import { useEffect } from "react";
import { Filters } from "./useFilters";
import { useRouter } from "next/navigation";
import QueryString from "qs";

export const useQueryFilters = (filters: Filters) => {
    const router = useRouter();
 useEffect(() => {
        const params = {
            ...filters.prices,
            pizzaTypes: Array.from(filters.pizzaTypes),
            sizes: Array.from(filters.sizes),
            ingredients: Array.from(filters.ingredients)
        };

        const query = QueryString.stringify(params, {
            arrayFormat: 'comma'
        });

        router.push(`?${query}`, { scroll: false });



    }, [filters, router]);
}