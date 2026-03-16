const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PutCommand, GetCommand, ScanCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../config/dynamodb");

const ENROLLMENTS_TABLE = process.env.DYNAMODB_ENROLLMENTS_TABLE;
const STUDENTS_TABLE = process.env.DYNAMODB_STUDENTS_TABLE;

// Admin: grant access to an approved student (creates login credentials)
const grantStudentAccess = async (req, res) => {
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
};

// Student: login
const studentLogin = async (req, res) => {
  const { email, password } = req.body;
  const { Items } = await docClient.send(new ScanCommand({ TableName: STUDENTS_TABLE }));
  const student = Items.find((s) => s.email === email);
  if (!student) return res.status(401).json({ error: "Invalid credentials" });

  const isValid = await bcrypt.compare(password, student.passwordHash);
  if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: student.id, email: student.email, role: "student" }, process.env.JWT_SECRET, { expiresIn: "24h" });
  res.json({ token, student: { fullName: student.fullName, email: student.email, program: student.program, experienceLevel: student.experienceLevel, enrolledAt: student.enrolledAt } });
};

// Student: get own profile
const getStudentProfile = async (req, res) => {
  const { Item } = await docClient.send(new GetCommand({ TableName: STUDENTS_TABLE, Key: { id: req.student.id } }));
  if (!Item) return res.status(404).json({ error: "Student not found" });
  const { passwordHash, ...profile } = Item;
  res.json(profile);
};

// Admin: get all students
const getAllStudents = async (req, res) => {
  const { Items } = await docClient.send(new ScanCommand({ TableName: STUDENTS_TABLE }));
  res.json(Items.map(({ passwordHash, ...s }) => s));
};

module.exports = { grantStudentAccess, studentLogin, getStudentProfile, getAllStudents };
