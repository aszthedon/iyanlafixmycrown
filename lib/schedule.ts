export const scheduleConfig = {
  timezone: "America/Detroit",
  bufferMinutes: 15,
  slotStepMinutes: 15,
  weeklyHours: {
    sun: null,
    mon: null,
    tue: { start: "10:00", end: "18:00" },
    wed: { start: "10:00", end: "18:00" },
    thu: { start: "10:00", end: "18:00" },
    fri: { start: "10:00", end: "19:00" },
    sat: { start: "09:00", end: "17:00" },
  } as const,
  blockedDates: [] as string[],
};
