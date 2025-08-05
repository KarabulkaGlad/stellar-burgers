import {
  getOrdersApi,
  getUserApi,
  orderBurgerApi,
  TRegisterData,
  TUserResponse,
  updateUserApi
} from '@api';
import {
  asyncThunkCreator,
  buildCreateSlice,
  SerializedError
} from '@reduxjs/toolkit';
import { TOrder, TUser } from '@utils-types';
import { EMPTY_USER } from '../../../constants/constants';
import { loginUser, logoutUser, registerUser } from '../auth/auth';
import { createOrder } from '../user-order/user-order';

const createSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator }
});

type TAuthUserSlice = {
  user: TUser;
  orders: TOrder[];
  isOrdersReceived: boolean;
  errors: {
    getUserError?: SerializedError;
    updateUserError?: SerializedError;
    getOrdersError?: SerializedError;
    createOrderError?: SerializedError;
  };
  statuses: {
    isGetUserPending: boolean;
    isUpdateUserPending: boolean;
    isGetOrdersPending: boolean;
    isCreateOrderPending: boolean;
  };
};

const initialState: TAuthUserSlice = {
  user: EMPTY_USER,
  orders: [],
  isOrdersReceived: false,
  errors: {},
  statuses: {
    isGetUserPending: false,
    isUpdateUserPending: false,
    isGetOrdersPending: false,
    isCreateOrderPending: false
  }
};

const authUserSlice = createSlice({
  name: 'authUser',
  initialState,
  reducers: (create) => ({
    getUser: create.asyncThunk<void, TUserResponse>(getUserApi, {
      pending: (state) => {
        state.errors.getUserError = undefined;
        state.statuses.isGetUserPending = true;
      },
      rejected: (state, action) => {
        state.errors.getUserError = action.error;
        state.statuses.isGetUserPending = false;
      },
      fulfilled: (state, action) => {
        state.user = action.payload.user;
        state.statuses.isGetUserPending = false;
      }
    }),
    updateUser: create.asyncThunk(
      async (data: TRegisterData) => updateUserApi(data),
      {
        pending: (state) => {
          state.errors.updateUserError = undefined;
          state.statuses.isUpdateUserPending = true;
        },
        rejected: (state, action) => {
          state.errors.updateUserError = action.error;
          state.statuses.isUpdateUserPending = false;
        },
        fulfilled: (state, action) => {
          state.user = action.payload.user;
          state.statuses.isUpdateUserPending = false;
        }
      }
    ),
    getOrders: create.asyncThunk<void, TOrder[]>(getOrdersApi, {
      pending: (state) => {
        state.errors.getOrdersError = undefined;
        state.statuses.isGetOrdersPending = true;
        state.isOrdersReceived = false;
      },
      rejected: (state, action) => {
        state.errors.getOrdersError = action.error;
        state.statuses.isGetOrdersPending = false;
        state.isOrdersReceived = false;
      },
      fulfilled: (state, action) => {
        state.orders = action.payload;
        state.statuses.isGetOrdersPending = false;
        state.isOrdersReceived = true;
      }
    })
  }),
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.unshift(action.payload.order);
      })
      .addCase(logoutUser.fulfilled, () => initialState);
  },
  selectors: {
    selectUser: (store) => store.user,
    selectOrders: (store) => store.orders,
    selectIsOrdersReceived: (store) => store.isOrdersReceived,
    selectErrors: (store) => store.errors,
    selectStatuses: (store) => store.statuses
  }
});

export const {
  getUser: getAuthUser,
  updateUser: updateAuthUser,
  getOrders: getOrdersAuthUser
} = authUserSlice.actions;
export const {
  selectUser: selectAuthUser,
  selectOrders: selectOrdersAuthUser,
  selectErrors: selectErrorsAuthUser,
  selectStatuses: selectStatusesAuthUser,
  selectIsOrdersReceived
} = authUserSlice.selectors;
export const authUserReducer = authUserSlice.reducer;
