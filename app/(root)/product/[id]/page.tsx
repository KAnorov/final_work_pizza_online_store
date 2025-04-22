import { Container} from "@/shared/components/shared"
import { prisma } from "@/prisma/prisma-client";
import { notFound } from "next/navigation";
import { ProductForm } from "@/shared/components/shared/product-form";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  

  if (isNaN(id)) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      ingredient: true,
      items: true,
           
    }
  });

  if (!product) {
    notFound();
  }

  return (
    <Container className="flex flex-col my-10">
      <ProductForm product={product} />
    </Container>
  );
}