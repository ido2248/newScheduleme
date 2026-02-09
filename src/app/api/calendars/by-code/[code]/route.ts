import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
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
    return NextResponse.json(
      { error: "Calendar not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: calendar.id,
    name: calendar.name,
    code: calendar.code,
    teacherName: calendar.teacher.name,
    allowedGrades: calendar.allowedGrades,
    maxStudentsPerSlot: calendar.maxStudentsPerSlot,
    availabilitySlots: calendar.availabilitySlots,
  });
}
