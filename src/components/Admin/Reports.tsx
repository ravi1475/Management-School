import React, { useState } from "react";
import { 
  BarChart2, 
  Download, 
  FileText, 
  Users, 
  Calendar, 
  Award, 
  TrendingUp,
  Filter,
  RefreshCw,
  ChevronDown
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart, 
  Area
} from "recharts";

// Sample data for charts
const teacherPerformanceData = [
  { name: "Mr. Johnson", rating: 4.7, classAvg: 85, attendance: 98 },
  { name: "Mrs. Davis", rating: 4.5, classAvg: 82, attendance: 95 },
  { name: "Mr. Smith", rating: 4.8, classAvg: 88, attendance: 99 },
  { name: "Ms. Wilson", rating: 4.6, classAvg: 84, attendance: 97 },
  { name: "Mrs. Brown", rating: 4.4, classAvg: 80, attendance: 94 },
  { name: "Mr. Garcia", rating: 4.9, classAvg: 90, attendance: 100 },
  { name: "Ms. Lee", rating: 4.3, classAvg: 79, attendance: 93 },
];

const enrollmentTrendData = [
  { month: "Jan", students: 520, capacity: 600 },
  { month: "Feb", students: 535, capacity: 600 },
  { month: "Mar", students: 550, capacity: 600 },
  { month: "Apr", students: 565, capacity: 600 },
  { month: "May", students: 575, capacity: 600 },
  { month: "Jun", students: 560, capacity: 600 },
  { month: "Jul", students: 545, capacity: 600 },
  { month: "Aug", students: 580, capacity: 600 },
  { month: "Sep", students: 590, capacity: 600 },
  { month: "Oct", students: 585, capacity: 600 },
  { month: "Nov", students: 575, capacity: 600 },
  { month: "Dec", students: 570, capacity: 600 },
];

const attendanceTrendData = [
  { month: "Jan", average: 92 },
  { month: "Feb", average: 94 },
  { month: "Mar", average: 91 },
  { month: "Apr", average: 88 },
  { month: "May", average: 90 },
  { month: "Jun", average: 85 },
  { month: "Jul", average: 80 },
  { month: "Aug", average: 87 },
  { month: "Sep", average: 93 },
  { month: "Oct", average: 95 },
  { month: "Nov", average: 92 },
  { month: "Dec", average: 88 },
];

const subjectPerformanceData = [
  { name: "Math", avgScore: 82 },
  { name: "Science", avgScore: 78 },
  { name: "English", avgScore: 85 },
  { name: "History", avgScore: 79 },
  { name: "Art", avgScore: 88 },
  { name: "Music", avgScore: 90 },
  { name: "P.E.", avgScore: 87 },
];

const genderDistributionData = [
  { name: "Male", value: 320 },
  { name: "Female", value: 270 }
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// Card component for report sections
const ReportCard = ({ title, icon, children }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </h2>
      </div>
      {children}
    </div>
  );
};

