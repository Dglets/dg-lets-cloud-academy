const { PutCommand, ScanCommand, GetCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../config/dynamodb");
const { v4: uuidv4 } = require("uuid");

const TABLE = process.env.DYNAMODB_BLOGS_TABLE;

const createPost = async (req, res) => {
  const { title, content, category, excerpt } = req.body;
  const item = {
    id: uuidv4(),
    title,
    content,
    excerpt,
    category,
    published: true,
    createdAt: new Date().toISOString(),
  };
  await docClient.send(new PutCommand({ TableName: TABLE, Item: item }));
  res.status(201).json({ message: "Blog post created", id: item.id });
};

const getPosts = async (req, res) => {
  const { Items } = await docClient.send(new ScanCommand({ TableName: TABLE }));
  const published = Items.filter((p) => p.published).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  res.json(published);
};

const getPost = async (req, res) => {
  const { Item } = await docClient.send(
    new GetCommand({ TableName: TABLE, Key: { id: req.params.id } })
  );
  if (!Item) return res.status(404).json({ error: "Post not found" });
  res.json(Item);
};

const deletePost = async (req, res) => {
  await docClient.send(new DeleteCommand({ TableName: TABLE, Key: { id: req.params.id } }));
  res.json({ message: "Post deleted" });
};

module.exports = { createPost, getPosts, getPost, deletePost };
