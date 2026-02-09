-- DropIndex
DROP INDEX "AvailabilitySlot_calendarId_dayOfWeek_periodNumber_key";

-- AlterTable
ALTER TABLE "AvailabilitySlot" ADD COLUMN     "validFrom" DATE,
ADD COLUMN     "validUntil" DATE;

-- CreateTable
CREATE TABLE "SlotException" (
    "id" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,

    CONSTRAINT "SlotException_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SlotException_slotId_idx" ON "SlotException"("slotId");

-- CreateIndex
CREATE INDEX "SlotException_slotId_startDate_endDate_idx" ON "SlotException"("slotId", "startDate", "endDate");

-- CreateIndex
CREATE INDEX "AvailabilitySlot_calendarId_dayOfWeek_periodNumber_idx" ON "AvailabilitySlot"("calendarId", "dayOfWeek", "periodNumber");

-- AddForeignKey
ALTER TABLE "SlotException" ADD CONSTRAINT "SlotException_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "AvailabilitySlot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
