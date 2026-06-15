import { Navigate } from 'react-router-dom';
import { getUser, isLoggedIn } from '../lib/auth';

export default function ProtectedRoute({ role, children }) {
  const user = getUser();

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return children;
}
