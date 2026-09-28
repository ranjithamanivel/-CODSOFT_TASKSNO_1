const express = require("express");

const router = express.Router();

const {
    getEnrollments,
    getEnrollmentById,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment
} = require("../controllers/enrollmentController");

router.get("/", getEnrollments);

router.get("/:id", getEnrollmentById);

router.post("/", createEnrollment);

router.put("/:id", updateEnrollment);

router.delete("/:id", deleteEnrollment);

module.exports = router;