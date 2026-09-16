import express from "express";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import Biodata from "../models/Biodata.js";
import User from "../models/User.js";
import PremiumMember from "../models/PremiumMember.js";
import ContactRequest from "../models/ContactRequest.js";
import SuccessStory from "../models/SuccessStory.js";
import { signAdminToken, requireAdminAuth } from "../utils/adminAuth.js";

const router = express.Router();

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

// POST /admin/auth/login -> { token, admin }
// Deliberately does not distinguish "unknown username" from "wrong password"
// in its response, to avoid leaking which usernames exist.
router.post("/admin/auth/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const admin = await Admin.findOne({ username: username.toLowerCase().trim() });
  const valid = admin && (await bcrypt.compare(password, admin.passwordHash));

  if (!valid) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  admin.lastLoginAt = new Date();
  await admin.save();

  const token = signAdminToken(admin);
  res.json({
    token,
    admin: { id: admin._id, username: admin.username, name: admin.name, role: admin.role },
  });
});

// GET /admin/auth/me -> confirms the current token is still valid and returns the admin's identity
router.get("/admin/auth/me", requireAdminAuth, async (req, res) => {
  const admin = await Admin.findById(req.admin.sub).select("-passwordHash");
  if (!admin) return res.status(401).json({ message: "Admin no longer exists" });
  res.json({ admin });
});

// Every route below requires a valid admin session.
router.use("/admin", requireAdminAuth);

// ---------------------------------------------------------------------------
// Profile moderation
// ---------------------------------------------------------------------------

// GET /admin/profiles -> filterable, paginated list of every biodata on the site
router.get("/admin/profiles", async (req, res) => {
  const {
    q = "",
    status = "",
    biodataType = "",
    division = "",
    occupation = "",
    premiumOnly = "",
    minAge = "",
    maxAge = "",
    page = 1,
    limit = 20,
    sort = "-createdAt",
  } = req.query;

  // Built as a list of clauses ANDed together, so the free-text search's own
  // $or and the division's own $or never collide with each other.
  const clauses = [];

  if (q) {
    const isNumeric = /^\d+$/.test(q);
    clauses.push({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { mobile: { $regex: q, $options: "i" } },
        ...(isNumeric ? [{ bioId: Number(q) }] : []),
      ],
    });
  }
  if (division) {
    clauses.push({
      $or: [
        { permanentDivision: { $regex: division, $options: "i" } },
        { presentDivision: { $regex: division, $options: "i" } },
      ],
    });
  }

  const query = clauses.length ? { $and: clauses } : {};
  if (status) query.status = status;
  if (biodataType) query.biodataType = biodataType;
  if (occupation) query.occupation = { $regex: occupation, $options: "i" };
  if (minAge || maxAge) {
    query.age = {};
    if (minAge) query.age.$gte = Number(minAge);
    if (maxAge) query.age.$lte = Number(maxAge);
  }

  const pageNum = Math.max(parseInt(page) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit) || 20, 1), 100);

  let profiles = await Biodata.find(query)
    .sort(sort)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .lean();

  const total = await Biodata.countDocuments(query);

  if (premiumOnly === "true" && profiles.length) {
    const bioIds = profiles.map((p) => p.bioId);
    const premiumSet = new Set(
      (await PremiumMember.find({ bioId: { $in: bioIds } }).lean()).map((p) => p.bioId)
    );
    profiles = profiles.filter((p) => premiumSet.has(p.bioId));
  }

  // Attach premium plan info for display without a second round trip from the client.
  const bioIds = profiles.map((p) => p.bioId).filter((id) => id != null);
  const premiumMembers = bioIds.length
    ? await PremiumMember.find({ bioId: { $in: bioIds } }).lean()
    : [];
  const premiumByBioId = new Map(premiumMembers.map((m) => [m.bioId, m.planType || "Basic"]));

  const enriched = profiles.map((p) => ({
    ...p,
    isPremium: premiumByBioId.has(p.bioId),
    planType: premiumByBioId.get(p.bioId) || null,
  }));

  res.json({
    profiles: enriched,
    total,
    page: pageNum,
    totalPages: Math.max(Math.ceil(total / limitNum), 1),
  });
});

