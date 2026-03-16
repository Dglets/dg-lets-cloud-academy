const { PutCommand, ScanCommand, GetCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../config/dynamodb");
const { v4: uuidv4 } = require("uuid");

const ASSIGNMENTS_TABLE = process.env.DYNAMODB_ASSIGNMENTS_TABLE;
const TESTS_TABLE = process.env.DYNAMODB_TESTS_TABLE;
const TUTORIALS_TABLE = process.env.DYNAMODB_TUTORIALS_TABLE;

// ── Assignments ──────────────────────────────────────────────
const createAssignment = async (req, res) => {
  const { title, description, dueDate, program } = req.body;
  const item = { id: uuidv4(), title, description, dueDate, program: program || "All", createdAt: new Date().toISOString() };
  await docClient.send(new PutCommand({ TableName: ASSIGNMENTS_TABLE, Item: item }));
  res.status(201).json({ message: "Assignment created", id: item.id });
};

const getAssignments = async (req, res) => {
  const { Items } = await docClient.send(new ScanCommand({ TableName: ASSIGNMENTS_TABLE }));
  res.json(Items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
};

const deleteAssignment = async (req, res) => {
  await docClient.send(new DeleteCommand({ TableName: ASSIGNMENTS_TABLE, Key: { id: req.params.id } }));
  res.json({ message: "Assignment deleted" });
};

// ── Tests ────────────────────────────────────────────────────
const createTest = async (req, res) => {
  const { title, description, duration, link, program } = req.body;
  const item = { id: uuidv4(), title, description, duration, link, program: program || "All", createdAt: new Date().toISOString() };
  await docClient.send(new PutCommand({ TableName: TESTS_TABLE, Item: item }));
  res.status(201).json({ message: "Test created", id: item.id });
};

const getTests = async (req, res) => {
  const { Items } = await docClient.send(new ScanCommand({ TableName: TESTS_TABLE }));
  res.json(Items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
};

const deleteTest = async (req, res) => {
  await docClient.send(new DeleteCommand({ TableName: TESTS_TABLE, Key: { id: req.params.id } }));
  res.json({ message: "Test deleted" });
};

// ── Tutorials ────────────────────────────────────────────────
const createTutorial = async (req, res) => {
  const { title, description, videoUrl, duration, program, week } = req.body;
  const item = { id: uuidv4(), title, description, videoUrl, duration, week, program: program || "All", createdAt: new Date().toISOString() };
  await docClient.send(new PutCommand({ TableName: TUTORIALS_TABLE, Item: item }));
  res.status(201).json({ message: "Tutorial uploaded", id: item.id });
};

const getTutorials = async (req, res) => {
  const { Items } = await docClient.send(new ScanCommand({ TableName: TUTORIALS_TABLE }));
  res.json(Items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
};

const deleteTutorial = async (req, res) => {
  await docClient.send(new DeleteCommand({ TableName: TUTORIALS_TABLE, Key: { id: req.params.id } }));
  res.json({ message: "Tutorial deleted" });
};

module.exports = { createAssignment, getAssignments, deleteAssignment, createTest, getTests, deleteTest, createTutorial, getTutorials, deleteTutorial };
