import { formatHour, formatGradeShort } from "@/lib/utils";

interface SlotBadgeProps {
  periodNumber: number;
  bookings: {
    id: string;
    studentName: string;
    studentGrade: number;
  }[];
  maxStudents: number;
  isBookable: boolean;
  onClick?: () => void;
}

export default function SlotBadge({
  periodNumber,
  bookings,
  maxStudents,
  isBookable,
  onClick,
}: SlotBadgeProps) {
  const isFull = bookings.length >= maxStudents;
  const isEmpty = bookings.length === 0;

  return (
    <div
      className={`rounded px-1.5 py-1 text-xs ${
        isFull
          ? "bg-red-50 text-red-700"
          : isEmpty
            ? "bg-green-50 text-green-700"
            : "bg-amber-50 text-amber-700"
      } ${isBookable && !isFull ? "cursor-pointer hover:ring-1 hover:ring-primary" : ""}`}
      onClick={isBookable && !isFull ? onClick : undefined}
    >
      <div className="font-medium">
        {formatHour(periodNumber)}{" "}
        <span className="font-normal">
          ({bookings.length}/{maxStudents})
        </span>
      </div>
      {bookings.length > 0 && (
        <div className="mt-0.5 space-y-0.5">
          {bookings.map((b) => (
            <div key={b.id} className="truncate">
              {b.studentName} ({formatGradeShort(b.studentGrade)})
            </div>
          ))}
        </div>
      )}
      {isBookable && !isFull && (
        <div className="mt-0.5 text-[10px] italic text-green-600">
          לחץ להזמנה
        </div>
      )}
    </div>
  );
}
