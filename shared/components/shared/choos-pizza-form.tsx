"use client";

import { cn } from "@/shared/lib/utils";
import { Title } from "./title";
import { Button } from "../ui";
import { PizzaImage } from "./pizza-image";
import { GroupVariants } from "./group-variants";
import { PizzaSize, PizzaType, pizzaTypes } from "@/shared/constants/pizza";
import React from "react";
import { Ingredient, ProductItem } from "@prisma/client";
import { IngredientItem } from "./ingredient-item";
import { usePizzaOptions } from "@/shared/hooks";
import { getPizzaDetails } from "@/shared/lib";

interface Props {
    className?: string;
    name: string;
    imageUrl: string;
    ingredients: Ingredient[];
    items: ProductItem[];
    loading?: boolean;
    onSubmit: (itemId: number, ingredients: number[]) => void;
}

/** 
 * Форма для выбора ПИЦЦЫ в корзине.
*/

export const ChoosePizzaForm: React.FC<Props> = ({ className, name, imageUrl, ingredients, items, loading, onSubmit }) => {

    const { size, type, selectedIngredients, availableSize, addIngredient, currentItemId, setSize, setType } = usePizzaOptions(items);
    const { totalPrice, textDetails } = getPizzaDetails(type, size, items, ingredients, selectedIngredients);
    const handeleClickAdd = () => {
        if (currentItemId) {
            onSubmit(currentItemId, Array.from(selectedIngredients));
        }

    };


    return <>
        <div className={cn(className, "flex flex-1")}>

            <PizzaImage imageUrl={imageUrl} size={size} />
            <div className="w-[490px] bg-[#f7f6f5] p-7">
                <Title text={name} size="md" className="font-extrabold mb-1" />
                <p className="text-gray-400">{textDetails}</p>

                <div className="flex flex-col gap-5 mt-7">
                    <GroupVariants
                        items={availableSize}
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
                    loading={loading}
                    className="h-[55px] px-10 text-base rounded-[18px] w-full mt-10"
                    onClick={handeleClickAdd}
                >
                    Добавить в корзину за {totalPrice} ₽.
                </Button>
            </div>
        </div>
    </>
}