import { orderBurgerApi, TOrderBurgerRequest } from '@api';
import {
  asyncThunkCreator,
  buildCreateSlice,
  PayloadAction,
  SerializedError
} from '@reduxjs/toolkit';
import {
  OrderBurger,
  TConstructorIngredient,
  TIngredient,
  TOrder
} from '@utils-types';
import { EMPTY_ORDER } from '../../../constants/constants';
import { logoutUser } from '../auth/auth';
import { v4 as uuidv4 } from 'uuid';

const createSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator }
});

type MovementDirection = 'up' | 'down';

export type TUserOrderSlice = {
  orderData: OrderBurger;
  lastOrder?: TOrder;
  errors: {
    createOrderError?: SerializedError;
  };
  statuses: {
    isCreateOrderPending: boolean;
  };
};

const initialState: TUserOrderSlice = {
  orderData: EMPTY_ORDER,
  errors: {},
  statuses: {
    isCreateOrderPending: false
  }
};

const userOrderSlice = createSlice({
  name: 'userOrder',
  initialState,
  reducers: (create) => ({
    createOrder: create.asyncThunk(
      async (data: TOrderBurgerRequest) => orderBurgerApi(data),
      {
        pending: (state) => {
          state.errors.createOrderError = undefined;
          state.statuses.isCreateOrderPending = true;
        },
        rejected: (state, action) => {
          state.errors.createOrderError = action.error;
          state.statuses.isCreateOrderPending = false;
        },
        fulfilled: (state, action) => {
          state.lastOrder = action.payload.order;
          state.statuses.isCreateOrderPending = false;
        }
      }
    ),
    addIngredientToOrder: create.reducer(
      (state, action: PayloadAction<TConstructorIngredient>) => {
        state.orderData.ingredients.push(action.payload);
      }
    ),
    addBunToOrder: create.reducer(
      (state, action: PayloadAction<TConstructorIngredient>) => {
        state.orderData.bun = action.payload;
      }
    ),
    removeIngredientFromOrder: create.reducer(
      (state, action: PayloadAction<TConstructorIngredient>) => {
        state.orderData.ingredients = state.orderData.ingredients.filter(
          (el) => el.id !== action.payload.id
        );
      }
    ),
    moveOneStepIngredienInOrder: create.reducer(
      (
        state,
        action: PayloadAction<{
          ingredient: TConstructorIngredient;
          direction: MovementDirection;
        }>
      ) => {
        const { ingredient, direction } = action.payload;
        const index = state.orderData.ingredients.findIndex(
          (el) => el.id === ingredient.id
        );
        if (
          index !== -1 &&
          (index !== 0 || direction === 'down') &&
          (index !== state.orderData.ingredients.length - 1 ||
            direction === 'up')
        ) {
          const temp = state.orderData.ingredients[index];
          const changeIndex = direction === 'up' ? index - 1 : index + 1;
          state.orderData.ingredients[index] =
            state.orderData.ingredients[changeIndex];
          state.orderData.ingredients[changeIndex] = temp;
        }
      }
    ),
    clearOrderData: create.reducer((state) => {
      state.lastOrder = undefined;
      state.orderData = EMPTY_ORDER;
    })
  }),

  extraReducers: (builder) => {
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.lastOrder = undefined;
    });
  },
  selectors: {
    selectOrder: (store) => store.orderData,
    selectLastOrder: (store) => store.lastOrder,
    selectErrors: (store) => store.errors,
    selectStatuses: (store) => store.statuses
  }
});

export const {
  createOrder,
  addIngredientToOrder,
  addBunToOrder,
  removeIngredientFromOrder,
  moveOneStepIngredienInOrder,
  clearOrderData
} = userOrderSlice.actions;
export const {
  selectErrors: selectErrorsUserOrder,
  selectStatuses: selectStatusesUserOrder,
  selectOrder: selectUserOrder,
  selectLastOrder: selectLastUserOrder
} = userOrderSlice.selectors;
export const userOrderReducer = userOrderSlice.reducer;
