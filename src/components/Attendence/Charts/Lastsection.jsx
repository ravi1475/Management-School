import React, { useState } from 'react';
import { Camera, X, Upload, Check } from 'lucide-react';

// Image Upload Modal Component
const ImageUploadModal = ({ onClose, onUpload, employeeName }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-96">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Update Profile Photo</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <div className="mb-4">
          <Camera className="mx-auto text-gray-400 mb-2" size={48} />
          <p className="text-sm text-gray-600">Upload photo for {employeeName}</p>
        </div>
        
        <label className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 transition-colors">
          <Upload size={16} className="mr-2" />
          <span>Choose File</span>
          <input type="file" className="hidden" onChange={onUpload} accept="image/*" />
        </label>
      </div>
    </div>
  </div>
);

// TopAttendants Component
const TopAttendants = ({ data }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleImageUpload = (event) => {
    // Handle image upload logic here
    setShowModal(false);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm w-72">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Top 5 Attendant</h2>
        <button className="text-gray-400 hover:text-gray-600">...</button>
      </div>
      
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.id} className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="relative cursor-pointer" onClick={() => {
                setSelectedEmployee(item);
                setShowModal(true);
              }}>
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
                />
                {item.isOnline && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                )}
                <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 hover:bg-opacity-10 transition-all flex items-center justify-center">
                  <Camera size={16} className="text-transparent group-hover:text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-800">{item.name}</span>
                <span className="text-xs text-gray-500">{item.department}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-end">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  parseFloat(item.percentage) === 100 
                    ? 'bg-green-100 text-green-600'
                    : parseFloat(item.percentage) >= 90
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {item.percentage}
                </span>
                <span className="text-xs text-gray-500 mt-1">{item.days}</span>
              </div>
              {item.trend === 'up' && <div className="text-green-500 text-xs">↑</div>}
              {item.trend === 'down' && <div className="text-red-500 text-xs">↓</div>}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <ImageUploadModal 
          onClose={() => setShowModal(false)}
          onUpload={handleImageUpload}
          employeeName={selectedEmployee?.name}
        />
      )}
    </div>
  );
};

// WeeklyAbsent Component
const WeeklyAbsent = ({ data }) => {
  const [hoveredDay, setHoveredDay] = useState(null);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const getCoordinates = (value, index, radius = 75) => {
    const angle = (index * 360) / 7 - 90;
    const x = 100 + (value / 100) * radius * Math.cos((angle * Math.PI) / 180);
    const y = 100 + (value / 100) * radius * Math.sin((angle * Math.PI) / 180);
    return { x, y };
  };

  const createRadarPath = (values) => {
    return values.map((value, index) => {
      const { x, y } = getCoordinates(value, index);
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    }).join(' ') + 'Z';
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm w-72">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Weekly Absent</h2>
        <div className="flex gap-2">
          <button className="text-xs px-3 py-1 bg-purple-100 text-purple-600 rounded-full">
            This Week
          </button>
          <button className="text-gray-400 hover:text-gray-600">...</button>
        </div>
      </div>
      
      <div className="relative h-64">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Background grid */}
          {[1, 2, 3, 4].map((level) => (
            <circle
              key={level}
              cx="100"
              cy="100"
              r={20 * level}
              fill="none"
              stroke="#eee"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
          ))}
          
          {/* Data area */}
          <path
            d={createRadarPath(data)}
            fill="url(#gradientPurple)"
            stroke="rgb(192, 132, 252)"
            strokeWidth="2"
            className="transition-all duration-300"
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradientPurple" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(216, 180, 254, 0.6)" />
              <stop offset="100%" stopColor="rgba(216, 180, 254, 0.1)" />
            </linearGradient>
          </defs>

          {/* Data points and labels */}
          {data.map((value, index) => {
            const { x, y } = getCoordinates(value, index);
            const labelCoords = getCoordinates(100, index, 95);
            const isHovered = daysOfWeek[index] === hoveredDay;

            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? "4" : "3"}
                  fill="white"
                  stroke="rgb(192, 132, 252)"
                  strokeWidth="2"
                  className="transition-all duration-200"
                />
                <text
                  x={labelCoords.x}
                  y={labelCoords.y}
                  textAnchor="middle"
                  className={`text-xs ${isHovered ? 'fill-purple-600 font-medium' : 'fill-gray-500'}`}
                  onMouseEnter={() => setHoveredDay(daysOfWeek[index])}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  {daysOfWeek[index]}
                </text>
                {isHovered && (
                  <g>
                    <rect
                      x={x - 15}
                      y={y - 25}
                      width="30"
                      height="20"
                      rx="4"
                      fill="rgba(192, 132, 252, 0.9)"
                    />
                    <text
                      x={x}
                      y={y - 12}
                      textAnchor="middle"
                      className="text-[10px] fill-white font-medium"
                    >
                      {value}%
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

// Main Dashboard Component
const LastSection = () => {
  const attendanceData = [
    { 
      id: 1, 
      name: 'Jacob Zachary', 
      percentage: '100%', 
      days: '30 Days', 
      avatar: '/api/placeholder/32/32',
      department: 'Engineering',
      isOnline: true,
      trend: 'up'
    },
    { 
      id: 2, 
      name: 'Hannah Sarah', 
      percentage: '100%', 
      days: '30 Days', 
      avatar: '/api/placeholder/32/32',
      department: 'Design',
      isOnline: true,
      trend: 'up'
    },
    { 
      id: 3, 
      name: 'Megan Alyssa', 
      percentage: '95%', 
      days: '30 Days', 
      avatar: '/api/placeholder/32/32',
      department: 'Marketing',
      isOnline: false,
      trend: 'down'
    },
    { 
      id: 4, 
      name: 'Lauren Rachel', 
      percentage: '92%', 
      days: '30 Days', 
      avatar: '/api/placeholder/32/32',
      department: 'Sales',
      isOnline: true,
      trend: 'up'
    },
    { 
      id: 5, 
      name: 'Abby Victoria', 
      percentage: '88%', 
      days: '30 Days', 
      avatar: '/api/placeholder/32/32',
      department: 'Support',
      isOnline: false,
      trend: 'down'
    }
    // { 
    //   id: 5, 
    //   name: 'Abby Victoria', 
    //   percentage: '88%', 
    //   days: '30 Days', 
    //   avatar: '/api/placeholder/32/32',
    //   department: 'Support',
    //   isOnline: false,
    //   trend: 'down'
    // }

    

    
  ];

  const weeklyAbsentData = [85, 92, 75, 88, 70, 95, 82];

  return (
    <div className="flex gap-6">
      <TopAttendants data={attendanceData} />
      <WeeklyAbsent data={weeklyAbsentData} />
    </div>
  );
};

export default LastSection;