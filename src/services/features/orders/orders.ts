import { asyncThunkCreator, buildCreateSlice, SerializedError } from "@reduxjs/toolkit";
import { logoutUser } from "../auth/auth";
import { getOrdersApi, orderBurgerApi } from "@api";
import { TOrder } from "@utils-types";

const createSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

type TOrdersSlice = {
    orders: TOrder[];
    errors: {
        getOrdersError?: SerializedError;
        createOrderError?: SerializedError;
    };
    statuses: {
        isGetOrdersPending: boolean;
        isCreateOrderPending: boolean;
    };
}

const initialState: TOrdersSlice = {
    orders: [],
    errors: {},
    statuses: {
        isGetOrdersPending: false,
        isCreateOrderPending: false,
    }
}

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: (create) => ({
        getOrders: create.asyncThunk(async () => getOrdersApi(),
        {
            pending: (state) => {
                state.errors.getOrdersError = undefined;
                state.statuses.isGetOrdersPending = true;
            },
            rejected: (state, action) => {
                state.errors.getOrdersError = action.error;
                state.statuses.isGetOrdersPending = false;
            },
            fulfilled: (state, action) => {
                state.orders = action.payload;
                state.statuses.isGetOrdersPending = false;
            }
        }),
        createOrder: create.asyncThunk(async (data: string[]) => orderBurgerApi(data),
        {
            pending: (state) => {
                state.errors.getOrdersError = undefined;
                state.statuses.isCreateOrderPending = true;
            },
            rejected: (state, action) => {
                state.errors.getOrdersError = action.error;
                state.statuses.isCreateOrderPending = false;
            },
            fulfilled: (state, action) => {
                state.orders.push(action.payload.order);
                state.statuses.isCreateOrderPending = false;
            }
        }),
    }), // потом по необходимости добавлю ещё redusers
    extraReducers: (builder) => {
        builder
        .addCase(logoutUser.fulfilled, () => initialState);
    },
    selectors: {
        selectOrders: (store) => store.orders,
        selectErrors: (store) => store.errors,
        selectStatuses: (store) => store.statuses,
    }
});

export const { getOrders, createOrder } = ordersSlice.actions;
export const { selectOrders, selectErrors: selectErrorsOrders, selectStatuses: selectStatusesOrders} = ordersSlice.selectors;
export const ordersReduser = ordersSlice.reducer;