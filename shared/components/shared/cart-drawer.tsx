'use client';

import { cn } from "@/shared/lib/utils";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui";
import { CartDrawerItem } from "./cart-drawer-item";
import { getCartItemDetails } from "@/shared/lib";

interface Props {
    className?: string;
}
export const CartDrawer: React.FC<React.PropsWithChildren<Props>> = ({ children, className }) => {
    return <>
        <Sheet>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent side="right" className={cn('flex flex-col justify-between pb-0 bg-[#F4F1EE]', className)}>
                <SheetHeader>
                    <SheetTitle>
                        В корзине <span className="font-bold"> 3 товара</span>
                    </SheetTitle>
                </SheetHeader>

                <div className=" overflow-auto scrollbar flex-1">
                    <div className="mb-2">
                        <CartDrawerItem
                            id={1}
                            imageUrl={"https://media.dodostatic.net/image/r:292x292/11ee7d610d2925109ab2e1c92cc5383c.avif"}
                            details={getCartItemDetails(2, 30, [{ name: 'Цыпленок' }, { name: 'Сыр' }])}
                            name={"Чоризо фреш"}
                            price={307}
                            quantity={1} />
                    </div>
                
                </div>

                <SheetFooter className="w-full bg-white p-8">
                    <div className="w-full">
                        <div className="flex mb-4">
                            <span className="flex flex-1 text-lg text-neutral-500">Итого:
                                <div className="flex-1 border-b border-dashed border-gray-200 relative top-1 mx-2"></div>
                            </span>
                            <span className="font-bold text-lg">3000 ₽</span>
                        </div>
                        <Link href="/cart">
                            <Button
                                className="w-full h-12 text-base"
                                // onClick={() => setRedirecting(true)}
                                // loading={loading || redirecting}
                                type="submit"
                            >
                                Оформить заказ
                                <ArrowRight className="w-5 ml-2" />
                            </Button>
                        </Link>
                    </div>

                </SheetFooter>

            </SheetContent>
        </Sheet>
    </>
}