const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// In production, store admin in DynamoDB. For simplicity, use env-based admin.
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (email !== process.env.ADMIN_EMAIL) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isValid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH || "");

  // Fallback: plain comparison for initial setup (replace with hash in production)
  const plainMatch = password === process.env.ADMIN_PASSWORD;

  if (!isValid && !plainMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  });

  res.json({ token, message: "Login successful" });
};

module.exports = { adminLogin };
