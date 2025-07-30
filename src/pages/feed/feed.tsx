import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { selectFeeds } from '../../services/features/feeds/feeds';
import { useSelector } from '../../services/store';

export const Feed: FC = () => {

  const feeds = useSelector(selectFeeds);

  if (!feeds.orders.length) {
    return <Preloader />;
  }

  <FeedUI orders={feeds.orders} handleGetFeeds={() => {}} />;
};
