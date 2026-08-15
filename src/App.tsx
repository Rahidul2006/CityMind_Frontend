import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Complaints from './pages/Complaints';
import Departments from './pages/Departments';
import Analytics from './pages/Analytics';
import Alarts from './pages/Alarts';
import Adminstrations from './pages/Adminstrations';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Navigate to="/" replace />} />
        <Route path="complaints" element={<Complaints />} />
        <Route path="departments" element={<Departments />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="alerts" element={<Alarts />} />
        <Route path="administration" element={<Adminstrations />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
