import Link from "next/link";
import { ReactNode } from "react";

function CalendarIcon() {
  return (
    <svg
      className="h-7 w-7"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

interface HeaderProps {
  variant?: "simple" | "dashboard";
  userName?: string | null;
  logoutForm?: ReactNode;
}

export default function Header({ variant = "simple", userName, logoutForm }: HeaderProps) {
  // Dashboard variant: 3-column layout
  if (variant === "dashboard") {
    return (
      <header className="sticky top-0 z-50 bg-linear-to-r from-primary to-primary-border text-white">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            
            {/* RIGHT: Logo/title (in RTL this appears on right) */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">ScheduleMe</span>
                  <CalendarIcon />
                </div>
                <p className="text-xs text-white/70">
                  האפליקציה החכמה לשיעורים עם המורים
                </p>
              </div>
            </Link>

            {/* CENTER: Navigation */}
            <nav className="flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                הלוחות שלי
              </Link>
              <Link
                href="/dashboard/calendars/new"
                className="text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                צור לוח
              </Link>
            </nav>

            {/* LEFT: User info + logout (in RTL this appears on left) */}
            <div className="flex items-center gap-3">
              {userName && (
                <span className="text-sm text-white/80">{userName}</span>
              )}
              {logoutForm}
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Simple variant: centered layout (default)
  return (
    <header className="sticky top-0 z-50 bg-linear-to-r from-primary to-primary-border text-white">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <Link href="/" className="block">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">ScheduleMe</span>
              <CalendarIcon />
            </div>
            <p className="mt-1 text-sm text-white/80">
              האפליקציה החכמה לשיעורים עם המורים
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
