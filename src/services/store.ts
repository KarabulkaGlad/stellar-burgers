import { combineSlices, configureStore, createReducer } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { authReduser } from './features/auth/auth';
import { authUserReduser } from './features/auth-user/auth-user';
import { feedsReduser } from './features/feeds/feeds';
import { ingredientsReduser } from './features/ingredients/ingredients';

const rootReducer = combineSlices({
  auth: authReduser,
  authUser: authUserReduser,
  feeds: feedsReduser,
  ingredients: ingredientsReduser,
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
