import { EMPTY_FEEDS, EMPTY_ORDER, EMPTY_USER } from "../src/constants/constants";
import { TAuthUserSlice } from "../src/services/features/auth-user/auth-user";
import { TAuthSlice } from "../src/services/features/auth/auth";
import { TFeedsUserSlice } from "../src/services/features/feeds/feeds";
import { TIngredientsSlice } from "../src/services/features/ingredients/ingredients";
import { TUserOrderSlice } from "../src/services/features/user-order/user-order";

export const dummyAuthState: TAuthSlice = {
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

export const dummyAuthUserState: TAuthUserSlice = {
    user: EMPTY_USER,
    orders: [],
    isOrdersReceived: false,
    errors: {},
    statuses: {
        isGetUserPending: false,
        isUpdateUserPending: false,
        isGetOrdersPending: false,
    }
};

export const dummyFeedsState: TFeedsUserSlice = {
    feeds: EMPTY_FEEDS,
    errors: {},
    statuses: {
    isGetFeedsPending: false
    }
};

export const dummyUserOrderState: TUserOrderSlice = {
    orderData: EMPTY_ORDER,
    errors: {},
    statuses: {
        isCreateOrderPending: false
    }
};

export const dummyIngredientsState: TIngredientsSlice = {
    ingredients: [],
    errors: {},
    statuses: {
        isGetIngredientsPending: false
    }
}