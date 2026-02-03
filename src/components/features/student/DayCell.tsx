import SlotBadge from "./SlotBadge";

interface Booking {
  id: string;
  studentName: string;
  studentGrade: number;
  date: string;
  availabilitySlotId: string;
}

interface AvailabilitySlot {
  id: string;
  dayOfWeek: number;
  periodNumber: number;
}

interface DayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  slots: AvailabilitySlot[];
  bookings: Booking[];
  maxStudents: number;
  isBookable: boolean;
  onSlotClick: (slot: AvailabilitySlot, date: Date) => void;
}

export default function DayCell({
  date,
  isCurrentMonth,
  isToday,
  slots,
  bookings,
  maxStudents,
  isBookable,
  onSlotClick,
}: DayCellProps) {
  const dateStr = date.toISOString().split("T")[0];
  const dayBookings = bookings.filter(
    (b) => b.date.split("T")[0] === dateStr
  );

  return (
    <div
      className={`min-h-[100px] border border-border p-1 ${
        !isCurrentMonth ? "bg-gray-50 opacity-50" : "bg-white"
      }`}
    >
      <div
        className={`mb-1 text-right text-xs font-medium ${
          isToday
            ? "flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white ml-auto"
            : "text-muted"
        }`}
      >
        {date.getDate()}
      </div>

      <div className="space-y-1">
        {slots.map((slot) => {
          const slotBookings = dayBookings
            .filter((b) => b.availabilitySlotId === slot.id)
            .map((b) => ({
              id: b.id,
              studentName: b.studentName,
              studentGrade: b.studentGrade,
            }));

          return (
            <SlotBadge
              key={slot.id}
              periodNumber={slot.periodNumber}
              bookings={slotBookings}
              maxStudents={maxStudents}
              isBookable={isBookable}
              onClick={() => onSlotClick(slot, date)}
            />
          );
        })}
      </div>
    </div>
  );
}
