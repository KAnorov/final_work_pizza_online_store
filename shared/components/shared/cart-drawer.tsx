'use client';

import { cn } from "@/shared/lib/utils";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui";
import { CartDrawerItem } from "./cart-drawer-item";
import { getCartItemDetails } from "@/shared/lib";
import { useCartStore } from "@/shared/store/cart";
import { useEffect, useState } from "react";
import { PizzaSize, PizzaType } from "@/shared/constants/pizza";
import Image from "next/image";
import { Title } from "./title";

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
            <SheetTrigger asChild>
                <div>{children}</div>
            </SheetTrigger>
            <SheetContent side="right" className={cn('flex flex-col justify-between pb-0 bg-[#F4F1EE]', className)}>
                <SheetHeader >
                    <SheetTitle className="text-3xl font-bold">Корзина</SheetTitle>
                </SheetHeader>
                
                <div className={cn('flex flex-col h-full', !totalAmount && 'justify-center')}>
                    {totalAmount > 0 && (
                        <div className="mb-4">
                            <p className="text-sm text-muted-foreground">
                                В корзине <span className="font-bold">{items.length} товара</span>
                            </p>
                        </div>
                    )}

                    {!totalAmount ? (
                        <div className="flex flex-col items-center justify-end w-72 mx-auto">
                            <Image src="/empty-box.png" alt="Empty cart" width={120} height={120} />
                            <Title size="sm" text="Корзина пустая" className="text-center font-bold my-2" />
                            <p className="text-center text-neutral-500 mb-5">
                                Добавьте хотя бы один продукт, чтобы совершить заказ
                            </p>

                          
                            <SheetClose asChild >
                                <Button variant="outline" className="w-56 h-12 text-base  cursor-pointer" size="lg">
                                    <ArrowLeft className="w-5 mr-2 " />
                                    Вернуться назад
                                </Button>
                            </SheetClose>
                        </div>
                    ) : (
                        <>
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
                                    <Link href="/cart" >
                                        <Button className="w-full h-12 text-base" type="submit">
                                            Оформить заказ
                                            <ArrowRight className="w-5 ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            </SheetFooter>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};