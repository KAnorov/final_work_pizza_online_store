import { prisma } from "./prisma-client";
import { category, ingredients, products } from "./constants";
import { Prisma } from "@prisma/client";
import { hashSync } from "bcrypt";


const randomNumber = (min: number, max: number) => { // Функция для генерации случайного числа в заданном диапазоне от 10 до 1000
    return Math.floor(Math.random() * (max - min) * 10 + min * 10) / 10;
};
const generateProductItem = ({ // Функция для создания объекта продукта с параметрами productId, pizzaType и size
    productId,
    pizzaType,
    size,
}: {
    productId: number;
    pizzaType?: 1 | 2;
    size?: 20 | 30 | 40;
}) => {
    return {
        productId,
        price: randomNumber(190, 600),
        pizzaType,
        size,
    } as Prisma.ProductItemUncheckedCreateInput;
};


async function up() {

    await prisma.user.createMany({ data: [
        {
            fullName: "Anna",
            email: "user@project.com",
            password: hashSync("11111", 10),
            verified: new Date(),
            role: 'USER',
        },
        {
            fullName: "Kostya",
            email: "admin@project.com",
            password: hashSync("22222", 10),
            verified: new Date(),
            role: 'ADMIN',
        }
    ] });
    await prisma.category.createMany({ data: category });
    await prisma.ingredient.createMany({ data: ingredients });
    await prisma.product.createMany({ data: products });


    const pizza1 = await prisma.product.create({
        data: {
            name: "Пепперони фреш",
            imageUrl: "https://media.dodostatic.net/image/r:292x292/11ee7d612fc7b7fca5be822752bee1e5.avif",
            categoryId: 1,
            ingredient: {
                connect: ingredients.slice(0, 5)
            }
        }
    });

    const pizza2 = await prisma.product.create({
        data: {
            name: "Сырная",
            imageUrl: "https://media.dodostatic.net/image/r:292x292/11ee7d610d2925109ab2e1c92cc5383c.avif",
            categoryId: 1,
            ingredient: {
                connect: ingredients.slice(5, 10)
            }
        }
    });

    const pizza3 = await prisma.product.create({
        data: {
            name: "Чоризо фреш",
            imageUrl: "https://media.dodostatic.net/image/r:292x292/11ee7d61706d472f9a5d71eb94149304.avif",
            categoryId: 1,
            ingredient: {
                connect: ingredients.slice(10, 40)
            }
        }
    });

    await prisma.productItem.createMany({
        data: [
            // Пицца "Пепперони фреш"
            generateProductItem({ productId: pizza1.id, pizzaType: 1, size: 20 }),
            generateProductItem({ productId: pizza1.id, pizzaType: 2, size: 30 }),
            generateProductItem({ productId: pizza1.id, pizzaType: 2, size: 40 }),

            // Пицца "Сырная"
            generateProductItem({ productId: pizza2.id, pizzaType: 1, size: 20 }),
            generateProductItem({ productId: pizza2.id, pizzaType: 1, size: 30 }),
            generateProductItem({ productId: pizza2.id, pizzaType: 1, size: 40 }),
            generateProductItem({ productId: pizza2.id, pizzaType: 2, size: 20 }),
            generateProductItem({ productId: pizza2.id, pizzaType: 2, size: 30 }),
            generateProductItem({ productId: pizza2.id, pizzaType: 2, size: 40 }),

            // Пицца "Чоризо фреш"
            generateProductItem({ productId: pizza3.id, pizzaType: 1, size: 20 }),
            generateProductItem({ productId: pizza3.id, pizzaType: 2, size: 30 }),
            generateProductItem({ productId: pizza3.id, pizzaType: 2, size: 40 }),

            // Остальные продукты
            generateProductItem({ productId: 1 }),
            generateProductItem({ productId: 2 }),
            generateProductItem({ productId: 3 }),
            generateProductItem({ productId: 4 }),
            generateProductItem({ productId: 5 }),
            generateProductItem({ productId: 6 }),
            generateProductItem({ productId: 7 }),
            generateProductItem({ productId: 8 }),
            generateProductItem({ productId: 9 }),
            generateProductItem({ productId: 10 }),
            generateProductItem({ productId: 11 }),
            generateProductItem({ productId: 12 }),
            generateProductItem({ productId: 13 }),
            generateProductItem({ productId: 14 }),
            generateProductItem({ productId: 15 }),
            generateProductItem({ productId: 16 }),
            generateProductItem({ productId: 17 })
        ]
    });

    await prisma.cart.createMany({
        data: [
            {
                userId: 1,
                totalAmount: 0,
                token: "11111",
            },
            {
                userId: 2,
                totalAmount: 0,
                token: "22222",
            }
        ]
    })

    await prisma.cartItem.create({
        data: {
                productItemId: 1,
                cartId: 1,
                quantity: 2,
                ingredients: {
                    connect: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
                }
            }
    })


};

async function down() {
    await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Cart" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "CartItem" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Ingredient" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "ProductItem" RESTART IDENTITY CASCADE`;
}


async function main() {
    try {
        await down();
        await up();
    } catch (er) {
        console.error(er);
    }
}
main()
    .then(async () =>
        await prisma.$disconnect()
    )
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    })
