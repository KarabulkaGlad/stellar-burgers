import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/features/ingredients/ingredients';
import { selectOrdersAuthUser } from '../../services/features/auth-user/auth-user';
import { selectFeeds } from '../../services/features/feeds/feeds';

export const OrderInfo: FC = () => {
  const location = useLocation();
  const { number } = useParams<{ number: string }>();

  const { orders: feedsOrders } = useSelector(selectFeeds);
  const profileOrders = useSelector(selectOrdersAuthUser);
  const ingredients = useSelector(selectIngredients);

  const sourceOrders = location.pathname.startsWith('/profile')
    ? profileOrders
    : feedsOrders;

  const orderData = sourceOrders.find(
    (order) => order.number === Number(number)
  );

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
