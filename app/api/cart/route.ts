import { prisma } from "@/prisma/prisma-client";
import { findOrCreateCart } from "@/shared/lib";
import { updateCartTotalAmount } from "@/shared/lib/update-cart-total-amount";
import { CreateCartItemValues } from "@/shared/services/dto/cart.dto";
import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto';

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("cartToken")?.value;
        
        if (!token) {
            return NextResponse.json(
                { totalAmount: 0, items: [] },
                { status: 200 }
            );
        }
        
        const userCart = await prisma.cart.findFirst({
            where: { 
                OR: [{ token }] 
            },
            include: {
                items: {
                    orderBy: { createdAt: "desc" },
                    include: {
                        productItem: { 
                            include: { 
                                product: true 
                            } 
                        },
                        ingredients: true
                    }
                }
            }
        });
        
        return NextResponse.json(userCart || { totalAmount: 0, items: [] });
    } catch (error) {
        console.error('GET /api/cart error:', error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    let token: string;
    try {
        // Получаем или создаем токен корзины
        const existingToken = req.cookies.get("cartToken")?.value;
        
        if (!existingToken) {
            token = crypto.randomUUID();
            // Сразу создаем корзину с новым токеном
            await findOrCreateCart(token);
        } else {
            token = existingToken;
        }

        // Получаем данные о добавляемом товаре
        const data = await req.json() as CreateCartItemValues;
        
        // Находим корзину пользователя
        const userCart = await findOrCreateCart(token);
        
        // Проверяем, есть ли уже такой товар в корзине
        const findCartItem = await prisma.cartItem.findFirst({
            where: {
                cartId: userCart.id,
                productItemId: data.productItemId,
                ingredients: {
                    every: {
                        id: { in: data.ingredients },
                    },
                },
            },
        });

        // Обновляем или создаем товар в корзине
        if (findCartItem) {
            await prisma.cartItem.update({
                where: { id: findCartItem.id },
                data: { quantity: findCartItem.quantity + 1 },
            });
        } else {
            await prisma.cartItem.create({
                data: {
                    cartId: userCart.id,
                    productItemId: data.productItemId,
                    quantity: 1,
                    ingredients: { 
                        connect: data.ingredients?.map((id) => ({ id })) 
                    },
                },
            });
        }

        // Обновляем общую сумму корзины
        const updatedUserCart = await updateCartTotalAmount(token);
        
        // Создаем ответ с обновленной корзиной
        const response = NextResponse.json(updatedUserCart);
        
        // Устанавливаем cookie только если токен новый
        if (!existingToken) {
            response.cookies.set('cartToken', token, {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 30 // 30 дней
            });
        }
        
        return response;

    } catch (error) {
        console.error('POST /api/cart error:', error);
        return NextResponse.json(
            { message: 'Failed to update cart' },
            { status: 500 }
        );
    }
}