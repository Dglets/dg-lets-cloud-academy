const router = require("express").Router();
const { body } = require("express-validator");
const { createInstructor, getAllInstructors, deleteInstructor, instructorLogin, submitGrade, getAllGrades, getGradesByStudent } = require("../controllers/instructorController");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");
const instructorAuth = require("../middleware/instructorAuth");

// Admin manages instructors
router.post("/", auth, [body("fullName").notEmpty(), body("email").isEmail(), body("password").isLength({ min: 6 })], validate, createInstructor);
router.get("/", auth, getAllInstructors);
router.delete("/:id", auth, deleteInstructor);

// Instructor login
router.post("/login", [body("email").isEmail(), body("password").notEmpty()], validate, instructorLogin);

// Grades (instructor only)
router.post("/grades", instructorAuth, [body("studentId").notEmpty(), body("refId").notEmpty(), body("score").isNumeric(), body("maxScore").isNumeric()], validate, submitGrade);
router.get("/grades", instructorAuth, getAllGrades);
router.get("/grades/student/:studentId", instructorAuth, getGradesByStudent);

// Admin can also view all grades
router.get("/grades/all", auth, getAllGrades);

module.exports = router;
