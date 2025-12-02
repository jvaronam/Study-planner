"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ToggleTaskButton({
  id,
  initialStatus,
}: {
  id: string;
  initialStatus: string; // ej. "PENDING" | "COMPLETED"
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const nextStatus =
    initialStatus === "COMPLETED" ? "PENDING" : "COMPLETED";

  async function handleToggle() {
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) {
        console.error("Failed to update task status");
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
      onClick={handleToggle}
      className="text-sm border rounded px-2 py-1"
      disabled={loading}
    >
      {loading ? "..." : initialStatus === "COMPLETED" ? "Mark pending" : "Complete"}
    </button>
  );
}
