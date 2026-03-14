const { PutCommand, ScanCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../config/dynamodb");
const { v4: uuidv4 } = require("uuid");

const TABLE = process.env.DYNAMODB_PARTNERSHIPS_TABLE;

const createPartnership = async (req, res) => {
  const { companyName, website, contactPerson, email, partnershipInterest, message } = req.body;
  const item = {
    id: uuidv4(),
    companyName,
    website,
    contactPerson,
    email,
    partnershipInterest,
    message,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  await docClient.send(new PutCommand({ TableName: TABLE, Item: item }));
  res.status(201).json({ message: "Partnership request submitted successfully", id: item.id });
};

const getPartnerships = async (req, res) => {
  const { Items } = await docClient.send(new ScanCommand({ TableName: TABLE }));
  res.json(Items);
};

const getPartnership = async (req, res) => {
  const { Item } = await docClient.send(
    new GetCommand({ TableName: TABLE, Key: { id: req.params.id } })
  );
  if (!Item) return res.status(404).json({ error: "Partnership not found" });
  res.json(Item);
};

module.exports = { createPartnership, getPartnerships, getPartnership };
