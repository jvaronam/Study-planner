import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import NewTaskForm from "./NewTaskForm";
import ToggleTaskButton from "./ToggleTaskButton";
import DeleteTaskButton from "./DeleteTaskButton";

type SubjectPageParams = {
  id: string;
};

type SubjectPageProps = {
  params: Promise<SubjectPageParams>;
};

export default async function SubjectDetailPage({ params }: SubjectPageProps) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/login");
  }

  const subject = await prisma.subject.findUnique({
    where: { id },
  });

  if (!subject || subject.userId !== user.id) {
    notFound();
  }

  const tasks = await prisma.task.findMany({
    where: { subjectId: subject.id },
    orderBy: [{ status: "asc" }, { dueDate: "asc" }],
  });

  return (
    <main className="max-w-3xl mx-auto py-8 space-y-4">
      <div>
        <h1 className="text-2xl font-bold mb-1">{subject.name}</h1>
        <p className="text-gray-600 text-sm">
          {subject.semester && <span>Semester: {subject.semester} • </span>}
          {subject.credits != null && <span>Credits: {subject.credits} • </span>}
          {subject.difficulty != null && (
            <span>Difficulty: {subject.difficulty}</span>
          )}
        </p>
      </div>

      <NewTaskForm subjectId={subject.id} />

      <section>
        <h2 className="font-semibold mb-2">Tasks</h2>
        {tasks.length === 0 && (
          <p className="text-gray-600 text-sm">
            No tasks yet. Add your first task above.
          </p>
        )}

        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between border rounded px-3 py-2"
            >
              <div>
                <div className="font-medium">{task.title}</div>
                <div className="text-xs text-gray-600 space-x-1">
                  <span>Type: {task.type}</span>
                  <span>• Status: {task.status}</span>
                  {task.dueDate && (
                    <span>
                      • Due:{" "}
                      {task.dueDate.toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  )}
                  {task.grade != null && <span>• Grade: {task.grade}</span>}
                </div>
                {task.description && (
                  <p className="text-xs text-gray-700 mt-1">
                    {task.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <ToggleTaskButton id={task.id} initialStatus={task.status} />
                <DeleteTaskButton id={task.id} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
