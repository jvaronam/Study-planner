"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewSubjectForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [semester, setSemester] = useState("");
  const [credits, setCredits] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          semester: semester || null,
          credits: credits !== "" ? Number(credits) : null,
          difficulty: difficulty !== "" ? Number(difficulty) : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Could not create subject");
        return;
      }

      // limpiar campos al crear
      setName("");
      setSemester("");
      setCredits("");
      setDifficulty("");

      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-slate-700 rounded-lg px-4 py-3 space-y-3 bg-slate-900 text-slate-50"
    >
      <h2 className="font-semibold mb-1">Add new subject</h2>

      <div>
        <label className="block text-sm mb-1 text-slate-200">Name</label>
        <input
          className="w-full border border-slate-600 rounded bg-slate-900 text-slate-50 px-2 py-1 placeholder-slate-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-sm mb-1 text-slate-200">Semester</label>
          <input
            className="w-full border border-slate-600 rounded bg-slate-900 text-slate-50 px-2 py-1 text-sm placeholder-slate-500"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-slate-200">Credits</label>
          <input
            type="number"
            className="w-full border border-slate-600 rounded bg-slate-900 text-slate-50 px-2 py-1 text-sm placeholder-slate-500"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-slate-200">
            Difficulty (1–5)
          </label>
          <input
            type="number"
            min={1}
            max={5}
            className="w-full border border-slate-600 rounded bg-slate-900 text-slate-50 px-2 py-1 text-sm placeholder-slate-500"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        className="mt-1 px-3 py-1 rounded text-sm font-medium bg-slate-100 text-slate-900 hover:bg-white disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Saving..." : "Add subject"}
      </button>
    </form>
  );
}
