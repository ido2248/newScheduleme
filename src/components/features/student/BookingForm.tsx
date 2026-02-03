"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { DAY_NAMES, formatHour, formatGrade } from "@/lib/utils";

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  calendarCode: string;
  calendarName: string;
  teacherName: string | null;
  allowedGrades: number[];
  slotId: string;
  periodNumber: number;
  date: Date;
}

export default function BookingForm({
  isOpen,
  onClose,
  onSuccess,
  calendarCode,
  calendarName,
  teacherName,
  allowedGrades,
  slotId,
  periodNumber,
  date,
}: BookingFormProps) {
  const [studentName, setStudentName] = useState("");
  const [studentGrade, setStudentGrade] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calendarCode,
          availabilitySlotId: slotId,
          date: dateStr,
          studentName: studentName.trim(),
          studentGrade: Number(studentGrade),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "ההזמנה נכשלה.");
        return;
      }

      setStudentName("");
      setStudentGrade("");
      onSuccess();
      onClose();
    } catch {
      setError("משהו השתבש. נסה שוב.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="הזמן שיעור">
      <div className="mb-4 rounded-lg bg-gray-50 p-3 text-sm">
        <p>
          <span className="text-muted">מורה:</span>{" "}
          <span className="font-medium">{teacherName || calendarName}</span>
        </p>
        <p>
          <span className="text-muted">תאריך:</span>{" "}
          <span className="font-medium">
            {DAY_NAMES[date.getDay()]}, {dateStr}
          </span>
        </p>
        <p>
          <span className="text-muted">שעה:</span>{" "}
          <span className="font-medium">{formatHour(periodNumber)}</span>
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="שם מלא"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="השם המלא שלך"
          required
        />

        <Select
          label="שכבה"
          value={studentGrade}
          onChange={(e) => setStudentGrade(e.target.value)}
          placeholder="בחר שכבה"
          options={allowedGrades.map((g) => ({
            value: g,
            label: formatGrade(g),
          }))}
          required
        />

        <div className="flex justify-end gap-2">
          <Button variant="secondary" type="button" onClick={onClose}>
            ביטול
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "מזמין..." : "אשר הזמנה"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
