const { PutCommand, ScanCommand, GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../config/dynamodb");
const { v4: uuidv4 } = require("uuid");
const { sendEnrollmentConfirmation, sendEnrollmentApproved, sendEnrollmentRejected } = require("../services/emailService");

const TABLE = process.env.DYNAMODB_ENROLLMENTS_TABLE;

const createEnrollment = async (req, res) => {
  try {
    const { fullName, email, phone, experienceLevel, preferredDate } = req.body;
    const item = {
      id: uuidv4(), fullName, email, phone, experienceLevel, preferredDate,
      status: "pending", createdAt: new Date().toISOString(),
    };
    await docClient.send(new PutCommand({ TableName: TABLE, Item: item }));
    sendEnrollmentConfirmation(item);
    res.status(201).json({ message: "Enrollment submitted successfully", id: item.id });
  } catch (err) {
    console.error("createEnrollment error:", err);
    res.status(500).json({ error: "Failed to submit enrollment" });
  }
};

const getEnrollments = async (req, res) => {
  try {
    const { Items } = await docClient.send(new ScanCommand({ TableName: TABLE }));
    res.json(Items);
  } catch (err) {
    console.error("getEnrollments error:", err);
    res.status(500).json({ error: "Failed to fetch enrollments" });
  }
};

const getEnrollment = async (req, res) => {
  try {
    const { Item } = await docClient.send(new GetCommand({ TableName: TABLE, Key: { id: req.params.id } }));
    if (!Item) return res.status(404).json({ error: "Enrollment not found" });
    res.json(Item);
  } catch (err) {
    console.error("getEnrollment error:", err);
    res.status(500).json({ error: "Failed to fetch enrollment" });
  }
};

const updateEnrollmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "approved", "rejected"].includes(status))
      return res.status(400).json({ error: "Invalid status" });
    await docClient.send(new UpdateCommand({
      TableName: TABLE,
      Key: { id: req.params.id },
      UpdateExpression: "SET #s = :s",
      ExpressionAttributeNames: { "#s": "status" },
      ExpressionAttributeValues: { ":s": status },
    }));
    // Fetch enrollment to get student details for email
    const { Item } = await docClient.send(new GetCommand({ TableName: TABLE, Key: { id: req.params.id } }));
    if (Item) {
      if (status === "approved") sendEnrollmentApproved(Item);
      if (status === "rejected") sendEnrollmentRejected(Item);
    }
    res.json({ message: "Status updated" });
  } catch (err) {
    console.error("updateEnrollmentStatus error:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
};

module.exports = { createEnrollment, getEnrollments, getEnrollment, updateEnrollmentStatus };
