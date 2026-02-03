import Checkbox from "@/components/ui/Checkbox";
import Input from "@/components/ui/Input";
import { DAY_NAMES, MAX_PERIODS, formatHour } from "@/lib/utils";

interface Step3Props {
  selectedDays: number[];
  hoursByDay: Record<number, number[]>;
  maxStudentsPerSlot: number;
  onHoursChange: (hoursByDay: Record<number, number[]>) => void;
  onMaxStudentsChange: (max: number) => void;
}

export default function Step3Hours({
  selectedDays,
  hoursByDay,
  maxStudentsPerSlot,
  onHoursChange,
  onMaxStudentsChange,
}: Step3Props) {
  function toggleHour(day: number, hour: number) {
    const current = hoursByDay[day] || [];
    const updated = current.includes(hour)
      ? current.filter((h) => h !== hour)
      : [...current, hour].sort((a, b) => a - b);

    onHoursChange({ ...hoursByDay, [day]: updated });
  }

  const hours = Array.from({ length: MAX_PERIODS }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-lg font-medium">שעות זמינות ליום</h3>
        <p className="mb-4 text-sm text-muted">
          לכל יום, בחר באילו שעות/תקופות אתה זמין.
        </p>
      </div>

      {selectedDays.map((day) => (
        <div key={day} className="rounded-lg border border-border p-4">
          <h4 className="mb-3 font-medium">{DAY_NAMES[day]}</h4>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
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

      <div className="max-w-xs">
        <h3 className="mb-2 text-lg font-medium">מקסימום תלמידים למשבצת</h3>
        <p className="mb-2 text-sm text-muted">
          כמה תלמידים יכולים להזמין אותה שעה באותו יום?
        </p>
        <Input
          type="number"
          min={1}
          max={50}
          value={maxStudentsPerSlot}
          onChange={(e) => onMaxStudentsChange(Number(e.target.value) || 1)}
        />
      </div>
    </div>
  );
}
