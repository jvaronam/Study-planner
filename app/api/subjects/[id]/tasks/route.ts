// app/api/subjects/[id]/tasks/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TaskType } from "@prisma/client";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET: listar tareas de una asignatura
export async function GET(_request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  const tasks = await prisma.task.findMany({
    where: { subjectId: subject.id },
    orderBy: [{ status: "asc" }, { dueDate: "asc" }],
  });

  return NextResponse.json(tasks);
}

// POST: crear tarea en una asignatura
export async function POST(request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  try {
    const body = await request.json();
    const { title, description, type, dueDate, grade } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (!type || typeof type !== "string") {
      return NextResponse.json(
        { error: "Type is required" },
        { status: 400 }
      );
    }

    // Comprobamos que el string recibido es un valor válido del enum TaskType
    if (!Object.values(TaskType).includes(type as TaskType)) {
      return NextResponse.json(
        { error: "Invalid task type" },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        type: type as TaskType, // aquí ya sabemos que es válido
        dueDate: dueDate ? new Date(dueDate) : null,
        grade: grade != null ? Number(grade) : null,
        subjectId: subject.id,
        // status usa el default PENDING definido en el modelo
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
