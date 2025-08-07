import * as api from '@api'; 
import { configureStore } from "@reduxjs/toolkit";
import { feedsReducer, getFeeds } from '../src/services/features/feeds/feeds';
import { EMPTY_FEEDS } from '../src/constants/constants';

jest.mock('@api'); 

describe('feeds reduser', () => {
    
    test('getFeeds resolve', async () => {
        const initalState = {
            orders: [
                {
                    _id: "1",
                    status: 'test',
                    name: 'test',
                    createdAt: 'test',
                    updatedAt: 'test',
                    number: 1,
                    ingredients: ["1", "2", "1"],
                }
            ],
            total: 10,
            totalToday: 1,
        };

        ;(api.getFeedsApi as jest.Mock).mockReturnValue(initalState);

        const store = configureStore({
            reducer: { feeds: feedsReducer }
        });

        await store.dispatch(getFeeds());

        const state = store.getState().feeds;

        expect(api.getFeedsApi).toHaveBeenCalled();
        expect(state.feeds).toEqual(initalState);
        expect(state.statuses.isGetFeedsPending).toBe(false);
    })

    test('getFeeds reject', async () => {
        const expectErr = {message: "Faild"};
        ;(api.getFeedsApi as jest.Mock).mockImplementation(() => Promise.reject(expectErr))

        const store = configureStore({
            reducer: { feeds: feedsReducer }
        });

        await store.dispatch(getFeeds());

        const state = store.getState().feeds;

        expect(api.getFeedsApi).toHaveBeenCalled();
        expect(state.feeds).toEqual(EMPTY_FEEDS);
        expect(state.errors.getFeedsError).toEqual(expectErr);
        expect(state.statuses.isGetFeedsPending).toBe(false);
    })

})