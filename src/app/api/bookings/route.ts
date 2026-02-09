import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validations";
import { formatGrade } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const calendarId = searchParams.get("calendarId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!calendarId || !startDate || !endDate) {
    return NextResponse.json(
      { error: "calendarId, startDate, and endDate are required" },
      { status: 400 }
    );
  }

  const bookings = await prisma.booking.findMany({
    where: {
      availabilitySlot: {
        calendarId,
      },
      date: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    },
    include: {
      availabilitySlot: {
        select: {
          id: true,
          dayOfWeek: true,
          periodNumber: true,
        },
      },
    },
    orderBy: { date: "asc" },
  });

  return NextResponse.json(bookings);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = bookingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { availabilitySlotId, date, studentName, studentGrade, calendarCode } =
    parsed.data;
  const bookingDate = new Date(date + "T00:00:00Z");

  // 1. Fetch the availability slot with its calendar
  const slot = await prisma.availabilitySlot.findUnique({
    where: { id: availabilitySlotId },
    include: { calendar: true },
  });

  if (!slot || slot.calendar.code !== calendarCode || !slot.calendar.isActive) {
    return NextResponse.json(
      { error: "לוח או משבצת לא תקינים." },
      { status: 404 }
    );
  }

  // 1b. Verify slot is valid for the requested date (validFrom/validUntil)
  if (slot.validFrom && bookingDate < slot.validFrom) {
    return NextResponse.json(
      { error: "משבצת זו אינה זמינה בתאריך זה." },
      { status: 400 }
    );
  }
  if (slot.validUntil && bookingDate > slot.validUntil) {
    return NextResponse.json(
      { error: "משבצת זו אינה זמינה בתאריך זה." },
      { status: 400 }
    );
  }

  // 1c. Check for SlotException hiding this slot on the requested date
  const exception = await prisma.slotException.findFirst({
    where: {
      slotId: availabilitySlotId,
      startDate: { lte: bookingDate },
      endDate: { gte: bookingDate },
    },
  });
  if (exception) {
    return NextResponse.json(
      { error: "משבצת זו אינה זמינה בתאריך זה." },
      { status: 400 }
    );
  }

  // 2. Verify the requested date falls on the correct day of week
  if (bookingDate.getUTCDay() !== slot.dayOfWeek) {
    return NextResponse.json(
      {
        error:
          "התאריך שנבחר אינו חל ביום הנכון בשבוע למשבצת זו.",
      },
      { status: 400 }
    );
  }

  // 3. Verify the student's grade is allowed
  if (!slot.calendar.allowedGrades.includes(studentGrade)) {
    return NextResponse.json(
      { error: `${formatGrade(studentGrade)} אינה מורשית בלוח זה.` },
      { status: 400 }
    );
  }

  // 4. Verify the date is not in the past
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (bookingDate < today) {
    return NextResponse.json(
      { error: "לא ניתן להזמין תאריך שעבר." },
      { status: 400 }
    );
  }

  // 5. 24-hour advance booking rule
  const now = new Date();
  const hoursUntilBooking =
    (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  if (hoursUntilBooking < 24) {
    return NextResponse.json(
      { error: "יש להזמין לפחות 24 שעות מראש." },
      { status: 400 }
    );
  }

  // 6-8. Capacity, grade-exclusive, and duplicate checks (in transaction)
  try {
    const booking = await prisma.$transaction(async (tx) => {
      const existingBookings = await tx.booking.findMany({
        where: {
          availabilitySlotId,
          date: bookingDate,
        },
      });

      // Grade-exclusive check
      if (existingBookings.length > 0) {
        const existingGrade = existingBookings[0].studentGrade;
        if (existingGrade !== studentGrade) {
          throw new Error(
            `GRADE_EXCLUSIVE:משבצת זו שמורה לתלמידי ${formatGrade(existingGrade)} בתאריך זה.`
          );
        }
      }

      // Capacity check
      if (existingBookings.length >= slot.calendar.maxStudentsPerSlot) {
        throw new Error("SLOT_FULL");
      }

      // Duplicate check
      const duplicate = existingBookings.find(
        (b) =>
          b.studentName.toLowerCase() === studentName.trim().toLowerCase()
      );
      if (duplicate) {
        throw new Error("DUPLICATE_BOOKING");
      }

      return tx.booking.create({
        data: {
          availabilitySlotId,
          date: bookingDate,
          studentName: studentName.trim(),
          studentGrade,
        },
      });
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "";
    if (message.startsWith("GRADE_EXCLUSIVE:")) {
      return NextResponse.json(
        { error: message.replace("GRADE_EXCLUSIVE:", "") },
        { status: 409 }
      );
    }
    if (message === "SLOT_FULL") {
      return NextResponse.json(
        { error: "משבצת זו כבר מלאה." },
        { status: 409 }
      );
    }
    if (message === "DUPLICATE_BOOKING") {
      return NextResponse.json(
        { error: "כבר הזמנת משבצת זו." },
        { status: 409 }
      );
    }
    throw error;
  }
}
