const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PutCommand, ScanCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../config/dynamodb");
const { v4: uuidv4 } = require("uuid");

const INSTRUCTORS_TABLE = process.env.DYNAMODB_INSTRUCTORS_TABLE;
const GRADES_TABLE = process.env.DYNAMODB_GRADES_TABLE;

const createInstructor = async (req, res) => {
  try {
    const { fullName, email, password, subject } = req.body;
    const { Items } = await docClient.send(new ScanCommand({ TableName: INSTRUCTORS_TABLE }));
    if (Items.find((i) => i.email === email)) return res.status(400).json({ error: "Instructor already exists" });
    const passwordHash = await bcrypt.hash(password, 10);
    const item = { id: uuidv4(), fullName, email, passwordHash, subject: subject || "", createdAt: new Date().toISOString() };
    await docClient.send(new PutCommand({ TableName: INSTRUCTORS_TABLE, Item: item }));
    res.status(201).json({ message: "Instructor created", id: item.id });
  } catch (err) {
    console.error("createInstructor error:", err);
    res.status(500).json({ error: "Failed to create instructor" });
  }
};

const getAllInstructors = async (req, res) => {
  try {
    const { Items } = await docClient.send(new ScanCommand({ TableName: INSTRUCTORS_TABLE }));
    res.json(Items.map(({ passwordHash, ...i }) => i).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (err) {
    console.error("getAllInstructors error:", err);
    res.status(500).json({ error: "Failed to fetch instructors" });
  }
};

const deleteInstructor = async (req, res) => {
  try {
    await docClient.send(new DeleteCommand({ TableName: INSTRUCTORS_TABLE, Key: { id: req.params.id } }));
    res.json({ message: "Instructor deleted" });
  } catch (err) {
    console.error("deleteInstructor error:", err);
    res.status(500).json({ error: "Failed to delete instructor" });
  }
};

const instructorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { Items } = await docClient.send(new ScanCommand({ TableName: INSTRUCTORS_TABLE }));
    const instructor = Items.find((i) => i.email === email);
    if (!instructor) return res.status(401).json({ error: "Invalid credentials" });
    const valid = await bcrypt.compare(password, instructor.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: instructor.id, email: instructor.email, fullName: instructor.fullName, role: "instructor" }, process.env.JWT_SECRET, { expiresIn: "24h" });
    res.json({ token, instructor: { id: instructor.id, fullName: instructor.fullName, email: instructor.email, subject: instructor.subject } });
  } catch (err) {
    console.error("instructorLogin error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

const submitGrade = async (req, res) => {
  try {
    const { studentId, studentName, studentEmail, refId, refTitle, refType, score, maxScore, feedback, program } = req.body;
    const item = {
      id: uuidv4(), studentId, studentName, studentEmail,
      refId, refTitle, refType,
      score: Number(score), maxScore: Number(maxScore),
      feedback: feedback || "",
      program: program || "All",
      instructorId: req.instructor.id,
      instructorName: req.instructor.fullName,
      gradedAt: new Date().toISOString(),
    };
    await docClient.send(new PutCommand({ TableName: GRADES_TABLE, Item: item }));
    res.status(201).json({ message: "Grade submitted", id: item.id });
  } catch (err) {
    console.error("submitGrade error:", err);
    res.status(500).json({ error: "Failed to submit grade" });
  }
};

const getAllGrades = async (req, res) => {
  try {
    const { Items } = await docClient.send(new ScanCommand({ TableName: GRADES_TABLE }));
    const sorted = Items.sort((a, b) => new Date(b.gradedAt) - new Date(a.gradedAt));
    // Instructors only see their own grades; admins (no instructorId on req) see all
    const result = req.instructor ? sorted.filter((g) => g.instructorId === req.instructor.id) : sorted;
    res.json(result);
  } catch (err) {
    console.error("getAllGrades error:", err);
    res.status(500).json({ error: "Failed to fetch grades" });
  }
};

const getGradesByStudent = async (req, res) => {
  try {
    const { Items } = await docClient.send(new ScanCommand({ TableName: GRADES_TABLE }));
    res.json(Items.filter((g) => g.studentId === req.params.studentId).sort((a, b) => new Date(b.gradedAt) - new Date(a.gradedAt)));
  } catch (err) {
    console.error("getGradesByStudent error:", err);
    res.status(500).json({ error: "Failed to fetch grades" });
  }
};

module.exports = { createInstructor, getAllInstructors, deleteInstructor, instructorLogin, submitGrade, getAllGrades, getGradesByStudent };
