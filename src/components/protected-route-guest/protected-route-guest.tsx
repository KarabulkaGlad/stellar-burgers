import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  selectIsAuthenticated,
  selectPathToReturnAfterAuth
} from '../../services/features/auth/auth';
import { useEffect } from 'react';

export const ProtectedRouteGuest = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const pathToReturn = useSelector(selectPathToReturnAfterAuth);
  if (isAuthenticated) {
    return <Navigate to={pathToReturn} replace />;
  }

  return <Outlet />;
};
