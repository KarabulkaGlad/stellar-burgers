import { getFeedsApi, TFeedsResponse } from "@api";
import { asyncThunkCreator, buildCreateSlice, SerializedError } from "@reduxjs/toolkit";
import { EMPTY_FEEDS } from "src/constants/constants";
import { logoutUser } from "../auth/auth";

const createSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

export type TFeeds = Omit<TFeedsResponse, 'success'>;

type TFeedsUserSlice = {
    feeds: TFeeds;
    errors: {
        getFeedsError?: SerializedError;
    };
    statuses: {
        isGetFeedsPending: boolean;
    };
}

const initialState: TFeedsUserSlice = {
    feeds: EMPTY_FEEDS,
    errors: {},
    statuses: {
        isGetFeedsPending: false,
    }
}

const feedsSlice = createSlice({
    name: 'feeds',
    initialState,
    reducers: (create) => ({
        getFeeds: create.asyncThunk(async () => getFeedsApi(),
        {
            pending: (state) => {
                state.errors.getFeedsError = undefined;
                state.statuses.isGetFeedsPending = true;
            },
            rejected: (state, action) => {
                state.errors.getFeedsError = action.error;
                state.statuses.isGetFeedsPending = false;
            },
            fulfilled: (state, action) => {
                state.feeds = action.payload;
                state.statuses.isGetFeedsPending = false;
            }
        }),
    }), // потом по необходимости добавлю ещё redusers
    extraReducers: (builder) => {
        builder
        .addCase(logoutUser.fulfilled, () => initialState);
    },
    selectors: {
        selectFeeds: (store) => store.feeds,
        selectErrors: (store) => store.errors,
        selectStatuses: (store) => store.statuses,
    }
});

export const { getFeeds } = feedsSlice.actions;
export const { selectFeeds, selectErrors: selectErrorsFeeds, selectStatuses: selectStatusesFeeds} = feedsSlice.selectors;
export const feedsReduser = feedsSlice.reducer;

