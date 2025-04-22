import { prisma } from "@/prisma/prisma-client";
import { updateCartTotalAmount } from "@/shared/lib/update-cart-total-amount";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid item ID" },
        { status: 400 }
      );
    }

    const token = request.cookies.get("cartToken")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Cart token not found" },
        { status: 401 }
      );
    }

    const data = await request.json() as { quantity: number };
    if (!data.quantity || typeof data.quantity !== "number") {
      return NextResponse.json(
        { error: "Invalid quantity" },
        { status: 400 }
      );
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: { id }
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    await prisma.cartItem.update({
      where: { id },
      data: { quantity: data.quantity }
    });

    const updatedCart = await updateCartTotalAmount(token);
    return NextResponse.json(updatedCart);
  } catch (error) {
    console.error("[CART_PATCH]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid item ID" },
        { status: 400 }
      );
    }

    const token = request.cookies.get("cartToken")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Cart token not found" },
        { status: 401 }
      );
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: { id }
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    await prisma.cartItem.delete({
      where: { id }
    });

    const updatedCart = await updateCartTotalAmount(token);
    return NextResponse.json(updatedCart);
  } catch (error) {
    console.error("[CART_DELETE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}