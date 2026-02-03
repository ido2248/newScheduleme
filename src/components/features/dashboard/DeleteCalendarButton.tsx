"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function DeleteCalendarButton({
  calendarId,
}: {
  calendarId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("האם אתה בטוח שברצונך למחוק לוח זה? כל ההזמנות יאבדו.")) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/calendars/${calendarId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="danger"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? "מוחק..." : "מחק לוח"}
    </Button>
  );
}
