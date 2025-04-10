"use client"
import { cn } from "@/shared/lib/utils";
import { Title } from "./title";
import { ProductCard } from ".";
import { useIntersection } from 'react-use';
import { RefObject, useEffect, useRef } from "react";
import { useCategoryStore } from "@/shared/store/category";

interface Product {
    id: number;
    name: string;
    imageUrl: string;
    variant: Array<{ price: number }>;
}
interface Props {
    title: string;
    items: Product[];
    categoryId: number;
    className?: string;
    listClassName?: string;
}

export const ProductsGroupList: React.FC<Props> = ({
    title,
    items,
    categoryId,
    className,
    listClassName
}) => {
    const
        setActiveCategoryId = useCategoryStore((state) => state.setActiveId),
        intersectionRef = useRef<HTMLDivElement>(null),
        intersection = useIntersection(intersectionRef as RefObject<HTMLElement>, { threshold: 0.4, rootMargin: '0px 0px -50% 0px' });

    useEffect(() => {
        if (intersection?.isIntersecting) {
            setActiveCategoryId(categoryId);
        }
    }, [categoryId, intersection?.isIntersecting, title])

    return (
        <div className={className} id={title} ref={intersectionRef}>
            <Title text={title} size="lg" className="font-extrabold mb-5" />
            <div className={cn('grid grid-cols-3 gap-[50px]', listClassName)}>

                {items.map((product) => {
                    return (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            imageUrl={product.imageUrl}
                            price={product.variant[0]?.price ?? 0}
                        />
                    );
                })}
            </div>
        </div>
    );
}