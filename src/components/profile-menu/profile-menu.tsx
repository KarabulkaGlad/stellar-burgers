import { FC, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { logoutUser } from '../../services/features/auth/auth';
import { selectAuthUser } from '../../services/features/auth-user/auth-user';

export const ProfileMenu: FC = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const user = useSelector(selectAuthUser);

  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
  }, []);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
