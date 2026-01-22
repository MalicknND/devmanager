import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = (body?.name ?? "").trim();
    const email = (body?.email ?? "").trim().toLowerCase();
    const password = body?.password ?? "";

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email et mot de passe sont requis." },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Le mot de passe doit contenir au moins 8 caractères." },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { message: "Cet email est déjà utilisé." },
        { status: 409 },
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name: name || null, email, password: hashed },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Erreur serveur (register)." },
      { status: 500 },
    );
  }
}
