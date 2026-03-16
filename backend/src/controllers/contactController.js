const { PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../config/dynamodb");
const { v4: uuidv4 } = require("uuid");

const TABLE = process.env.DYNAMODB_CONTACTS_TABLE;

const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const item = { id: uuidv4(), name, email, subject, message, createdAt: new Date().toISOString() };
    await docClient.send(new PutCommand({ TableName: TABLE, Item: item }));
    res.status(201).json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("createContact error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};

const getContacts = async (req, res) => {
  try {
    const { Items } = await docClient.send(new ScanCommand({ TableName: TABLE }));
    res.json(Items);
  } catch (err) {
    console.error("getContacts error:", err);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
};

module.exports = { createContact, getContacts };
