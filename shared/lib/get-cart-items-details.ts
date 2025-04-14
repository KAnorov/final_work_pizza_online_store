import { Ingredient } from "@prisma/client";
import { mapPizzaType, PizzaSize, PizzaType } from "../constants/pizza";

export const getCartItemDetails = (
    pizzaType: PizzaType,
    pizzaSize: PizzaSize,
    ingredients: Ingredient[]
) => {
    const details = [];
    if (pizzaSize && pizzaType) {
     const typeName = mapPizzaType[pizzaType];
     details.push(`Размер: ${typeName}, диаметр: ${pizzaSize} см`);
    }
    if (ingredients) {
     // details.push(`Ингредиенты: ${ingredients.map(i => i.name).join(', ')}`);
     details.push(...ingredients.map(i => i.name));
    }

    return details.join(', ');
}