// app/subjects/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import NewSubjectForm from "./NewSubjectForm";
import DeleteSubjectButton from "./DeleteSubjectButton";

export default async function SubjectsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/login");
  }

  const subjects = await prisma.subject.findMany({
    where: { userId: user.id },
    orderBy: [{ semester: "asc" }, { name: "asc" }],
  });

  return (
    <main className="max-w-3xl mx-auto py-8 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My subjects</h1>
        <Link
          href="/dashboard"
          className="text-sm underline text-gray-600 hover:text-black"
        >
          Back to dashboard
        </Link>
      </div>

      <NewSubjectForm />

      <section>
        <h2 className="font-semibold mb-2">Subjects list</h2>

        {subjects.length === 0 && (
          <p className="text-sm text-gray-600">
            You don't have any subjects yet. Create one above.
          </p>
        )}

        <ul className="space-y-2">
          {subjects.map((subject) => (
            <li
              key={subject.id}
              className="flex items-center justify-between border rounded px-3 py-2"
            >
              
              <Link href={`/subjects/${subject.id}`} className="flex-1">
                <div className="font-medium">{subject.name}</div>
                <div className="text-xs text-gray-600">
                  {subject.semester && <span>Semester: {subject.semester} • </span>}
                  {subject.credits != null && <span>Credits: {subject.credits} • </span>}
                  {subject.difficulty != null && (
                    <span>Difficulty: {subject.difficulty}</span>
                  )}
                </div>
              </Link>

              <div className="ml-3">
                <DeleteSubjectButton id={subject.id} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
