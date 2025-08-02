import { Navigate, Outlet, useLocation } from 'react-router-dom';
import {
  selectIsAuthenticated,
  setPathToReturnAfterAuth
} from '../../services/features/auth/auth';
import { useDispatch, useSelector } from '../../services/store';

export const ProtectedRouteAuth = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    dispatch(setPathToReturnAfterAuth(location.pathname));
    return <Navigate to='/login' state={{ from: location }} replace />;
  }
  return <Outlet />;
};
