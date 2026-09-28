const db = require("../config/database");

//Get all the elements
const getStudents = (req, res) => {

    const {
        search,
        department,
        sort,
        order
    } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page < 1 || limit < 1) {
        return res.status(400).json({
            message: "Page and limit must be greater than 0"
        });
    }

    const offset = (page - 1) * limit;


    let sql = "SELECT * FROM students";
    let conditions = [];
    let values = [];

    // Search
    if (search) {
        conditions.push(
            "(name LIKE ? OR email LIKE ?)"
        );

        values.push(
            `%${search}%`,
            `%${search}%`
        );
    }

    // Filter
    if (department) {
        conditions.push("department = ?");
        values.push(department);
    }

    // WHERE
    if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
    }

    // Sorting
    const allowedSortFields = [
        "id",
        "name",
        "email",
        "department",
        "year"
    ];

    const sortField =
        allowedSortFields.includes(sort)
            ? sort
            : "id";

    const sortOrder =
        order &&
        order.toLowerCase() === "desc"
            ? "DESC"
            : "ASC";

    sql += ` ORDER BY ${sortField} ${sortOrder}`;
    
    //Pagination
    sql += " LIMIT ? OFFSET ?";

    values.push(limit, offset);

    db.query(sql, values, (error, results) => {

        if (error) {

            return res.status(500).json({
                message: "Failed to retrieve students",
                error: error.message
            });
        }

        res.status(200).json({
            page: page,
            limit: limit,
            count: results.length,
            data: results
        });
    });

};

// Element get by ID
const getStudentById = (req, res) => {

    const studentId = req.params.id;

    const sql = "SELECT * FROM students WHERE id = ?";

    db.query(sql, [studentId], (error, results) => {

        if (error) {
            return res.status(500).json({
                message: "Failed to retrieve student",
                error: error.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json(results[0]);
    });
};

//POST method
const createStudent = (req, res) => {

    const {
        name,
        email,
        phone,
        department,
        year
    } = req.body;

    const sql = `
        INSERT INTO students
        (name, email, phone, department, year)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, email, phone, department, year],
        (error, result) => {

            if (error) {

                if (error.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({
                        message: "Email already exists"
                    });
                }

                return res.status(500).json({
                    message: "Failed to create student",
                    error: error.message
                });
            }

            res.status(201).json({
                message: "Student created successfully",
                studentId: result.insertId
            });
        }
    );
};

const updateStudent = (req, res) => {

    const studentId = req.params.id;

    const {
        name,
        email,
        phone,
        department,
        year
    } = req.body;

    const sql = `
        UPDATE students
        SET name = ?,
            email = ?,
            phone = ?,
            department = ?,
            year = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [name, email, phone, department, year, studentId],
        (error, result) => {

            if (error) {
                return res.status(500).json({
                    message: "Failed to update student",
                    error: error.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Student not found"
                });
            }

            res.status(200).json({
                message: "Student updated successfully"
            });
        }
    );
};

const deleteStudent = (req, res) => {

    const studentId = req.params.id;

    const sql = "DELETE FROM students WHERE id = ?";

    db.query(sql, [studentId], (error, result) => {

        if (error) {
            return res.status(500).json({
                message: "Failed to delete student",
                error: error.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            message: "Student deleted successfully"
        });
    });
};

module.exports = {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
};