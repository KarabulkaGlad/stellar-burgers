import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useSelector } from '../../services/store';
import { selectOrdersAuthUser } from '../../services/features/auth-user/auth-user';

export const ProfileOrders: FC = () => {
  
  const orders = useSelector(selectOrdersAuthUser);

  return <ProfileOrdersUI orders={orders} />;
};
