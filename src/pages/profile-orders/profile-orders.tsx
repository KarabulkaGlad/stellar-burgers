import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getOrdersAuthUser,
  selectIsOrdersReceived,
  selectOrdersAuthUser,
  selectStatusesAuthUser
} from '../../services/features/auth-user/auth-user';
import { selectIsAuthenticated } from '../../services/features/auth/auth';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrdersAuthUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isOrdersReceived = useSelector(selectIsOrdersReceived);
  const { isGetOrdersPending } = useSelector(selectStatusesAuthUser);

  useEffect(() => {
    if (isAuthenticated && !isOrdersReceived) {
      dispatch(getOrdersAuthUser());
    }
  }, []);

  if (isGetOrdersPending) {
    return <Preloader />;
  }
  return <ProfileOrdersUI orders={orders} />;
};
