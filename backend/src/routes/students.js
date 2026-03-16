const router = require("express").Router();
const { body } = require("express-validator");
const { grantStudentAccess, studentLogin, getStudentProfile, getAllStudents } = require("../controllers/studentController");
const { createAssignment, getAssignments, deleteAssignment, createTest, getTests, deleteTest, createTutorial, getTutorials, deleteTutorial } = require("../controllers/portalController");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");
const studentAuth = require("../middleware/studentAuth");

// Admin routes
router.post("/grant-access", auth, [body("enrollmentId").notEmpty(), body("password").isLength({ min: 6 })], validate, grantStudentAccess);
router.get("/all", auth, getAllStudents);

// Student auth
router.post("/login", [body("email").isEmail(), body("password").notEmpty()], validate, studentLogin);
router.get("/profile", studentAuth, getStudentProfile);

// Assignments
router.post("/assignments", auth, [body("title").notEmpty(), body("description").notEmpty(), body("dueDate").notEmpty()], validate, createAssignment);
router.get("/assignments", studentAuth, getAssignments);
router.delete("/assignments/:id", auth, deleteAssignment);

// Tests
router.post("/tests", auth, [body("title").notEmpty(), body("description").notEmpty()], validate, createTest);
router.get("/tests", studentAuth, getTests);
router.delete("/tests/:id", auth, deleteTest);

// Tutorials
router.post("/tutorials", auth, [body("title").notEmpty(), body("videoUrl").notEmpty()], validate, createTutorial);
router.get("/tutorials", studentAuth, getTutorials);
router.delete("/tutorials/:id", auth, deleteTutorial);

module.exports = router;
