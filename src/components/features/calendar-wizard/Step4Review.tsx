import Badge from "@/components/ui/Badge";
import { DAY_NAMES } from "@/lib/utils";

interface Step4Props {
  name: string;
  allowedGrades: number[];
  selectedDays: number[];
  hoursByDay: Record<number, number[]>;
  maxStudentsPerSlot: number;
}

export default function Step4Review({
  name,
  allowedGrades,
  selectedDays,
  hoursByDay,
  maxStudentsPerSlot,
}: Step4Props) {
  const totalSlots = Object.values(hoursByDay).reduce(
    (sum, hours) => sum + hours.length,
    0
  );

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Review Your Calendar</h3>

      <div className="rounded-lg border border-border p-4">
        <div className="space-y-4">
          <div>
            <span className="text-sm text-muted">Calendar Name</span>
            <p className="font-medium">{name}</p>
          </div>

          <div>
            <span className="text-sm text-muted">Allowed Grades</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {allowedGrades.map((grade) => (
                <Badge key={grade} variant="info">
                  Grade {grade}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <span className="text-sm text-muted">Max Students per Slot</span>
            <p className="font-medium">{maxStudentsPerSlot}</p>
          </div>

          <div>
            <span className="text-sm text-muted">
              Schedule ({totalSlots} total slots)
            </span>
            <div className="mt-2 space-y-2">
              {selectedDays.map((day) => (
                <div key={day}>
                  <span className="text-sm font-medium">
                    {DAY_NAMES[day]}:
                  </span>{" "}
                  <span className="text-sm text-muted">
                    {(hoursByDay[day] || [])
                      .map((h) => `Hour ${h}`)
                      .join(", ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
