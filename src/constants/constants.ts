import { TUser } from "@utils-types";
import { TFeeds } from "src/services/features/feeds/feeds";

export const EMPTY_USER: TUser = {
    email: "",
    name: ""
}

export const EMPTY_FEEDS: TFeeds = {
    orders: [],
    total: 0,
    totalToday: 0,
}
