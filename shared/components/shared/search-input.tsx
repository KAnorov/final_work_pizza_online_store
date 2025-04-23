'use client'

import { cn } from "@/shared/lib/utils";
import { Api } from "@/shared/services/api-client";
import { Product } from "@prisma/client";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { useClickAway, useDebounce } from "react-use";



interface Props {
    className?: string;
}

export const SearchInput = ({ className }: Props) => {

    const
        [focused, setFocused] = useState(false),
        [searchQuery, setSearchQuery] = useState(''),
        [products, setProducts] = useState<Product[]>([]),
        ref = useRef(null);

    useClickAway(ref, () => setFocused(false));

    useDebounce( // вызов функции поиска через 250 мс после ввода символов
        async () => {
            try {
                const response = await Api.products.search(searchQuery);
                setProducts(response);
            } catch (error) {
                console.error(error);
            }
        }, 250, [searchQuery]);


    const onClickItem = () => { 
        setFocused(false); // убрать фокус на поиске
        setSearchQuery(''); // очистить поле поиска при выборе товара
    };

    return <>
        {focused && <div className="fixed top-0 left-0 bottom-0 right-0 bg-black/50 z-30" />}

        <div ref={ref}
            className={cn("flex rounded-2xl flex-1 justify-between relative h-11 z-30", className)}>
            <Search className="absolute top-1/2 translate-y-[-50%] left-3 h-5 text-gray-400" />
            <input
                className="rounded-2xl outline-none w-full bg-gray-100 pl-11"
                type="text"
                placeholder="Найти пиццу"
                onFocus={() => { 
                    setFocused(true)
                    if (searchQuery.trim()) {
                       Api.products.search(searchQuery) 
                       .then((data) => setProducts(data)) 
                    }
                    
                    ;}}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            {products.length > 0 && <div className={cn(
                'absolute w-full bg-white rounded-xl py-2 top-14 shadow-md transition-all duration-200 invisible opacity-0 z-30',
                focused && 'visible opacity-100 top-12'

            )}>

                {products.map((product) => ( // если фокус на поиске то показываем список товаров
                    <Link
                        onClick={onClickItem}
                        key={product.id}
                        className="flex items-center gap-1 w-full px-3 py-2 hover:bg-primary/10 cursor-pointer"
                        href={`/product/${product.id}`}>
                        <img
                            className="rounded h-7 w-7"
                            src={product.imageUrl}
                            alt={product.name}
                        />
                        <span>{product.name}</span>


                    </Link>
                ))}
            </div>}
        </div>



    </>


}