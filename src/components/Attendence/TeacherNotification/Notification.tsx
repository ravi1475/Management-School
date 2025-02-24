import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Define types for button variants
type ButtonVariants = {
  hover: {
    scale: number;
  };
};

// Define type for active view
type ActiveView = 'notifications' | 'leaves';

// Define props interface if needed (empty in this case but added for completeness)
interface TeacherDashboardProps {}

const TeacherDashboard: React.FC<TeacherDashboardProps> = () => {
  const [activeView, setActiveView] = useState<ActiveView>('notifications');

  const buttonVariants: ButtonVariants = {
    hover: { scale: 1.05 },
  };

  return (
    <div style={{ backgroundColor: '#f5ebff' }} className="min-h-screen p-8">
      {/* Top Left Back Button */}
      <div className="mb-4">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
        >
          <motion.svg 
            whileHover={{ scale: 1.1 }} 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </motion.svg>
          <span className="font-medium">Home</span>
        </Link>
      </div>

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <motion.div 
          className="bg-white rounded-lg shadow p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Teacher Dashboard</h1>
              <p className="text-gray-600 mt-1">Class XI-B Homeroom</p>
            </div>
            <div className="flex gap-3">
              <motion.button 
                onClick={() => setActiveView('notifications')}
                whileHover="hover"
                variants={buttonVariants}
                className={`px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors ${
                  activeView === 'notifications' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Send Notifications
              </motion.button>
              <motion.button 
                onClick={() => setActiveView('leaves')}
                whileHover="hover"
                variants={buttonVariants}
                className={`px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors ${
                  activeView === 'leaves' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Leave Requests
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto">
        {activeView === 'notifications' && (
          <motion.div 
            className="bg-white rounded-lg shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Send To</label>
                  <div className="flex flex-wrap gap-3">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                      My Class (XI-B)
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Specific Students
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Parents
                    </motion.button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <motion.select 
                    whileHover={{ scale: 1.02 }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-colors"
                  >
                    <option>Class Announcement</option>
                    <option>Homework Update</option>
                    <option>Test Reminder</option>
                    <option>Parent Meeting</option>
                  </motion.select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <motion.input 
                    whileHover={{ scale: 1.02 }}
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-colors"
                    placeholder="Enter notification subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <motion.textarea 
                    whileHover={{ scale: 1.02 }}
                    className="w-full p-3 border border-gray-300 rounded-lg h-36 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-colors"
                    placeholder="Type your message here..."
                  />
                </div>

                <motion.button 
                  whileHover="hover"
                  variants={buttonVariants}
                  className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send Notification
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {activeView === 'leaves' && (
          <motion.div 
            className="bg-white rounded-lg shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Student Leave Requests</h2>
              <div className="space-y-4">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="border border-gray-200 rounded-lg p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800">Rahul Sharma</h3>
                      <p className="text-sm text-gray-600 mt-1">Roll No: 15</p>
                      <div className="flex gap-4 mt-2">
                        <span className="text-sm text-gray-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Feb 20 - Feb 21, 2025
                        </span>
                        <span className="text-sm text-gray-600">(2 days)</span>
                      </div>
                      <p className="mt-2 text-sm text-gray-700">Reason: Medical appointment</p>
                    </div>
                    <div className="flex gap-2">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95, backgroundColor: "#34D399", transition: { duration: 0.2 } }}
                        className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        Approve
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95, backgroundColor: "#FDBA74", transition: { duration: 0.2 } }}
                        className="px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
                      >
                        Reject
                      </motion.button>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="border border-gray-200 rounded-lg p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800">Priya Patel</h3>
                      <p className="text-sm text-gray-600 mt-1">Roll No: 08</p>
                      <div className="flex gap-4 mt-2">
                        <span className="text-sm text-gray-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Feb 22, 2025
                        </span>
                        <span className="text-sm text-gray-600">(1 day)</span>
                      </div>
                      <p className="mt-2 text-sm text-gray-700">Reason: Family function</p>
                    </div>
                    <div className="flex gap-2">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95, backgroundColor: "#34D399", transition: { duration: 0.2 } }}
                        className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        Approve
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95, backgroundColor: "#FDBA74", transition: { duration: 0.2 } }}
                        className="px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
                      >
                        Reject
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;