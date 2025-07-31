import { combineSlices, configureStore, createReducer } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { authReducer } from './features/auth/auth';
import { authUserReducer } from './features/auth-user/auth-user';
import { feedsReducer } from './features/feeds/feeds';
import { ingredientsReducer } from './features/ingredients/ingredients';
import { userOrderReducer } from './features/user-order/user-order';

const rootReducer = combineSlices({
  auth: authReducer,
  authUser: authUserReducer,
  feeds: feedsReducer,
  ingredients: ingredientsReducer,
  userOrder: userOrderReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
