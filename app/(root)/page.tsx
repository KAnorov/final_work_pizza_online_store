
import { Container, Filters, ProductsGroupList, Title, TopBar } from "@/shared/components/shared";
import { prisma } from "@/prisma/prisma-client";




export default async function Home() {
   const categories = await prisma.category.findMany({ 
    include: {
      product: {
        include: {
          ingredient: true,
          variant: true,
        
        }
      }
    }
   });
  
  return <>

    <Container className="mt-10">
      <Title text="Все пиццы" size="lg" className="font-extrabold" />
    </Container>

    <TopBar categories={categories.filter((category)=>category.product.length > 0 )} />

    <Container className="mt-10 pb-14">
      <div className="flex gap-[80px]">

        {/* Фильтрация */}
        <div className="w-[250px]">
          <Filters />
        </div>


        {/* Список товаров */}
        <div className="flex-1">
          <div className="flex flex-col gap-16">
         
         { categories.map(
            (category) => (
              category.product.length > 0 && (
                <ProductsGroupList
                key={category.id}
                title={category.name}
                categoryId={category.id}
                items={category.product}
                />
              )
            )
          )}
         
           

          </div>
        </div>
      </div></Container></>
}
