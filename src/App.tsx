import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import StudentManagement from './pages/StudentManagement';
import FeeStructure from './pages/FeeStructure';
import Notifications from './pages/Notifications';
import Reports from './pages/Reports';
// import PaymentPortal from './pages/PaymentPortal';
import Layout from './components/Layout';
import StudentRegistrationForm from './pages/StudentForm';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<StudentManagement />} />
          <Route path="/fee-structure" element={<FeeStructure />} />
          <Route path="/Attendence" element={<Reports />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/reports" element={<Reports />} />
          
          <Route path="/StudentRegistrationForm" element={<StudentRegistrationForm />} />

          {/* <Route path="/payment-portal" element={<PaymentPortal />} /> */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;