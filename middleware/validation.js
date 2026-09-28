const validateStudent = (req, res, next) => {

    const {
        name,
        email,
        phone,
        department,
        year
    } = req.body;

    if (!name || !email || !phone || !department || !year) {
        return res.status(400).json({
            message: "All student fields are required"
        });
    }

    if (!email.includes("@")) {
        return res.status(400).json({
            message: "Please provide a valid email"
        });
    }

    if (!/^\d{10}$/.test(phone)) {
        return res.status(400).json({
            message: "Phone number must contain exactly 10 digits"
        });
    }

    if (year < 1 || year > 5) {
        return res.status(400).json({
            message: "Year must be between 1 and 5"
        });
    }

    next();
};

module.exports = {
    validateStudent
};