import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { availabilityEditSchema } from "@/lib/validations";
import { getWeekRange, getMonthRange, formatHour, DAY_NAMES } from "@/lib/utils";

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
  const parsed = availabilityEditSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "קלט לא תקין.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { scope, slots: desiredSlots } = parsed.data;

  // Fetch current permanent slots
  const currentPermanentSlots = await prisma.availabilitySlot.findMany({
    where: { calendarId, validFrom: null, validUntil: null },
  });

  try {
    if (scope === "permanent") {
      await handlePermanentEdit(calendarId, currentPermanentSlots, desiredSlots);
    } else {
      const range =
        scope === "week" ? getWeekRange() : getMonthRange();
      await handleTemporaryEdit(
        calendarId,
        currentPermanentSlots,
        desiredSlots,
        range
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "";
    if (message.startsWith("SLOT_HAS_BOOKINGS:")) {
      const slotKey = message.replace("SLOT_HAS_BOOKINGS:", "");
      const [day, period] = slotKey.split("-").map(Number);
      return NextResponse.json(
        {
          error: `לא ניתן להסיר את ${formatHour(period)} ב${DAY_NAMES[day]} כי יש הזמנות עתידיות. בטל קודם את ההזמנות.`,
        },
        { status: 409 }
      );
    }
    throw error;
  }
}

interface SlotRecord {
  id: string;
  dayOfWeek: number;
  periodNumber: number;
}

async function handlePermanentEdit(
  calendarId: string,
  currentSlots: SlotRecord[],
  desiredSlots: { dayOfWeek: number; periodNumber: number }[]
) {
  const currentSet = new Set(
    currentSlots.map((s) => `${s.dayOfWeek}-${s.periodNumber}`)
  );
  const desiredSet = new Set(
    desiredSlots.map((s) => `${s.dayOfWeek}-${s.periodNumber}`)
  );

  const toAdd = desiredSlots.filter(
    (s) => !currentSet.has(`${s.dayOfWeek}-${s.periodNumber}`)
  );
  const toRemove = currentSlots.filter(
    (s) => !desiredSet.has(`${s.dayOfWeek}-${s.periodNumber}`)
  );

  await prisma.$transaction(async (tx) => {
    // Check for future bookings on slots being removed
    for (const slot of toRemove) {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      const futureBookings = await tx.booking.findFirst({
        where: {
          availabilitySlotId: slot.id,
          date: { gte: today },
        },
      });
      if (futureBookings) {
        throw new Error(
          `SLOT_HAS_BOOKINGS:${slot.dayOfWeek}-${slot.periodNumber}`
        );
      }
    }

    // Delete removed permanent slots
    if (toRemove.length > 0) {
      await tx.availabilitySlot.deleteMany({
        where: { id: { in: toRemove.map((s) => s.id) } },
      });
    }

    // Create new permanent slots
    if (toAdd.length > 0) {
      await tx.availabilitySlot.createMany({
        data: toAdd.map((s) => ({
          calendarId,
          dayOfWeek: s.dayOfWeek,
          periodNumber: s.periodNumber,
        })),
      });
    }
  });
}

async function handleTemporaryEdit(
  calendarId: string,
  currentPermanentSlots: SlotRecord[],
  desiredSlots: { dayOfWeek: number; periodNumber: number }[],
  range: { start: Date; end: Date }
) {
  const permanentSet = new Set(
    currentPermanentSlots.map((s) => `${s.dayOfWeek}-${s.periodNumber}`)
  );
  const desiredSet = new Set(
    desiredSlots.map((s) => `${s.dayOfWeek}-${s.periodNumber}`)
  );

  // Permanent slots NOT in desired → need SlotException for this range
  const toHide = currentPermanentSlots.filter(
    (s) => !desiredSet.has(`${s.dayOfWeek}-${s.periodNumber}`)
  );

  // Desired slots NOT in permanent → need temporary AvailabilitySlot
  const toAddTemp = desiredSlots.filter(
    (s) => !permanentSet.has(`${s.dayOfWeek}-${s.periodNumber}`)
  );

  await prisma.$transaction(async (tx) => {
    // Check for bookings in range on slots being hidden
    for (const slot of toHide) {
      const bookingInRange = await tx.booking.findFirst({
        where: {
          availabilitySlotId: slot.id,
          date: { gte: range.start, lte: range.end },
        },
      });
      if (bookingInRange) {
        throw new Error(
          `SLOT_HAS_BOOKINGS:${slot.dayOfWeek}-${slot.periodNumber}`
        );
      }
    }

    // Create SlotExceptions for hidden permanent slots
    for (const slot of toHide) {
      // Remove any existing overlapping exception first
      await tx.slotException.deleteMany({
        where: {
          slotId: slot.id,
          startDate: { lte: range.end },
          endDate: { gte: range.start },
        },
      });

      await tx.slotException.create({
        data: {
          slotId: slot.id,
          startDate: range.start,
          endDate: range.end,
        },
      });
    }

    // Remove any existing overlapping temporary slots for the same day+period
    for (const s of toAddTemp) {
      await tx.availabilitySlot.deleteMany({
        where: {
          calendarId,
          dayOfWeek: s.dayOfWeek,
          periodNumber: s.periodNumber,
          validFrom: { not: null },
          validUntil: { not: null },
          AND: [
            { validFrom: { lte: range.end } },
            { validUntil: { gte: range.start } },
          ],
        },
      });
    }

    // Create temporary AvailabilitySlots for additions
    if (toAddTemp.length > 0) {
      await tx.availabilitySlot.createMany({
        data: toAddTemp.map((s) => ({
          calendarId,
          dayOfWeek: s.dayOfWeek,
          periodNumber: s.periodNumber,
          validFrom: range.start,
          validUntil: range.end,
        })),
      });
    }
  });
}
