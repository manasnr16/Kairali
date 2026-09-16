import express from "express";
import crypto from "crypto";
import Otp from "../models/Otp.js";
import User from "../models/User.js";
import { sendOtpEmail } from "../utils/mailer.js";

const router = express.Router();

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 30 * 1000; // 30 seconds

const hashOtp = (otp) => crypto.createHash("sha256").update(otp).digest("hex");
const generateOtp = () => String(crypto.randomInt(100000, 999999));

// POST /otp/send  { email, purpose } -> emails a 6-digit code, valid for 5 minutes
router.post("/otp/send", async (req, res) => {
  const { email, purpose = "register" } = req.body;

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: "A valid email is required" });
  }

  if (purpose === "register") {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }
  }

  const recent = await Otp.findOne({ email, purpose }).sort({ createdAt: -1 });
  if (recent && Date.now() - recent.createdAt.getTime() < RESEND_COOLDOWN_MS) {
    const waitSeconds = Math.ceil(
      (RESEND_COOLDOWN_MS - (Date.now() - recent.createdAt.getTime())) / 1000
    );
    return res.status(429).json({ message: `Please wait ${waitSeconds}s before requesting another code` });
  }

  const otp = generateOtp();

  try {
    await sendOtpEmail(email, otp);
  } catch (error) {
    return res.status(502).json({ message: error.message || "Failed to send verification email" });
  }

  // Replace any previous unverified codes for this email/purpose.
  await Otp.deleteMany({ email, purpose, verified: false });

  await Otp.create({
    email,
    purpose,
    otpHash: hashOtp(otp),
    expiresAt: new Date(Date.now() + OTP_TTL_MS),
  });

  res.status(200).json({ message: "Verification code sent" });
});

// POST /otp/verify  { email, otp, purpose } -> confirms the code and marks it verified
router.post("/otp/verify", async (req, res) => {
  const { email, otp, purpose = "register" } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "email and otp are required" });
  }

  const record = await Otp.findOne({ email, purpose }).sort({ createdAt: -1 });

  if (!record) {
    return res.status(400).json({ message: "No verification code found. Please request a new one." });
  }

  if (record.verified) {
    return res.status(200).json({ message: "Email already verified", verified: true });
  }

  if (record.expiresAt.getTime() < Date.now()) {
    return res.status(410).json({ message: "This code has expired. Please request a new one." });
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    return res.status(429).json({ message: "Too many attempts. Please request a new code." });
  }

  if (hashOtp(String(otp)) !== record.otpHash) {
    record.attempts += 1;
    await record.save();
    return res.status(400).json({ message: "Incorrect code. Please try again." });
  }

  record.verified = true;
  await record.save();

  res.status(200).json({ message: "Email verified successfully", verified: true });
});

export default router;
