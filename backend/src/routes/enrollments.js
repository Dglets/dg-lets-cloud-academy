const router = require("express").Router();
const { body } = require("express-validator");
const { createEnrollment, getEnrollments, getEnrollment } = require("../controllers/enrollmentController");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");

const enrollmentRules = [
  body("fullName").trim().notEmpty().withMessage("Full name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("phone").trim().notEmpty().withMessage("Phone number is required"),
  body("experienceLevel").isIn(["beginner", "intermediate", "advanced"]).withMessage("Invalid experience level"),
  body("preferredDate").notEmpty().withMessage("Preferred date is required"),
];

router.post("/", enrollmentRules, validate, createEnrollment);
router.get("/", auth, getEnrollments);
router.get("/:id", auth, getEnrollment);

module.exports = router;
