// app/page.tsx
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  // Si ya está autenticado, lo mandamos al dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="max-w-3xl w-full space-y-8">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
            Study planner
          </p>
          <h1 className="text-4xl md:text-5xl font-bold">
            Organize your{" "}
            <span className="text-sky-400">subjects</span> and{" "}
            <span className="text-sky-400">tasks</span> in one place.
          </h1>
          <p className="text-slate-400 max-w-xl">
            Track exams, assignments and study sessions. See your next tasks at
            a glance and keep your semester under control.
          </p>
        </header>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-sky-500 text-slate-950 font-medium hover:bg-sky-400 transition"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-slate-600 text-slate-100 hover:bg-slate-900 hover:border-slate-400 transition"
          >
            Create an account
          </Link>
        </div>

        <section className="grid gap-4 md:grid-cols-3 text-sm text-slate-300">
          <div className="border border-slate-700 rounded-lg p-3 bg-slate-900/60">
            <h2 className="font-semibold mb-1 text-slate-100">
              Subjects overview
            </h2>
            <p>Keep all your courses in one place with credits and difficulty.</p>
          </div>
          <div className="border border-slate-700 rounded-lg p-3 bg-slate-900/60">
            <h2 className="font-semibold mb-1 text-slate-100">Task types</h2>
            <p>Exams, assignments, projects and simple study sessions.</p>
          </div>
          <div className="border border-slate-700 rounded-lg p-3 bg-slate-900/60">
            <h2 className="font-semibold mb-1 text-slate-100">Next tasks</h2>
            <p>See what&apos;s coming soon so you never miss a deadline.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
