import { FC, useMemo } from 'react';
import { BurgerConstructorUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectLastUserOrder, selectStatusesUserOrder, selectUserOrder } from '../../services/features/user-order/user-order';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(selectUserOrder);
  const {isCreateOrderPending} = useSelector(selectStatusesUserOrder);

  const orderModalData = useSelector(selectLastUserOrder);

  const onOrderClick = () => {
    if (!constructorItems.bun || isCreateOrderPending) return;
  };
  const closeOrderModal = () => {};

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s, v) => s + v.price,
        0
      ),
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


