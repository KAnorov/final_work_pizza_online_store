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
    name?: string;
    imgeUrl: string;
    ingredients: Ingredient[];
    items: ProductItem[];
    onClickAddCart?: VoidFunction;
}

export const ChoosePizzaForm: React.FC<Props> = ({ className, name, imgeUrl, ingredients, items, onClickAddCart }) => {
  
    const {size, type, selectedIngredients, availableSize, addIngredient, setSize, setType} = usePizzaOptions(items);
    const {totalPrice, textDetails} = getPizzaDetails(type, size, items, ingredients, selectedIngredients);
    const handeleClickAdd = () => {
        onClickAddCart?.();
        alert(`Вы добавили пиццу ${name} в корзину`);
        console.log("Вы добавили пиццу в корзину", {
            size,
            type,
            ingredients: selectedIngredients
        });
    };
    
    return <>
        <div className={cn(className, "flex flex-1")}>

            <PizzaImage imageUrl={imgeUrl} size={size} />
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
                    className="h-[55px] px-10 text-base rounded-[18px] w-full mt-10"
                    onClick={handeleClickAdd}
                >
                    Добавить в корзину за {totalPrice} рублей.
                </Button>
            </div>
        </div>
    </>
}