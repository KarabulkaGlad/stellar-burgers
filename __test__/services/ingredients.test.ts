import { TIngredient } from "@utils-types";
import { getIngredients, ingredientsReducer, selectIngredientById, TIngredientsSlice } from "../../src/services/features/ingredients/ingredients";
import * as api from '@api'; 
import { configureStore } from "@reduxjs/toolkit";
import { dummyAuthState, dummyAuthUserState, dummyFeedsState, dummyIngredientsState, dummyUserOrderState } from "../constants";

jest.mock('@api'); 

describe('ingredient reduser', () => {
    const initalIngredientsState: TIngredient[] = 
        [
            {
                _id: "1",
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
                _id: "2",
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
                _id: "3",
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

    test('getIngredients resolve', async () => {
        ;(api.getIngredientsApi as jest.Mock).mockReturnValue(initalIngredientsState);

        const store = configureStore({
            reducer: { ingredients: ingredientsReducer }
        });

        await store.dispatch(getIngredients());

        const state = store.getState().ingredients;

        expect(api.getIngredientsApi).toHaveBeenCalled();
        expect(state.ingredients).toEqual(initalIngredientsState);
        expect(state.statuses.isGetIngredientsPending).toBe(false);
    })

    test('getIngredients reject', async () => {
        const expectErr = {message: "Faild"};
        ;(api.getIngredientsApi as jest.Mock).mockImplementation(() => Promise.reject(expectErr))

        const store = configureStore({
            reducer: { ingredients: ingredientsReducer }
        });

        await store.dispatch(getIngredients());

        const state = store.getState().ingredients;

        expect(api.getIngredientsApi).toHaveBeenCalled();
        expect(state.ingredients).toEqual([]);
        expect(state.errors.getIngredientsError).toEqual(expectErr);
        expect(state.statuses.isGetIngredientsPending).toBe(false);
    })

    test('selectIngredientById', async () => {

        const dummyReducer = {};
        const store = configureStore({
        reducer: {
            ingredients: ingredientsReducer,
            auth: () => dummyAuthState,
            authUser: () => dummyAuthUserState,
            feeds: () => dummyFeedsState,
            userOrder: () => dummyUserOrderState,
        },
        preloadedState: {
            ingredients: {
            ...dummyIngredientsState,
            ingredients: initalIngredientsState
            },
        }
        });

        const result = selectIngredientById("1")(store.getState());
        expect(result).toEqual(initalIngredientsState[0]);
    })
})