import Checkbox from "@/components/ui/Checkbox";
import Input from "@/components/ui/Input";
import { DAY_NAMES, MAX_PERIODS } from "@/lib/utils";

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
        <h3 className="mb-2 text-lg font-medium">Available Hours per Day</h3>
        <p className="mb-4 text-sm text-muted">
          For each day, select which school hours/periods you are available.
        </p>
      </div>

      {selectedDays.map((day) => (
        <div key={day} className="rounded-lg border border-border p-4">
          <h4 className="mb-3 font-medium">{DAY_NAMES[day]}</h4>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {hours.map((hour) => (
              <Checkbox
                key={hour}
                label={`Hour ${hour}`}
                checked={(hoursByDay[day] || []).includes(hour)}
                onChange={() => toggleHour(day, hour)}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="max-w-xs">
        <h3 className="mb-2 text-lg font-medium">Max Students per Slot</h3>
        <p className="mb-2 text-sm text-muted">
          How many students can book the same hour on the same day?
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
