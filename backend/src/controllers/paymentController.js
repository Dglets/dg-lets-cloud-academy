const { PutCommand, ScanCommand, GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../config/dynamodb");
const { v4: uuidv4 } = require("uuid");

const TABLE = process.env.DYNAMODB_PAYMENTS_TABLE;

const submitPayment = async (req, res) => {
  try {
    const { fullName, email, phone, program, paymentType, referenceNumber, amount } = req.body;
    const item = { id: uuidv4(), fullName, email, phone, program, paymentType, referenceNumber, amount, status: "pending", createdAt: new Date().toISOString() };
    await docClient.send(new PutCommand({ TableName: TABLE, Item: item }));
    res.status(201).json({ message: "Payment submitted successfully", id: item.id });
  } catch (err) {
    console.error("submitPayment error:", err);
    res.status(500).json({ error: "Failed to submit payment" });
  }
};

const getPayments = async (req, res) => {
  try {
    const { Items } = await docClient.send(new ScanCommand({ TableName: TABLE }));
    res.json(Items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (err) {
    console.error("getPayments error:", err);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "verified", "rejected"].includes(status))
      return res.status(400).json({ error: "Invalid status" });
    await docClient.send(new UpdateCommand({
      TableName: TABLE,
      Key: { id: req.params.id },
      UpdateExpression: "SET #s = :s",
      ExpressionAttributeNames: { "#s": "status" },
      ExpressionAttributeValues: { ":s": status },
    }));
    res.json({ message: "Payment status updated" });
  } catch (err) {
    console.error("updatePaymentStatus error:", err);
    res.status(500).json({ error: "Failed to update payment status" });
  }
};

module.exports = { submitPayment, getPayments, updatePaymentStatus };
