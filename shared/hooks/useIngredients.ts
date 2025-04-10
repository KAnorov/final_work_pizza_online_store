import { Api } from "@/shared/services/api-client";
import { Ingredient } from "@prisma/client";
import { useEffect, useState } from "react";

export const useIngredients = () => {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]),
    [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchIterIngredients() {
            try {
                setLoading(true);
                const
                    ingredients = await Api.ingredients.getAll();
                setIngredients(ingredients);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchIterIngredients();
    }, []);

    return { ingredients, loading };
} 