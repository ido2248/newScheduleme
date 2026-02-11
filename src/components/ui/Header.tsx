"use client";

import { useState } from "react";
import Link from "next/link";
import { ReactNode } from "react";

function CalendarIcon() {
  return (
    <svg
      className="h-6 w-6 sm:h-7 sm:w-7"
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dashboard variant: responsive layout with hamburger menu on mobile
  if (variant === "dashboard") {
    return (
      <header className="sticky top-0 z-50 bg-linear-to-r from-primary to-primary-border text-white">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:py-4">
          {/* Mobile layout */}
          <div className="flex items-center justify-between sm:hidden">
            {/* Hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 hover:bg-white/10 transition-colors"
              aria-label="תפריט"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Compact logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold">ScheduleMe</span>
              <CalendarIcon />
            </Link>

            {/* User name */}
            <div className="max-w-20 truncate text-sm text-white/80">
              {userName}
            </div>
          </div>

          {/* Mobile dropdown menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden mt-3 space-y-1 border-t border-white/20 pt-3">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                הלוחות שלי
              </Link>
              <Link
                href="/dashboard/calendars/new"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                צור לוח
              </Link>
              <div className="border-t border-white/20 mt-2 pt-2 px-3 py-2">
                {logoutForm}
              </div>
            </div>
          )}

          {/* Desktop layout */}
          <div className="hidden sm:flex items-center justify-between">
            {/* RIGHT: Logo/title (in RTL this appears on right) */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <span className="text-2xl md:text-3xl font-bold">ScheduleMe</span>
                  <CalendarIcon />
                </div>
                <p className="text-xs text-white/70">
                  האפליקציה החכמה לשיעורים עם המורים
                </p>
              </div>
            </Link>

            {/* CENTER: Navigation */}
            <nav className="flex items-center gap-4 md:gap-6">
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
      <div className="mx-auto max-w-6xl px-4 py-4 sm:py-6">
        <Link href="/" className="block">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl font-bold">ScheduleMe</span>
              <CalendarIcon />
            </div>
            <p className="mt-1 text-xs sm:text-sm text-white/80">
              האפליקציה החכמה לשיעורים עם המורים
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
