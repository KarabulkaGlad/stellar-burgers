import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useCallback, useEffect } from 'react';
import { getFeeds, selectFeeds } from '../../services/features/feeds/feeds';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const feeds = useSelector(selectFeeds);

  const handleGetFeeds = useCallback(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  if (!feeds.orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={feeds.orders} handleGetFeeds={handleGetFeeds} />;
};
