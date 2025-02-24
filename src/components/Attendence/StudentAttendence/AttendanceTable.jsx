import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const AttendanceTable = ({
  filteredStudents,
  selectedStudentIds,
  toggleStudentSelection,
  toggleSelectAll,
  getStatusIcon,
  handleAttendanceChange,
  handleAutomaticCheckIn
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="p-4 bg-gray-50">
              <input
                type="checkbox"
                className="rounded border-gray-300"
                onChange={toggleSelectAll}
                checked={
                  filteredStudents.length > 0 &&
                  selectedStudentIds.size === filteredStudents.length
                }
              />
            </th>
            <th className="p-4 text-left text-sm font-medium text-gray-600 bg-gray-50">
              Student Name
            </th>
            <th className="p-4 text-left text-sm font-medium text-gray-600 bg-gray-50">
              Roll No.
            </th>
            <th className="p-4 text-left text-sm font-medium text-gray-600 bg-gray-50">
              Status
            </th>
            <th className="p-4 text-left text-sm font-medium text-gray-600 bg-gray-50">
              Time In
            </th>
            <th className="p-4 text-left text-sm font-medium text-gray-600 bg-gray-50">
              Time Out
            </th>
            <th className="p-4 text-left text-sm font-medium text-gray-600 bg-gray-50">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length > 0 ? (
            filteredStudents.map(student => (
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
                      <span className="text-sm font-medium block">
                        {student.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {student.grade} - {student.section}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600">{student.rollNo}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(student.attendance)}
                    <select
                      value={student.attendance}
                      onChange={e =>
                        handleAttendanceChange(student.id, e.target.value)
                      }
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
                      <option value="Select" disabled>
                        Select
                      </option>
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Late">Late</option>
                    </select>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600">{student.timeIn}</td>
                <td className="p-4 text-sm text-gray-600">
                  {student.timeOut || '-'}
                </td>
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
              <td
                colSpan="7"
                className="p-4 text-center text-gray-500 animate-slideDown"
              >
                No Results Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;