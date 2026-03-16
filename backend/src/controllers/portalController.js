const { PutCommand, ScanCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../config/dynamodb");
const { v4: uuidv4 } = require("uuid");

const ASSIGNMENTS_TABLE = process.env.DYNAMODB_ASSIGNMENTS_TABLE;
const TESTS_TABLE = process.env.DYNAMODB_TESTS_TABLE;
const TUTORIALS_TABLE = process.env.DYNAMODB_TUTORIALS_TABLE;

// ── Assignments ──────────────────────────────────────────────
const createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, program } = req.body;
    const item = { id: uuidv4(), title, description, dueDate, program: program || "All", createdAt: new Date().toISOString() };
    await docClient.send(new PutCommand({ TableName: ASSIGNMENTS_TABLE, Item: item }));
    res.status(201).json({ message: "Assignment created", id: item.id });
  } catch (err) {
    console.error("createAssignment error:", err);
    res.status(500).json({ error: "Failed to create assignment" });
  }
};

const getAssignments = async (req, res) => {
  try {
    const { Items } = await docClient.send(new ScanCommand({ TableName: ASSIGNMENTS_TABLE }));
    res.json(Items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (err) {
    console.error("getAssignments error:", err);
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
};

const deleteAssignment = async (req, res) => {
  try {
    await docClient.send(new DeleteCommand({ TableName: ASSIGNMENTS_TABLE, Key: { id: req.params.id } }));
    res.json({ message: "Assignment deleted" });
  } catch (err) {
    console.error("deleteAssignment error:", err);
    res.status(500).json({ error: "Failed to delete assignment" });
  }
};

// ── Tests ────────────────────────────────────────────────────
const createTest = async (req, res) => {
  try {
    const { title, description, duration, link, program } = req.body;
    const item = { id: uuidv4(), title, description, duration, link, program: program || "All", createdAt: new Date().toISOString() };
    await docClient.send(new PutCommand({ TableName: TESTS_TABLE, Item: item }));
    res.status(201).json({ message: "Test created", id: item.id });
  } catch (err) {
    console.error("createTest error:", err);
    res.status(500).json({ error: "Failed to create test" });
  }
};

const getTests = async (req, res) => {
  try {
    const { Items } = await docClient.send(new ScanCommand({ TableName: TESTS_TABLE }));
    res.json(Items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (err) {
    console.error("getTests error:", err);
    res.status(500).json({ error: "Failed to fetch tests" });
  }
};

const deleteTest = async (req, res) => {
  try {
    await docClient.send(new DeleteCommand({ TableName: TESTS_TABLE, Key: { id: req.params.id } }));
    res.json({ message: "Test deleted" });
  } catch (err) {
    console.error("deleteTest error:", err);
    res.status(500).json({ error: "Failed to delete test" });
  }
};

// ── Tutorials ────────────────────────────────────────────────
const createTutorial = async (req, res) => {
  try {
    const { title, description, videoUrl, duration, program, week } = req.body;
    const item = { id: uuidv4(), title, description, videoUrl, duration, week, program: program || "All", createdAt: new Date().toISOString() };
    await docClient.send(new PutCommand({ TableName: TUTORIALS_TABLE, Item: item }));
    res.status(201).json({ message: "Tutorial uploaded", id: item.id });
  } catch (err) {
    console.error("createTutorial error:", err);
    res.status(500).json({ error: "Failed to upload tutorial" });
  }
};

const getTutorials = async (req, res) => {
  try {
    const { Items } = await docClient.send(new ScanCommand({ TableName: TUTORIALS_TABLE }));
    res.json(Items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (err) {
    console.error("getTutorials error:", err);
    res.status(500).json({ error: "Failed to fetch tutorials" });
  }
};

const deleteTutorial = async (req, res) => {
  try {
    await docClient.send(new DeleteCommand({ TableName: TUTORIALS_TABLE, Key: { id: req.params.id } }));
    res.json({ message: "Tutorial deleted" });
  } catch (err) {
    console.error("deleteTutorial error:", err);
    res.status(500).json({ error: "Failed to delete tutorial" });
  }
};

module.exports = { createAssignment, getAssignments, deleteAssignment, createTest, getTests, deleteTest, createTutorial, getTutorials, deleteTutorial };
