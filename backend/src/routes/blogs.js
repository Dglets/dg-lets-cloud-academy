const router = require("express").Router();
const { body } = require("express-validator");
const { createPost, getPosts, getPost, deletePost } = require("../controllers/blogController");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");

const postRules = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("content").trim().notEmpty().withMessage("Content is required"),
  body("category").trim().notEmpty().withMessage("Category is required"),
];

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", auth, postRules, validate, createPost);
router.delete("/:id", auth, deletePost);

module.exports = router;
