const router = require("express").Router();
const { body } = require("express-validator");
const { createContact, getContacts } = require("../controllers/contactController");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");

const contactRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("message").trim().notEmpty().withMessage("Message is required"),
];

router.post("/", contactRules, validate, createContact);
router.get("/", auth, getContacts);

module.exports = router;
