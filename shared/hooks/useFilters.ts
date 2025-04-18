import { useSearchParams } from "next/navigation";
import { useSet } from "react-use";
import { useState } from "react";

interface PriceProps {
    priceForm?: number;
    priceTo?: number;

}

interface QueryFilters extends PriceProps {
    pizzaTypes?: string;
    sizes?: string;
    ingredients?: string;


}

export interface Filters {
    sizes: Set<string>;
    pizzaTypes: Set<string>;
    ingredients: Set<string>;
    prices: PriceProps;
}

interface ReturnProps extends Filters {
    setPrices: (name: keyof PriceProps, value: number) => void;
    setPizzaTypes: (value: string) => void;
    setSizes: (value: string) => void;
    setSelectedIngredients: (value: string) => void;

}


export const useFilters = (): ReturnProps => {
    const searchParams = useSearchParams() as unknown as Map<keyof QueryFilters, string>;

    // Фильтр ингредиентов
    const [ingredients, { toggle: toggleIngredients }] = useSet(
        new Set<string>(searchParams.get('ingredients')?.split(',') || [])
    );

    // Фильтр размеров
    const [sizes, { toggle: toggleSizes }] = useSet(
        new Set<string>(searchParams.get('sizes')?.split(',') || [])
    );

    // Фильтр типа пиццы
    const [pizzaTypes, { toggle: togglePizzaTypes }] = useSet(
        new Set<string>(searchParams.get('pizzaTypes')?.split(',') || [])
    );

    // Фильтр стоимости
    const [prices, setPrices] = useState<PriceProps>({
        priceForm: Number(searchParams.get('priceForm')) || undefined,
        priceTo: Number(searchParams.get('priceTo')) || undefined,
    });

    const updatePrice = (name: keyof PriceProps, value : number) => {
        setPrices((prev) => ({ 
            ...prev,
             [name]: value }));
    };

    return {
        sizes,
        pizzaTypes,
        ingredients,
        setSelectedIngredients: toggleIngredients,
        prices,
        setPrices: updatePrice,
        setPizzaTypes: togglePizzaTypes,
        setSizes: toggleSizes
    };
};