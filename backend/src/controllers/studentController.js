const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PutCommand, GetCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../config/dynamodb");

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

module.exports = { grantStudentAccess, studentLogin, getStudentProfile, getAllStudents };
