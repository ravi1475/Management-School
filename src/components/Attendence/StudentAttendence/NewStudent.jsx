import React, { useState, useEffect } from 'react';
import {
  Search,
  Calendar,
  Download,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FilterModal from './FilterModal';
import AttendanceTable from './AttendanceTable';

// Allowed grade and section options
const gradeOptions = Array.from({ length: 12 }, (_, i) => String(i + 1));
const sectionOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

// Two default students that always show initially
const defaultStudents = [
  {
    id: 'default-1',
    name: 'Default Student 1',
    rollNo: 'D001',
    grade: '1',
    section: 'A',
    attendance: 'Present',
    timeIn: '08:30 AM',
    timeOut: '-',
    isCheckedIn: true,
    attendanceHistory: []
  },
  {
    id: 'default-2',
    name: 'Default Student 2',
    rollNo: 'D002',
    grade: '2',
    section: 'B',
    attendance: 'Absent',
    timeIn: '-',
    timeOut: '-',
    isCheckedIn: false,
    attendanceHistory: []
  }
];

const StudentAttendance = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    present: 85,
    absent: 10,
    late: 5,
    totalStudents: 45
  });

  // Time settings configuration
  const scheduleConfig = {
    startTime: '08:30:00',
    lateThreshold: '08:45:00',
    endTime: '15:30:00'
  };

  // Students state (initialized with two default students)
  const [students, setStudents] = useState(defaultStudents);
  const [fetchError, setFetchError] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState(new Set());
  const [bulkModalVisible, setBulkModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter states (grade & section)
  const [filters, setFilters] = useState({ grade: '', section: '' });
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Attendance summary fetched from backend (present & absent only)
  const [attendanceRecords, setAttendanceRecords] = useState({ present: [], absent: [] });

  // Timer to update currentTime every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch students from backend; if data found, replace default students.
  useEffect(() => {
    fetch('http://localhost:5000/api/students')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        const studentsData = Array.isArray(data) ? data : data.students;
        if (studentsData && studentsData.length > 0) {
          const mappedStudents = studentsData.map((s, index) => ({
            id: s.id || s.student_id || index,
            name: s.first_name ? `${s.first_name} ${s.last_name}` : s.me,
            rollNo: s.rollNo || s.student_registration_no || 'N/A',
            grade: gradeOptions.includes(String(s.grade)) ? String(s.grade) : 'N/A',
            section:
              s.section && sectionOptions.includes(String(s.section).toUpperCase())
                ? String(s.section).toUpperCase()
                : 'N/A',
            attendance: "Select",
            timeIn: '-',
            timeOut: '-',
            isCheckedIn: false,
            attendanceHistory: []
          }));
          setStudents(mappedStudents);
        }
      })
      .catch(error => {
        console.error('Error fetching students:', error);
        setFetchError(true);
        setTimeout(() => setFetchError(false), 3000);
      });
  }, []);

  // Fetch attendance summary (present & absent only)
  useEffect(() => {
    fetch('http://localhost:5000/api/attendance')
      .then(response => response.json())
      .then(data => {
        setAttendanceRecords(data);
      })
      .catch(err => console.error("Error fetching attendance records:", err));
  }, []);

  // Auto update: Mark as absent if check-in time passed without check-in.
  useEffect(() => {
    const currentTimeStr = currentTime.toTimeString().slice(0, 8);
    setStudents(prevStudents =>
      prevStudents.map(student => {
        if (!student.timeIn && !student.isCheckedIn && currentTimeStr > scheduleConfig.startTime) {
          return { ...student, attendance: 'Absent', timeIn: '-', isCheckedIn: true };
        }
        return student;
      })
    );
  }, [currentTime]);

  // Handle automatic check-in (single student)
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
              { date: now.toLocaleDateString(), status, timeIn: formattedTime }
            ]
          };
        }
        return student;
      })
    );
    updateAttendanceStats();
  };

  // Handle manual attendance change for a student
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
              { date: now.toLocaleDateString(), status, timeIn: formattedTime }
            ]
          };
        }
        return student;
      })
    );
    updateAttendanceStats();
  };

  // Update overall attendance stats
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

  // CSV export functionality
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
    // Replace default students with imported ones.
    setStudents(newStudents);
  };
  // --- End CSV Import Functionality ---

  // Toggle student selection for bulk actions
  const toggleStudentSelection = (studentId) => {
    setSelectedStudentIds(prev => {
      const newSet = new Set(prev);
      newSet.has(studentId) ? newSet.delete(studentId) : newSet.add(studentId);
      return newSet;
    });
  };

  // Toggle "Select All" checkbox state
  const toggleSelectAll = () => {
    if (selectedStudentIds.size === students.length) {
      setSelectedStudentIds(new Set());
    } else {
      setSelectedStudentIds(new Set(students.map(s => s.id)));
    }
  };

  // Handle bulk check-in button press
  const handleBulkCheckInButton = () => {
    if (selectedStudentIds.size === 0) {
      alert("Please select at least one student for bulk check-in.");
      return;
    }
    setBulkModalVisible(true);
  };

  // Filter functions: compute filteredStudents and filter modal handlers.
  const filteredStudents = students.filter(student =>
    (filters.grade === '' || student.grade === filters.grade) &&
    (filters.section === '' || student.section === filters.section) &&
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApplyFilters = ({ grade, section }) => {
    setFilters({ grade, section });
    setShowFilterModal(false);
  };

  const handleClearFilters = () => {
    setFilters({ grade: '', section: '' });
    setShowFilterModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className="pt-16 p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-1">
            <ArrowLeft
              size={24}
              className="text-purple-600 cursor-pointer mr-4"
              onClick={() => navigate('/')}
            />
            <h1 className="text-3xl font-semibold text-gray-800">Student Attendance</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <Clock size={20} className="text-purple-500" />
              <span className="text-lg font-medium">
                {currentTime.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="text-sm text-gray-500">Class Time:</span>
              <span className="ml-2 font-medium">
                {scheduleConfig.startTime.slice(0, 5)} - {scheduleConfig.endTime.slice(0, 5)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Attendance Summary Section (from backend) */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Present Students</h2>
            {attendanceRecords.present.length > 0 ? (
              <ul>
                {attendanceRecords.present.map(student => (
                  <li key={student.id} className="text-sm">{student.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No data.</p>
            )}
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Absent Students</h2>
            {attendanceRecords.absent.length > 0 ? (
              <ul>
                {attendanceRecords.absent.map(student => (
                  <li key={student.id} className="text-sm">{student.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No data.</p>
            )}
          </div>
        </div>

        {/* Controls for Filtering, Search, Export, and Import */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="p-4 flex flex-wrap items-center gap-2 border-b border-gray-100">
            <button
              onClick={() => {}}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2"
            >
              <Calendar size={16} />
              {/* Date picker control can be added here if needed */}
              Select Date
            </button>
            <button
              onClick={() => setShowFilterModal(true)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2"
            >
              <Filter size={16} />
              Grade &amp; Section
            </button>
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search student name or roll number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition duration-300"
                >
                  &times;
                </button>
              )}
            </div>
            <button
              onClick={handleBulkCheckInButton}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm flex items-center gap-2"
            >
              <Clock size={16} />
              Bulk Check-In
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2"
              disabled={exporting}
            >
              <Download size={16} />
              {exporting ? <span className="animate-pulse">Downloading...</span> : "Export"}
            </button>
            <button
              onClick={() => document.getElementById('importFileInput').click()}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2"
            >
              Import
            </button>
            <input
              type="file"
              id="importFileInput"
              accept=".csv"
              onChange={handleImportFile}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* Attendance Table (separated component) */}
        <AttendanceTable
          filteredStudents={filteredStudents}
          selectedStudentIds={selectedStudentIds}
          toggleStudentSelection={toggleStudentSelection}
          toggleSelectAll={toggleSelectAll}
          getStatusIcon={status => {
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
          }}
          handleAttendanceChange={handleAttendanceChange}
          handleAutomaticCheckIn={handleAutomaticCheckIn}
        />
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <FilterModal
          gradeFilter={filters.grade}
          setGradeFilter={(grade) => setFilters(prev => ({ ...prev, grade }))}
          sectionFilter={filters.section}
          setSectionFilter={(section) => setFilters(prev => ({ ...prev, section }))}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />
      )}
    </div>
  );
};

export default StudentAttendance;