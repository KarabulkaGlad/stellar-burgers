import { asyncThunkCreator, buildCreateSlice, SerializedError } from "@reduxjs/toolkit";
import { logoutUser } from "../auth/auth";
import { getIngredientsApi } from "@api";
import { TIngredient } from "@utils-types";

const createSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});


type TIngredientsSlice = {
    ingredients: TIngredient[]
    errors: {
        getIngredientsError?: SerializedError;
    };
    statuses: {
        isGetIngredientsPending: boolean;
    };
}

const initialState: TIngredientsSlice = {
    ingredients: [],
    errors: {},
    statuses: {
        isGetIngredientsPending: false,
    }
}

const ingredientsSlice = createSlice({
    name: 'ingredients',
    initialState,
    reducers: (create) => ({
        getIngredients: create.asyncThunk<void, TIngredient[]>(async () => getIngredientsApi(),
        {
            pending: (state) => {
                state.errors.getIngredientsError = undefined;
                state.statuses.isGetIngredientsPending = true;
            },
            rejected: (state, action) => {
                state.errors.getIngredientsError = action.error;
                state.statuses.isGetIngredientsPending = false;
            },
            fulfilled: (state, action) => {
                state.ingredients = action.payload;
                state.statuses.isGetIngredientsPending = false;
            }
        }),
    }), // потом по необходимости добавлю ещё redusers
    extraReducers: (builder) => {
        builder
        .addCase(logoutUser.fulfilled, () => initialState);
    },
    selectors: {
        selectIngredients: (store) => store.ingredients,
        selectErrors: (store) => store.errors,
        selectStatuses: (store) => store.statuses,
    }
});

export const { getIngredients } = ingredientsSlice.actions;
export const { selectIngredients, selectErrors: selectErrorsIngredients, selectStatuses: selectStatusesIngredients} = ingredientsSlice.selectors;
export const ingredientsReducer = ingredientsSlice.reducer;

