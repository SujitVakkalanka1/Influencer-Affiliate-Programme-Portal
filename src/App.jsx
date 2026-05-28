import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import InfluencerDashboard from './pages/InfluencerDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<InfluencerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ToastProvider>
  );
}
