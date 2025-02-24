import React from 'react';
import { Users, CreditCard, AlertCircle, TrendingUp, Calendar, Bell } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      name: 'Total Students',
      value: '2,543',
      icon: Users,
      change: '+5.4%',
      changeType: 'increase',
      description: 'Active enrollments this semester'
    },
    {
      name: 'Fees Collected',
      value: '₹15,43,250',
      icon: CreditCard,
      change: '+12.3%',
      changeType: 'increase',
      description: 'Total collections this month'
    },
    {
      name: 'Due Payments',
      value: '₹2,38,400',
      icon: AlertCircle,
      change: '-2.3%',
      changeType: 'decrease',
      description: 'Pending fee payments'
    },
    {
      name: 'Monthly Growth',
      value: '18.6%',
      icon: TrendingUp,
      change: '+3.2%',
      changeType: 'increase',
      description: 'Compared to last month'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      title: 'New Student Registration',
      description: 'John Doe registered for Computer Science',
      timestamp: '2 hours ago',
      icon: Users
    },
    {
      id: 2,
      title: 'Fee Payment Received',
      description: 'Sarah Smith paid ₹45,000',
      timestamp: '4 hours ago',
      icon: CreditCard
    },
    {
      id: 3,
      title: 'Due Date Reminder',
      description: 'Fee payment due for 125 students',
      timestamp: '5 hours ago',
      icon: Bell
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Parent-Teacher Meeting',
      date: 'March 1, 2025',
      time: '10:00 AM'
    },
    {
      id: 2,
      title: 'Annual Sports Day',
      date: 'March 5, 2025',
      time: '9:00 AM'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Institution Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Here's your institution's overview for today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div 
            key={item.name} 
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6"
          >
            <div className="flex items-center">
              <div className="bg-indigo-500 rounded-lg p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{item.name}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {item.change}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="h-5 w-5 text-indigo-500" />
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className="bg-indigo-100 rounded-full p-2">
                  <activity.icon className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="h-5 w-5 text-indigo-500" />
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center space-x-4">
                <div className="bg-indigo-100 rounded-lg p-3 text-center">
                  <p className="text-xs font-medium text-indigo-600">
                    {event.date.split(',')[0]}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{event.title}</p>
                  <p className="text-xs text-gray-500">{`${event.date} at ${event.time}`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;