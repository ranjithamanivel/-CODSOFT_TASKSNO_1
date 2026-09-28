const db = require("../config/database");

const getEnrollments = (req, res) => {

    const sql = `
        SELECT
            e.id,
            e.student_id,
            s.name AS student_name,
            e.course_id,
            c.course_name,
            c.course_code,
            e.enrollment_date
        FROM enrollments e
        JOIN students s
            ON e.student_id = s.id
        JOIN courses c
            ON e.course_id = c.id
    `;

    db.query(sql, (error, results) => {

        if (error) {
            return res.status(500).json({
                message: "Failed to retrieve enrollments",
                error: error.message
            });
        }

        res.status(200).json(results);
    });
};

const getEnrollmentById = (req, res) => {

    const enrollmentId = req.params.id;

    const sql = `
        SELECT
            e.id,
            e.student_id,
            s.name AS student_name,
            e.course_id,
            c.course_name,
            c.course_code,
            e.enrollment_date
        FROM enrollments e
        JOIN students s
            ON e.student_id = s.id
        JOIN courses c
            ON e.course_id = c.id
        WHERE e.id = ?
    `;

    db.query(sql, [enrollmentId], (error, results) => {

        if (error) {
            return res.status(500).json({
                message: "Failed to retrieve enrollment",
                error: error.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Enrollment not found"
            });
        }

        res.status(200).json(results[0]);
    });
};

const createEnrollment = (req, res) => {
    const {
        student_id,
        course_id,
        enrollment_date
    } = req.body;

    const sql = `
        INSERT INTO enrollments
        (student_id, course_id, enrollment_date)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [student_id, course_id, enrollment_date],
        (error, result) => {

            if (error) {

                if (error.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({
                        message: "Student is already enrolled in this course"
                    });
                }

                if (error.code === "ER_NO_REFERENCED_ROW_2") {
                    return res.status(400).json({
                        message: "Invalid student ID or course ID"
                    });
                }

                return res.status(500).json({
                    message: "Failed to create enrollment",
                    error: error.message
                });
            }

            res.status(201).json({
                message: "Enrollment created successfully",
                enrollmentId: result.insertId
            });
        }
    );
};

const updateEnrollment = (req, res) => {
    const enrollmentId = req.params.id;
    const {
        student_id,
        course_id,
        enrollment_date
    } = req.body;

    const sql = `
        UPDATE enrollments
        SET student_id = ?,
            course_id = ?,
            enrollment_date = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            student_id,
            course_id,
            enrollment_date,
            enrollmentId
        ],
        (error, result) => {

            if (error) {

                if (error.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({
                        message: "Student is already enrolled in this course"
                    });
                }

                if (error.code === "ER_NO_REFERENCED_ROW_2") {
                    return res.status(400).json({
                        message: "Invalid student ID or course ID"
                    });
                }

                return res.status(500).json({
                    message: "Failed to update enrollment",
                    error: error.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Enrollment not found"
                });
            }

            res.status(200).json({
                message: "Enrollment updated successfully"
            });
        }
    );
};

const deleteEnrollment = (req, res) => {
    const enrollmentId = req.params.id;

    const sql = "DELETE FROM enrollments WHERE id = ?";

    db.query(sql, [enrollmentId], (error, result) => {

        if (error) {
            return res.status(500).json({
                message: "Failed to delete enrollment",
                error: error.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Enrollment not found"
            });
        }

        res.status(200).json({
            message: "Enrollment deleted successfully"
        });
    });
};

module.exports = {
    getEnrollments,
    getEnrollmentById,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment
};