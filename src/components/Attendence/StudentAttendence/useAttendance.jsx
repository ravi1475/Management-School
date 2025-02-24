import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const gradeOptions = Array.from({ length: 12 }, (_, i) => String(i + 1));
const sectionOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const scheduleConfig = {
    startTime: '08:30:00',
    lateThreshold: '08:45:00',
    endTime: '15:30:00'
};

const useAttendance = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [stats, setStats] = useState({
        present: 85,
        absent: 10,
        late: 5,
        totalStudents: 45
    });
    const [students, setStudents] = useState([]);
    const [fetchError, setFetchError] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [selectedStudentIds, setSelectedStudentIds] = useState(new Set());
    const [bulkModalVisible, setBulkModalVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [gradeFilter, setGradeFilter] = useState("");
    const [sectionFilter, setSectionFilter] = useState("");

    // Update currentTime every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    // Fetch students from backend
    useEffect(() => {
        fetch('http://localhost:5000/api/students')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                const studentsData = Array.isArray(data) ? data : data.students;
                const mappedStudents = studentsData.map((s, index) => ({
                    id: s.id || s.student_id || index,
                    name: s.first_name ? `${s.first_name} ${s.last_name}` : s.me,
                    rollNo: s.rollNo || s.student_registration_no || 'N/A',
                    grade: gradeOptions.includes(String(s.grade)) ? String(s.grade) : 'N/A',
                    section: s.section && sectionOptions.includes(String(s.section).toUpperCase())
                        ? String(s.section).toUpperCase() : 'N/A',
                    attendance: "Select",
                    timeIn: '-',
                    timeOut: '-',
                    isCheckedIn: false,
                    attendanceHistory: []
                }));
                setStudents(mappedStudents);
            })
            .catch(error => {
                console.error('Error fetching students:', error);
                setFetchError(true);
                setTimeout(() => setFetchError(false), 3000);
            });
    }, []);

    // Auto check for late arrivals
    useEffect(() => {
        const currentTimeStr = currentTime.toTimeString().slice(0, 8);
        setStudents(prevStudents =>
            prevStudents.map(student => {
                if (!student.timeIn && !student.isCheckedIn && currentTimeStr > scheduleConfig.startTime) {
                    return {
                        ...student,
                        attendance: 'Absent',
                        timeIn: '-',
                        isCheckedIn: true
                    };
                }
                return student;
            })
        );
    }, [currentTime]);

    // Update attendance stats
    const updateAttendanceStats = () => {
        const totalStudents = students.length;
        const presentCount = students.filter(s => s.attendance === 'Present').length;
        const absentCount = students.filter(s => s.attendance === 'Absent').length;
        const lateCount = students.filter(s => s.attendance === 'Late').length;
        setStats({
            present: Math.round((presentCount / totalStudents) * 100),
            absent: Math.round((absentCount / totalStudents) * 100),
            late: Math.round((lateCount / totalStudents) * 100),
            totalStudents
        });
    };

    // Handle automatic check-in for a single student.
    const handleAutomaticCheckIn = (studentId) => {
        const now = new Date();
        const currentTimeStr = now.toTimeString().slice(0, 8);
        const formattedTime = now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        setStudents(prevStudents =>
            prevStudents.map(student => {
                if (student.id === studentId) {
                    let status = 'Present';
                    if (currentTimeStr > scheduleConfig.lateThreshold) status = 'Late';
                    return {
                        ...student,
                        attendance: status,
                        timeIn: formattedTime,
                        isCheckedIn: true,
                        attendanceHistory: [
                            ...student.attendanceHistory,
                            {
                                date: now.toLocaleDateString(),
                                status,
                                timeIn: formattedTime
                            }
                        ]
                    };
                }
                return student;
            })
        );
        updateAttendanceStats();
    };

    // Handle manual attendance change.
    const handleAttendanceChange = (studentId, status) => {
        const now = new Date();
        const formattedTime = now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        setStudents(prevStudents =>
            prevStudents.map(student => {
                if (student.id === studentId) {
                    return {
                        ...student,
                        attendance: status,
                        timeIn: status === 'Absent' ? '-' : formattedTime,
                        isCheckedIn: true,
                        attendanceHistory: [
                            ...student.attendanceHistory,
                            {
                                date: now.toLocaleDateString(),
                                status,
                                timeIn: formattedTime
                            }
                        ]
                    };
                }
                return student;
            })
        );
        updateAttendanceStats();
    };

    // Handler for export functionality (CSV)
    const handleExport = () => {
        setExporting(true);
        const headers = ['ID', 'Name', 'Roll No', 'Grade', 'Section', 'Attendance', 'Time In', 'Time Out'];
        const csvRows = [];
        csvRows.push(headers.join(','));
        students.forEach(student => {
            const row = [
                student.id,
                `"${student.name}"`,
                student.rollNo,
                student.grade,
                student.section,
                student.attendance,
                student.timeIn,
                student.timeOut || ''
            ];
            csvRows.push(row.join(','));
        });
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'student_attendance.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => setExporting(false), 1500);
    };

    // --- CSV Import Functionality ---
    const handleImportFile = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            processCSVData(text);
        };
        reader.readAsText(file);
    };

    const processCSVData = (csvText) => {
        const lines = csvText.split('\n').filter(line => line.trim() !== '');
        if (lines.length <= 1) return;
        const newStudents = [];
        for (let i = 1; i < lines.length; i++) {
            const parts = lines[i].split(',');
            const clean = parts.map(p => p.replace(/^"|"$/g, '').trim());
            const [id, name, rollNo, grade, section, attendance, timeIn, timeOut] = clean;
            newStudents.push({
                id: id || `${Date.now()}_${i}`,
                name: name || "Unknown",
                rollNo: rollNo || "N/A",
                grade: gradeOptions.includes(String(grade)) ? String(grade) : 'N/A',
                section: section && sectionOptions.includes(String(section).toUpperCase())
                    ? String(section).toUpperCase() : 'N/A',
                attendance: "Select",
                timeIn: timeIn || '-',
                timeOut: timeOut || '-',
                isCheckedIn: false,
                attendanceHistory: []
            });
        }
        setStudents(prev => {
            const existingMap = {};
            prev.forEach(stu => {
                existingMap[stu.id] = stu;
            });
            newStudents.forEach(newStu => {
                existingMap[newStu.id] = { ...existingMap[newStu.id], ...newStu };
            });
            return Object.values(existingMap);
        });
    };
    // --- End CSV Import Functionality ---

    // Toggle individual student selection
    const toggleStudentSelection = (studentId) => {
        setSelectedStudentIds(prev => {
            const newSet = new Set(prev);
            newSet.has(studentId) ? newSet.delete(studentId) : newSet.add(studentId);
            return newSet;
        });
    };

    // Toggle "Select All"
    const toggleSelectAll = () => {
        if (selectedStudentIds.size === students.length) {
            setSelectedStudentIds(new Set());
        } else {
            setSelectedStudentIds(new Set(students.map(s => s.id)));
        }
    };

    // Bulk check-in handler
    const handleBulkCheckIn = (status) => {
        const now = new Date();
        const formattedTime = now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        setStudents(prevStudents =>
            prevStudents.map(student => {
                if (selectedStudentIds.has(student.id)) {
                    return {
                        ...student,
                        attendance: status,
                        timeIn: status === 'Present' ? formattedTime : '-',
                        isCheckedIn: true,
                        attendanceHistory: [
                            ...student.attendanceHistory,
                            {
                                date: now.toLocaleDateString(),
                                status,
                                timeIn: status === 'Present' ? formattedTime : '-'
                            }
                        ]
                    };
                }
                return student;
            })
        );
        updateAttendanceStats();
        setBulkModalVisible(false);
        setSelectedStudentIds(new Set());
        alert(`Bulk check-in as ${status} completed successfully.`);
    };

    // Return status icon based on attendance status.
    const getStatusIcon = (status) => {
        switch (status) {
            case 'Present':
                return <CheckCircle size={16} className="text-green-500" />;
            case 'Absent':
                return <XCircle size={16} className="text-red-500" />;
            case 'Late':
                return <AlertCircle size={16} className="text-yellow-500" />;
            default:
                return null;
        }
    };

    return {
        currentTime,
        stats,
        students,
        fetchError,
        exporting,
        selectedStudentIds,
        bulkModalVisible,
        searchTerm,
        gradeFilter,
        sectionFilter,
        setSearchTerm,
        setGradeFilter,
        setSectionFilter,
        setBulkModalVisible,
        handleAutomaticCheckIn,
        handleAttendanceChange,
        handleExport,
        handleImportFile,
        toggleStudentSelection,
        toggleSelectAll,
        handleBulkCheckIn,
        getStatusIcon,
        processCSVData,
        gradeOptions,
        sectionOptions,
        scheduleConfig
    };
};

export default useAttendance;