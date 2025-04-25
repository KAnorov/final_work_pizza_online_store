import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {  // зпросить в базе данных всех пользователей
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
}

export async function POST(req: NextRequest) { // создать нового пользователя
    const data = await req.json();
    const user = await prisma.user.create({
        data
    });
    return NextResponse.json(user);
}