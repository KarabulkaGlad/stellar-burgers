import * as api from '@api'; 
import { configureStore } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { authUserReducer } from '../../src/services/features/auth-user/auth-user';
import { authReducer, forgotPassword, loginUser, logoutUser, registerUser, resetPassword, setPathToReturnAfterAuth } from '../../src/services/features/auth/auth';
import { getCookie } from '../../src/utils/cookie';
import { TLoginData } from '@api';
import { dummyAuthState, dummyAuthUserState, dummyUserOrderState } from '../constants';
import { userOrderReducer } from '../../src/services/features/user-order/user-order';

beforeEach(() => {
  localStorage.clear();
  document.cookie = ''; 
  jest.clearAllMocks();
});

describe('auth reduser', () => {

    const loginData: TLoginData = {
        email: 'test email',
        password: 'test password',
    }

    const registerData: api.TRegisterData = {
        ...loginData,
        name: 'test name',
    }

    const user: TUser & {password: string} = {
        email: 'test email',
        name: 'test name',
        password: 'test password'
    }

    test('loginUser resolve', async () => {
        const authResponse: api.TAuthResponse = {
            refreshToken: 'test refresh',
            accessToken: 'test access',
            user: user,
            success: true,
        };
        jest.mock('../../src/utils/cookie', () => ({
            setCookie: jest.fn(),
            getCookie: jest.fn(() => 'test access')
        }));

        global.fetch = jest.fn(() => 
        Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve(authResponse),
        })
        ) as jest.Mock;

        const store = configureStore({
            reducer: {
                auth: authReducer,
                authUser: authUserReducer
            },
        });

        await store.dispatch(loginUser(loginData));

        const state = store.getState();
        const refresh = localStorage.getItem('refreshToken');
        const access = getCookie('accessToken');

        expect(state.auth.isAuthenticated).toBe(true);
        expect(state.auth.isAuthChecked).toBe(true);
        expect(state.authUser.user).toEqual(user);
        expect(refresh).toBe(authResponse.refreshToken);
        expect(access).toBe(authResponse.accessToken);
    });

    test('loginUser reject', async () => {

        const err = {message: 'Faild'};
        jest.spyOn(api, 'loginUserApi').mockRejectedValue(err);

        const store = configureStore({
            reducer: {
                auth: authReducer,
            },
        });

        await store.dispatch(loginUser(loginData));

        const state = store.getState();

        expect(state.auth.isAuthenticated).toBe(false);
        expect(state.auth.isAuthChecked).toBe(true);
        expect(state.auth.errors.loginError).toEqual(err);
    });

    test('registerUser resolve', async () => {
        const authResponse: api.TAuthResponse = {
            refreshToken: 'test refresh',
            accessToken: 'test access',
            user: user,
            success: true,
        };
        jest.mock('../../src/utils/cookie', () => ({
            setCookie: jest.fn(),
            getCookie: jest.fn(() => 'test access')
        }));

        global.fetch = jest.fn(() => 
        Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve(authResponse),
        })
        ) as jest.Mock;


        const store = configureStore({
            reducer: {
                auth: authReducer,
                authUser: authUserReducer
            },
        });

        await store.dispatch(registerUser(registerData));

        const state = store.getState();
        const refresh = localStorage.getItem('refreshToken');
        const access = getCookie('accessToken');

        expect(state.auth.isAuthenticated).toBe(true);
        expect(state.auth.isAuthChecked).toBe(true);
        expect(state.authUser.user).toEqual(user);
        expect(refresh).toBe(authResponse.refreshToken);
        expect(access).toBe(authResponse.accessToken);
    });

    test('registerUser reject', async () => {

        const err = {message: 'Faild'};
        jest.spyOn(api, 'registerUserApi').mockRejectedValue(err);

        const store = configureStore({
            reducer: {
                auth: authReducer,
            },
        });

        await store.dispatch(registerUser(registerData));

        const state = store.getState();

        expect(state.auth.isAuthenticated).toBe(false);
        expect(state.auth.isAuthChecked).toBe(true);
        expect(state.auth.errors.registerError).toEqual(err);
    });

    test('forgotPassword reject', async () => {
        const err = { message: 'Failed' };

        jest.spyOn(api, 'forgotPasswordApi').mockRejectedValue(err);

        const store = configureStore({
            reducer: { auth: authReducer }
        });

        await store.dispatch(forgotPassword({ email: 'test' }));

        const state = store.getState().auth;

        expect(state.errors.forgotPasswordError).toEqual(err);
        expect(state.statuses.isforgotPasswordPending).toBe(false);

    });

    test('resetPassword reject', async () => {
        const err = { message: 'Failed' };

        jest.spyOn(api, 'resetPasswordApi').mockRejectedValue(err);

        const store = configureStore({
            reducer: { auth: authReducer }
        });

        await store.dispatch(resetPassword({ password: 'test', token: 'test' }));

        const state = store.getState().auth;

        expect(state.errors.resetPasswordError).toEqual(err);
        expect(state.statuses.isResetPasswordPending).toBe(false);

    });

    test('logoutUser resolve', async () => {

        const lastOrder = {
            _id: 'test',
            status: 'test',
            name: 'test',
            createdAt: 'test',
            updatedAt: 'test',
            number: 1,
            ingredients: ["1", "2", "1"]
        }

        const user = {
            email: "test",
            name: "test",
        }

        global.fetch = jest.fn(() => 
        Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({success: true}),
        })
        ) as jest.Mock;


        const store = configureStore({
            reducer: {
                auth: authReducer,
                authUser: authUserReducer,
                userOrder: userOrderReducer,
            },
            preloadedState: {
                auth: {
                    ...dummyAuthState,
                    isAuthChecked: true,
                    isAuthenticated: true
                },
                authUser: {
                    ...dummyAuthUserState,
                    user: user,
                },
                userOrder: {
                    ...dummyUserOrderState,
                    lastOrder: lastOrder,
                }
            }
        });

        let state = store.getState();

        expect(state.auth.isAuthenticated).toBe(true);
        expect(state.authUser.user).toEqual(user);
        expect(state.userOrder.lastOrder).toEqual(lastOrder);

        await store.dispatch(logoutUser());

        state = store.getState();

        expect(state.auth.isAuthenticated).toBe(false);
        expect(state.authUser).toEqual(dummyAuthUserState);
        expect(state.userOrder.lastOrder).toBeUndefined();
    });

    test('setPathToReturnAfterAuth', () => {
        const state = authReducer(dummyAuthState, setPathToReturnAfterAuth('/test'))
        expect(state.pathToReturnAfterAuth).toBe('/test');
    })
})