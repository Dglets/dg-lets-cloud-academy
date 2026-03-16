const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(auth.split(" ")[1], process.env.JWT_SECRET);
    if (decoded.role !== "instructor") return res.status(403).json({ error: "Forbidden" });
    req.instructor = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};