// GET /admin/profiles/:id -> single biodata (Mongo _id) with full detail for a review panel
router.get("/admin/profiles/:id", async (req, res) => {
  const biodata = await Biodata.findById(req.params.id).lean();
  if (!biodata) return res.status(404).json({ message: "Profile not found" });

  const premium = await PremiumMember.findOne({ bioId: biodata.bioId }).lean();
  res.json({ ...biodata, isPremium: !!premium, planType: premium?.planType || null });
});

// PATCH /admin/profiles/:id/status -> archive / blacklist / reactivate a profile.
// This is the single source of truth the public site reads from (GET /biodatas
// and GET /biodatabyid both filter on `status`), so the change is instant.
router.patch("/admin/profiles/:id/status", async (req, res) => {
  const { status, reason = "" } = req.body || {};
  const allowed = ["active", "archived", "blacklisted"];

  if (!allowed.includes(status)) {
    return res.status(400).json({ message: `status must be one of: ${allowed.join(", ")}` });
  }

  const biodata = await Biodata.findByIdAndUpdate(
    req.params.id,
    { $set: { status, statusReason: reason, statusUpdatedAt: new Date() } },
    { new: true }
  );

  if (!biodata) return res.status(404).json({ message: "Profile not found" });
  res.json(biodata);
});

// ---------------------------------------------------------------------------
// Statistics dashboard
// ---------------------------------------------------------------------------

// GET /admin/stats -> everything the dashboard needs in one call
router.get("/admin/stats", async (req, res) => {
  const [
    totalProfiles,
    activeProfiles,
    archivedProfiles,
    blacklistedProfiles,
    maleProfiles,
    femaleProfiles,
    totalUsers,
    premiumMembers,
    contactRequestCount,
    marriageCount,
    genderByStatus,
    signupsByMonthRaw,
    topOccupationsRaw,
    topLocationsRaw,
  ] = await Promise.all([
    Biodata.countDocuments(),
    Biodata.countDocuments({ status: "active" }),
    Biodata.countDocuments({ status: "archived" }),
    Biodata.countDocuments({ status: "blacklisted" }),
    Biodata.countDocuments({ biodataType: "Male" }),
    Biodata.countDocuments({ biodataType: "Female" }),
    User.countDocuments(),
    PremiumMember.find().lean(),
    ContactRequest.countDocuments(),
    SuccessStory.countDocuments(),
    Biodata.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Biodata.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]),
    Biodata.aggregate([
      { $match: { occupation: { $nin: [null, ""] } } },
      { $group: { _id: "$occupation", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]),
    Biodata.aggregate([
      { $match: { permanentDivision: { $nin: [null, ""] } } },
      { $group: { _id: "$permanentDivision", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]),
  ]);

  // Plan-tier breakdown (which plan is most common among paying members).
  const planCounts = premiumMembers.reduce((acc, member) => {
    const plan = member.planType || "Basic";
    acc[plan] = (acc[plan] || 0) + 1;
    return acc;
  }, {});
  const mostCommonPlan =
    Object.entries(planCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  res.json({
    profiles: {
      total: totalProfiles,
      active: activeProfiles,
      archived: archivedProfiles,
      blacklisted: blacklistedProfiles,
      male: maleProfiles,
      female: femaleProfiles,
      other: totalProfiles - maleProfiles - femaleProfiles,
    },
    users: {
      total: totalUsers,
    },
    premium: {
      total: premiumMembers.length,
      planCounts,
      mostCommonPlan,
    },
    engagement: {
      contactRequests: contactRequestCount,
      estimatedRevenue: contactRequestCount * 5,
      successStories: marriageCount,
    },
    charts: {
      statusBreakdown: genderByStatus.map((s) => ({ status: s._id, count: s.count })),
      signupsByMonth: signupsByMonthRaw.map((s) => ({ month: s._id, count: s.count })),
      topOccupations: topOccupationsRaw.map((s) => ({ occupation: s._id, count: s.count })),
      topLocations: topLocationsRaw.map((s) => ({ location: s._id, count: s.count })),
    },
  });
});

export default router;
