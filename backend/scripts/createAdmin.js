// One-off CLI to create/reset a /admin control-panel account. There is no
// public signup route for admins on purpose — this is the only way in.
//
// Usage:
//   node scripts/createAdmin.js <username> <password> "<Display Name>"
//
// Re-running with an existing username updates that admin's password/name
// instead of failing, so it doubles as a password-reset tool.
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

async function main() {
  const [username, password, name = "Admin"] = process.argv.slice(2);

  if (!username || !password) {
    console.error("Usage: node scripts/createAdmin.js <username> <password> \"<Display Name>\"");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await Admin.findOneAndUpdate(
    { username: username.toLowerCase().trim() },
    { $set: { passwordHash, name } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(`✅ Admin ready: ${admin.username} (${admin.name})`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("❌ Failed to create admin:", err.message);
  process.exit(1);
});
