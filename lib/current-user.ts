import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const token = cookies().get("token")?.value;
  if (!token) return null;

  try {
    const payload = verifyToken(token);
    return prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true },
    });
  } catch {
    return null;
  }
}
