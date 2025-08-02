import {
  forgotPasswordApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TForgotPasswordData,
  TLoginData,
  TRegisterData,
  TResetPasswordData,
  TServerResponse
} from '@api';
import {
  asyncThunkCreator,
  buildCreateSlice,
  PayloadAction,
  SerializedError
} from '@reduxjs/toolkit';
import { getAuthUser } from '../auth-user/auth-user';

const createSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator }
});

type TAuthSlice = {
  isAuthenticated: boolean;
  isAuthChecked: boolean;
  pathToReturnAfterAuth: string;
  errors: {
    loginError?: SerializedError;
    logoutError?: SerializedError;
    registerError?: SerializedError;
    forgotPasswordError?: SerializedError;
    resetPasswordError?: SerializedError;
  };
  statuses: {
    isLoginPending: boolean;
    isLogoutPending: boolean;
    isRegisterPending: boolean;
    isforgotPasswordPending: boolean;
    isResetPasswordPending: boolean;
  };
};

const initialState: TAuthSlice = {
  isAuthenticated: false,
  isAuthChecked: false,
  pathToReturnAfterAuth: '/',
  errors: {},
  statuses: {
    isLoginPending: false,
    isLogoutPending: false,
    isRegisterPending: false,
    isforgotPasswordPending: false,
    isResetPasswordPending: false
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: (create) => ({
    login: create.asyncThunk(async (data: TLoginData) => loginUserApi(data), {
      pending: (state) => {
        state.errors.loginError = undefined;
        state.statuses.isLoginPending = true;
        state.isAuthChecked = true;
      },
      rejected: (state, action) => {
        state.errors.loginError = action.error;
        state.isAuthenticated = false;
        state.statuses.isLoginPending = false;
      },
      fulfilled: (state, action) => {
        state.isAuthenticated = action.payload.success;
        state.statuses.isLoginPending = false;
      }
    }),

    register: create.asyncThunk(
      async (data: TRegisterData) => registerUserApi(data),
      {
        pending: (state) => {
          state.errors.registerError = undefined;
          state.statuses.isRegisterPending = true;
          state.isAuthChecked = true;
        },
        rejected: (state, action) => {
          state.errors.registerError = action.error;
          state.statuses.isRegisterPending = false;
          state.isAuthenticated = false;
        },
        fulfilled: (state, action) => {
          state.statuses.isRegisterPending = false;
          state.isAuthenticated = action.payload.success;
        }
      }
    ),

    forgotPassword: create.asyncThunk(
      async (data: TForgotPasswordData) => forgotPasswordApi(data),
      {
        pending: (state) => {
          state.errors.forgotPasswordError = undefined;
          state.statuses.isforgotPasswordPending = true;
        },
        rejected: (state, action) => {
          state.errors.forgotPasswordError = action.error;
          state.statuses.isforgotPasswordPending = false;
        },
        fulfilled: (state) => {
          state.statuses.isforgotPasswordPending = false;
        }
      }
    ),

    resetPassword: create.asyncThunk(
      async (data: TResetPasswordData) => resetPasswordApi(data),
      {
        pending: (state) => {
          state.errors.resetPasswordError = undefined;
          state.statuses.isResetPasswordPending = true;
        },
        rejected: (state, action) => {
          state.errors.resetPasswordError = action.error;
          state.statuses.isResetPasswordPending = false;
        },
        fulfilled: (state) => {
          state.statuses.isRegisterPending = false;
        }
      }
    ),

    logout: create.asyncThunk<void, TServerResponse<{}>>(logoutApi, {
      pending: (state) => {
        state.errors.logoutError = undefined;
        state.statuses.isLogoutPending = true;
      },
      rejected: (state, action) => {
        state.errors.logoutError = action.error;
        state.statuses.isLogoutPending = false;
      },
      fulfilled: (state, action) => {
        state.isAuthenticated = !action.payload.success;
        state.statuses.isLoginPending = false;
      }
    }),
    setPathToReturnAfterAuth: create.reducer(
      (state, action: PayloadAction<string>) => {
        state.pathToReturnAfterAuth = action.payload;
      }
    )
  }),
  extraReducers: (builder) => {
    builder
      .addCase(getAuthUser.pending, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(getAuthUser.fulfilled, (state) => {
        state.isAuthenticated = true;
      });
  },
  selectors: {
    selectIsAuthChecked: (store) => store.isAuthChecked,
    selectIsAuthenticated: (store) => store.isAuthenticated,
    selectErrors: (store) => store.errors,
    selectStatuses: (store) => store.statuses,
    selectPathToReturnAfterAuth: (store) => store.pathToReturnAfterAuth
  }
});

export const {
  login: loginUser,
  register: registerUser,
  logout: logoutUser,
  setPathToReturnAfterAuth,
  forgotPassword,
  resetPassword
} = authSlice.actions;
export const {
  selectIsAuthenticated,
  selectIsAuthChecked,
  selectPathToReturnAfterAuth,
  selectErrors: selectErrorsAuth,
  selectStatuses: selectStatusesAuth
} = authSlice.selectors;
export const authReducer = authSlice.reducer;
