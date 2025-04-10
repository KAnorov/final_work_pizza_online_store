
import { cn } from "@/shared/lib/utils";
import { Title } from "./title";
import { Button } from "../ui";
import { PizzaImage } from "./pizza-image";
import { GroupVariants } from "./group-variants";
import { mapPizzaType, PizzaSize, pizzaSizes, PizzaType, pizzaTypes } from "@/shared/constants/pizza";
import React from "react";
import { Ingredient, ProductItem } from "@prisma/client";
import { IngredientItem } from "./ingredient-item";
import { useSet } from "react-use";


interface Props {
    className?: string;
    name?: string;
    imgeUrl: string;
    ingredients: Ingredient[];
    items: ProductItem[];
    onClickAddCart?: VoidFunction;
}

export const ChoosePizzaForm: React.FC<Props> = ({ className, name, imgeUrl, ingredients, items, onClickAddCart }) => {
    const [size, setSize] = React.useState<PizzaSize>(20);
    const [type, setType] = React.useState<PizzaType>(1);
    const [selectedIngredients, { toggle: addIngredient }] = useSet(new Set<number>([]));
    const pizzaPrice = items.find((item) => item.pizzaType === type && item.size === size)?.price || 0;
    const totolIngtedientsPrice = ingredients
        .filter((ingredient) => selectedIngredients.has(ingredient.id))
        .reduce((sum, ingredient) => sum + ingredient.price, 0);

    const totalPrice = pizzaPrice + totolIngtedientsPrice;
    const textDetals = `${size} см, ${mapPizzaType[type]} тесто = ${totalPrice} руб.`;
    const handeleClickAdd = () => {
        onClickAddCart?.();
        alert(`Вы добавили пиццу ${name} в корзину`);
        console.log("Вы добавили пиццу в корзину", {
            size,
            type,
            ingredients: selectedIngredients
        });
    };

    const filteredPizzasByType = items.filter((item) => item.pizzaType === type);
    const availablePizzas = pizzaSizes.map((item) => ({
        name: item.name,
        value: item.value,
        disabled: !filteredPizzasByType.some((pizza) => Number(pizza.size) === Number(item.value))

    }));

    React.useEffect(() => {
        const
            isDisabledSize = availablePizzas
                ?.find((item) => !item.disabled),

            currentSize = availablePizzas
                ?.find((item) => item.value === String(size) && !item.disabled);

        if (!currentSize && isDisabledSize) {
            setSize(Number(isDisabledSize.value) as PizzaSize);
        }
    }, [type])

    return <>
        <div className={cn(className, "flex flex-1")}>

            <PizzaImage imageUrl={imgeUrl} size={size} />
            <div className="w-[490px] bg-[#f7f6f5] p-7">
                <Title text={name} size="md" className="font-extrabold mb-1" />
                <p className="text-gray-400">{textDetals}</p>

                <div className="flex flex-col gap-5 mt-7">
                    <GroupVariants
                        items={availablePizzas}
                        value={String(size)}
                        onClick={value => setSize(Number(value) as PizzaSize)}
                    />
                    <GroupVariants
                        items={pizzaTypes}
                        value={String(type)}
                        onClick={value => setType(Number(value) as PizzaType)}
                    />
                </div>
                <div className="mt-7 bg-gray-50 p-5 rounded-md h-[420px] overflow-auto scrollbar">
                    <div className="grid grid-cols-3 gap-3">
                        {ingredients.map((ingredient) => (

                            <IngredientItem
                                key={ingredient.id}
                                name={ingredient.name}
                                price={ingredient.price}
                                imageUrl={ingredient.imageUrl}
                                onClick={() => addIngredient(ingredient.id)}
                                active={selectedIngredients.has(ingredient.id)}

                            />
                        ))}
                    </div>
                </div>

                <Button
                    className="h-[55px] px-10 text-base rounded-[18px] w-full mt-10"
                    onClick={handeleClickAdd}
                >
                    Добавить в корзину за {totalPrice} рублей.
                </Button>
            </div>
        </div>
    </>
}