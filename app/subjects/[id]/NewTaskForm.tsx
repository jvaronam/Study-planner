"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type NewTaskFormProps = {
  subjectId: string;
};

export default function NewTaskForm({ subjectId }: NewTaskFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"EXAM" | "ASSIGNMENT" | "PROJECT" | "STUDY">(
    "EXAM"
  );
  const [dueDate, setDueDate] = useState("");
  const [grade, setGrade] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/subjects/${subjectId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || null,
          type,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
          grade: grade !== "" ? Number(grade) : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Could not create task");
        return;
      }

      // limpiar campos
      setTitle("");
      setDescription("");
      setType("EXAM");
      setDueDate("");
      setGrade("");

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
      <h2 className="font-semibold mb-1">Add new task</h2>

      <div>
        <label className="block text-sm mb-1 text-slate-200">Title</label>
        <input
          className="w-full border border-slate-600 rounded bg-slate-900 text-slate-50 px-2 py-1 placeholder-slate-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1 text-slate-200">Description</label>
        <textarea
          className="w-full border border-slate-600 rounded bg-slate-900 text-slate-50 px-2 py-1 text-sm placeholder-slate-500"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-sm mb-1 text-slate-200">Type</label>
          <select
            className="w-full border border-slate-600 rounded bg-slate-900 text-slate-50 px-2 py-1 text-sm"
            value={type}
            onChange={(e) =>
              setType(
                e.target.value as "EXAM" | "ASSIGNMENT" | "PROJECT" | "STUDY"
              )
            }
          >
            <option value="EXAM">Exam</option>
            <option value="ASSIGNMENT">Assignment</option>
            <option value="PROJECT">Project</option>
            <option value="STUDY">Study session</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1 text-slate-200">Due date</label>
          <input
            type="date"
            className="w-full border border-slate-600 rounded bg-slate-900 text-slate-50 px-2 py-1 text-sm"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-slate-200">Grade</label>
          <input
            type="number"
            step="0.1"
            className="w-full border border-slate-600 rounded bg-slate-900 text-slate-50 px-2 py-1 text-sm placeholder-slate-500"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        className="mt-1 px-3 py-1 rounded text-sm font-medium bg-slate-100 text-slate-900 hover:bg-white disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Saving..." : "Add task"}
      </button>
    </form>
  );
}
