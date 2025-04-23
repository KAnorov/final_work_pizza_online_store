import { prisma } from "@/prisma/prisma-client";

export interface GetSearchParams {
    query?: string;
    sortBy?: string;
    sizes?: string;
    pizzaTypes?: string;
    ingredients?: string;
    priceFrom?: string;
    priceTo?: string;
}

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 1000;

export const findPizzas = async (params: GetSearchParams) => { 
    const sizes = params.sizes?.split(',').map(Number); 
    const pizzaTypes = params.pizzaTypes?.split(',').map(Number );
    const ingredientsIdArr = params.ingredients?.split(',').map(Number);

    const minPrice = params.priceFrom ? parseInt(params.priceFrom) : DEFAULT_MIN_PRICE;
    const maxPrice = params.priceTo ? parseInt(params.priceTo) : DEFAULT_MAX_PRICE;

  const categories = await prisma.category.findMany({ 
    include: {
      products: {
        orderBy: {id: 'desc'}, // Сортируем по id в обратном порядке
        where: {
            ingredient: ingredientsIdArr ? { 
                some: {
                    id: {
                        in: ingredientsIdArr // Список доступных ингредиентов пиццы in - это в списке
                }
            }
        }: undefined, 
        items: {
            some: {
                size: {
                    in: sizes // Список доступных размеров пиццы
                },
                pizzaType: {
                    in: pizzaTypes // Список доступных типов пиццы 
                },
                price: {
                    gte: minPrice, // Минимальная цена gte - greater than or equal это больше или равно
                    lte: maxPrice // Максимальная цена lte - less than or equal это меньше или равно
                }
            }
        }
    },
        include: { // Объект для включения дополнительных полей в результат запроса
          ingredient: true, // включает поле ingredient в результат запроса
          items: { 
            where: { // Объект для фильтрации полей в объекте items
                price: {
                    gte: minPrice, 
                    lte: maxPrice 
                }
            },
            orderBy: {price: 'asc'} // Сортируем цены по возрастанию
          },
        
        }
      }
    }
   });

return categories;

};