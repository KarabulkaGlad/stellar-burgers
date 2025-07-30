import { FC, useMemo } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import { selectFeeds } from '../../services/features/feeds/feeds';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const feeds = useSelector(selectFeeds);

  const readyOrders = useMemo(() => getOrders(feeds.orders, 'done'), [feeds]);

  const pendingOrders = useMemo(() => getOrders(feeds.orders, 'pending'), [feeds]);

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feeds}
    />
  );
};
