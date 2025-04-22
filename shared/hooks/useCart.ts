
import { CreateCartItemValues } from '../services/dto/cart.dto';
import { CartStateItem } from '../lib/get-cart-details';
import { useCartStore } from '../store/cart';
import { useEffect } from 'react';

type ReturnProps = {
  totalAmount: number;
  items: CartStateItem[];
  loading: boolean;
  updateItemQuantity: (id: number, quantity: number) => void;
  removeCartItem: (id: number) => void;
  addCartItem: (values: CreateCartItemValues) => void;
};

export const useCart = (): ReturnProps => {
  const cartState = useCartStore((state) => state); // Получаем все свойства из состояния корзины

  useEffect(() => {
    cartState.fetchCartItems(); // Вызов функции для получения корзины при монтировании компонента
  }, []); // Перезагрузка корзины, если состояние корзины изменилось

  return cartState;
};
