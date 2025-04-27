
import { prisma } from "@/prisma/prisma-client";



export const updateCartTotalAmount = async (token: string) => { // здесь мы получаем корзину по токену
    const userCart = await prisma.cart.findFirst({
        where: {
            token,
        },
        include: {
            items: {
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    productItem: {
                        include: {
                            product: true
                        },
                    },
                    ingredients: true
                },
            },
        },
    });

    if (!userCart) return 0;

 const validItems = userCart.items.filter(item => item.productItem.product !== null);
    const totalAmount = validItems.reduce((acc, item) => {
        return acc + calculateCartTotal({
            ...item,
            productItem: {
                ...item.productItem,
                product: item.productItem.product!
            }
        });
    }, 0);

    

    return await prisma.cart.update({
        where: {
            id: userCart.id,
        },
        data: {
            totalAmount,
        },
        include: {
            items: {
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    productItem: {
                        include: {
                            product: true,
                        },
                    },
                    ingredients: true,
                },
            },
        },
    });
}
