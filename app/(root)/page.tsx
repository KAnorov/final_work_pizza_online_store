
import { Container, Filters, ProductsGroupList, Title, TopBar } from "@/shared/components/shared";
import { Suspense } from "react";
import { findPizzas, GetSearchParams } from "@/shared/lib/find-pizza";

export default async function Home({ searchParams }: { searchParams: GetSearchParams }) {
   
  const categories = await  findPizzas(searchParams);
   
  if(!categories) {
      return new Response('404', {status:404});
   }


   const filteredCategories = categories.filter(
    (category) => category.products.length > 0
  );
  
  return <>
    <Container className="mt-10">
      <Title text="Все пиццы" size="lg" className="font-extrabold" />
    </Container>

    <TopBar categories={filteredCategories} />

    <Container className="mt-10 pb-14">
      <div className="flex gap-[80px]">

        {/* Фильтрация */}
        <div className="w-[250px]">
          <Suspense> 
          <Filters />
          </Suspense>
        </div>


        {/* Список товаров */}
        <div className="flex-1">
          <div className="flex flex-col gap-16">
         
         { categories.map(
            (category) => (
              category.products.length > 0 && (
                <ProductsGroupList
                key={category.id}
                title={category.name}
                categoryId={category.id}
                items={category.products}
                />
              )
            )
          )}
         
           

          </div>
        </div>
      </div></Container></>
}
