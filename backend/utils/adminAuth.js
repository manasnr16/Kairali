import jwt from "jsonwebtoken";

const TOKEN_TTL = "8h";

function getSecret() {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    throw new Error("ADMIN_JWT_SECRET is not set in the environment");
  }
  return secret;
}

export function signAdminToken(admin) {
  return jwt.sign(
    { sub: admin._id.toString(), username: admin.username, role: admin.role },
    getSecret(),
    { expiresIn: TOKEN_TTL }
  );
}

// Protects every /admin/* route below it. Expects "Authorization: Bearer <token>".
export function requireAdminAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Admin authentication required" });
  }

  try {
    req.admin = jwt.verify(token, getSecret());
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired admin session" });
  }
}
