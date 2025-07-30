import { orderBurgerApi, TOrderBurgerRequest } from "@api";
import { asyncThunkCreator, buildCreateSlice, SerializedError } from "@reduxjs/toolkit";
import { OrderBurder, TOrder} from "@utils-types";
import { EMPTY_ORDER } from "../../../constants/constants";
import { logoutUser } from "../auth/auth";

const createSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

type TUserOrderSlice = {
    orderData: OrderBurder;
    lastOrder?: TOrder;
    errors: {
        createOrderError?: SerializedError;
    };
    statuses: {
        isCreateOrderPending: boolean;
    };
}

const initialState: TUserOrderSlice = {
    orderData: EMPTY_ORDER,
    errors: {},
    statuses: {
        isCreateOrderPending: false,
    }
}

const userOrderSlice = createSlice({
    name: 'userOrder',
    initialState,
    reducers: (create) => ({
        createOrder: create.asyncThunk(async (data: TOrderBurgerRequest) => orderBurgerApi(data),
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
        }),
    }),

    extraReducers: (builder) => {
        builder
        .addCase(logoutUser.fulfilled, () => initialState);
    },
    selectors: {
        selectOrder: (store) => store.orderData,
        selectLastOrder: (store) => store.lastOrder,
        selectErrors: (store) => store.errors,
        selectStatuses: (store) => store.statuses,
    }
});

export const { createOrder } = userOrderSlice.actions;
export const { 
    selectErrors: selectErrorsUserOrder, 
    selectStatuses: selectStatusesUserOrder,
    selectOrder: selectUserOrder,
selectLastOrder: selectLastUserOrder} = userOrderSlice.selectors;
export const userOrderReducer = userOrderSlice.reducer;