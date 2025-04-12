import { Api } from "@/shared/services/api-client";
import { Ingredient } from "@prisma/client";
import { useEffect, useState, useCallback } from "react";

export const useIngredients = () => {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchIngredients = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const ingredients = await Api.ingredients.getAll();
            setIngredients(ingredients);
        } catch (err) {
            console.error('Failed to fetch ingredients:', err);
            setError(err instanceof Error ? err : new Error('Failed to fetch ingredients'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchIngredients();
    }, [fetchIngredients]);

    return { 
        ingredients, 
        loading, 
        error,
        refetch: fetchIngredients
    };
};