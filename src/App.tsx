import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { DepartmentLayout } from './components/layout/DepartmentLayout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Complaints from './pages/Complaints';
import Departments from './pages/Departments';
import Analytics from './pages/Analytics';
import Alarts from './pages/Alarts';
import Adminstrations from './pages/Adminstrations';
import Budget from './pages/Budget';

import DepartmentLogin from './pages/department/DepartmentLogin';
import DepartmentDashboard from './pages/department/DepartmentDashboard';
import DepartmentTasks from './pages/department/DepartmentTasks';
import DepartmentTaskDetail from './pages/department/DepartmentTaskDetail';
import DepartmentPriority from './pages/department/DepartmentPriority';
import DepartmentMap from './pages/department/DepartmentMap';
import DepartmentResolved from './pages/department/DepartmentResolved';
import DepartmentProfile from './pages/department/DepartmentProfile';

// Admin Protected Route Guard
const AdminProtectedRoute = () => {
  const token = localStorage.getItem('token');
  const userRole = (localStorage.getItem('userRole') || '').toUpperCase();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If a Department Officer tries to access Admin pages, redirect to Department Dashboard
  if (userRole === 'DEPARTMENT_OFFICER' || userRole === 'OFFICER') {
    return <Navigate to="/department/dashboard" replace />;
  }

  return <Outlet />;
};

// Department Officer Protected Route Guard
const DepartmentProtectedRoute = () => {
  const token = localStorage.getItem('token');
  const userRole = (localStorage.getItem('userRole') || '').toUpperCase();

  if (!token) {
    return <Navigate to="/department/login" replace />;
  }

  // If an Admin tries to access Department pages, redirect to Admin Dashboard
  if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LandingPage initialShowLogin={true} />} />

      {/* DEPARTMENT OFFICER LOGIN */}
      <Route path="/department/login" element={<DepartmentLogin />} />

      {/* ADMIN PROTECTED ROUTES */}
      <Route element={<AdminProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/alerts" element={<Alarts />} />
          <Route path="/administration" element={<Adminstrations />} />
          <Route path="/budget" element={<Budget />} />
        </Route>
      </Route>

      {/* DEPARTMENT OFFICER PORTAL PROTECTED ROUTES */}
      <Route element={<DepartmentProtectedRoute />}>
        <Route element={<DepartmentLayout />}>
          <Route path="/department/dashboard" element={<DepartmentDashboard />} />
          <Route path="/department/tasks" element={<DepartmentTasks />} />
          <Route path="/department/tasks/:id" element={<DepartmentTaskDetail />} />
          <Route path="/department/priority" element={<DepartmentPriority />} />
          <Route path="/department/map" element={<DepartmentMap />} />
          <Route path="/department/resolved" element={<DepartmentResolved />} />
          <Route path="/department/profile" element={<DepartmentProfile />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
