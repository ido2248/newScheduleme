import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { DAY_NAMES, formatGrade, formatHour } from "@/lib/utils";
import DeleteCalendarButton from "@/components/features/dashboard/DeleteCalendarButton";
import DeleteBookingButton from "@/components/features/dashboard/DeleteBookingButton";


export default async function CalendarDetailPage({
  params,
}: {
  params: Promise<{ calendarId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { calendarId } = await params;

  const calendar = await prisma.calendar.findUnique({
    where: { id: calendarId },
    include: {
      availabilitySlots: {
        include: {
          bookings: {
            orderBy: { date: "asc" },
          },
        },
        orderBy: [{ dayOfWeek: "asc" }, { periodNumber: "asc" }],
      },
    },
  });

  if (!calendar || calendar.teacherId !== session.user.id) {
    notFound();
  }

  // Show only permanent slots in the weekly overview
  const permanentSlots = calendar.availabilitySlots.filter(
    (slot) => slot.validFrom === null && slot.validUntil === null
  );

  const slotsByDay = permanentSlots.reduce(
    (acc, slot) => {
      if (!acc[slot.dayOfWeek]) acc[slot.dayOfWeek] = [];
      acc[slot.dayOfWeek].push(slot);
      return acc;
    },
    {} as Record<number, typeof permanentSlots>
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            href="/dashboard"
            className="text-sm text-muted hover:text-foreground"
          >
            &rarr; חזרה ללוחות
          </Link>
          <h1 className="mt-1 text-2xl font-bold">{calendar.name}</h1>
          <p className="text-sm text-muted">
            קוד: <span className="font-mono font-medium">{calendar.code}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <DeleteCalendarButton calendarId={calendar.id} />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Badge variant={calendar.isActive ? "success" : "default"}>
          {calendar.isActive ? "פעיל" : "לא פעיל"}
        </Badge>
        {calendar.allowedGrades.map((grade) => (
          <Badge key={grade} variant="info">
            {formatGrade(grade)}
          </Badge>
        ))}
        <Badge variant="default">
          מקסימום {calendar.maxStudentsPerSlot} למשבצת
        </Badge>
      </div>

      <h2 className="mb-4 text-lg font-semibold">לוח שבועי</h2>

      {Object.keys(slotsByDay).length === 0 ? (
        <p className="text-sm text-muted">אין משבצות זמינות מוגדרות.</p>
      ) : (
        <div className="grid gap-4">
          {Object.entries(slotsByDay)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([day, slots]) => (
              <Card key={day}>
                <h3 className="mb-3 font-semibold">
                  {DAY_NAMES[Number(day)]}
                </h3>
                <div className="grid gap-2">
                  {slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                    >
                      <div>
                        <span className="text-sm font-medium">
                          {formatHour(slot.periodNumber)}
                        </span>
                        <span className="me-2 text-xs text-muted">
                          ({slot.bookings.length}/{calendar.maxStudentsPerSlot}{" "}
                          הוזמנו)
                        </span>
                      </div>
                      {slot.bookings.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {slot.bookings.map((booking) => (
                            <div
                              key={booking.id}
                              className="flex items-center gap-1"
                            >
                              <Badge variant="warning">
                                {booking.studentName} ({formatGrade(booking.studentGrade)}) -{" "}
                                {new Date(booking.date).toLocaleDateString("he-IL")}
                              </Badge>
                              <DeleteBookingButton bookingId={booking.id} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}
