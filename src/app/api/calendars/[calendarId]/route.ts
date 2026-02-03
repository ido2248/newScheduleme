import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ calendarId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { calendarId } = await params;

  const calendar = await prisma.calendar.findUnique({
    where: { id: calendarId },
    include: {
      availabilitySlots: {
        include: {
          bookings: { orderBy: { date: "asc" } },
        },
        orderBy: [{ dayOfWeek: "asc" }, { periodNumber: "asc" }],
      },
    },
  });

  if (!calendar || calendar.teacherId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(calendar);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ calendarId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { calendarId } = await params;

  const calendar = await prisma.calendar.findUnique({
    where: { id: calendarId },
  });

  if (!calendar || calendar.teacherId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();

  const updated = await prisma.calendar.update({
    where: { id: calendarId },
    data: {
      name: body.name ?? calendar.name,
      allowedGrades: body.allowedGrades ?? calendar.allowedGrades,
      maxStudentsPerSlot: body.maxStudentsPerSlot ?? calendar.maxStudentsPerSlot,
      isActive: body.isActive ?? calendar.isActive,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ calendarId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { calendarId } = await params;

  const calendar = await prisma.calendar.findUnique({
    where: { id: calendarId },
  });

  if (!calendar || calendar.teacherId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.calendar.delete({
    where: { id: calendarId },
  });

  return NextResponse.json({ success: true });
}
