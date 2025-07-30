import { TIngredient } from "@utils-types";

export const filterIngredientsByType = (items: TIngredient[], type: string) => {
    return items.filter((item) => item.type === type);
}