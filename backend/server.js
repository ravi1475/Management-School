const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// 📌 GET all students
app.get("/students", async (req, res) => {
    try {
        const [students] = await db.query("SELECT * FROM students");
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📌 GET student by ID
app.get("/students/:id", async (req, res) => {
    try {
        const [student] = await db.query("SELECT * FROM students WHERE id = ?", [req.params.id]);
        if (student.length === 0) return res.status(404).json({ error: "Student not found" });
        res.json(student[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📌 POST - Add new student
app.post("/students", async (req, res) => {
    try {
        const {
            first_name,
            middle_name,
            last_name,
            date_of_birth,
            gender,
            blood_group,
            nationality,
            religion,
            category,
            aadhaar_number,
            mobile_number,
            email,
            emergency_contact,
            admission_no,
            roll_number,
            class_name,
            section,
            admission_date,
            previous_school,
            address,
            father,
            mother
        } = req.body;

        const sql = `
            INSERT INTO students (
                first_name, middle_name, last_name, date_of_birth, gender, 
                blood_group, nationality, religion, category, aadhaar_number,
                mobile_number, email, emergency_contact, admission_no, roll_number,
                class_name, section, admission_date, previous_school,
                address_house_no, address_street, address_city, address_state, address_pin_code,
                father_name, father_occupation, father_contact_number, father_email,
                mother_name, mother_occupation, mother_contact_number, mother_email
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            first_name || '',
            middle_name || '',
            last_name || '',
            date_of_birth,
            gender || '',
            blood_group || '',
            nationality || '',
            religion || '',
            category || '',
            aadhaar_number || '',
            mobile_number || '',
            email || '',
            emergency_contact || '',
            admission_no || '',
            roll_number || '',
            class_name || '',
            section || '',
            admission_date,
            previous_school || '',
            address?.house_no || '',
            address?.street || '',
            address?.city || '',
            address?.state || '',
            address?.pin_code || '',
            father?.name || '',
            father?.occupation || '',
            father?.contact_number || '',
            father?.email || '',
            mother?.name || '',
            mother?.occupation || '',
            mother?.contact_number || '',
            mother?.email || ''
        ];

        const [result] = await db.query(sql, values);
        res.json({ id: result.insertId, message: "Student added successfully" });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: err.message });
    }
});

// 📌 PUT - Update student
app.put("/students/:id", async (req, res) => {
    try {
        const { first_name, last_name, email, mobile_number } = req.body;
        const sql = "UPDATE students SET first_name=?, last_name=?, email=?, mobile_number=? WHERE id=?";
        await db.query(sql, [first_name, last_name, email, mobile_number, req.params.id]);
        res.json({ message: "Student updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📌 DELETE - Remove student
app.delete("/students/:id", async (req, res) => {
    try {
        const sql = "DELETE FROM students WHERE id=?";
        await db.query(sql, [req.params.id]);
        res.json({ message: "Student deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
