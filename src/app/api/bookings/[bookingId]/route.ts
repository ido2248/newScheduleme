import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bookingId } = await params;

  // Verify the booking belongs to a calendar owned by this teacher
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      availabilitySlot: {
        include: {
          calendar: true,
        },
      },
    },
  });

  if (!booking || booking.availabilitySlot.calendar.teacherId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.booking.delete({
    where: { id: bookingId },
  });

  return NextResponse.json({ success: true });
}
