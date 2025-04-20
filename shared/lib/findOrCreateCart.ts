import { prisma } from '@/prisma/prisma-client';

export const findOrCreateCart = async (token: string) => {
  let userCart = await prisma.cart.findFirst({ // находим корзину по токену
    where: {
      token,
    },
  });

  if (!userCart) {
    userCart = await prisma.cart.create({ // если корзины нет, то создаем ее
      data: {
        token,
      },
    });
  }

  return userCart;
};
