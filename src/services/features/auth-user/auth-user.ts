import { getOrdersApi, getUserApi, orderBurgerApi, TRegisterData, updateUserApi } from "@api";
import { asyncThunkCreator, buildCreateSlice, SerializedError } from "@reduxjs/toolkit";
import { TOrder, TUser } from "@utils-types";
import { EMPTY_USER } from "../../../constants/constants";
import { loginUser, logoutUser, registerUser } from "../auth/auth";

const createSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

type TAuthUserSlice = {
    user: TUser;
    orders: TOrder[];
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
}

const initialState: TAuthUserSlice = {
    user: EMPTY_USER,
    orders: [],
    errors: {},
    statuses: {
        isGetUserPending: false,
        isUpdateUserPending: false,
        isGetOrdersPending: false,
        isCreateOrderPending: false,
    }
}

const authUserSlice = createSlice({
    name: 'authUser',
    initialState,
    reducers: (create) => ({
        getUser: create.asyncThunk(async () => getUserApi(),
        {
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
        updateUser: create.asyncThunk(async (data: TRegisterData) => updateUserApi(data),
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
        }),
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
    }),
    extraReducers: (builder) => {
        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.user = action.payload.user;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
        })
        .addCase(logoutUser.fulfilled, () => initialState);
    },
    selectors: {
        selectUser: (store) => store.user,
        selectOrders: (store) => store.orders,
        selectErrors: (store) => store.errors,
        selectStatuses: (store) => store.statuses,
    }
});

export const { 
    getUser: getAuthUser,
    updateUser: updateAuthUser, 
    getOrders: getOrdersAuthUser, 
    createOrder } = authUserSlice.actions;
export const { 
    selectUser: selectAuthUser, 
    selectOrders: selectOrdersAuthUser, 
    selectErrors: selectErrorsAuth, 
    selectStatuses: selectStatusesAuth} = authUserSlice.selectors;
export const authUserReduser = authUserSlice.reducer;
