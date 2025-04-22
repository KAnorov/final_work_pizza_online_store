import { ChooseProductModal } from "@/shared/components/shared";
import { prisma } from "@/prisma/prisma-client";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

interface PageParams {
  params: { id: string };
}

export default async function ProductPage({ params }: PageParams) {
  const id = Number(params.id);

  if (isNaN(id)) {
    notFound();
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true // Если нужно включить данные продукта
          }
        },
        ingredient: true,
        category: true // Если нужно включить категорию
      }
    });

    if (!product) {
      notFound();
    }

    return <ChooseProductModal product={product} />;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    notFound();
  }
}