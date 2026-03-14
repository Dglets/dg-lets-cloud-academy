const { PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../config/dynamodb");
const { v4: uuidv4 } = require("uuid");

const TABLE = process.env.DYNAMODB_CONTACTS_TABLE;

const createContact = async (req, res) => {
  const { name, email, subject, message } = req.body;
  const item = {
    id: uuidv4(),
    name,
    email,
    subject,
    message,
    createdAt: new Date().toISOString(),
  };
  await docClient.send(new PutCommand({ TableName: TABLE, Item: item }));
  res.status(201).json({ message: "Message sent successfully" });
};

const getContacts = async (req, res) => {
  const { Items } = await docClient.send(new ScanCommand({ TableName: TABLE }));
  res.json(Items);
};

module.exports = { createContact, getContacts };
