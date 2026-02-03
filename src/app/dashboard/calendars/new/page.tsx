import Link from "next/link";
import Card from "@/components/ui/Card";
import CalendarWizard from "@/components/features/calendar-wizard/CalendarWizard";

export default function NewCalendarPage() {
  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-sm text-muted hover:text-foreground"
        >
          &rarr; חזרה ללוחות
        </Link>
        <h1 className="mt-1 text-2xl font-bold">צור לוח חדש</h1>
        <p className="text-sm text-muted">
          הגדר את הזמינות שלך לשיעורים פרטיים.
        </p>
      </div>

      <Card>
        <CalendarWizard />
      </Card>
    </div>
  );
}
