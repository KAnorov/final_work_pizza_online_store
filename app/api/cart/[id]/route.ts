import { prisma } from "@/prisma/prisma-client";
import { updateCartTotalAmount } from "@/shared/lib/update-cart-total-amount";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) { // PATCH метод для обновления товара в корзине
    try {
      const id = Number(params.id); // Получаем идентификатор товара из параметров запроса
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
  

  export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) { // DELETE метод для удаления товара из корзины
    try {
      const id = Number(params.id);
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
  
// export async function PATCH(req: NextRequest) {
//     try {
//         const { searchParams } = new URL(req.url);
//         const id = Number(searchParams.get('id'));// Получаем ID товара из параметров маршрута
        
//         if (isNaN(id)) { return new Response(JSON.stringify({ message: "Неверный идентификатор товара" }), { status: 400 }); } // Проверяем, что ID является числом

//         const data = (await req.json() as { quantity: number }); // Получаем данные из запроса
//         if (!data.quantity || data.quantity < 1) { return new Response(JSON.stringify({ message: "Invalid quantity" }), { status: 400 }); } // Проверяем, что количество является числом и больше нуля

//         const token = req.cookies.get("cartToken")?.value; // Получаем токен авторизации из куки
//         if (!token) return new Response(JSON.stringify({ message: "Не авторизован" }), { status: 401 }); // Проверяем наличие токена авторизации в куках
        
//         const cartItem = await prisma.cartItem.findFirst({ where: { id } }); // Находим корзину по токену авторизации
//         if (!cartItem) return new Response(JSON.stringify({ message: "Товар не найден" }), { status: 404 }); // Проверяем наличие товара в корзине



//         await prisma.cartItem.update({         // Обновляем количество товара в корзине
//             where: { id },                    // Используем переданный ID товара в параметрах маршрута 
//             data: { quantity: data.quantity } // Обновляем количество товара в корзине

//         });

//         const updateUserCart = await updateCartTotalAmount(token); // Обновляем общую стоимость корзины пользователя
//         return NextResponse.json(updateUserCart);

//     } catch (error) {
//         console.log(error);
//         return new Response(JSON.stringify({ message: "Не удалось получить данные" }), { status: 500 });
//     }
// }

// export async function DELETE(req: NextRequest ) {
//     try {
//         const { searchParams } = new URL(req.url);
//         const id = Number(searchParams.get('id')); // Получаем ID товара из параметров маршрута
//         if (isNaN(id)) { return new Response(JSON.stringify({ message: "Неверный идентификатор товара" }), { status: 400 }); } // Проверяем, что ID является числом

//         const token = req.cookies.get("cartToken")?.value; // Получаем токен авторизации из куки
//         if (!token) return new Response(JSON.stringify({ message: "Не авторизован" }), { status: 401 }); // Проверяем наличие токена авторизации в куках
       
//         const cartItem = await prisma.cartItem.findFirst({ where: { id } }); // Находим корзину по токену авторизации
//         if (!cartItem) return new Response(JSON.stringify({ message: "Товар не найден" }), { status: 404 }); // Проверяем наличие товара в корзине

//         await prisma.cartItem.delete({where: { id }}) // Удаляем товар из корзины
//         const updateUserCart = await updateCartTotalAmount(token); // Обновляем общую стоимость корзины пользователя
//         return new Response(JSON.stringify(updateUserCart), { status: 200 });
//     } catch (error) {
//         console.log(error);
//         return new Response(JSON.stringify({ message: "Не удалось получить данные" }), { status: 500 });
//     }
// }