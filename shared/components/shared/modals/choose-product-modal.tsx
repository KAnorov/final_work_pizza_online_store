'use client';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/components/ui/dialog";
import { cn } from "@/shared/lib/utils";
import { useRouter } from "next/navigation";
import { ChooseProductForm } from "../choose-product-form";
import { ProductWithRelations } from "@/@types/prisma";
import { ChoosePizzaForm } from "../choos-pizza-form";
import { useCartStore } from "@/shared/store/cart";
import toast from "react-hot-toast";


interface Props {
    product: ProductWithRelations;
    className?: string;
}


export const ChooseProductModal: React.FC<Props> = ({ product, className }) => {
    const router = useRouter();
    const firstItem = product.items[0];
    const isPizzaForm = Boolean(firstItem.pizzaType);
    const addCartItem = useCartStore((state) => state.addCartItem);
    const loading = useCartStore((state) => state.loading);

    const onAddProduct = async () => {
        await addCartItem({
            productItemId: firstItem.id,
        })
        toast.success(product.name + "  добавлен в корзину");
        router.back();
    };

    const onAddPizza = async (productItemId: number, ingredients: number[]) => {
        try {
            await addCartItem({
                productItemId,
                ingredients,
            });
            toast.success(product.name + " добавлена в корзину");
            router.back();
        } catch (error) {
            console.error(error);
            toast.error("Ошибка добавления в корзину");
        }
    };



    return <>

        <Dialog open={Boolean(product)} onOpenChange={() => router.back()}>
            <DialogContent className={cn("p-0 min-w-[1060px] min-h-[550px] bg-white overflow-hidden", className)}>
                <DialogTitle className="hidden"></DialogTitle>
                <DialogDescription className="hidden"></DialogDescription>
                {
                    isPizzaForm ? (
                        <ChoosePizzaForm
                            imageUrl={product.imageUrl}
                            name={product.name}
                            ingredients={product.ingredient}
                            items={product.items}
                            onSubmit={onAddPizza}
                            loading={loading}
                        />
                    ) : <ChooseProductForm
                        imageUrl={product.imageUrl}
                        name={product.name}
                        onSubmit={onAddProduct}
                        price={firstItem.price}
                        loading={loading}
                    />


                }
            </DialogContent>
        </Dialog>

    </>

}