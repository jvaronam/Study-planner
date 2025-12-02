"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteSubjectButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this subject and all its tasks?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/subjects/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Failed to delete subject");
      }

      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="text-sm text-red-600 border border-red-600 rounded px-2 py-1"
      disabled={loading}
    >
      {loading ? "..." : "Delete"}
    </button>
  );
}
