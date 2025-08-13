import * as api from '@api'; 
import { configureStore } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { authUserReducer, getAuthUser, getOrdersAuthUser, updateAuthUser } from '../../src/services/features/auth-user/auth-user';
import { dummyAuthUserState } from '../constants';
import { authReducer } from '../../src/services/features/auth/auth';

jest.mock('@api'); 

describe('auth-user reduser', () => {
    const initalStateUser: TUser = {
        email: 'test',
        name: 'test'
    };

    test('getUser resolve', async () => {
        ;(api.getUserApi as jest.Mock).mockResolvedValue({user: initalStateUser});

        const store = configureStore({
            reducer: { 
                asuthUser: authUserReducer,
                auth: authReducer,
            },
        })

        await store.dispatch(getAuthUser())
        const state = store.getState();

        expect(api.getUserApi).toHaveBeenCalled();
        expect(state.asuthUser.user).toEqual(initalStateUser);
        expect(state.asuthUser.statuses.isGetUserPending).toBe(false);
        expect(state.asuthUser.errors.getUserError).toBeUndefined();
        expect(state.auth.isAuthChecked).toBe(true);
        expect(state.auth.isAuthenticated).toBe(true);
    })

    test('getUser reject', async () => {
        const expectErr = {message: "Faild"};
        (api.getUserApi as jest.Mock).mockImplementation(() => Promise.reject(expectErr));

        const store = configureStore({
            reducer: { 
                asuthUser: authUserReducer,
                auth: authReducer,
            },
        })

        await store.dispatch(getAuthUser())
        const state = store.getState();

        expect(api.getUserApi).toHaveBeenCalled();
        expect(state.asuthUser.statuses.isGetUserPending).toBe(false);
        expect(state.asuthUser.errors.getUserError).toEqual(expectErr);
        expect(state.auth.isAuthChecked).toBe(true);
    })

    test('updateUser resolve', async () => {
        const updatedUser: api.TRegisterData = {
            email: 'test change',
            name: 'test change',
            password: 'test change'
        };
        
        ;(api.updateUserApi as jest.Mock).mockResolvedValue({user: updatedUser});

        const store = configureStore({
            reducer: { authUser: authUserReducer},
            preloadedState: {
                authUser: {
                    ...dummyAuthUserState,
                    user: initalStateUser
                },
            }
        })

        let state = store.getState().authUser;
        expect(state.user).toEqual(initalStateUser);

        await store.dispatch(updateAuthUser(updatedUser))
        state = store.getState().authUser;

        expect(api.updateUserApi).toHaveBeenCalled();
        expect(state.user).toEqual(updatedUser);
        expect(state.statuses.isUpdateUserPending).toBe(false);
        expect(state.errors.updateUserError).toBeUndefined();
    })

    test('updateUser reject', async () => {
        const updatedUser: api.TRegisterData = {
            email: 'test change',
            name: 'test change',
            password: 'test change'
        };
        const expectErr = {message: "Faild"};
        
        ;(api.updateUserApi as jest.Mock).mockImplementation(() => Promise.reject(expectErr));

        const store = configureStore({
            reducer: { authUser: authUserReducer},
        })

        await store.dispatch(updateAuthUser(updatedUser))
        const state = store.getState().authUser;

        expect(api.updateUserApi).toHaveBeenCalled();
        expect(state.statuses.isUpdateUserPending).toBe(false);
        expect(state.errors.updateUserError).toEqual(expectErr);
    })

    test('getOrders resolve', async () => {
        const ordersResponse: api.TFeedsResponse = {
            orders: [
                {
                    _id: "1",
                    status: "test",
                    name: "test",
                    createdAt: "test",
                    updatedAt: "test",
                    number: 1,
                    ingredients: ["1", "2", "1"]
                },
            ],
            total: 1,
            totalToday: 1,
            success: true
        };
    
        ;(api.getOrdersApi as jest.Mock).mockResolvedValue(ordersResponse);

        const store = configureStore({
            reducer: { asuthUser: authUserReducer},
        })

        await store.dispatch(getOrdersAuthUser())
        const state = store.getState().asuthUser;

        expect(api.getOrdersApi).toHaveBeenCalled();
        expect(state.orders).toEqual(ordersResponse);
        expect(state.isOrdersReceived).toBe(true);
        expect(state.statuses.isGetOrdersPending).toBe(false);
        expect(state.errors.getOrdersError).toBeUndefined();
    })

    test('getOrders reject', async () => {
    
        const expectErr = {message: "Faild"};
        ;(api.getOrdersApi as jest.Mock).mockImplementation(() => Promise.reject(expectErr));

        const store = configureStore({
            reducer: { asuthUser: authUserReducer},
        })

        await store.dispatch(getOrdersAuthUser())
        const state = store.getState().asuthUser;

        expect(api.getOrdersApi).toHaveBeenCalled();
        expect(state.isOrdersReceived).toBe(false);
        expect(state.statuses.isGetOrdersPending).toBe(false);
        expect(state.errors.getOrdersError).toEqual(expectErr);
    })
})