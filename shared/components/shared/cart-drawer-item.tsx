import { cn } from "@/shared/lib/utils";
import * as CartItem from "@/shared/components/shared/cart-item-details";
import { CartItemProps } from "./cart-item-details/cart-item-details.types";
import { CountButton } from "./count-button";
import { Trash2Icon } from "lucide-react";

interface Props extends CartItemProps {
    className?: string;
}

export const CartDrawerItem: React.FC<Props> = ({ className, id, imageUrl, price, quantity, name, details }) => {
    return <>
        <div className={cn('flex bg-white p-5 gap-6', className)}>
        <CartItem.Image src={imageUrl} />

        <div className="flex-1">
            <CartItem.Info name={name} details={details} />
            <hr className="mt-3 mb-4" />

            <div className="flex justify-between items-center">
                <CountButton onClick={type => { console.log(type) }} value={quantity} />
                <div className="flex items-center gap-3">
                    <CartItem.Price value={price} />
                    <Trash2Icon
                        className="text-gray-400 cursor-pointer hover:text-gray-600"
                        size={16}
                    />
                </div>
            </div>

        </div>
        </div>
    </>
}