// app/api/subjects/[id]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 👇 aquí es donde cambiamos: params es una Promise
  const { id } = await context.params;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 400 });
  }

  const subject = await prisma.subject.findUnique({
    where: { id },
  });

  if (!subject || subject.userId !== user.id) {
    return NextResponse.json(
      { error: "Subject not found" },
      { status: 404 }
    );
  }

  await prisma.subject.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}
