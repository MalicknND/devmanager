import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

type Params = { params: { id: string } };

export async function GET(_: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const client = await prisma.client.findFirst({
    where: { id: params.id, userId: user.id },
    include: { projects: { orderBy: { createdAt: "desc" } } },
  });

  if (!client)
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ client }, { status: 200 });
}

export async function PATCH(req: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const exists = await prisma.client.findFirst({
    where: { id: params.id, userId: user.id },
    select: { id: true },
  });
  if (!exists)
    return NextResponse.json({ message: "Not found" }, { status: 404 });

  const body = await req.json();
  const data: {
    name?: string;
    email?: string | null;
    phone?: string | null;
    company?: string | null;
  } = {};

  if (body?.name !== undefined) {
    const name = String(body.name).trim();
    if (!name)
      return NextResponse.json(
        { message: "Le nom ne peut pas être vide." },
        { status: 400 },
      );
    data.name = name;
  }
  if (body?.email !== undefined) data.email = String(body.email).trim() || null;
  if (body?.phone !== undefined) data.phone = String(body.phone).trim() || null;
  if (body?.company !== undefined)
    data.company = String(body.company).trim() || null;

  const client = await prisma.client.update({ where: { id: params.id }, data });
  return NextResponse.json({ client }, { status: 200 });
}

export async function DELETE(_: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const exists = await prisma.client.findFirst({
    where: { id: params.id, userId: user.id },
    select: { id: true },
  });
  if (!exists)
    return NextResponse.json({ message: "Not found" }, { status: 404 });

  await prisma.client.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Deleted" }, { status: 200 });
}
