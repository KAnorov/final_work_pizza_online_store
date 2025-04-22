import { cn } from "@/shared/lib/utils";
import { Title } from "./title";
import { Button } from "../ui";

interface Props {
    className?: string;
    name: string;
    price: number;
    imageUrl: string;
    onSubmit?: VoidFunction;
    loading?: boolean;
}
/**  * Форма для выбора ПРОДУКТА в корзине.*/

export const ChooseProductForm: React.FC<Props> = ({ className, name, imageUrl, onSubmit, price, loading }) => {

    return <>
        <div className={cn(className, "flex flex-1")}>

            <div className="flex items-center justify-center flex-1 relative w-full">
                <img
                    src={imageUrl}
                    alt={name}
                    className="relative left-2 top-2 transition-all z-10 duration-300 w-[400px] h-[400px]"
                />

            </div>


            <div className="w-[490px] bg-[#f7f6f5] p-7">
                <Title text={name} size="md" className="font-extrabold mb-1" />
                

                <Button
                loading={loading}
                onClick={() => onSubmit?.()}
                    className="h-[55px] px-10 text-base rounded-[18px] w-full mt-10"
                >
                    Добавить в корзину за {price} ₽.
                </Button>
            </div>
        </div>
    </>
}