
import { prisma } from "@/prisma/prisma-client";
import { findOrCreateCart } from "@/shared/lib";
import { updateCartTotalAmount } from "@/shared/lib/update-cart-total-amount";
import { CreateCartItemValues } from "@/shared/services/dto/cart.dto";
import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto';
export async function GET(req: NextRequest) { // получаем корзину пользователя
    try {
        const token = req.cookies.get("cartToken")?.value;
        if (!token) return NextResponse.json({ totalAmount: 0, items: [] });

        const userCart = await prisma.cart.findFirst({
            where: {
                OR: [{ token }]
            },
            include: {
                items: {
                    orderBy: { createdAt: "desc" },
                    include: {
                        productItem: { include: { product: true } },
                        ingredients: true
                    }

                }
            }
        });
        return NextResponse.json(userCart);
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "error" })
    }
}

export async function POST(req: NextRequest) {// добавляем товар в корзину
    try {
        let token = req.cookies.get("cartToken")?.value; // получаем токен корзины пользователя из куков
        if (!token) return token = crypto.randomUUID();// если нет токена создаем новый токен

        const userCart = await findOrCreateCart(token); // Получаем или создаем корзину пользователя

        const data = (await req.json()) as CreateCartItemValues;

        const findCartItem = await prisma.cartItem.findFirst({// проверяем есть ли уже такой товар в корзине
            where: {
                cartId: userCart.id, // фильтруем по ид корзины и товару
                productItemId: data.productItemId,// фильтруем по ид товара
                ingredients: {    // фильтруем по ингредиентам
                    every: {      // проверяем все ингредиенты
                        id: { in: data.ingredients },
                    },
                },
            },
        });

        // Обновляем количество товара в корзине, если он уже есть в корзине, иначе создаем новый товар в корзине
        if (findCartItem) {
            await prisma.cartItem.update({// обновляем количество товара в корзине
                where: { id: findCartItem.id }, // фильтруем по ид корзины и товара
                data: { quantity: findCartItem.quantity + 1 }, // увеличиваем количество товара на 1
            });
        } else {
            await prisma.cartItem.create({// создаем новый товар в корзине
                data: {
                    cartId: userCart.id, // ид корзины
                    productItemId: data.productItemId, // ид товара
                    quantity: 1, // количество товара
                    ingredients: { connect: data.ingredients?.map((id) => ({ id })) }, // связываем ингредиенты с товаром
                },
            });
        }
        const updatedUserCart = await updateCartTotalAmount(token); // Обновляем общую сумму корзины

        const resp = NextResponse.json(updatedUserCart); // Отправляем ответ клиенту с обновленной корзиной и токеном корзины
        resp.cookies.set('cartToken', token);// Устанавливаем куку с обновленным токеном корзины на клиенте
        return resp; 

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Не удалось создать корзину' }, { status: 500 })
    }
}
