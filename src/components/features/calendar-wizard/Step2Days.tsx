import Checkbox from "@/components/ui/Checkbox";
import { DAY_NAMES } from "@/lib/utils";

interface Step2Props {
  selectedDays: number[];
  onDaysChange: (days: number[]) => void;
}

export default function Step2Days({ selectedDays, onDaysChange }: Step2Props) {
  function toggleDay(day: number) {
    if (selectedDays.includes(day)) {
      onDaysChange(selectedDays.filter((d) => d !== day));
    } else {
      onDaysChange([...selectedDays, day].sort());
    }
  }

  return (
    <div>
      <h3 className="mb-2 text-lg font-medium">Available Days</h3>
      <p className="mb-4 text-sm text-muted">
        Select which days of the week you are available for private lessons.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {DAY_NAMES.map((dayName, index) => (
          <Checkbox
            key={index}
            label={dayName}
            checked={selectedDays.includes(index)}
            onChange={() => toggleDay(index)}
          />
        ))}
      </div>
    </div>
  );
}
