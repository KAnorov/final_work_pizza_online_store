
import { CartDTO, CreateCartItemValues } from './dto/cart.dto';
import { axiosInstance } from './instance';

export const getCart = async (): Promise<CartDTO> => { // получить корзину
  return (await axiosInstance.get<CartDTO>('/cart')).data;
};

export const updateItemQuantity = async (itemId: number, quantity: number): Promise<CartDTO> => { // изменить количество элементов в корзине
  return (await axiosInstance.patch<CartDTO>('/cart/' + itemId, { quantity })).data;
};

export const removeCartItem = async (id: number): Promise<CartDTO> => { // удалить элемент из корзины
  return (await axiosInstance.delete<CartDTO>('/cart/' + id)).data;
};

export const addCartItem = async (values: CreateCartItemValues): Promise<CartDTO> => { // добавить элемент в корзину
  return (await axiosInstance.post<CartDTO>('/cart', values)).data;
};
