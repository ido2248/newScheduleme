import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import MonthlyCalendarView from "@/components/features/student/MonthlyCalendarView";

export default async function StudentCalendarPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const calendar = await prisma.calendar.findUnique({
    where: { code },
    include: {
      teacher: {
        select: { name: true },
      },
      availabilitySlots: {
        select: {
          id: true,
          dayOfWeek: true,
          periodNumber: true,
        },
        orderBy: [{ dayOfWeek: "asc" }, { periodNumber: "asc" }],
      },
    },
  });

  if (!calendar || !calendar.isActive) {
    notFound();
  }

  const calendarData = {
    id: calendar.id,
    name: calendar.name,
    code: calendar.code,
    teacherName: calendar.teacher.name,
    allowedGrades: calendar.allowedGrades,
    maxStudentsPerSlot: calendar.maxStudentsPerSlot,
    availabilitySlots: calendar.availabilitySlots,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-lg font-bold">
            ScheduleMe
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{calendar.name}</h1>
          <p className="text-sm text-muted">
            Teacher: {calendar.teacher.name || "Unknown"}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {calendar.allowedGrades.map((grade) => (
              <Badge key={grade} variant="info">
                Grade {grade}
              </Badge>
            ))}
            <Badge variant="default">
              Max {calendar.maxStudentsPerSlot} per slot
            </Badge>
          </div>
        </div>

        <Card>
          <MonthlyCalendarView calendar={calendarData} />
        </Card>
      </main>
    </div>
  );
}
