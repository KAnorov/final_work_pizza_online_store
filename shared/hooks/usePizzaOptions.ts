import { useEffect, useState } from "react";
import { Variant } from "../components/shared/group-variants";
import { PizzaSize, PizzaType } from "../constants/pizza";
import { useSet } from "react-use";
import { getAvailablePizzaSizes } from "../lib";
import { ProductItem } from "@prisma/client";
import { it } from "node:test";


interface ReturnProps {
    size: PizzaSize;
    type: PizzaType;
    availableSize: Variant[];
    currentItemId?: number;
    setSize: (size: PizzaSize) => void;
    setType: (type: PizzaType) => void;
    selectedIngredients: Set<number>;
    addIngredient: (id: number) => void;
}

export const usePizzaOptions = (
    items: ProductItem[] ,
) : ReturnProps  => {

    const [size, setSize] = useState<PizzaSize>(20);
    const [type, setType] = useState<PizzaType>(1);
    const [selectedIngredients, { toggle: addIngredient }] = useSet(new Set<number>([]));
    const availableSize = getAvailablePizzaSizes(type, items);
    const currentItemId = items.find(item => item.pizzaType === type && item.size === size)?.id;

    useEffect(() => {
        const
            isDisabledSize = availableSize
                ?.find((item) => !item.disabled),

            currentSize = availableSize
                ?.find((item) => item.value === String(size) && !item.disabled);

        if (!currentSize && isDisabledSize) {
            setSize(Number(isDisabledSize.value) as PizzaSize);
        }
    }, [type])

    return {
        size,
        setSize,
        type,
        setType,
        selectedIngredients,
        addIngredient,
        availableSize,
        currentItemId
    }
}