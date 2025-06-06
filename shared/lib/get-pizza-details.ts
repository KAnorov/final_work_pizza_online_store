import { Ingredient, ProductItem } from "@prisma/client"
import { calcTotalPizzaPrice } from "./calc-total-pizza-price";
import { mapPizzaType, PizzaSize, PizzaType } from "../constants/pizza";

export const getPizzaDetails = ( // получаем информацию о выбранной пицце
    type: PizzaType,
    size: PizzaSize,
    items: ProductItem[],
    ingredients: Ingredient[],
    selectedIngredients: Set<number>
) => {
    const totalPrice = calcTotalPizzaPrice(type, size, items, ingredients, selectedIngredients);
    const textDetails = `${size} см, ${mapPizzaType[type]} тесто = ${totalPrice} руб.`;

    return {
        totalPrice,
        textDetails
    }
}