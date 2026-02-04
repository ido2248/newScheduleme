import Link from "next/link";

function CalendarIcon() {
  return (
    <svg
      className="h-8 w-8"
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

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#9333ea] to-[#c084fc] text-white">
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
