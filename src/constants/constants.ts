import { OrderBurger, TIngredient, TUser } from '@utils-types';
import { TFeeds } from '../services/features/feeds/feeds';
import { v4 as uuidv4 } from 'uuid';
export const EMPTY_USER: TUser = {
  email: '',
  name: ''
};

export const EMPTY_FEEDS: TFeeds = {
  orders: [],
  total: 0,
  totalToday: 0
};

export const EMPTY_INGREDIENT: TIngredient = {
  _id: '',
  name: '',
  type: 'bun',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 0,
  image: '',
  image_large: '',
  image_mobile: ''
};

export const EMPTY_ORDER: OrderBurger = {
  ingredients: []
};
