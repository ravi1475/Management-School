import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import StudentManagement from './pages/StudentManagement';
import FeeStructure from './pages/FeeStructure';
import Notifications from './pages/Notifications';
import Reports from './pages/Reports';
import Layout from './components/Layout';
import StudentRegistrationForm from './pages/StudentForm';
import AuthPage from './pages/AuthPage';
import AccountsPage from './pages/AccountsPage';
import UserManagement from './pages/UserManagement';
import UserEdit from './pages/UserEdit';
import LoginForm from './pages/LoginForm';

import { ClassSectionManagement } from './components/Schools/Class'
import { ManageStudent } from './pages/ManageStudents'
// import  StudentFeeDetails  from './components/StudentFeeDetails'

import ManageSchools from './components/Admin/ManageSchools';
import ManageUsers from './components/Admin/ManageUser';
import StaffDirectory from './components/Admin/StaffDirectory';
import StaffDocumentManagement from "./components/Admin/StaffDocumentManagement";
import SchoolReports from "./components/Admin/Reports";
import SchoolCalendar from "./components/Schools/Calender";
import TeacherDirectory from "./components/Schools/TeacherDirectory"

// Uncomment these when the components are available
// import StudentFeeDetails from './pages/StudentFeeDetails';
// import PaymentGateway from './pages/PaymentGateway';
// import UserProfile from './pages/UserProfile';
// import NotFound from './pages/NotFound';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if user is authenticated on component mount
    const storedToken = localStorage.getItem('authToken');
    const storedRole = localStorage.getItem('userRole');
    
    if (storedToken && storedRole) {
      setToken(storedToken);
      setUserRole(storedRole);
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthSuccess = (token: string, role: string = 'user') => {
    // Store auth info in localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role);
    
    // Update state
    setToken(token);
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Clear auth info
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    
    // Reset state
    setToken(null);
    setUserRole(null);
    setIsAuthenticated(false);
  };

  // Protected route component
  const ProtectedRoute = ({ 
    children, 
    allowedRoles = ['admin', 'school', 'teacher', 'user'] 
  }: { 
    children: JSX.Element, 
    allowedRoles?: string[] 
  }) => {
    if (!isAuthenticated) {
      return <Navigate to="/auth" replace />;
    }
    
    if (userRole && !allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
    
    return children;
  };

  return (
    

    
    <Router>
      
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <LoginForm onLoginSuccess={handleAuthSuccess} />
          } 
        />
        
        <Route 
          path="/auth" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <AuthPage onAuthSuccess={handleAuthSuccess} />
          } 
        />
        
        {/* Default route - redirect to login if not authenticated, dashboard if authenticated */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <Navigate to="/auth" replace />
          } 
        />
        
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/school/students/financial-management/student-management" 
          element={
            <ProtectedRoute>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <StudentManagement />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/school/financial-management/fee-structure" 
          element={
            <ProtectedRoute>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <FeeStructure />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/Attendence" 
          element={
            <ProtectedRoute>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <Reports />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/notifications" 
          element={
            <ProtectedRoute>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <Notifications />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/school/reports" 
          element={
            <ProtectedRoute>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <Reports />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/school/financial-management/account-page" 
          element={
            <ProtectedRoute>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <AccountsPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/students/StudentRegistrationForm" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'school']}>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <StudentRegistrationForm />
              </Layout>
            </ProtectedRoute>
          } 
        />

        < Route
          path='/school/students/class-section'
          element={
            <ProtectedRoute>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <ClassSectionManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        < Route
          path='/school/faculty/teachers'
          element={
            <ProtectedRoute>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <TeacherDirectory />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path='/school/students/manage-students'
          element={
            <ProtectedRoute>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <ManageStudent />
              </Layout>
            </ProtectedRoute>
          }
        />


        <Route 
          path="/Calender" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'school']}>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <SchoolCalendar />
              </Layout>
            </ProtectedRoute>
          } 

        />
        
        {/* Uncomment these routes when the components are available */}
        {/* 
        <Route 
          path="/student-fee/:id" 
          element={
            <ProtectedRoute>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <StudentFeeDetails />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/payment/:studentId" 
          element={
            <ProtectedRoute>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <PaymentGateway />
              </Layout>
            </ProtectedRoute>
          } 
        />
        */}


               {/* Admin Routes */}
           <Route 
             path="/admin/schools" 
             element={
               <ProtectedRoute allowedRoles={['admin']}>
                 <Layout onLogout={handleLogout} userRole={userRole}>
                   <ManageSchools />
                 </Layout>
               </ProtectedRoute>
             } 
           />

           <Route 
             path="/admin/users" 
             element={
               <ProtectedRoute allowedRoles={['admin']}>
                 <Layout onLogout={handleLogout} userRole={userRole}>
                   <ManageUsers />
                 </Layout>
               </ProtectedRoute>
             } 
           />

         <Route 
           path="/staff" 
           element={
             <ProtectedRoute allowedRoles={['admin']}>
               <Layout onLogout={handleLogout} userRole={userRole}>
                 <StaffDirectory />
               </Layout>
             </ProtectedRoute>
           } 
         />

                 <Route 
                   path="/staff/documents" 
                   element={
                     <ProtectedRoute allowedRoles={['admin']}>
                       <Layout onLogout={handleLogout} userRole={userRole}>
                         <StaffDocumentManagement />
                       </Layout>
                     </ProtectedRoute>
                   } 
                 />
                 <Route 
                   path="/reports-admin" 
                   element={
                     <ProtectedRoute allowedRoles={['admin']}>
                       <Layout onLogout={handleLogout} userRole={userRole}>
                         <SchoolReports />
                       </Layout>
                     </ProtectedRoute>
                   } 
                 />
        
        {/* User Management Routes */}
        <Route 
          path="/users" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <UserManagement />
              </Layout>
            </ProtectedRoute>
          } 
        />


        
        {/* Uncomment these routes when the components are available */}
        {/*
        <Route 
          path="/users/:id" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'school']}>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <UserProfile />
              </Layout>
            </ProtectedRoute>
          } 
        />
        */}
        
        <Route 
          path="/users/:id/edit" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <UserEdit />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        {/* Profile route - accessible by all authenticated users */}
        {/*
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <UserProfile />
              </Layout>
            </ProtectedRoute>
          } 
        />
        */}
        
        {/* Unauthorized access page */}
        <Route 
          path="/unauthorized" 
          element={
            <Layout userRole={userRole} onLogout={handleLogout}>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
                <p className="mb-4">You don't have permission to access this resource.</p>
                <button 
                  onClick={() => window.history.back()} 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Go Back
                </button>
              </div>
            </Layout>
          } 
        />
        
        {/* 404 Not Found */}
        <Route 
          path="*" 
          element={
            isAuthenticated ? (
              <Layout userRole={userRole} onLogout={handleLogout}>
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold text-red-600 mb-4">Page Not Found</h1>
                  <p className="mb-4">The page you are looking for does not exist.</p>
                  <button 
                    onClick={() => window.history.back()} 
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >



                    Go Back
                  </button>
                </div>
              </Layout>
            ) : (
              <Navigate to="/auth" replace />
            )
          } 
        />
      </Routes>
    </Router>


  );
  
}

export default App;