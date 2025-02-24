import React, { useState, useEffect } from 'react';
import { Search, Calendar, Download, Filter, MoreHorizontal, Clock, CheckCircle, XCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentAttendance = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    present: 85,
    absent: 10,
    late: 5,
    totalStudents: 45
  });

  // Configurable time settings
  const scheduleConfig = {
    startTime: '08:30:00',
    lateThreshold: '08:45:00',
    endTime: '15:30:00'
  };

  const [students, setStudents] = useState([]);
  const [fetchError, setFetchError] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState(new Set());
  const [bulkModalVisible, setBulkModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // New states for grade & section filtering.
  const [gradeFilter, setGradeFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);

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
          grade: s.grade || 'N/A',
          section: s.section || 'N/A',
          attendance: "Select", // Force default attendance to "Select"
          timeIn: '-',
          timeOut: '-',
          isCheckedIn: false,
          attendanceHistory: []
        }));
        console.log("Mapped Students:", mappedStudents);
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
    const checkLateArrivals = () => {
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
    };
    checkLateArrivals();
  }, [currentTime]);
  
  // Function to handle automatic check-in
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
  
  // Function to handle manual attendance change
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
  
  // Update attendance stats function
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
  
  // --- New Import Functionality ---
  // Function to handle file input change (CSV Import)
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

  // Parse CSV data and merge with existing students
  const processCSVData = (csvText) => {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    if (lines.length <= 1) return; // no data rows found
    // Assumes first line is header: ID, Name, Roll No, Grade, Section, Attendance, Time In, Time Out
    const newStudents = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const parts = line.split(',');
      const clean = parts.map(p => p.replace(/^"|"$/g, '').trim());
      const [id, name, rollNo, grade, section, attendance, timeIn, timeOut] = clean;
      newStudents.push({
        id: id || `${Date.now()}_${i}`,
        name: name || "Unknown",
        rollNo: rollNo || "N/A",
        grade: grade || "N/A",
        section: section || "N/A",
        attendance: "Select", // Force default attendance to "Select"
        timeIn: timeIn || '-',
        timeOut: timeOut || '-',
        isCheckedIn: false, // Reset check-in status
        attendanceHistory: []
      });
    }
    // Merge new students with existing ones.
    setStudents(prev => {
      const existingMap = {};
      prev.forEach(stu => {
        existingMap[stu.id] = stu;
      });
      newStudents.forEach(newStu => {
        // Overwrite if already exists; otherwise add.
        existingMap[newStu.id] = { ...existingMap[newStu.id], ...newStu };
      });
      return Object.values(existingMap);
    });
  };
  // --- End Import Functionality ---

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

  // Bulk check-in handlers
  const handleBulkCheckInButton = () => {
    if (selectedStudentIds.size === 0) {
      alert("Please select at least one student for bulk check-in.");
      return;
    }
    setBulkModalVisible(true);
  };

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

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setShowDatePicker(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Compute unique grades and sections for filtering options.
  const uniqueGrades = [...new Set(students.map(s => s.grade))];
  const uniqueSections = [...new Set(students.map(s => s.section))];

  // Update filteredStudents to include grade and section filters.
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (gradeFilter === "" || student.grade === gradeFilter) &&
    (sectionFilter === "" || student.section === sectionFilter)
  );

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
              <span className="ml-2 font-medium">{scheduleConfig.startTime.slice(0, 5)} - {scheduleConfig.endTime.slice(0, 5)}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* ... Stats cards remain the same ... */}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 flex flex-wrap items-center gap-2 border-b border-gray-100">
            <button
              onClick={toggleDatePicker}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2"
            >
              <Calendar size={16} />
              {selectedDate 
                ? new Date(selectedDate).toLocaleDateString() 
                : "Select Date"}
            </button>
            {/* Modified Grade & Section Button */}
            <button 
              onClick={() => setShowFilterModal(true)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2"
            >
              <Filter size={16} />
              Grade & Section
            </button>
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search student name or roll number"
                value={searchTerm}
                onChange={handleSearchChange}
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
            {/* Export and Import Buttons */}
            <button 
              onClick={handleExport}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2"
              disabled={exporting}
            >
              <Download size={16} />
              {exporting 
                ? <span className="animate-pulse">Downloading...</span>
                : "Export"}
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
  
          {fetchError && (
            <div className="text-red-500 animate-pulse mb-4">
              Data cannot fetch from backend
            </div>
          )}
  
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="p-4 bg-gray-50">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300" 
                      onChange={toggleSelectAll}
                      checked={students.length > 0 && selectedStudentIds.size === students.length}
                    />
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600 bg-gray-50">Student Name</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600 bg-gray-50">Roll No.</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600 bg-gray-50">Status</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600 bg-gray-50">Time In</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600 bg-gray-50">Time Out</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600 bg-gray-50">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-gray-100 hover:bg-purple-50 transition-opacity duration-300"
                    >
                      <td className="p-4">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300" 
                          checked={selectedStudentIds.has(student.id)}
                          onChange={() => toggleStudentSelection(student.id)}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <span className="text-sm font-medium block">{student.name}</span>
                            <span className="text-xs text-gray-500">{student.grade} - {student.section}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{student.rollNo}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(student.attendance)}
                          <select
                            value={student.attendance}
                            onChange={(e) => handleAttendanceChange(student.id, e.target.value)}
                            className={`px-3 py-1 rounded-full text-sm border-0 ${
                              student.attendance === 'Present'
                                ? 'bg-green-100 text-green-800'
                                : student.attendance === 'Absent'
                                ? 'bg-red-100 text-red-800'
                                : student.attendance === 'Late'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <option value="Select" disabled>Select</option>
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                            <option value="Late">Late</option>
                          </select>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{student.timeIn}</td>
                      <td className="p-4 text-sm text-gray-600">{student.timeOut || '-'}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleAutomaticCheckIn(student.id)}
                          disabled={student.isCheckedIn}
                          className={`px-3 py-1 rounded-lg text-sm ${
                            student.isCheckedIn
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                          }`}
                        >
                          Check In
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500 animate-slideDown">
                      No Results Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {bulkModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Bulk Check-In Options</h2>
            <p className="mb-4">Select the attendance status for the selected students:</p>
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => handleBulkCheckIn('Absent')} 
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Bulk Check-In as Absent
              </button>
              <button 
                onClick={() => handleBulkCheckIn('Present')} 
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Bulk Check-In as Present
              </button>
              <button 
                onClick={() => setBulkModalVisible(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* New Modal for Grade & Section Filtering */}
      {showFilterModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4">Filter by Grade & Section</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
              <select 
                className="w-full border border-gray-300 rounded-lg p-2" 
                value={gradeFilter} 
                onChange={(e)=> setGradeFilter(e.target.value)}
              >
                <option value="">All</option>
                {uniqueGrades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
              <select 
                className="w-full border border-gray-300 rounded-lg p-2" 
                value={sectionFilter} 
                onChange={(e)=> setSectionFilter(e.target.value)}
              >
                <option value="">All</option>
                {uniqueSections.map(section => (
                  <option key={section} value={section}>{section}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-4">
              <button 
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={() => setShowFilterModal(false)}
              >
                Apply Filters
              </button>
              <button 
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => {
                  setGradeFilter("");
                  setSectionFilter("");
                  setShowFilterModal(false);
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAttendance;