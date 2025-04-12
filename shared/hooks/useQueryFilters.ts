import { useEffect, useCallback } from "react";
import { Filters } from "./useFilters";
import { useRouter, useSearchParams } from "next/navigation";
import QueryString from "qs";

export const useQueryFilters = (filters: Filters) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const updateQuery = useCallback(() => {
        // Проверяем, есть ли реальные изменения в фильтрах
        const currentParams = QueryString.parse(searchParams.toString());
        const newParams = {
            ...filters.prices,
            pizzaTypes: Array.from(filters.pizzaTypes),
            sizes: Array.from(filters.sizes),
            ingredients: Array.from(filters.ingredients)
        };

        // Сравниваем текущие и новые параметры
        if (QueryString.stringify(currentParams) !== QueryString.stringify(newParams)) {
            const query = QueryString.stringify(newParams, {
                arrayFormat: 'comma',
                skipNulls: true, // Пропускаем null/undefined значения
                addQueryPrefix: true // Добавляет "?" автоматически
            });

            router.push(query, { scroll: false });
        }
    }, [filters, router, searchParams]);

    useEffect(() => {
        updateQuery();
    }, [updateQuery]);
};