import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body?.email ?? "").trim().toLowerCase();
    const password = body?.password ?? "";

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email et mot de passe sont requis." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { message: "Identifiants invalides." },
        { status: 401 },
      );
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return NextResponse.json(
        { message: "Identifiants invalides." },
        { status: 401 },
      );
    }

    const token = signToken({ userId: user.id, email: user.email });

    const res = NextResponse.json(
      { user: { id: user.id, email: user.email, name: user.name } },
      { status: 200 },
    );

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch {
    return NextResponse.json(
      { message: "Erreur serveur (login)." },
      { status: 500 },
    );
  }
}
