require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const enrollmentRoutes = require("./routes/enrollments");
const partnershipRoutes = require("./routes/partnerships");
const blogRoutes = require("./routes/blogs");
const contactRoutes = require("./routes/contacts");
const adminRoutes = require("./routes/admin");
const notificationRoutes = require("./routes/notifications");
const studentRoutes = require("./routes/students");
const paymentRoutes = require("./routes/payments");
const instructorRoutes = require("./routes/instructors");

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use("/api/", limiter);

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { error: "Too many login attempts, please try again later" } });
app.use("/api/admin/login", loginLimiter);
app.use("/api/students/login", loginLimiter);
app.use("/api/instructors/login", loginLimiter);

app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/partnerships", partnershipRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/instructors", instructorRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "DG-LETS Cloud Academy API" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
