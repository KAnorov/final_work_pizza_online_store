import { prisma } from "@/prisma/prisma-client";
import { updateCartTotalAmount } from "@/shared/lib/update-cart-total-amount";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) { // PATCH метод для обновления товара в корзине
    try {
        // Получаем идентификатор товара из параметров запроса
        const resolvedParams = await params;
        const id = Number(resolvedParams.id);
        const data = (await req.json()) as { quantity: number };// Получаем данные запроса (объект с полем quantity)
        const token = req.cookies.get('cartToken')?.value;// Получаем токен авторизации из куки запроса

        if (!token) { // Проверяем, что токен авторизации существует
            return NextResponse.json({ error: 'Cart token not found' });
        }

        const cartItem = await prisma.cartItem.findFirst({ // Проверяем, что корзина существует
            where: {
                id,
            },
        });

        if (!cartItem) {
            return NextResponse.json({ error: 'Cart item not found' });
        }

        await prisma.cartItem.update({ // Обновляем количество товара в корзине
            where: {
                id,
            },
            data: {
                quantity: data.quantity,
            },
        });

        const updatedUserCart = await updateCartTotalAmount(token); // Получаем обновленную корзину пользователя после обновления количество товара

        return NextResponse.json(updatedUserCart);
    } catch (error) {
        console.log('[CART_PATCH] Server error', error);
        return NextResponse.json({ message: 'Не удалось обновить корзину' }, { status: 500 });
    }
}


export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) { // DELETE метод для удаления товара из корзины
    try {
        const resolvedParams = await params;
        const id = Number(resolvedParams.id);
        const token = req.cookies.get('cartToken')?.value;

        if (!token) { // Проверяем, что токен авторизации существует
            return NextResponse.json({ error: 'Cart token not found' });
        }

        const cartItem = await prisma.cartItem.findFirst({
            where: {
                id,
            },
        });

        if (!cartItem) { // Проверяем, что корзина существует
            return NextResponse.json({ error: 'Cart item not found' });
        }

        await prisma.cartItem.delete({
            where: {
                id,
            },
        });

        const updatedUserCart = await updateCartTotalAmount(token);

        return NextResponse.json(updatedUserCart);
    } catch (error) {
        console.log('[CART_DELETE] Server error', error);
        return NextResponse.json({ message: 'Не удалось удалить корзину' }, { status: 500 });
    }
}

