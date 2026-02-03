"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { DAY_NAMES } from "@/lib/utils";

interface CalendarCardProps {
  calendar: {
    id: string;
    name: string;
    code: string;
    allowedGrades: number[];
    maxStudentsPerSlot: number;
    isActive: boolean;
    availabilitySlots: {
      dayOfWeek: number;
      periodNumber: number;
    }[];
  };
}

export default function CalendarCard({ calendar }: CalendarCardProps) {
  const [copied, setCopied] = useState(false);

  const uniqueDays = [...new Set(calendar.availabilitySlots.map((s) => s.dayOfWeek))];

  function copyCode() {
    navigator.clipboard.writeText(calendar.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{calendar.name}</h3>
          <button
            onClick={copyCode}
            className="mt-1 flex items-center gap-1 text-sm text-muted hover:text-foreground"
            title="Click to copy code"
          >
            <span className="font-mono">{calendar.code}</span>
            <span className="text-xs">
              {copied ? "(copied!)" : "(click to copy)"}
            </span>
          </button>
        </div>
        <Badge variant={calendar.isActive ? "success" : "default"}>
          {calendar.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-1">
        {calendar.allowedGrades.map((grade) => (
          <Badge key={grade} variant="info">
            Grade {grade}
          </Badge>
        ))}
      </div>

      <p className="text-sm text-muted">
        {calendar.availabilitySlots.length} slots across{" "}
        {uniqueDays.map((d) => DAY_NAMES[d]).join(", ")}
      </p>

      <p className="text-sm text-muted">
        Max {calendar.maxStudentsPerSlot} student{calendar.maxStudentsPerSlot > 1 ? "s" : ""} per slot
      </p>

      <div className="mt-auto flex gap-2 pt-2">
        <Link href={`/dashboard/calendars/${calendar.id}`} className="flex-1">
          <Button variant="secondary" size="sm" className="w-full">
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
}
