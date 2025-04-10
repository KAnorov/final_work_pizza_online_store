import { ChooseProductModal } from "@/shared/components/shared";
import { prisma } from "@/prisma/prisma-client";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

export default async function ProductPage({ params }: Props) {

  const { id } = await params;
    
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: {
      variant: true,
      ingredient: true
    }
  });

  if (!product) {
    return notFound();
  }

  return (
    
      <ChooseProductModal product={product} />
    
  );
}