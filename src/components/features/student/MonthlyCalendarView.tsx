"use client";

import { useState, useEffect, useCallback } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import DayCell from "./DayCell";
import DayCellMobile from "./DayCellMobile";
import SlotBadge from "./SlotBadge";
import BookingForm from "./BookingForm";
import { getDaysInMonth, getFirstDayOfMonth, DAY_NAMES, DAY_NAMES_SHORT, MONTH_NAMES } from "@/lib/utils";

interface SlotException {
  startDate: string;
  endDate: string;
}

interface AvailabilitySlot {
  id: string;
  dayOfWeek: number;
  periodNumber: number;
  validFrom?: string | null;
  validUntil?: string | null;
  exceptions?: SlotException[];
}

interface Booking {
  id: string;
  studentName: string;
  studentGrade: number;
  date: string;
  availabilitySlotId: string;
}

interface CalendarData {
  id: string;
  name: string;
  code: string;
  teacherName: string | null;
  allowedGrades: number[];
  maxStudentsPerSlot: number;
  availabilitySlots: AvailabilitySlot[];
}

interface MonthlyCalendarViewProps {
  calendar: CalendarData;
}


export default function MonthlyCalendarView({
  calendar,
}: MonthlyCalendarViewProps) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [bookingModal, setBookingModal] = useState<{
    isOpen: boolean;
    slot: AvailabilitySlot | null;
    date: Date | null;
  }>({ isOpen: false, slot: null, date: null });

  const [selectedDayForMobile, setSelectedDayForMobile] = useState<{
    date: Date;
    slots: AvailabilitySlot[];
  } | null>(null);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const startDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01`;
    const endDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(daysInMonth).padStart(2, "0")}`;

    try {
      const res = await fetch(
        `/api/bookings?calendarId=${calendar.id}&startDate=${startDate}&endDate=${endDate}`
      );
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } finally {
      setLoading(false);
    }
  }, [calendar.id, currentYear, currentMonth]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }

  function handleSlotClick(slot: AvailabilitySlot, date: Date) {
    // Check 24-hour rule client-side
    const now = new Date();
    const hoursUntil = (date.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hoursUntil < 24) {
      return; // Can't book within 24 hours
    }

    setBookingModal({ isOpen: true, slot, date });
  }

  function handleDayClickMobile(date: Date, slots: AvailabilitySlot[]) {
    if (slots.length === 0) return;
    setSelectedDayForMobile({ date, slots });
  }

  // Build the calendar grid
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Get days from previous month to fill the first week
  const prevMonthDays = firstDay;
  const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const prevMonthMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonthMonth);

  const calendarDays: { date: Date; isCurrentMonth: boolean }[] = [];

  // Previous month trailing days
  for (let i = prevMonthDays - 1; i >= 0; i--) {
    calendarDays.push({
      date: new Date(Date.UTC(prevMonthYear, prevMonthMonth, daysInPrevMonth - i)),
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      date: new Date(Date.UTC(currentYear, currentMonth, i)),
      isCurrentMonth: true,
    });
  }

  // Next month leading days
  const remaining = 42 - calendarDays.length; // 6 rows * 7 days
  const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  const nextMonthMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  for (let i = 1; i <= remaining; i++) {
    calendarDays.push({
      date: new Date(Date.UTC(nextMonthYear, nextMonthMonth, i)),
      isCurrentMonth: false,
    });
  }

  // Get effective slots for a specific date, checking validFrom/validUntil and exceptions
  function getEffectiveSlotsForDate(date: Date): AvailabilitySlot[] {
    const dayOfWeek = date.getUTCDay();
    const dateStr = date.toISOString().split("T")[0];

    const seen = new Set<string>();
    return calendar.availabilitySlots.filter((slot) => {
      if (slot.dayOfWeek !== dayOfWeek) return false;

      // Check validFrom/validUntil
      if (slot.validFrom) {
        const from = typeof slot.validFrom === "string"
          ? slot.validFrom.split("T")[0]
          : new Date(slot.validFrom).toISOString().split("T")[0];
        if (dateStr < from) return false;
      }
      if (slot.validUntil) {
        const until = typeof slot.validUntil === "string"
          ? slot.validUntil.split("T")[0]
          : new Date(slot.validUntil).toISOString().split("T")[0];
        if (dateStr > until) return false;
      }

      // Check exceptions
      if (slot.exceptions && slot.exceptions.length > 0) {
        const hasException = slot.exceptions.some((ex) => {
          const exStart = typeof ex.startDate === "string"
            ? ex.startDate.split("T")[0]
            : new Date(ex.startDate).toISOString().split("T")[0];
          const exEnd = typeof ex.endDate === "string"
            ? ex.endDate.split("T")[0]
            : new Date(ex.endDate).toISOString().split("T")[0];
          return dateStr >= exStart && dateStr <= exEnd;
        });
        if (hasException) return false;
      }

      // Deduplicate by dayOfWeek+periodNumber (prefer first match)
      const key = `${slot.dayOfWeek}-${slot.periodNumber}`;
      if (seen.has(key)) return false;
      seen.add(key);

      return true;
    });
  }

  const isToday = (date: Date) =>
    date.getUTCFullYear() === today.getFullYear() &&
    date.getUTCMonth() === today.getMonth() &&
    date.getUTCDate() === today.getDate();

  const isBookable = (date: Date) => {
    const now = new Date();
    const hoursUntil = (date.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntil >= 24;
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-3 sm:mb-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={prevMonth}>
          &rarr;
        </Button>
        <h2 className="text-base sm:text-lg font-semibold text-primary">
          {MONTH_NAMES[currentMonth]} {currentYear}
        </h2>
        <Button variant="ghost" size="sm" onClick={nextMonth}>
          &larr;
        </Button>
      </div>

      {loading && (
        <div className="mb-2 text-center text-xs sm:text-sm text-muted">
          טוען הזמנות...
        </div>
      )}

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-border bg-gray-50 rounded-t-lg">
        {DAY_NAMES_SHORT.map((day, index) => (
          <div
            key={index}
            className="border-x border-border p-1.5 sm:p-3 text-center text-[10px] sm:text-xs font-semibold text-muted"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map(({ date, isCurrentMonth }, index) => {
          const slots = isCurrentMonth ? getEffectiveSlotsForDate(date) : [];

          if (isMobile) {
            return (
              <DayCellMobile
                key={index}
                date={date}
                isCurrentMonth={isCurrentMonth}
                isToday={isToday(date)}
                slotsCount={slots.length}
                hasBookableSlots={isCurrentMonth && isBookable(date) && slots.length > 0}
                onClick={() => handleDayClickMobile(date, slots)}
              />
            );
          }

          return (
            <DayCell
              key={index}
              date={date}
              isCurrentMonth={isCurrentMonth}
              isToday={isToday(date)}
              slots={slots}
              bookings={bookings}
              maxStudents={calendar.maxStudentsPerSlot}
              isBookable={isCurrentMonth && isBookable(date)}
              onSlotClick={handleSlotClick}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 sm:mt-4 flex flex-wrap gap-3 sm:gap-4 text-[10px] sm:text-xs text-muted">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-green-50 border border-green-200" />
          <span>פנוי</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-amber-50 border border-amber-200" />
          <span>הוזמן חלקית</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-red-50 border border-red-200" />
          <span>מלא</span>
        </div>
      </div>

      {/* Mobile: hint text */}
      {isMobile && (
        <p className="mt-2 text-center text-[10px] text-muted">
          לחץ על יום עם נקודה ירוקה כדי לראות שעות פנויות
        </p>
      )}

      {/* Mobile day detail modal */}
      {selectedDayForMobile && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedDayForMobile(null)}
          title={`${DAY_NAMES[selectedDayForMobile.date.getUTCDay()]}, ${selectedDayForMobile.date.getUTCDate()} ${MONTH_NAMES[selectedDayForMobile.date.getUTCMonth()]}`}
        >
          <div className="space-y-3">
            {selectedDayForMobile.slots.map((slot) => {
              const dateStr = selectedDayForMobile.date.toISOString().split("T")[0];
              const slotBookings = bookings
                .filter(
                  (b) =>
                    b.date.split("T")[0] === dateStr &&
                    b.availabilitySlotId === slot.id
                )
                .map((b) => ({
                  id: b.id,
                  studentName: b.studentName,
                  studentGrade: b.studentGrade,
                }));

              const isFull = slotBookings.length >= calendar.maxStudentsPerSlot;

              return (
                <SlotBadge
                  key={slot.id}
                  periodNumber={slot.periodNumber}
                  bookings={slotBookings}
                  maxStudents={calendar.maxStudentsPerSlot}
                  isBookable={isBookable(selectedDayForMobile.date) && !isFull}
                  onClick={() => {
                    setSelectedDayForMobile(null);
                    handleSlotClick(slot, selectedDayForMobile.date);
                  }}
                />
              );
            })}
          </div>
        </Modal>
      )}

      {/* Booking modal */}
      {bookingModal.slot && bookingModal.date && (
        <BookingForm
          isOpen={bookingModal.isOpen}
          onClose={() =>
            setBookingModal({ isOpen: false, slot: null, date: null })
          }
          onSuccess={fetchBookings}
          calendarCode={calendar.code}
          calendarName={calendar.name}
          teacherName={calendar.teacherName}
          allowedGrades={calendar.allowedGrades}
          slotId={bookingModal.slot.id}
          periodNumber={bookingModal.slot.periodNumber}
          date={bookingModal.date}
        />
      )}
    </div>
  );
}
