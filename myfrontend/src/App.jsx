import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Employee/Login';
import Home from './pages/Employee/Home';
import HRLogin from './pages/HRstaff/HRLogin';
import Profile from './pages/Employee/Profile';
import HRDashboard from './pages/HRstaff/HRDashboard';
import EmployeeManagement from "./pages/HRstaff/EmployeeManagement";
import HRProfile from "./pages/HRstaff/HRProfile";

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
        <Route path="/hr-profile" element={<HRProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
