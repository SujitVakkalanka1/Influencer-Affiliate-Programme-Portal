import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import InfluencerDashboard from "./pages/InfluencerDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
export default function App() {
  return <Routes><Route path="/" element={<LandingPage />} /><Route path="/login" element={<AuthPage mode="login" />} /><Route path="/register" element={<AuthPage mode="register" />} /><Route path="/dashboard" element={<InfluencerDashboard />} /><Route path="/admin" element={<AdminDashboard />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>;
}
