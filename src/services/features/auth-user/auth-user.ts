import { getUserApi, TRegisterData, updateUserApi } from "@api";
import { asyncThunkCreator, buildCreateSlice, SerializedError } from "@reduxjs/toolkit";
import { TUser } from "@utils-types";
import { EMPTY_USER } from "src/constants/constants";
import { loginUser, logoutUser, registerUser } from "../auth/auth";

const createSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

type TAuthUserSlice = {
    user: TUser;
    errors: {
        getUserError?: SerializedError;
        updateUserError?: SerializedError;
    };
    statuses: {
        isGetUserPending: boolean;
        isUpdateUserPending: boolean;
    };
}

const initialState: TAuthUserSlice = {
    user: EMPTY_USER,
    errors: {},
    statuses: {
        isGetUserPending: false,
        isUpdateUserPending: false
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
        })
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
        selectErrors: (store) => store.errors,
        selectStatuses: (store) => store.statuses,
    }
});

export const { getUser: getAuthUser, updateUser: updateAuthUser } = authUserSlice.actions;
export const { selectUser: selectAuthUser, selectErrors: selectErrorsAuth, selectStatuses: selectStatusesAuth} = authUserSlice.selectors;
export const authUserReduser = authUserSlice.reducer;
