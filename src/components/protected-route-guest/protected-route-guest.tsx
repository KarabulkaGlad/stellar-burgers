import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../services/features/auth/auth';
import { useEffect } from 'react';

export const ProtectedRouteGuest = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || 'profile';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
};
