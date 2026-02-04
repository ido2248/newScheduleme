"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import CodeInput from "@/components/features/student/CodeInput";

export default function HomePageContent() {
  return (
    <Card className="w-full max-w-md">
      {/* Toggle Buttons */}
      <div className="mb-6 flex rounded-lg bg-gray-100 p-1">
        <button
          className="flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors bg-white text-foreground shadow-sm"
        >
          תלמיד
        </button>
        <Link
          href="/login"
          className="flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors text-muted hover:text-foreground text-center"
        >
          מורה
        </Link>
      </div>

      {/* Student Content */}
      <div>
        <p className="mb-4 text-sm text-muted">
          הזן את קוד הלוח של המורה שלך כדי לצפות בשיעורים הזמינים ולהזמין מקום.
        </p>
        <CodeInput />
      </div>
    </Card>
  );
}