// Tab component for switching between report types
const TabButton = ({ active, icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-2 rounded-md text-sm font-medium mr-2 ${
        active 
          ? "bg-indigo-100 text-indigo-700" 
          : "bg-white text-gray-600 hover:bg-gray-50"
      }`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );
};

// Export button component
const ExportButton = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition duration-150"
    >
      <Download className="h-4 w-4 mr-1.5" />
      {label}
    </button>
  );
};

// Dropdown filter component
const FilterDropdown = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative inline-block">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition duration-150"
      >
        <Filter className="h-4 w-4 mr-1.5" />
        {label}: {value}
        <ChevronDown className="h-4 w-4 ml-1.5" />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-40 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm ${
                value === option ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Reports component
const ReportsAnalytics = () => {
  const [activeTab, setActiveTab] = useState("performance");
  const [timeFrame, setTimeFrame] = useState("This Year");
  const [gradeFilter, setGradeFilter] = useState("All Grades");

  // Mock function to export data
  const exportData = (format) => {
    alert(`Exporting data in ${format} format. This would trigger a real download in a production environment.`);
  };

  // Mock function to refresh data
  const refreshData = () => {
    alert("Refreshing data... In a real application, this would fetch the latest data from the server.");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">Comprehensive insights into school performance, enrollment trends, and more.</p>
      </div>

      {/* Filters and controls */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
        <div className="flex flex-wrap gap-2">
          <TabButton
            active={activeTab === "performance"}
            icon={<Award className="h-4 w-4" />}
            label="Performance"
            onClick={() => setActiveTab("performance")}
          />
          <TabButton
            active={activeTab === "enrollment"}
            icon={<Users className="h-4 w-4" />}
            label="Enrollment & Attendance"
            onClick={() => setActiveTab("enrollment")}
          />
          <TabButton
            active={activeTab === "export"}
            icon={<FileText className="h-4 w-4" />}
            label="Export Data"
            onClick={() => setActiveTab("export")}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <FilterDropdown
            label="Time Frame"
            options={["This Month", "This Quarter", "This Year", "All Time"]}
            value={timeFrame}
            onChange={setTimeFrame}
          />
          
          <FilterDropdown
            label="Grade"
            options={["All Grades", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"]}
            value={gradeFilter}
            onChange={setGradeFilter}
          />
          
          <button
            onClick={refreshData}
            className="flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition duration-150"
          >
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Performance Tab Content */}
      {activeTab === "performance" && (
        <div>
          {/* Teacher Performance */}
          <ReportCard 
            title="Teacher Performance" 
            icon={<Award className="h-5 w-5 text-indigo-600" />}
          >
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-4">
                Average rating, class performance, and attendance rates for each teacher.
              </p>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={teacherPerformanceData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="rating" fill="#8884d8" name="Rating (out of 5)" />
                    <Bar dataKey="classAvg" fill="#82ca9d" name="Class Average (%)" />
                    <Bar dataKey="attendance" fill="#ffc658" name="Attendance Rate (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="flex justify-end">
              <ExportButton label="Export Data" onClick={() => exportData("CSV")} />
            </div>
          </ReportCard>

          {/* Subject Performance */}
          <ReportCard 
            title="Subject Performance" 
            icon={<BarChart2 className="h-5 w-5 text-green-600" />}
          >
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-4">
                Average scores across different subjects in the curriculum.
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={subjectPerformanceData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="avgScore" fill="#82ca9d" name="Average Score (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div>
                  <h3 className="text-base font-medium mb-3">Key Insights</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                      <span>Music and Art have the highest average scores, indicating strong performance in creative subjects.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mt-1.5 mr-2"></span>
                      <span>Science has the lowest average score. Consider reviewing teaching methods or providing additional resources.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-2"></span>
                      <span>English scores are above average, suggesting effective literacy programs.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <ExportButton label="Export Data" onClick={() => exportData("CSV")} />
            </div>
          </ReportCard>
        </div>
      )}

      {/* Enrollment & Attendance Tab Content */}
      {activeTab === "enrollment" && (
        <div>
          {/* Enrollment Trends */}
          <ReportCard 
            title="Enrollment Trends" 
            icon={<Users className="h-5 w-5 text-blue-600" />}
          >
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-4">
                Monthly enrollment numbers compared to total capacity.
              </p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={enrollmentTrendData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="capacity" stroke="#8884d8" fill="#8884d8" fillOpacity={0.1} name="Total Capacity" />
                    <Area type="monotone" dataKey="students" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} name="Enrolled Students" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-blue-800 text-sm font-medium mb-1">Current Enrollment</h3>
                <p className="text-2xl font-bold text-blue-900">570</p>
                <p className="text-xs text-blue-700 mt-1">95% of total capacity</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-green-800 text-sm font-medium mb-1">Growth Rate</h3>
                <p className="text-2xl font-bold text-green-900">+9.6%</p>
                <p className="text-xs text-green-700 mt-1">Compared to last year</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-purple-800 text-sm font-medium mb-1">Available Capacity</h3>
                <p className="text-2xl font-bold text-purple-900">30</p>
                <p className="text-xs text-purple-700 mt-1">Seats remaining</p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <ExportButton label="Export Data" onClick={() => exportData("CSV")} />
            </div>
          </ReportCard>

          {/* Attendance Trends */}
          <ReportCard 
            title="Attendance Trends" 
            icon={<Calendar className="h-5 w-5 text-orange-600" />}
          >
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-4">
                Monthly average attendance rate across all classes.
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={attendanceTrendData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[70, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="average" 
                        stroke="#ff7300" 
                        strokeWidth={2}
                        name="Attendance Rate (%)" 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h3 className="text-orange-800 text-sm font-medium mb-1">Average Attendance</h3>
                    <p className="text-2xl font-bold text-orange-900">89.5%</p>
                    <p className="text-xs text-orange-700 mt-1">Across all grades</p>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="text-red-800 text-sm font-medium mb-1">Absence Rate</h3>
                    <p className="text-2xl font-bold text-red-900">10.5%</p>
                    <p className="text-xs text-red-700 mt-1">Includes excused absences</p>
                  </div>
                  
                  <div className="col-span-2">
                    <h3 className="text-sm font-medium mb-2">Key Observations</h3>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-orange-500 mt-1.5 mr-2"></span>
                        <span>Significant drop in attendance during summer months (Jun-Jul)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                        <span>Peak attendance in October (95%)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <ExportButton label="Export Data" onClick={() => exportData("CSV")} />
            </div>
          </ReportCard>

          {/* Student Demographics */}
          <ReportCard 
            title="Student Demographics" 
            icon={<Users className="h-5 w-5 text-purple-600" />}
          >
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-4">
                Breakdown of student population by gender and grade level.
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genderDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {genderDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Grade Distribution</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Grade 1</span>
                        <span>120 students (21%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "21%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Grade 2</span>
                        <span>105 students (18%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "18%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Grade 3</span>
                        <span>118 students (21%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: "21%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Grade 4</span>
                        <span>125 students (22%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "22%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Grade 5</span>
                        <span>102 students (18%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: "18%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <ExportButton label="Export Data" onClick={() => exportData("CSV")} />
            </div>
          </ReportCard>
        </div>
      )}

      {/* Export Data Tab Content */}
      {activeTab === "export" && (
        <ReportCard 
          title="Export School Data" 
          icon={<Download className="h-5 w-5 text-indigo-600" />}
        >
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-4">
              Export various reports and datasets for further analysis or record-keeping.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-600" />
                  Student Records
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  Complete student enrollment data, demographics, and contact information.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => exportData("CSV")}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-sm hover:bg-blue-100 transition duration-150"
                  >
                    CSV
                  </button>
                  <button
                    onClick={() => exportData("Excel")}
                    className="px-3 py-1.5 bg-green-50 text-green-700 rounded-md text-sm hover:bg-green-100 transition duration-150"
                  >
                    Excel
                  </button>
                  <button
                    onClick={() => exportData("PDF")}
                    className="px-3 py-1.5 bg-red-50 text-red-700 rounded-md text-sm hover:bg-red-100 transition duration-150"
                  >
                    PDF
                  </button>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                  <Award className="h-4 w-4 mr-2 text-purple-600" />
                  Academic Performance
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  Detailed reports on student grades, test scores, and subject performance.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => exportData("CSV")}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-sm hover:bg-blue-100 transition duration-150"
                  >
                    CSV
                  </button>
                  <button
                    onClick={() => exportData("Excel")}
                    className="px-3 py-1.5 bg-green-50 text-green-700 rounded-md text-sm hover:bg-green-100 transition duration-150"
                  >
                    Excel
                  </button>
                  <button
                    onClick={() => exportData("PDF")}
                    className="px-3 py-1.5 bg-red-50 text-red-700 rounded-md text-sm hover:bg-red-100 transition duration-150"
                  >
                    PDF
                  </button>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-orange-600" />
                  Attendance Records
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  Daily, weekly, and monthly attendance logs for all classes and grades.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => exportData("CSV")}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-sm hover:bg-blue-100 transition duration-150"
                  >
                    CSV
                  </button>
                  <button
                    onClick={() => exportData("Excel")}
                    className="px-3 py-1.5 bg-green-50 text-green-700 rounded-md text-sm hover:bg-green-100 transition duration-150"
                  >
                    Excel
                  </button>
                  <button
                    onClick={() => exportData("PDF")}
                    className="px-3 py-1.5 bg-red-50 text-red-700 rounded-md text-sm hover:bg-red-100 transition duration-150"
                  >
                    PDF
                  </button>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                  Financial Reports
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  Budget summaries, expense reports, and financial forecasts.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => exportData("CSV")}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-sm hover:bg-blue-100 transition duration-150"
                  >
                    CSV
                  </button>
                  <button
                    onClick={() => exportData("Excel")}
                    className="px-3 py-1.5 bg-green-50 text-green-700 rounded-md text-sm hover:bg-green-100 transition duration-150"
                  >
                    Excel
                  </button>
                  <button
                    onClick={() => exportData("PDF")}
                    className="px-3 py-1.5 bg-red-50 text-red-700 rounded-md text-sm hover:bg-red-100 transition duration-150"
                  >
                    PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-medium text-gray-800 mb-3">Schedule Automated Reports</h3>
            <p className="text-sm text-gray-500 mb-4">
              Set up recurring reports to be automatically generated and sent to specified email addresses.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option>Student Performance</option>
                  <option>Attendance Summary</option>
                  <option>Financial Overview</option>
                  <option>Enrollment Statistics</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>Quarterly</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option>PDF</option>
                  <option>Excel</option>
                  <option>CSV</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Recipients (comma separated)</label>
              <input 
                type="text" 
                placeholder="principal@school.edu, admin@school.edu" 
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition duration-150">
                Schedule Report
              </button>
            </div>
          </div>
        </ReportCard>
      )}
    </div>
  );
};

export default ReportsAnalytics;