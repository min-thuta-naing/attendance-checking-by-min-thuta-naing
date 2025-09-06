import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Employee/Login';
import Home from './pages/Employee/Home';
import HRLogin from './pages/HRstaff/HRLogin';
import Profile from './pages/Employee/Profile';
import HRDashboard from './pages/HRstaff/HRDashboard';
import EmployeeManagement from "./pages/HRstaff/EmployeeManagement";
import HRProfile from "./pages/HRstaff/HRProfile";
import RegisterEmployee from './pages/HRstaff/RegisterEmployee';
import HRAdminManagement from './pages/HRstaff/HRAdminManagement';
import ChangePasswordPage from './pages/ChangePasswordPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/hrlogin" element={<HRLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/hr-dashboard" element={<HRDashboard />} />
        <Route path="/hr-emp-mgmt" element={<EmployeeManagement />} />
        <Route path="/hr-staff-all-list" element={<HRAdminManagement />} />
        <Route path="/hr-profile" element={<HRProfile />} />
        <Route path="/hr-register-emp" element={<RegisterEmployee/>}/> 
        <Route path="/change-password" element={<ChangePasswordPage/>}/> 
      </Routes>
    </Router>
  );
}

export default App;
