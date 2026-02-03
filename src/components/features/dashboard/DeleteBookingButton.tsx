"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteBookingButton({
  bookingId,
}: {
  bookingId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("בטל הזמנה זו?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="me-1 rounded p-0.5 text-xs text-muted hover:text-danger disabled:opacity-50"
      title="ביטול הזמנה"
    >
      ✕
    </button>
  );
}
