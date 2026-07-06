import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { useAuthStore } from '../../stores/auth.store';

export function ProtectedRoute() {
  const token = useAuthStore((state) => state.token);
  const location = useLocation();

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
}
