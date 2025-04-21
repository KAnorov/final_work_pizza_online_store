import { Container, PizzaImage, Title } from "@/shared/components/shared";
import { GroupVariants } from "@/shared/components/shared/group-variants";
import { prisma } from "@/prisma/prisma-client";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: Props) {

  const  id  =  params;
    
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: {
      items: true,
      ingredient: true
    }
  });

  if (!product) {
    return notFound();
  }

  return (
    <Container className="flex flex-col my-10">
      <div className="flex flex-1">
        <PizzaImage imageUrl={product.imageUrl} size={40} />
        <div className="w-[490px] bg-[#FCFCFC] p-7">
          <Title
            text={product.name}
            size="md"
            className="font-extrabold mb-1"
          />
          <GroupVariants
            selectedValue="2" 
            items={[
              { name: "Маленькая", value: '1' },
              { name: "Средняя", value: '2' },
              { name: "Большая", value: '3' }
            ]} 
          />
        </div>
      </div>
    </Container>
  );
}