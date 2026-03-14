const { PutCommand, ScanCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../config/dynamodb");
const { v4: uuidv4 } = require("uuid");

const TABLE = process.env.DYNAMODB_ENROLLMENTS_TABLE;

const createEnrollment = async (req, res) => {
  const { fullName, email, phone, experienceLevel, preferredDate } = req.body;
  const item = {
    id: uuidv4(),
    fullName,
    email,
    phone,
    experienceLevel,
    preferredDate,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  await docClient.send(new PutCommand({ TableName: TABLE, Item: item }));
  res.status(201).json({ message: "Enrollment submitted successfully", id: item.id });
};

const getEnrollments = async (req, res) => {
  const { Items } = await docClient.send(new ScanCommand({ TableName: TABLE }));
  res.json(Items);
};

const getEnrollment = async (req, res) => {
  const { Item } = await docClient.send(
    new GetCommand({ TableName: TABLE, Key: { id: req.params.id } })
  );
  if (!Item) return res.status(404).json({ error: "Enrollment not found" });
  res.json(Item);
};

module.exports = { createEnrollment, getEnrollments, getEnrollment };
