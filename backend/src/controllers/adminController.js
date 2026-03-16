const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // Support both plain password (dev) and bcrypt hash (production)
    let isValid = password === process.env.ADMIN_PASSWORD;
    if (!isValid && process.env.ADMIN_PASSWORD_HASH) {
      isValid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    }
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    });
    res.json({ token, message: "Login successful" });
  } catch (err) {
    console.error("adminLogin error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

module.exports = { adminLogin };
