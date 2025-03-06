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
import Dashboard from './pages/Dashboard';
import StudentManagement from './pages/StudentManagement';
import FeeStructure from './pages/FeeStructure';
import Notifications from './pages/Notifications';
import Reports from './pages/Reports';
import Layout from './components/Layout';
import StudentRegistrationForm from './pages/StudentForm';
import AuthPage from './pages/AuthPage';
import AccountsPage from './pages/AccountsPage';
import { ClassSectionManagement } from './components/Masters/Class';
import { ExtraFess } from './components/Masters/ExtraFess';
import { Fee_Head_New } from './components/Masters/Fee_Head_New';
import { ManageStudent } from './pages/ManageStudents'
import { ManageTeachers } from './pages/ManageTeachers';
import  AccountManagement  from './pages/AccountManagement'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if user is authenticated on component mount
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthSuccess = (token: string) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      {!isAuthenticated ? (
        <Routes>
          <Route path="*" element={<AuthPage onAuthSuccess={handleAuthSuccess} />} />
        </Routes>
      ) : (
        <Layout onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<StudentManagement />} />
            <Route path="/fee-structure" element={<FeeStructure />} />
            <Route path="/Attendence" element={<Reports />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/AccountPage" element={<AccountsPage />} />
            <Route path="/master/classe-section" element={<ClassSectionManagement />} />
            <Route path="/master/extra-fess" element={<ExtraFess />} />
            <Route path="/master/fee_head_new" element={<Fee_Head_New />} />
            <Route path="/students/StudentRegistrationForm" element={<StudentRegistrationForm />} />
            <Route path="/students/ManageStudents" element={<ManageStudent/>} />
            <Route path='/staff/ManageTeachers' element={<ManageTeachers/>} />
            <Route path='/finance/accountmanagement' element={<AccountManagement/>} />
          </Routes>
        </Layout>
      )}
    </Router>
  );
}

export default App;



