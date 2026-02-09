import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/ui/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import MonthlyCalendarView from "@/components/features/student/MonthlyCalendarView";
import { formatGrade } from "@/lib/utils";

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
          validFrom: true,
          validUntil: true,
          exceptions: {
            select: {
              startDate: true,
              endDate: true,
            },
          },
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
    availabilitySlots: calendar.availabilitySlots.map((slot) => ({
      id: slot.id,
      dayOfWeek: slot.dayOfWeek,
      periodNumber: slot.periodNumber,
      validFrom: slot.validFrom?.toISOString() ?? null,
      validUntil: slot.validUntil?.toISOString() ?? null,
      exceptions: slot.exceptions.map((ex) => ({
        startDate: ex.startDate.toISOString(),
        endDate: ex.endDate.toISOString(),
      })),
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <div className="mb-3 flex justify-end">
            <Link href="/">
              <Button variant="secondary" size="sm">
                 חזרה לדף הבית &larr;
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl font-bold">{calendar.name}</h1>
          <p className="text-sm text-muted">
            מורה: {calendar.teacher.name || "לא ידוע"}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {calendar.allowedGrades.map((grade) => (
              <Badge key={grade} variant="info">
                {formatGrade(grade)}
              </Badge>
            ))}
            <Badge variant="default">
              מקסימום {calendar.maxStudentsPerSlot} למשבצת
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
