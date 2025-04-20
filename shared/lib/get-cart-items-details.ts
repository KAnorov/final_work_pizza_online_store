import { mapPizzaType, PizzaSize, PizzaType } from "../constants/pizza";
import { CartStateItem } from "./get-cart-details";

export const getCartItemDetails = (
    ingredients: CartStateItem['ingredients'],
    pizzaType?: PizzaType,
    pizzaSize?: PizzaSize,
) : string => {
    const details = [];
    if (pizzaSize && pizzaType) {
     const typeName = mapPizzaType[pizzaType];
     details.push(`${typeName} ${pizzaSize} см`);
    }
    if (ingredients) {
     // details.push(`Ингредиенты: ${ingredients.map(i => i.name).join(', ')}`);
     details.push(...ingredients.map(i => i.name));
    }

    return details.join(', ');
}