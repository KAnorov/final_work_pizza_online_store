'use client';

import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { cn } from "@/shared/lib/utils";
import { useRouter } from "next/navigation";
import { ChooseProductForm } from "../choose-product-form";
import { ProductWithRelations } from "@/@types/prisma";
import { ChoosePizzaForm } from "../choos-pizza-form";


interface Props {
    product: ProductWithRelations;
    className?: string;
}


export const ChooseProductModal: React.FC<Props> = ({ product, className }) => {
    const router = useRouter();
    const isPizzaForm = Boolean(product.variant[0].pizzaType);

    return <>

        <Dialog open={Boolean(product)} onOpenChange={() => router.back()}>
            <DialogContent className={cn("p-0 min-w-[1060px] min-h-[550px] bg-white overflow-hidden", className)}>
                {
                    isPizzaForm ? (
                        <ChoosePizzaForm  
                        imgeUrl={product.imageUrl} 
                        name={product.name} 
                        ingredients={product.ingredient}
                        items={product.variant}
                         />
                    ) : <ChooseProductForm imgeUrl={product.imageUrl} name={product.name} />

                }
            </DialogContent>
        </Dialog>

    </>

}