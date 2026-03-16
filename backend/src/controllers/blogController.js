const { PutCommand, ScanCommand, GetCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../config/dynamodb");
const { v4: uuidv4 } = require("uuid");

const TABLE = process.env.DYNAMODB_BLOGS_TABLE;

const createPost = async (req, res) => {
  try {
    const { title, content, category, excerpt } = req.body;
    const item = { id: uuidv4(), title, content, excerpt, category, published: true, createdAt: new Date().toISOString() };
    await docClient.send(new PutCommand({ TableName: TABLE, Item: item }));
    res.status(201).json({ message: "Blog post created", id: item.id });
  } catch (err) {
    console.error("createPost error:", err);
    res.status(500).json({ error: "Failed to create post" });
  }
};

const getPosts = async (req, res) => {
  try {
    const { Items } = await docClient.send(new ScanCommand({ TableName: TABLE }));
    res.json(Items.filter((p) => p.published).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (err) {
    console.error("getPosts error:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

const getPost = async (req, res) => {
  try {
    const { Item } = await docClient.send(new GetCommand({ TableName: TABLE, Key: { id: req.params.id } }));
    if (!Item) return res.status(404).json({ error: "Post not found" });
    res.json(Item);
  } catch (err) {
    console.error("getPost error:", err);
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

const deletePost = async (req, res) => {
  try {
    await docClient.send(new DeleteCommand({ TableName: TABLE, Key: { id: req.params.id } }));
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("deletePost error:", err);
    res.status(500).json({ error: "Failed to delete post" });
  }
};

module.exports = { createPost, getPosts, getPost, deletePost };
