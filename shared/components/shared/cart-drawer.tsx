'use client';

import { cn } from "@/shared/lib/utils";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui";
import { CartDrawerItem } from "./cart-drawer-item";
import { getCartItemDetails } from "@/shared/lib";
import { useCartStore } from "@/shared/store/cart";
import { useEffect, useState } from "react";
import { PizzaSize, PizzaType } from "@/shared/constants/pizza";

interface Props {
    className?: string;
}

export const CartDrawer: React.FC<React.PropsWithChildren<Props>> = ({ children, className }) => {
    const totalAmount = useCartStore((state) => state.totalAmount);
    const fetchCartItems = useCartStore((state) => state.fetchCartItems);
    const items = useCartStore((state) => state.items);
    const updateItemQuantity = useCartStore((state) => state.updateItemQuantity);
    const removeCartItem = useCartStore((state) => state.removeCartItem);
    const [loadingItemId, setLoadingItemId] = useState<number | null>(null);
    
    useEffect(() => {
        fetchCartItems();
    }, [fetchCartItems]);

    const onClickCountButton = async (id: number, quantity: number, type: 'plus' | 'minus') => {
        if (loadingItemId !== null) return; 
        
        const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;
        
        setLoadingItemId(id); 
        try {
            await updateItemQuantity(id, newQuantity); 
        } catch (error) {
            console.error("Ошибка при обновлении количества:", error);
        } finally {
            setLoadingItemId(null); 
        }
    };

    return (
        <Sheet>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent side="right" className={cn('flex flex-col justify-between pb-0 bg-[#F4F1EE]', className)}>
                <SheetHeader>
                    <SheetTitle>
                        В корзине <span className="font-bold">{items.length} товара</span>
                    </SheetTitle>
                </SheetHeader>

                <div className="overflow-auto scrollbar flex-1">
                    {items.map((item) => (
                        <div key={item.id} className="mb-2">
                            <CartDrawerItem
                                id={item.id}
                                imageUrl={item.imageUrl}
                                details={getCartItemDetails(
                                    item.ingredients,
                                    item.pizzaType as PizzaType,
                                    item.pizzaSize as PizzaSize,
                                )}
                                disabled={item.disabled}
                                name={item.name}
                                price={item.price}
                                quantity={item.quantity}
                                onClickCountButton={(type) => onClickCountButton(item.id, item.quantity, type)}
                                onClickRemove={() => removeCartItem(item.id)}
                                isLoading={loadingItemId === item.id}
                            />
                        </div>
                    ))}
                </div>

                <SheetFooter className="w-full bg-white p-8">
                    <div className="w-full">
                        <div className="flex mb-4">
                            <span className="flex flex-1 text-lg text-neutral-500">
                                Итого:
                                <div className="flex-1 border-b border-dashed border-gray-200 relative top-1 mx-2"></div>
                            </span>
                            <span className="font-bold text-lg">{totalAmount} ₽</span>
                        </div>
                        <Link href="/cart">
                            <Button className="w-full h-12 text-base" type="submit">
                                Оформить заказ
                                <ArrowRight className="w-5 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};