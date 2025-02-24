import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, TooltipProps } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';

// Define interfaces for data structure
interface AttendanceData {
  year: string;
  attendance: number;
  month: string;
}

// Define props for custom tooltip
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: AttendanceData;
  }>;
}

// Type for filter options
type FilterOption = 'all' | 'last30';

const AttendanceChart: React.FC = () => {
  const [activeBar, setActiveBar] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [filteredData, setFilteredData] = useState<AttendanceData[]>([]);

  const allData: AttendanceData[] = [
    { year: '2018', attendance: 200, month: 'Jan' },
    { year: '2019', attendance: 250, month: 'Feb' },
    { year: '2020', attendance: 380, month: 'Mar' },
    { year: '2021', attendance: 320, month: 'Apr' },
    { year: '2022', attendance: 240, month: 'May' },
    { year: '2023', attendance: 350, month: 'Jun' },
    { year: '2024', attendance: 570, month: 'Jul' },
    { year: '2025', attendance: 410, month: 'Aug' },
    { year: '2026', attendance: 320, month: 'Sep' },
    { year: '2027', attendance: 380, month: 'Oct' }
  ];

  // Generate last 30 days data
  const last30DaysData: AttendanceData[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
      year: date.toLocaleDateString(),
      attendance: Math.floor(Math.random() * 200) + 100,
      month: date.toLocaleDateString('en-US', { month: 'short' })
    };
  }).reverse();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setFilteredData(activeFilter === 'last30' ? last30DaysData : allData);
  }, [activeFilter]);

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-xl rounded-lg border border-purple-100">
          <p className="text-sm font-medium text-purple-600 mb-1">
            {activeFilter === 'last30' ? payload[0].payload.month : payload[0].payload.year}
          </p>
          <p className="text-lg font-bold text-purple-800">
            {payload[0].value.toLocaleString()} Attendees
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-4xl h-96 p-8 mt-16 bg-white rounded-xl shadow-lg transition-all duration-500 ease-in-out">
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-purple-900 mb-2">Attendance Analytics</h2>
            <p className="text-purple-600 text-sm">Track your attendance patterns over time</p>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setActiveFilter('all')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 
                ${activeFilter === 'all' 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' 
                  : 'bg-purple-50 text-purple-600 hover:bg-purple-100'}`}
            >
              <TrendingUp size={18} />
              <span className="font-medium">All Time</span>
            </button>
            <button
              onClick={() => setActiveFilter('last30')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300
                ${activeFilter === 'last30' 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' 
                  : 'bg-purple-50 text-purple-600 hover:bg-purple-100'}`}
            >
              <Calendar size={18} />
              <span className="font-medium">Last 30 Days</span>
            </button>
          </div>
        </div>

        {/* Chart Section */}
        <div className="mt-4 bg-white p-6 rounded-xl border border-purple-100">
          <BarChart
            width={600}
            height={300}
            data={filteredData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            onMouseMove={(state: any) => {
              if (state.activeTooltipIndex !== undefined) {
                setActiveBar(state.activeTooltipIndex);
              }
            }}
            onMouseLeave={() => setActiveBar(null)}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f3ff" />
            <XAxis
              dataKey={activeFilter === 'last30' ? 'month' : 'year'}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#7c3aed', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#7c3aed', fontSize: 12 }}
              domain={[0, (dataMax: number) => dataMax + 100]}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="attendance" 
              radius={[8, 8, 0, 0]}
              animationDuration={1500}
              animationBegin={200}
            >
              {filteredData.map((entry, index) => (
                <rect
                  key={`bar-${index}`}
                  fill={index === filteredData.length - 1 ? '#c4b5fd' : '#ddd6fe'}
                  className={`transition-all duration-300 ease-in-out transform
                    ${activeBar === index ? 'opacity-100 scale-y-105' : 'opacity-90'}
                    hover:fill-purple-500 hover:opacity-100
                    ${isLoading ? 'translate-y-full' : 'translate-y-0'}`}
                  style={{
                    transformOrigin: 'bottom',
                    transition: `transform 500ms ${index * 50}ms, opacity 300ms ${index * 50}ms`
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-purple-600 text-sm font-medium">Total Attendees</p>
            <p className="text-2xl font-bold text-purple-900">
              {filteredData.reduce((sum, item) => sum + item.attendance, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-purple-600 text-sm font-medium">Average Attendance</p>
            <p className="text-2xl font-bold text-purple-900">
              {Math.round(filteredData.reduce((sum, item) => sum + item.attendance, 0) / filteredData.length).toLocaleString()}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-purple-600 text-sm font-medium">Peak Attendance</p>
            <p className="text-2xl font-bold text-purple-900">
              {Math.max(...filteredData.map(item => item.attendance)).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceChart;