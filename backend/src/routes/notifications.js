const router = require("express").Router();
const { body } = require("express-validator");
const { subscribeNotification, getNotifications } = require("../controllers/notificationController");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");

router.post("/", [body("email").isEmail().withMessage("Valid email required"), body("program").notEmpty()], validate, subscribeNotification);
router.get("/", auth, getNotifications);

module.exports = router;
