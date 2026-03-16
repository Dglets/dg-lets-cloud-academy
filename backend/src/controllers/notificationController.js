const { PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../config/dynamodb");
const { v4: uuidv4 } = require("uuid");

const TABLE = process.env.DYNAMODB_NOTIFICATIONS_TABLE;

const subscribeNotification = async (req, res) => {
  try {
    const { email, program } = req.body;
    const item = { id: uuidv4(), email, program, createdAt: new Date().toISOString() };
    await docClient.send(new PutCommand({ TableName: TABLE, Item: item }));
    res.status(201).json({ message: "You'll be notified when this program launches!" });
  } catch (err) {
    console.error("subscribeNotification error:", err);
    res.status(500).json({ error: "Failed to subscribe" });
  }
};

const getNotifications = async (req, res) => {
  try {
    const { Items } = await docClient.send(new ScanCommand({ TableName: TABLE }));
    res.json(Items);
  } catch (err) {
    console.error("getNotifications error:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

module.exports = { subscribeNotification, getNotifications };
