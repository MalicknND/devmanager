import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

export async function GET() {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const clients = await prisma.client.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ clients }, { status: 200 });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const name = (body?.name ?? "").trim();
  const email = (body?.email ?? "").trim() || null;
  const phone = (body?.phone ?? "").trim() || null;
  const company = (body?.company ?? "").trim() || null;

  if (!name) {
    return NextResponse.json(
      { message: "Le nom du client est requis." },
      { status: 400 },
    );
  }

  const client = await prisma.client.create({
    data: { name, email, phone, company, userId: user.id },
  });

  return NextResponse.json({ client }, { status: 201 });
}
