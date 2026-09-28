require('dotenv').config()

const express=require("express");
const app=express();
const PORT=3000;
app.use(express.json());

require("./config/database");

const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");

app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);

app.get("/", (req,res)=>{
    res.send("Student Record Management API running");
});

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});