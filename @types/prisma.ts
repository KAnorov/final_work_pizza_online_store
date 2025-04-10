import { Ingredient, Product, ProductItem } from "@prisma/client";

export type ProductWithRelations = Product & {
    variant: ProductItem[];
    ingredient: Ingredient[];
}