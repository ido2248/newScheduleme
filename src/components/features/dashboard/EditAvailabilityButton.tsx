"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import ScopeDialog, { type EditScope } from "./ScopeDialog";
import { DAY_NAMES, MAX_PERIODS, formatHour } from "@/lib/utils";

interface Slot {
  dayOfWeek: number;
  periodNumber: number;
}

interface EditAvailabilityButtonProps {
  calendarId: string;
  currentSlots: Slot[];
}

export default function EditAvailabilityButton({
  calendarId,
  currentSlots,
}: EditAvailabilityButtonProps) {
  const router = useRouter();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isScopeDialogOpen, setIsScopeDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [hoursByDay, setHoursByDay] = useState<Record<number, number[]>>({});

  function openEditor() {
    const days = [...new Set(currentSlots.map((s) => s.dayOfWeek))].sort(
      (a, b) => a - b
    );
    const hbd: Record<number, number[]> = {};
    for (const slot of currentSlots) {
      if (!hbd[slot.dayOfWeek]) hbd[slot.dayOfWeek] = [];
      hbd[slot.dayOfWeek].push(slot.periodNumber);
    }
    for (const day of Object.keys(hbd)) {
      hbd[Number(day)].sort((a, b) => a - b);
    }
    setSelectedDays(days);
    setHoursByDay(hbd);
    setError("");
    setIsEditorOpen(true);
  }

  function toggleDay(day: number) {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
      const newHours = { ...hoursByDay };
      delete newHours[day];
      setHoursByDay(newHours);
    } else {
      setSelectedDays([...selectedDays, day].sort((a, b) => a - b));
    }
  }

  function toggleHour(day: number, hour: number) {
    const current = hoursByDay[day] || [];
    const updated = current.includes(hour)
      ? current.filter((h) => h !== hour)
      : [...current, hour].sort((a, b) => a - b);
    setHoursByDay({ ...hoursByDay, [day]: updated });
  }

  function hasChanges(): boolean {
    const currentSet = new Set(
      currentSlots.map((s) => `${s.dayOfWeek}-${s.periodNumber}`)
    );
    const editedSlots: string[] = [];
    for (const day of selectedDays) {
      for (const hour of hoursByDay[day] || []) {
        editedSlots.push(`${day}-${hour}`);
      }
    }
    const editedSet = new Set(editedSlots);

    if (currentSet.size !== editedSet.size) return true;
    for (const key of currentSet) {
      if (!editedSet.has(key)) return true;
    }
    return false;
  }

  function handleSaveClick() {
    if (!hasChanges()) {
      setIsEditorOpen(false);
      return;
    }
    setIsScopeDialogOpen(true);
  }

  async function handleScopeSelect(scope: EditScope) {
    setLoading(true);
    setError("");

    const slots: Slot[] = [];
    for (const day of selectedDays) {
      for (const hour of hoursByDay[day] || []) {
        slots.push({ dayOfWeek: day, periodNumber: hour });
      }
    }

    try {
      const res = await fetch(`/api/calendars/${calendarId}/availability`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope, slots }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "שמירה נכשלה.");
        setIsScopeDialogOpen(false);
        return;
      }

      setIsScopeDialogOpen(false);
      setIsEditorOpen(false);
      router.refresh();
    } catch {
      setError("משהו השתבש. נסה שוב.");
      setIsScopeDialogOpen(false);
    } finally {
      setLoading(false);
    }
  }

  const hours = Array.from({ length: MAX_PERIODS }, (_, i) => i + 1);

  return (
    <>
      <Button variant="outline" size="sm" onClick={openEditor}>
        ערוך זמינות
      </Button>

      <Modal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        title="עריכת זמינות"
        size="lg"
      >
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-danger">
            {error}
          </div>
        )}

        {/* Day selection */}
        <div className="mb-4">
          <h4 className="mb-2 text-sm font-medium">ימים זמינים</h4>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {DAY_NAMES.map((name, idx) => (
              <Checkbox
                key={idx}
                label={name}
                checked={selectedDays.includes(idx)}
                onChange={() => toggleDay(idx)}
              />
            ))}
          </div>
        </div>

        {/* Hours per day */}
        {selectedDays.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">שעות זמינות ליום</h4>
            {selectedDays.map((day) => (
              <div
                key={day}
                className="rounded-lg border border-border p-3"
              >
                <h5 className="mb-2 text-sm font-medium">{DAY_NAMES[day]}</h5>
                <div className="grid grid-cols-4 gap-1 sm:grid-cols-6">
                  {hours.map((hour) => (
                    <Checkbox
                      key={hour}
                      label={formatHour(hour)}
                      checked={(hoursByDay[day] || []).includes(hour)}
                      onChange={() => toggleHour(day, hour)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsEditorOpen(false)}
          >
            ביטול
          </Button>
          <Button size="sm" onClick={handleSaveClick}>
            שמור שינויים
          </Button>
        </div>
      </Modal>

      <ScopeDialog
        isOpen={isScopeDialogOpen}
        onClose={() => setIsScopeDialogOpen(false)}
        onSelect={handleScopeSelect}
        loading={loading}
      />
    </>
  );
}
