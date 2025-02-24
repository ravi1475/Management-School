import React, { useEffect, useState } from "react";
import axios from "axios";

const TeacherDashboard2 = () => {
    const [students, setStudents] = useState([]);

    // Fetch student attendance data from backend
    const fetchAttendance = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/get_attendance");
            setStudents(response.data);
        } catch (error) {
            console.error("Error fetching attendance:", error);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Teacher Dashboard</h1>
            <button onClick={fetchAttendance} style={{ marginBottom: "20px", padding: "10px 20px", fontSize: "16px" }}>
                Refresh Attendance
            </button>
            <table border="1" style={{ margin: "auto", width: "60%", textAlign: "center", fontSize: "18px" }}>
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Attendance</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td>{student.id}</td>
                            <td>{student.name}</td>
                            <td style={{ color: student.status === "present" ? "green" : "red" }}>
                                {student.status || "Not Marked"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TeacherDashboard2;
