import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface AttendanceData {
  year: string;
  attendance: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: AttendanceData; value: number }[];
}

const TotalAttendanceReport: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('All Classes');
  const [dateRange, setDateRange] = useState<string>('Last 30 Days');

  useEffect(() => {
    const fetchAttendanceData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/attendance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filter: selectedFilter,
            dateRange: dateRange,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch attendance data');
        }

        const data = await response.json();
        setAttendanceData(data);
      } catch (err: any) {
        setError(err.message);
        setAttendanceData([
          { year: '2018', attendance: 200 },
          { year: '2019', attendance: 250 },
          { year: '2020', attendance: 400 },
          { year: '2021', attendance: 300 },
          { year: '2022', attendance: 230 },
          { year: '2023', attendance: 350 },
          { year: '2024', attendance: 570 },
          { year: '2025', attendance: 420 },
          { year: '2026', attendance: 320 },
          { year: '2027', attendance: 400 },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceData();
  }, [selectedFilter, dateRange]);

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-md rounded-md text-sm">
          <p className="font-medium">{payload[0].payload.year}</p>
          <p className="text-purple-700">Attendance: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Total Attendance Report</h2>
        <button className="text-gray-500 hover:text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="relative inline-block text-left">
          <button
            className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full"
            onClick={() => {
              /* Toggle filter menu */
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </button>
        </div>

        <div className="relative inline-block text-left flex-grow">
          <button
            className="inline-flex justify-between items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            onClick={() => {
              /* Toggle classes dropdown */
            }}
          >
            {selectedFilter}
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="relative inline-block text-left">
          <button
            className="inline-flex justify-between items-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            onClick={() => {
              /* Toggle date picker */
            }}
          >
            {dateRange}
            <svg
              className="ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-80">
          <p className="text-gray-500">Loading attendance data...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-80">
          <p className="text-red-500">Error: {error}</p>
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={attendanceData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis
                dataKey="year"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                domain={[0, 'dataMax + 100']}
                ticks={[0, 200, 400, 600]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="attendance"
                radius={[10, 10, 10, 10]}
                barSize={40}
                fill="#D1BCE6"
                fillOpacity={0.8}
              >
                {attendanceData.map((entry, index) => (
                  <rect
                    key={`bar-${index}`}
                    fill={entry.year === '2024' ? '#9333EA' : '#D1BCE6'}
                    fillOpacity={entry.year === '2024' ? 1 : 0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default TotalAttendanceReport;