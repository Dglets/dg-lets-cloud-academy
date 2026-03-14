const router = require("express").Router();
const { body } = require("express-validator");
const { createPartnership, getPartnerships, getPartnership } = require("../controllers/partnershipController");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");

const partnershipRules = [
  body("companyName").trim().notEmpty().withMessage("Company name is required"),
  body("contactPerson").trim().notEmpty().withMessage("Contact person is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("partnershipInterest").trim().notEmpty().withMessage("Partnership interest is required"),
];

router.post("/", partnershipRules, validate, createPartnership);
router.get("/", auth, getPartnerships);
router.get("/:id", auth, getPartnership);

module.exports = router;
