import { OrderBurger, TConstructorIngredient, TOrder } from "@utils-types"
import { addBunToOrder, addIngredientToOrder, createOrder, moveOneStepIngredienInOrder, removeIngredientFromOrder, TUserOrderSlice, userOrderReducer } from "../src/services/features/user-order/user-order"
import { configureStore } from "@reduxjs/toolkit"
import * as api from '@api'; 
import { EMPTY_ORDER } from "../src/constants/constants";
import { dummyUserOrderState } from "./constants";
import { feedsReducer } from "../src/services/features/feeds/feeds";
import { authUserReducer } from "../src/services/features/auth-user/auth-user";

jest.mock('@api'); 

describe('Тестирование reducer user-order', () => {

    const initalBunState: TConstructorIngredient = 
        {
            id: "1",
            _id: "1",
            name: "Краторная булка N-200i",
            type: "bun",
            proteins: 80,
            fat: 24,
            carbohydrates: 53,
            calories: 420,
            price: 1255,
            image: "https://code.s3.yandex.net/react/code/bun-02.png",
            image_mobile: "https://code.s3.yandex.net/react/code/bun-02-mobile.png",
            image_large: "https://code.s3.yandex.net/react/code/bun-02-large.png",
        }

    const initalIngredientsState: TConstructorIngredient[] = 
        [
            {
                id: "2",
                _id: "2",
                name: "Биокотлета из марсианской Магнолии",
                type: "main",
                proteins: 420,
                fat: 142,
                carbohydrates: 242,
                calories: 4242,
                price: 424,
                image: "https://code.s3.yandex.net/react/code/meat-01.png",
                image_mobile: "https://code.s3.yandex.net/react/code/meat-01-mobile.png",
                image_large: "https://code.s3.yandex.net/react/code/meat-01-large.png",
            },
            {
                id: "3",
                _id: "3",
                name: "Филе Люминесцентного тетраодонтимформа",
                type: "main",
                proteins: 44,
                fat: 26,
                carbohydrates: 85,
                calories: 643,
                price: 988,
                image: "https://code.s3.yandex.net/react/code/meat-03.png",
                image_mobile: "https://code.s3.yandex.net/react/code/meat-03-mobile.png",
                image_large: "https://code.s3.yandex.net/react/code/meat-03-large.png",
            },
            {
                id: "4",
                _id: "4",
                name: "Соус Spicy-X",
                type: "sauce",
                proteins: 30,
                fat: 20,
                carbohydrates: 40,
                calories: 30,
                price: 90,
                image: "https://code.s3.yandex.net/react/code/sauce-02.png",
                image_mobile: "https://code.s3.yandex.net/react/code/sauce-02-mobile.png",
                image_large: "https://code.s3.yandex.net/react/code/sauce-02-large.png",
            },
        ]

    test('create order resolve', async () => {
        const mockData = {
            order: {
                _id: "1",
                status: "test",
                name: "test",
                createdAt: "test",
                updatedAt: "test",
                number: "1",
                ingredients: ["1", "2", "1"]
            }
        };

        ;(api.orderBurgerApi as jest.Mock).mockResolvedValue(mockData);

        const store = configureStore({
            reducer: { 
                userOrder: userOrderReducer,
                feeds: feedsReducer,
                authUser: authUserReducer
            }
        });

        let state = store.getState();
        expect(state.userOrder.statuses.isCreateOrderPending).toBe(false);

        await store.dispatch(createOrder({ ingredients: ["1", "2", "1"] }));

        state = store.getState();
        expect(state.userOrder.lastOrder).toEqual(mockData.order);
        expect(state.userOrder.statuses.isCreateOrderPending).toBe(false);
        expect(state.userOrder.errors.createOrderError).toBeUndefined();
        expect(state.feeds.feeds.orders).toEqual([mockData.order]);
        expect(state.authUser.orders).toEqual([mockData.order]);
    });

    test('create order reject', async () => {
        const expectErr = {message: "Faild"};
        ;(api.orderBurgerApi as jest.Mock).mockImplementation(() => Promise.reject(expectErr))

        const store = configureStore({
            reducer: { userOrder: userOrderReducer }
        });

        await store.dispatch(createOrder({ingredients: ["1", "2", "1"]}));

        const state = store.getState().userOrder;

        expect(state.lastOrder).toBeUndefined();
        expect(state.statuses.isCreateOrderPending).toBe(false);
        expect(state.errors.createOrderError).toEqual(expectErr);
    });

    test('addBunToOrder', () => {
        const state = userOrderReducer(dummyUserOrderState , addBunToOrder(initalBunState));

        expect(state.orderData.bun).toEqual(initalBunState);
    })

    test('addIngredientToOrder', () => {
        const state = userOrderReducer(dummyUserOrderState, addIngredientToOrder(initalIngredientsState[0]));

        expect(state.orderData.ingredients).toHaveLength(1);
        expect(state.orderData.ingredients).toEqual([initalIngredientsState[0]]);
    })

    test('removeIngredientFromOrder', () => {
        const state = userOrderReducer({...dummyUserOrderState, 
            orderData: { ingredients: [initalIngredientsState[0], initalIngredientsState[1]]}},
            removeIngredientFromOrder(initalIngredientsState[0]));
        
        expect(state.orderData.ingredients).toHaveLength(1);
        expect(state.orderData.ingredients).toEqual([initalIngredientsState[1]]);
    })
    
    test('moveOneStepIngredienInOrder up', () => {
        const state = userOrderReducer({...dummyUserOrderState, 
            orderData: { ingredients: [initalIngredientsState[0], initalIngredientsState[1], initalIngredientsState[2]]}},
            moveOneStepIngredienInOrder({ingredient: initalIngredientsState[1], direction: 'up'}));
        
        expect(state.orderData.ingredients).toEqual([initalIngredientsState[1], initalIngredientsState[0], initalIngredientsState[2]])
    })

    test('moveOneStepIngredienInOrder down', () => {
        const state = userOrderReducer({...dummyUserOrderState, 
            orderData: { ingredients: [initalIngredientsState[0], initalIngredientsState[1], initalIngredientsState[2]]}},
            moveOneStepIngredienInOrder({ingredient: initalIngredientsState[0], direction: 'down'}));
        
        expect(state.orderData.ingredients).toEqual([initalIngredientsState[1], initalIngredientsState[0], initalIngredientsState[2]])
    })
})

