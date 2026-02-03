import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Button from "@/components/ui/Button";
import CalendarCard from "@/components/features/dashboard/CalendarCard";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const calendars = await prisma.calendar.findMany({
    where: { teacherId: session.user.id },
    include: {
      availabilitySlots: {
        select: {
          dayOfWeek: true,
          periodNumber: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">הלוחות שלי</h1>
          <p className="text-sm text-muted">
            נהל את לוחות הזמנים שלך
          </p>
        </div>
        <Link href="/dashboard/calendars/new">
          <Button>צור לוח חדש</Button>
        </Link>
      </div>

      {calendars.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <h3 className="text-lg font-medium">אין לוחות עדיין</h3>
          <p className="mt-1 text-sm text-muted">
            צור את הלוח הראשון שלך כדי להתחיל לתזמן שיעורים.
          </p>
          <Link href="/dashboard/calendars/new" className="mt-4 inline-block">
            <Button>צור לוח</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {calendars.map((calendar) => (
            <CalendarCard key={calendar.id} calendar={calendar} />
          ))}
        </div>
      )}
    </div>
  );
}
