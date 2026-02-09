-- Partial unique index: ensures only one permanent slot per calendar+day+period
-- (permanent slots have validFrom IS NULL AND validUntil IS NULL)
CREATE UNIQUE INDEX "AvailabilitySlot_permanent_unique"
ON "AvailabilitySlot" ("calendarId", "dayOfWeek", "periodNumber")
WHERE "validFrom" IS NULL AND "validUntil" IS NULL;
