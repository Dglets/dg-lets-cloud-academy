const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { PutCommand, GetCommand, ScanCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../config/dynamodb");
const { sendPortalAccessGranted, sendPasswordReset } = require("../services/emailService");

const ENROLLMENTS_TABLE = process.env.DYNAMODB_ENROLLMENTS_TABLE;
const STUDENTS_TABLE = process.env.DYNAMODB_STUDENTS_TABLE;

const grantStudentAccess = async (req, res) => {
  try {
    const { enrollmentId, password } = req.body;
    const { Item: enrollment } = await docClient.send(new GetCommand({ TableName: ENROLLMENTS_TABLE, Key: { id: enrollmentId } }));
    if (!enrollment) return res.status(404).json({ error: "Enrollment not found" });
    if (enrollment.status !== "approved") return res.status(400).json({ error: "Student must be approved first" });
    const passwordHash = await bcrypt.hash(password, 10);
    const student = {
      id: enrollmentId,
      fullName: enrollment.fullName,
      email: enrollment.email,
      phone: enrollment.phone,
      experienceLevel: enrollment.experienceLevel,
      program: enrollment.program || "Cloud Engineering Foundations",
      enrolledAt: enrollment.createdAt,
      passwordHash,
      accessGrantedAt: new Date().toISOString(),
    };
    await docClient.send(new PutCommand({ TableName: STUDENTS_TABLE, Item: student }));
    sendPortalAccessGranted(student, password);
    res.status(201).json({ message: "Access granted successfully" });
  } catch (err) {
    console.error("grantStudentAccess error:", err);
    res.status(500).json({ error: "Failed to grant access" });
  }
};

const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { Items } = await docClient.send(new ScanCommand({ TableName: STUDENTS_TABLE }));
    const student = Items.find((s) => s.email === email);
    if (!student) return res.status(401).json({ error: "Invalid credentials" });
    const isValid = await bcrypt.compare(password, student.passwordHash);
    if (!isValid) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: student.id, email: student.email, role: "student" }, process.env.JWT_SECRET, { expiresIn: "24h" });
    res.json({ token, student: { fullName: student.fullName, email: student.email, program: student.program, experienceLevel: student.experienceLevel, enrolledAt: student.enrolledAt } });
  } catch (err) {
    console.error("studentLogin error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

const getStudentProfile = async (req, res) => {
  try {
    const { Item } = await docClient.send(new GetCommand({ TableName: STUDENTS_TABLE, Key: { id: req.student.id } }));
    if (!Item) return res.status(404).json({ error: "Student not found" });
    const { passwordHash, ...profile } = Item;
    res.json(profile);
  } catch (err) {
    console.error("getStudentProfile error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const { Items } = await docClient.send(new ScanCommand({ TableName: STUDENTS_TABLE }));
    res.json(Items.map(({ passwordHash, ...s }) => s));
  } catch (err) {
    console.error("getAllStudents error:", err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const { Items } = await docClient.send(new ScanCommand({ TableName: STUDENTS_TABLE }));
    const student = Items.find((s) => s.email === email);
    // Always respond OK to prevent email enumeration
    if (!student) return res.json({ message: "If that email exists, a reset link has been sent." });
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
    await docClient.send(new UpdateCommand({
      TableName: STUDENTS_TABLE,
      Key: { id: student.id },
      UpdateExpression: "SET resetToken = :t, resetExpiry = :e",
      ExpressionAttributeValues: { ":t": token, ":e": expiry },
    }));
    sendPasswordReset(student, token);
    res.json({ message: "If that email exists, a reset link has been sent." });
  } catch (err) {
    console.error("requestPasswordReset error:", err);
    res.status(500).json({ error: "Failed to process request" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const { Items } = await docClient.send(new ScanCommand({ TableName: STUDENTS_TABLE }));
    const student = Items.find((s) => s.resetToken === token);
    if (!student) return res.status(400).json({ error: "Invalid or expired reset link." });
    if (new Date(student.resetExpiry) < new Date()) return res.status(400).json({ error: "Reset link has expired. Please request a new one." });
    const passwordHash = await bcrypt.hash(password, 10);
    await docClient.send(new UpdateCommand({
      TableName: STUDENTS_TABLE,
      Key: { id: student.id },
      UpdateExpression: "SET passwordHash = :h REMOVE resetToken, resetExpiry",
      ExpressionAttributeValues: { ":h": passwordHash },
    }));
    res.json({ message: "Password reset successfully. You can now log in." });
  } catch (err) {
    console.error("resetPassword error:", err);
    res.status(500).json({ error: "Failed to reset password" });
  }
};

module.exports = { grantStudentAccess, studentLogin, getStudentProfile, getAllStudents, requestPasswordReset, resetPassword };
