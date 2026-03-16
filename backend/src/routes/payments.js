const router = require("express").Router();
const { body } = require("express-validator");
const { submitPayment, getPayments, updatePaymentStatus } = require("../controllers/paymentController");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");

router.post("/", [
  body("fullName").notEmpty(),
  body("email").isEmail(),
  body("phone").notEmpty(),
  body("program").notEmpty(),
  body("paymentType").notEmpty(),
  body("referenceNumber").notEmpty(),
  body("amount").notEmpty(),
], validate, submitPayment);

router.get("/", auth, getPayments);
router.patch("/:id/status", auth, updatePaymentStatus);

module.exports = router;
