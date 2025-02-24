import React, { useState } from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [showSearchInput, setShowSearchInput] = useState<boolean>(false);
  
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };
  
  return (
    <div className="w-full h-16 bg-white shadow-sm flex items-center px-8">
      {/* Logo Section */}
      <div className="flex items-center mr-12">
        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-colors">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M13 5l7 7-7 7M5 5l7 7-7 7" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="ml-2 text-xl font-bold tracking-wide text-gray-900">Gyansetu</span>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-1">
        <div 
          className={`flex items-center px-3 py-2 mr-4 rounded-md cursor-pointer transition-colors ${
            activeTab === 'dashboard' 
              ? 'bg-gray-200 text-gray-900' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => handleTabClick('dashboard')}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
          >
            <rect 
              x="3" y="3" width="18" height="18" rx="2" 
              stroke={activeTab === 'dashboard' ? "#000000" : "#666666"} 
              strokeWidth="2" 
            />
            <line 
              x1="8" y1="9" x2="16" y2="9" 
              stroke={activeTab === 'dashboard' ? "#000000" : "#666666"} 
              strokeWidth="2" 
            />
            <line 
              x1="8" y1="15" x2="16" y2="15" 
              stroke={activeTab === 'dashboard' ? "#000000" : "#666666"} 
              strokeWidth="2" 
            />
          </svg>
          <span className={activeTab === 'dashboard' ? "font-medium" : ""}>Dashboard</span>
        </div>
        
        <Link to="/student" style={{ textDecoration: 'none' }} >
          <button 
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              activeTab === 'attendance' 
                ? 'bg-gray-200 text-gray-900' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => handleTabClick('attendance')}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
            >
              <circle 
                cx="12" cy="8" r="4" 
                stroke={activeTab === 'attendance' ? "#000000" : "#666666"} 
                strokeWidth="2" 
              />
              <path 
                d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 20" 
                stroke={activeTab === 'attendance' ? "#000000" : "#666666"} 
                strokeWidth="2" 
              />
            </svg>
            <span className={activeTab === 'attendance' ? "font-medium" : ""}>
              Manage Attendance
            </span>
          </button>
        </Link>
        
        <Link to="/notificationmanagement" style={{ textDecoration: 'none' }} >
          <div 
            className={`flex items-center px-3 py-2 mr-4 rounded-md cursor-pointer transition-colors ${
              activeTab === 'students' 
                ? 'bg-gray-200 text-gray-900' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => handleTabClick('students')}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
            >
              <rect 
                x="4" y="4" width="16" height="16" rx="2" 
                stroke={activeTab === 'students' ? "#000000" : "#666666"} 
                strokeWidth="2" 
              />
              <line 
                x1="4" y1="10" x2="20" y2="10" 
                stroke={activeTab === 'students' ? "#000000" : "#666666"} 
                strokeWidth="2" 
              />
              <line 
                x1="10" y1="4" x2="10" y2="20" 
                stroke={activeTab === 'students' ? "#000000" : "#666666"} 
                strokeWidth="2" 
              />
            </svg>
            <span className={activeTab === 'students' ? "font-medium" : ""}>Notification Management</span>
          </div>
        </Link>
        
        <div 
          className={`flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors ${
            activeTab === 'reports' 
              ? 'bg-gray-200 text-gray-900' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => handleTabClick('reports')}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
          >
            <path 
              d="M12 3L4 9V21H9V14H15V21H20V9L12 3Z" 
              stroke={activeTab === 'reports' ? "#000000" : "#666666"} 
              strokeWidth="2" 
            />
          </svg>
          <span className={activeTab === 'reports' ? "font-medium" : ""}>Reports</span>
        </div>
      </div>

      {/* Right Side Icons and Profile */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          {showSearchInput ? (
            <div className="absolute right-0 top-0 -translate-y-1/2 flex items-center">
              <input 
                type="text" 
                className="border border-gray-300 rounded-md py-1 px-2 w-48 text-sm" 
                placeholder="Search..." 
                autoFocus
                onBlur={() => setShowSearchInput(false)}
              />
              <Search 
                size={20} 
                className="text-gray-500 ml-2 cursor-pointer" 
                onClick={() => setShowSearchInput(false)}
              />
            </div>
          ) : (
            <Search 
              size={20} 
              className="text-gray-600 hover:text-gray-900 cursor-pointer transition-colors" 
              onClick={() => setShowSearchInput(true)}
            />
          )}
        </div>
        
        <div className="relative">
          <Bell 
            size={20} 
            className="text-gray-600 hover:text-gray-900 cursor-pointer transition-colors" 
          />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">1</span>
          </div>
        </div>
        
        <div className="relative">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden mr-2">
              <img src="/api/placeholder/40/40" alt="User avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Olivio Broks</div>
              <div className="text-xs text-gray-600">admin@o.com</div>
            </div>
            <ChevronDown size={16} className="ml-2 text-gray-600" />
          </div>
          
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;