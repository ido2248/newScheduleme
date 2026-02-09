interface DayCellMobileProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  slotsCount: number;
  hasBookableSlots: boolean;
  onClick: () => void;
}

export default function DayCellMobile({
  date,
  isCurrentMonth,
  isToday,
  slotsCount,
  hasBookableSlots,
  onClick,
}: DayCellMobileProps) {
  const hasSlots = slotsCount > 0;

  return (
    <div
      className={`min-h-[44px] border border-border flex flex-col items-center justify-center p-1 ${
        !isCurrentMonth ? "bg-gray-50 opacity-50" : "bg-white"
      } ${hasBookableSlots ? "cursor-pointer active:bg-primary-light" : ""}`}
      onClick={hasBookableSlots ? onClick : undefined}
    >
      <div
        className={`text-xs font-medium leading-none ${
          isToday
            ? "flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white"
            : "text-muted"
        }`}
      >
        {date.getDate()}
      </div>

      {hasSlots && isCurrentMonth && (
        <div className="mt-1 flex items-center gap-0.5">
          <div
            className={`h-1.5 w-1.5 rounded-full ${
              hasBookableSlots ? "bg-green-500" : "bg-gray-300"
            }`}
          />
          {slotsCount > 1 && (
            <span className="text-[8px] text-muted">{slotsCount}</span>
          )}
        </div>
      )}
    </div>
  );
}
