import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calendarCreateSchema } from "@/lib/validations";
import { generateCalendarCode } from "@/lib/utils";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const calendars = await prisma.calendar.findMany({
    where: { teacherId: session.user.id },
    include: {
      availabilitySlots: {
        select: { dayOfWeek: true, periodNumber: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(calendars);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = calendarCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const code = generateCalendarCode();

  const calendar = await prisma.calendar.create({
    data: {
      teacherId: session.user.id,
      name: parsed.data.name,
      code,
      allowedGrades: parsed.data.allowedGrades,
      maxStudentsPerSlot: parsed.data.maxStudentsPerSlot,
      availabilitySlots: {
        create: parsed.data.availabilitySlots.map((slot) => ({
          dayOfWeek: slot.dayOfWeek,
          periodNumber: slot.periodNumber,
        })),
      },
    },
    include: { availabilitySlots: true },
  });

  return NextResponse.json(calendar, { status: 201 });
}
