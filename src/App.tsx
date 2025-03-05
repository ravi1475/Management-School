// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Dashboard from './pages/Dashboard';
// import StudentManagement from './pages/StudentManagement';
// import FeeStructure from './pages/FeeStructure';
// import Notifications from './pages/Notifications';
// import Reports from './pages/Reports';
// // import PaymentPortal from './pages/PaymentPortal';
// import Layout from './components/Layout';
// import StudentRegistrationForm from './pages/StudentForm';

// function App() {
//   return (
//     <Router>
//       <Layout>
//         <Routes>
//           <Route path="/" element={<Dashboard />} />
//           <Route path="/students" element={<StudentManagement />} />
//           <Route path="/fee-structure" element={<FeeStructure />} />
//           <Route path="/Attendence" element={<Reports />} />
//           <Route path="/notifications" element={<Notifications />} />
//           <Route path="/reports" element={<Reports />} />
          
//           <Route path="/StudentRegistrationForm" element={<StudentRegistrationForm />} />

//           {/* <Route path="/payment-portal" element={<PaymentPortal />} /> */}
//         </Routes>
//       </Layout>
//     </Router>
//   );
// }

// export default App;






import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Pages
import Dashboard from './pages/Dashboard';
import StudentManagement from './pages/StudentManagement';
import FeeStructure from './pages/FeeStructure';
import Notifications from './pages/Notifications';
import Reports from './pages/Reports';
import AccountsPage from './pages/AccountsPage';
import StudentRegistrationForm from './pages/StudentForm';

// Components
import Layout from './components/Layout';
import LoginForm from './components/LoginForm';

function App() {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    token: '',
    role: '',
  });
  
  useEffect(() => {
    // Check if user is authenticated on component mount
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    if (token && role) {
      setAuth({
        isAuthenticated: true,
        token,
        role,
      });
    }
  }, []);

  const handleLoginSuccess = (token: string, role: string) => {
    // Save auth info to localStorage for persistence
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role);
    
    setAuth({
      isAuthenticated: true,
      token,
      role,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    setAuth({
      isAuthenticated: false,
      token: '',
      role: '',
    });
  };

  // Admin dashboard components
  const AdminDashboard = () => (
    <Layout onLogout={handleLogout} userRole="admin">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/students" element={<StudentManagement />} />
        <Route path="/fee-structure" element={<FeeStructure />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/accounts" element={<AccountsPage />} />
      </Routes>
    </Layout>
  );

  // School dashboard components
  const SchoolDashboard = () => (
    <Layout onLogout={handleLogout} userRole="school">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/students" element={<StudentManagement />} />
        <Route path="/fee-structure" element={<FeeStructure />} />
        <Route path="/attendance" element={<Reports />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/student-registration" element={<StudentRegistrationForm />} />
      </Routes>
    </Layout>
  );

  // Teacher dashboard components
  const TeacherDashboard = () => (
    <Layout onLogout={handleLogout} userRole="teacher">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/students" element={<StudentManagement />} />
        <Route path="/attendance" element={<Reports />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </Layout>
  );

  // Render auth page if not authenticated
  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        </div>
      </div>
    );
  }

  // Render the appropriate dashboard based on user role
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={`/${auth.role}`} replace />} />
        
        {/* Admin Routes */}
        <Route 
          path="/admin/*" 
          element={auth.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" replace />} 
        />
        
        {/* School Routes */}
        <Route 
          path="/school/*" 
          element={auth.role === 'school' ? <SchoolDashboard /> : <Navigate to="/" replace />} 
        />
        
        {/* Teacher Routes */}
        <Route 
          path="/teacher/*" 
          element={auth.role === 'teacher' ? <TeacherDashboard /> : <Navigate to="/" replace />} 
        />
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to={`/${auth.role}`} replace />} />
      </Routes>
    </Router>
  );
}

export default App;