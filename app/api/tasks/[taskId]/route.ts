// app/api/tasks/[taskId]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@prisma/client";

type TaskContext = {
  params: Promise<{ taskId: string }>;
};

// PUT: actualizar tarea (aquí solo cambiamos el status)
export async function PUT(request: Request, context: TaskContext) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { taskId } = await context.params;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 400 });
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { subject: true },
  });

  if (!task || task.subject.userId !== user.id) {
    return NextResponse.json(
      { error: "Task not found" },
      { status: 404 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const { status } = body as { status?: string };

  if (!status) {
    return NextResponse.json(
      { error: "Status is required" },
      { status: 400 }
    );
  }

  if (!Object.values(TaskStatus).includes(status as TaskStatus)) {
    return NextResponse.json(
      { error: "Invalid status" },
      { status: 400 }
    );
  }

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: { status: status as TaskStatus },
  });

  return NextResponse.json(updated);
}

// DELETE: borrar tarea
export async function DELETE(_request: Request, context: TaskContext) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { taskId } = await context.params;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 400 });
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { subject: true },
  });

  if (!task || task.subject.userId !== user.id) {
    return NextResponse.json(
      { error: "Task not found" },
      { status: 404 }
    );
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  return NextResponse.json({ ok: true });
}
