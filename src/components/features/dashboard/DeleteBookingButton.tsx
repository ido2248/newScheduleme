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
      className="me-1 rounded p-1.5 sm:p-0.5 text-sm sm:text-xs text-muted hover:text-danger active:text-danger disabled:opacity-50 min-h-[32px] min-w-[32px] sm:min-h-0 sm:min-w-0 flex items-center justify-center"
      title="ביטול הזמנה"
    >
      ✕
    </button>
  );
}
