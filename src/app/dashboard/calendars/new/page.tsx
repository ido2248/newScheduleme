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
          &larr; Back to calendars
        </Link>
        <h1 className="mt-1 text-2xl font-bold">Create New Calendar</h1>
        <p className="text-sm text-muted">
          Set up your availability for private lessons.
        </p>
      </div>

      <Card>
        <CalendarWizard />
      </Card>
    </div>
  );
}
