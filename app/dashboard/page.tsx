// app/dashboard/page.tsx
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { TaskStatus } from "@prisma/client";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      subjects: {
        include: {
          tasks: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const subjects = user.subjects;
  const tasks = subjects.flatMap((s) => s.tasks);

  const totalSubjects = subjects.length;
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (t) => t.status === TaskStatus.COMPLETED
  ).length;

  const pendingTasks = totalTasks - completedTasks;

  const nextTasks = tasks
    .filter((t) => t.status !== TaskStatus.COMPLETED && t.dueDate)
    .sort(
      (a, b) =>
        new Date(a.dueDate as Date).getTime() -
        new Date(b.dueDate as Date).getTime()
    )
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Cabecera */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Study planner
            </p>
            <h1 className="mt-1 text-3xl md:text-4xl font-bold">
              Welcome back, {user.name ?? "student"}
            </h1>
            <p className="mt-2 text-slate-400">
              Here&apos;s a quick overview of your subjects and tasks.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            {/* Botón de logout */}
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="text-xs px-3 py-1.5 rounded-md border border-slate-600 hover:border-red-500 hover:text-red-300 hover:bg-slate-900 transition"
              >
                Logout
              </button>
            </form>

            {/* Enlace a subjects */}
            <Link
              href="/subjects"
              className="inline-flex items-center px-3 py-1.5 rounded-md border border-slate-600 text-sm font-medium hover:border-slate-300 hover:bg-slate-900"
            >
              Go to subjects
            </Link>
          </div>
        </header>

        {/* Tarjetas resumen */}
        <section className="grid gap-4 md:grid-cols-4 text-sm">
          <div className="border border-slate-700 rounded-lg p-4 bg-slate-900/70">
            <h2 className="text-slate-400 text-xs uppercase mb-2">
              Subjects
            </h2>
            <p className="text-2xl font-semibold">{totalSubjects}</p>
            <p className="text-slate-500 mt-1">Active this semester</p>
          </div>

          <div className="border border-slate-700 rounded-lg p-4 bg-slate-900/70">
            <h2 className="text-slate-400 text-xs uppercase mb-2">Tasks</h2>
            <p className="text-2xl font-semibold">{totalTasks}</p>
            <p className="text-slate-500 mt-1">Total created</p>
          </div>

          <div className="border border-slate-700 rounded-lg p-4 bg-slate-900/70">
            <h2 className="text-slate-400 text-xs uppercase mb-2">
              Completed
            </h2>
            <p className="text-2xl font-semibold">{completedTasks}</p>
            <p className="text-slate-500 mt-1">
              {totalTasks > 0
                ? `${Math.round(
                    (completedTasks / totalTasks) * 100
                  )}% done`
                : "No tasks yet"}
            </p>
          </div>

          <div className="border border-slate-700 rounded-lg p-4 bg-slate-900/70">
            <h2 className="text-slate-400 text-xs uppercase mb-2">Pending</h2>
            <p className="text-2xl font-semibold">{pendingTasks}</p>
            <p className="text-slate-500 mt-1">Left to complete</p>
          </div>
        </section>

        {/* Next tasks */}
        <section className="border border-slate-700 rounded-lg p-4 bg-slate-900/70">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-lg">Next tasks</h2>
            <span className="text-xs text-slate-400">
              Sorted by closest due date
            </span>
          </div>

          {nextTasks.length === 0 ? (
            <p className="text-sm text-slate-400">
              No upcoming tasks. Create tasks inside each subject.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {nextTasks.map((task) => {
                const subject = subjects.find((s) =>
                  s.tasks.some((t) => t.id === task.id)
                );

                return (
                  <li
                    key={task.id}
                    className="flex items-center justify-between gap-4 border border-slate-700 rounded-md px-3 py-2 bg-slate-950/60"
                  >
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-xs text-slate-400">
                        {subject?.name ?? "Unknown subject"} •{" "}
                        {task.type.toLowerCase()}
                      </p>
                    </div>
                    <div className="text-right text-xs text-slate-300">
                      {task.dueDate ? (
                        <>
                          <p>Due:</p>
                          <p className="font-mono">
                            {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        </>
                      ) : (
                        <p className="text-slate-500">No due date</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
