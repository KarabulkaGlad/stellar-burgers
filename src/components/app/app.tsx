import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { Route, Routes, useLocation } from 'react-router-dom';
import { MainLayout } from '../../layout/main-layout';
import { Modal } from '../modal';
import { OrderInfo } from '../order-info';
import { IngredientDetails } from '../ingredient-details';
import { ProtectedRouteAuth } from '../protected-route-auth/protected-route-auth';
import { useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { getIngredients } from '../../services/features/ingredients/ingredients';
import { ModalWrapper } from '../modal-wrapper/ModalWrapper ';
import { getFeeds } from '../../services/features/feeds/feeds';
import { ItemInfoLayout } from '../../layout/item-info-layout/item-info-layout';
import { ProtectedRouteGuest } from '../protected-route-guest';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const backgroundLocation = location.state?.background;

  useEffect(() => {
    dispatch(getIngredients());
    dispatch(getFeeds());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<MainLayout />}>
          <Route index element={<ConstructorPage />} />
          <Route path='feed' element={<Feed />} />
          <Route element={<ProtectedRouteGuest />}>
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='forgot-password' element={<ForgotPassword />} />
            <Route path='reset-password' element={<ResetPassword />} />
          </Route>
          <Route element={<ProtectedRouteAuth />}>
            <Route path='profile'>
              <Route index element={<Profile />} />
              <Route path='orders' element={<ProfileOrders />} />
            </Route>
          </Route>
        </Route>

        <Route element={<ItemInfoLayout />}>
          <Route element={<ProtectedRouteAuth />}>
            <Route path='orders/:number' element={<OrderInfo />} />
          </Route>
          <Route path='/ingredients/:id' element={<IngredientDetails />} />
          <Route path='/feed/:number' element={<OrderInfo />} />
        </Route>
        <Route path='*' element={<NotFound404 />} />
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <ModalWrapper title='Детали ингредиента'>
                {' '}
                <IngredientDetails />{' '}
              </ModalWrapper>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <ModalWrapper title='Детали заказа'>
                {' '}
                <OrderInfo />{' '}
              </ModalWrapper>
            }
          />
          <Route element={<ProtectedRouteAuth />}>
            <Route
              path='/profile/orders/:number'
              element={
                <ModalWrapper title='Детали заказа'>
                  {' '}
                  <OrderInfo />{' '}
                </ModalWrapper>
              }
            />
          </Route>
        </Routes>
      )}
    </div>
  );
};

export default App;
