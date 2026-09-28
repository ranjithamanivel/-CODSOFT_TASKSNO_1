const db = require("../config/database");

const getCourses = (req, res) => {

    const sql = "SELECT * FROM courses";

    db.query(sql, (error, results) => {

        if (error) {
            return res.status(500).json({
                message: "Failed to retrieve courses",
                error: error.message
            });
        }

        res.status(200).json(results);
    });
};

const getCourseById = (req, res) => {

    const courseId = req.params.id;

    const sql = "SELECT * FROM courses WHERE id = ?";

    db.query(sql, [courseId], (error, results) => {

        if (error) {
            return res.status(500).json({
                message: "Failed to retrieve course",
                error: error.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        res.status(200).json(results[0]);
    });
};

const createCourse = (req, res) => {

    const {
        course_name,
        course_code,
        credits
    } = req.body;

    const sql = `
        INSERT INTO courses
        (course_name, course_code, credits)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [course_name, course_code, credits],
        (error, result) => {

            if (error) {

                if (error.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({
                        message: "Course code already exists"
                    });
                }

                return res.status(500).json({
                    message: "Failed to create course",
                    error: error.message
                });
            }

            res.status(201).json({
                message: "Course created successfully",
                courseId: result.insertId
            });
        }
    );
};

const updateCourse = (req, res) => {

    const courseId = req.params.id;

    const {
        course_name,
        course_code,
        credits
    } = req.body;

    const sql = `
        UPDATE courses
        SET course_name = ?,
            course_code = ?,
            credits = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [course_name, course_code, credits, courseId],
        (error, result) => {

            if (error) {

                if (error.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({
                        message: "Course code already exists"
                    });
                }

                return res.status(500).json({
                    message: "Failed to update course",
                    error: error.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Course not found"
                });
            }

            res.status(200).json({
                message: "Course updated successfully"
            });
        }
    );
};

const deleteCourse = (req, res) => {

    const courseId = req.params.id;

    const sql = "DELETE FROM courses WHERE id = ?";

    db.query(sql, [courseId], (error, result) => {

        if (error) {
            return res.status(500).json({
                message: "Failed to delete course",
                error: error.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        res.status(200).json({
            message: "Course deleted successfully"
        });
    });
};

module.exports = {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
};