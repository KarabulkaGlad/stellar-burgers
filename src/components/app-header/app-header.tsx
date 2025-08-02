import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectAuthUser } from '../../services/features/auth-user/auth-user';

export const AppHeader: FC = () => {
  const user = useSelector(selectAuthUser);
  return <AppHeaderUI userName={user.name} />;
};
