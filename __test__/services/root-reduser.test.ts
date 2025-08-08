import { combineSlices } from "@reduxjs/toolkit";
import { authUserReducer } from "../../src/services/features/auth-user/auth-user";
import { authReducer } from "../../src/services/features/auth/auth";
import { feedsReducer } from "../../src/services/features/feeds/feeds";
import { ingredientsReducer } from "../../src/services/features/ingredients/ingredients";
import { userOrderReducer } from "../../src/services/features/user-order/user-order";
import { EMPTY_FEEDS, EMPTY_ORDER, EMPTY_USER } from "../../src/constants/constants";
import { dummyAuthState, dummyAuthUserState, dummyFeedsState, dummyIngredientsState, dummyUserOrderState } from "../constants";

const rootReducer = combineSlices({
  auth: authReducer,
  authUser: authUserReducer,
  feeds: feedsReducer,
  ingredients: ingredientsReducer,
  userOrder: userOrderReducer
});

describe('rootReducer', () => {
  test('test redusers inital state', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });

    expect(state).toEqual({
      auth: dummyAuthState,
      authUser: dummyAuthUserState,
      feeds: dummyFeedsState,
      ingredients: dummyIngredientsState,
      userOrder: dummyUserOrderState,
    });
  });
});