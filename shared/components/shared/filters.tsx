"use client";

import { RangeSlider, Title } from ".";
import { Input } from "../ui";
import { CheckboxFiltersGroup } from "./checkbox-filters-group";
import { useIngredients, useQueryFilters, useFilters } from "@/shared/hooks";


interface Props {
    className?: string;

}

export const Filters: React.FC<Props> = ({ className }) => {
    const { ingredients, loading } = useIngredients();
    const filters = useFilters();
    const updatePrices = (prices: number[]) => {
        filters.setPrices('priceForm', prices[0]);
        filters.setPrices('priceTo', prices[1]);
    };


    useQueryFilters(filters);

    const
        items = ingredients.map(item => ({ value: String(item.id), text: item.name }));




    return <>
        <div className={className}>
            <Title text='Фильтрация' size="sm" className="mb-5 font-bold " />

            {/* Верхние чекбоксы */}

            <CheckboxFiltersGroup
                name=""
                title="Типы пиццы"
                className="mb-5"
                onClickCheckbox={filters.setPizzaTypes}
                selected={filters.pizzaTypes}
                items={[
                    { text: 'Тонкое тесто', value: '1' },
                    { text: 'Традиционное', value: '2' },
                ]}
            />


            <CheckboxFiltersGroup
                title="Размеры"
                name="sizes"
                className="mt-5"
                onClickCheckbox={filters.setSizes}
                selected={filters.sizes}
                // loading={loading}
                items={[
                    { text: '20 см', value: '20' },
                    { text: '30 см', value: '30' },
                    { text: '40 см', value: '40' }
                ]}
            />


            {/* Фильтер цен */}
            <div className="mt-5 border-y border-y-neutral-100 py-6 pb-7 cursor-pointer">
                <p className="font-bold mb-3">Цена от до:</p>
                <div className="flex gap-3 mb-5">
                    <Input
                        type="number"
                        placeholder="0"
                        min={0} max={1000}
                        value={String(filters.prices.priceForm)}
                        onChange={e => filters.setPrices('priceForm', Number(e.target.value))} />
                    <Input
                        type="number"
                        min={100}
                        max={1000}
                        placeholder="1000"
                        value={String(filters.prices.priceTo)}
                        onChange={e => filters.setPrices('priceTo', Number(e.target.value))} />
                </div>
                <RangeSlider min={0} max={1000} step={10} value={[filters.prices.priceForm || 0, filters.prices.priceTo || 1000]}
                    onValueChange={updatePrices} />


            </div>
            <CheckboxFiltersGroup
                name="ingredients"
                title="Ингридиенты"
                className="mt-5"
                limit={6}
                defaultItems={items.slice(0, 6)}
                items={items}
                loading={loading}
                onClickCheckbox={filters.setSelectedIngredients}
                selected={filters.ingredients}
            />
        </div>

    </>

}