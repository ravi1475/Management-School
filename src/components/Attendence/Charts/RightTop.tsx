import React, { useState, useEffect } from 'react';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

// Define interfaces for the dashboard data
interface DashboardData {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  lateStudents: number;
  presentPercentage: number;
  absentPercentage: number;
  latePercentage: number;
  studentTrend: number[];
}

// Interface for chart data
interface ChartDataPoint {
  name: string;
  value: number;
}

// Props interface for gauge component
interface GaugeProps {
  percentage: number;
  color: 'green' | 'red' | 'yellow';
}

// Card props interface
interface DashboardCardProps {
  number: number;
  label: string;
  iconClass: string;
  badgeColor: 'purple' | 'green' | 'red' | 'yellow';
  children: React.ReactNode;
}

// Gauge Component
const Gauge: React.FC<GaugeProps> = ({ percentage, color }) => (
  <div className="gauge-container">
    <div className="gauge">
      <div
        className={`gauge-fill ${color}`}
        style={{ transform: `rotate(${(percentage / 100) * 180}deg)` }}
      ></div>
      <div className="gauge-cover">{percentage.toFixed(0)}%</div>
    </div>
  </div>
);

// Dashboard Card Component
const DashboardCard: React.FC<DashboardCardProps> = ({
  number,
  label,
  iconClass,
  badgeColor,
  children
}) => (
  <div className="col-md-6 mb-4">
    <div className="dashboard-card">
      <div className="card-content">
        <div>
          <h2 className="card-number">{number}</h2>
          <p className="card-label">{label}</p>
        </div>
        {children}
      </div>
      <div className={`icon-badge ${badgeColor}`}>
        <i className={iconClass}></i>
      </div>
    </div>
  </div>
);

const AttendanceDashboard: React.FC = () => {
  // State to store data from backend
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalStudents: 570,
    presentToday: 430,
    absentToday: 140,
    lateStudents: 13,
    presentPercentage: 70,
    absentPercentage: 30,
    latePercentage: 10,
    studentTrend: [20, 30, 50, 30, 20] // Mock data for bar chart
  });

  // Effect to fetch data from backend
  useEffect(() => {
    const fetchDashboardData = async (): Promise<void> => {
      try {
        // const response = await fetch('your-api-endpoint');
        // const data: DashboardData = await response.json();
        // setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  // Convert array to format needed by recharts
  const chartData: ChartDataPoint[] = dashboardData.studentTrend.map((value, index) => ({
    name: `Day ${index + 1}`,
    value
  }));

  return (
    <div className="dashboard-container">
      <h1>Hello Amit</h1>
      <p className="text-muted">We hope you're having a great day.</p>

      <div className="row">
        {/* Total Students Card */}
        <DashboardCard
          number={dashboardData.totalStudents}
          label="Total Students"
          iconClass="fas fa-users"
          badgeColor="purple"
        >
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={50}>
              const RechartsBar: React.FC<any> = (props) => <Bar {...props} />;
            </ResponsiveContainer>
            <svg style={{ height: 0 }}>
              <defs>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d8b4fe" />
                  <stop offset="100%" stopColor="#e9d5ff" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </DashboardCard>

        {/* Present Today Card */}
        <DashboardCard
          number={dashboardData.presentToday}
          label="Present Today"
          iconClass="fas fa-check-circle"
          badgeColor="green"
        >
          <Gauge percentage={dashboardData.presentPercentage} color="green" />
        </DashboardCard>

        {/* Absent Today Card */}
        <DashboardCard
          number={dashboardData.absentToday}
          label="Absent Today"
          iconClass="fas fa-times-circle"
          badgeColor="red"
        >
          <Gauge percentage={dashboardData.absentPercentage} color="red" />
        </DashboardCard>

        {/* Late Students Card */}
        <DashboardCard
          number={dashboardData.lateStudents}
          label="Late students today"
          iconClass="fas fa-clock"
          badgeColor="yellow"
        >
          <Gauge percentage={dashboardData.latePercentage} color="yellow" />
        </DashboardCard>
      </div>
    </div>
  );
};

export default AttendanceDashboard;