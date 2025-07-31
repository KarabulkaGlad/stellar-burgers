import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../services/features/auth/auth';

export const ProtectedRouteGuest = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
};
