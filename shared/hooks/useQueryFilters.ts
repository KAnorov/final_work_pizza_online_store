import { useEffect, useRef } from "react";
import { Filters } from "./useFilters";
import { useRouter } from "next/navigation";
import qs from 'qs';

export const useQueryFilters = (filters: Filters) => { // фильтр по цене и ингредиентам
    const isMounted = useRef(false);   // создаем переменную для отслеживания состояния компонента
    const router = useRouter(); // получаем хук для навигации по страницам
  
    useEffect(() => {
      if (isMounted.current) { // если компонент уже отрендерился, то обновляем данные в адресной строке
        const params = { // создаем объект с параметрами фильтрации
          ...filters.prices, // добавляем в объект параметры фильтрации
          pizzaTypes: Array.from(filters.pizzaTypes), // преобразуем сеты в массивы, чтобы их можно было сериализовать в строку
          sizes: Array.from(filters.sizes), // так же преобразуем сеты в массивы
          ingredients: Array.from(filters.selectedIngredients), // так же преобразуем сеты в массивы
        };
  
        const query = qs.stringify(params, { // сериализуем объект в строку с помощью библиотеки qs
          arrayFormat: 'comma', // указываем, что массивы нужно сериализовать в строку через запятую
        });
  
        router.push(`?${query}`, { // меняем адресную строку с помощью хука useRouter
          scroll: false, // не прокручиваем страницу после изменения адресной строки
        });
  
        console.log(filters, 999); // выводим в консоль объект с параметрами фильтрации
      }
  
      isMounted.current = true; // устанавливаем флаг, что компонент отрендерился
    }, [filters]); // запускаем эффект при изменении параметров фильтрации
  };