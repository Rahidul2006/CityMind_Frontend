import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Complaints from './pages/Complaints';
import Departments from './pages/Departments';
import Analytics from './pages/Analytics';
import Alarts from './pages/Alarts';
import Adminstrations from './pages/Adminstrations';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LandingPage initialShowLogin={true} />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/alerts" element={<Alarts />} />
          <Route path="/administration" element={<Adminstrations />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
