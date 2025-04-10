'use client';

import { useState } from "react";
import { Input, Skeleton } from "../ui";
import { FilterChecboxProps, FilterCheckbox } from "./filter-checkbox";


type Item = FilterChecboxProps;

interface Props {
    title: string;
    items: Item[];
    defaultItems?: Item[];
    limit?: number;
    loading?: boolean,
    searchInputPlaceholder?: string;
    onClickCheckbox?: (id: string) => void;
    defaultValue?: string[];
    selected?: Set<string>;
    className?: string;
    name?: string;

}


export const CheckboxFiltersGroup: React.FC<Props> = ({
    title,
    items,
    defaultItems,
    limit = 3,
    loading,
    searchInputPlaceholder = 'Поиск...',
    className,
    onClickCheckbox,
    selected,
    name
}) => {
    const
        [showAll, setShowAll] = useState(false),
        [searchValues, setSearchValues] = useState(''),
        list = showAll ? items.filter((item) => item.text.toLocaleLowerCase().includes(searchValues.toLocaleLowerCase())) : (defaultItems || items).slice(0, limit),
        onChengeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {

            setSearchValues(e.target.value);
        }

    if (loading) {
        return <>
            <div className={className}>
                <p className="font-bold mb-3">{title}</p>
                {
                    ...Array(limit)
                        .fill(0)
                        .map((_, index) => (
                            <Skeleton key={index} className="w-full h-9 mb-3 rounded-2xl" />
                        ))
                }
            </div>
        </>
    }

    return <>
        <div className={className}>
            <p className="font-bold mb-3">{title}</p>

            {showAll && <div className="mb-5">
                <Input onChange={onChengeSearchInput} placeholder={searchInputPlaceholder} className="bg-gray-50 border-none" />
            </div>
            }


            <div className="flex flex-col gap-4 max-h-96 pr-2 overflow-auto scrollbar ">
                {list.map((item) => <FilterCheckbox
                    key={String(item.value)}
                    text={item.text}
                    value={item.value}
                    endAdornment={item.endAdornment}
                    checked={selected?.has(item.value)}
                    onCheckedChange={() => onClickCheckbox?.(item.value)}
                    name={name}
                />
                )}
            </div>
            {items.length > limit &&
                <div className={showAll ? 'border-t-neutral-100 mt-4' : ''}>
                    <button onClick={() =>
                        setShowAll(!showAll)} className="text-primary mt-3 cursor-pointer">
                        {showAll ? 'Скрыть' : 'Показать все'}</button>
                </div>
            }


        </div>
    </>
}