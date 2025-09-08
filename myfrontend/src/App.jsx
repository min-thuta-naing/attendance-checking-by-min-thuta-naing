import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { ToastProvider } from "./contexts/ToastContext";

import Login from './pages/Employee/Login';
import Home from './pages/Employee/Home';
import HRLogin from './pages/HRstaff/HRLogin';
import Profile from './pages/Employee/Profile';
import HRDashboard from './pages/HRstaff/HRDashboard';
import EmployeeManagement from "./pages/HRstaff/EmployeeManagement";
import HRProfile from "./pages/HRstaff/HRProfile";
import RegisterEmployee from './pages/HRstaff/RegisterEmployee';
import HRAdminManagement from './pages/HRstaff/HRAdminManagement';
import EmployeeChangePasswordPage from './pages/Employee/EmployeeChangePasswordPage';
import Welcome from './pages/Welcome';
import RegisterEmpFacialData from './pages/HRstaff/RegisterEmpFacialData';
import EmployeeAttendanceHistory from './pages/Employee/EmployeeAttendanceHistory';
import ChangePasswordPage from './pages/Employee/ChangePasswordPage';

function App() {
  return (
    //I wrape dwith ToastProvider to see toast noti in every page 
    //I added the ProtectedRoute to prevent employee seeing HR endpoints and vice versa 
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />

          <Route path="/hrlogin" element={<HRLogin />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/change-password" element={<ChangePasswordPage />} /> */}
          <Route path="/change-password" element={<ProtectedRoute element={ChangePasswordPage} allowedRoles={['EMPLOYEE']} />} />


          <Route path="/home" element={<ProtectedRoute element={Home} allowedRoles={['EMPLOYEE']} />} />
          <Route path="/emp-attendance-history" element={<ProtectedRoute element={EmployeeAttendanceHistory} allowedRoles={['EMPLOYEE']} />} />
          <Route path="/profile" element={<ProtectedRoute element={Profile} allowedRoles={['EMPLOYEE']} />} />
          <Route path="/emp-change-password" element={<ProtectedRoute element={EmployeeChangePasswordPage} allowedRoles={['EMPLOYEE']} />} />

          <Route path="/hr-dashboard" element={<ProtectedRoute element={HRDashboard} allowedRoles={['HR']} />} />
          <Route path="/hr-emp-mgmt" element={<ProtectedRoute element={EmployeeManagement} allowedRoles={['HR']} />} />
          <Route path="/hr-staff-all-list" element={<ProtectedRoute element={HRAdminManagement} allowedRoles={['HR']} />} />
          <Route path="/hr-profile" element={<ProtectedRoute element={HRProfile} allowedRoles={['HR']} />} />
          <Route path="/hr-register-emp" element={<ProtectedRoute element={RegisterEmployee} allowedRoles={['HR']} />} />
          <Route path="/hr-register-emp/:id/facial-data" element={<ProtectedRoute element={RegisterEmpFacialData} allowedRoles={['HR']} />} />

        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
