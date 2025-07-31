import { FC, useMemo } from 'react';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearOrderData,
  createOrder,
  selectLastUserOrder,
  selectStatusesUserOrder,
  selectUserOrder
} from '../../services/features/user-order/user-order';
import { OrderBurger } from '@utils-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { selectIsAuthenticated } from '../../services/features/auth/auth';

const converterOrderToStringArray = (order: OrderBurger): string[] => {
  if (!order.bun) return [];
  return [
    order.bun._id,
    ...order.ingredients.map((ingredient) => ingredient._id),
    order.bun._id
  ];
};

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const constructorItems = useSelector(selectUserOrder);
  const { isCreateOrderPending } = useSelector(selectStatusesUserOrder);

  const orderModalData = useSelector(selectLastUserOrder);

  const onOrderClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    if (!constructorItems.bun || isCreateOrderPending) return;
    dispatch(
      createOrder({
        ingredients: converterOrderToStringArray(constructorItems)
      })
    );
  };

  const closeOrderModal = () => {
    dispatch(clearOrderData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce((s, v) => s + v.price, 0),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={isCreateOrderPending}
      constructorItems={constructorItems}
      orderModalData={orderModalData ?? null}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
