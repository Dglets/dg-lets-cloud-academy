const router = require("express").Router();
const { body } = require("express-validator");
const { adminLogin } = require("../controllers/adminController");
const validate = require("../middleware/validate");

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  validate,
  adminLogin
);

module.exports = router;
