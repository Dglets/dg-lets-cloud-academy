const { PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../config/dynamodb");
const { v4: uuidv4 } = require("uuid");

const TABLE = process.env.DYNAMODB_NOTIFICATIONS_TABLE;

const subscribeNotification = async (req, res) => {
  const { email, program } = req.body;
  const item = { id: uuidv4(), email, program, createdAt: new Date().toISOString() };
  await docClient.send(new PutCommand({ TableName: TABLE, Item: item }));
  res.status(201).json({ message: "You'll be notified when this program launches!" });
};

const getNotifications = async (req, res) => {
  const { Items } = await docClient.send(new ScanCommand({ TableName: TABLE }));
  res.json(Items);
};

module.exports = { subscribeNotification, getNotifications };
