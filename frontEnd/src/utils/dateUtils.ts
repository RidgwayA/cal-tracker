export function getUserTimeZone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return tz || "UTC";
  } catch {
    return "UTC";
  }
}

/** Format a Date as YYYY-MM-DD IN the given time zone (defaults to the user's tz). */
export function ymdInTZ(
  date: Date = new Date(),
  timeZone: string = getUserTimeZone()
): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find(p => p.type === "year")!.value;
  const month = parts.find(p => p.type === "month")!.value;
  const day = parts.find(p => p.type === "day")!.value;

  return `${year}-${month}-${day}`;
}

/** Today as YYYY-MM-DD in the user's time zone (or a provided tz). */
export const getTodayDate = (timeZone: string = getUserTimeZone()): string => {
  return ymdInTZ(new Date(), timeZone);
};

/** Human-readable label for a YYYY-MM-DD in a given tz (default: user's tz). */
export function formatReadableDate(
  ymd: string,
  timeZone: string = getUserTimeZone()
): string {
  const [y, m, d] = ymd.split("-").map(Number);
  if (!y || !m || !d) return "";
  // Anchor at noon UTC to avoid DST/offset edge cases when rendering
  const noonUtc = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  return noonUtc.toLocaleDateString("en-US", {
    timeZone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** True if the given YYYY-MM-DD equals “today” in the given tz (default: user's tz). */
export function isToday(ymd: string, timeZone: string = getUserTimeZone()): boolean {
  return ymd === getTodayDate(timeZone);
}

/** Lexicographic compare for YYYY-MM-DD. Returns -1, 0, 1. */
export function compareYMD(a: string, b: string): -1 | 0 | 1 {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

/** Add N days to a YYYY-MM-DD and return a new YYYY-MM-DD (in the given tz). */
export function addDaysYMD(
  ymd: string,
  days: number,
  timeZone: string = getUserTimeZone()
): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const noonUtc = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  noonUtc.setUTCDate(noonUtc.getUTCDate() + days);
  return ymdInTZ(noonUtc, timeZone);
}

export function canEditDate(
  ymd: string,
  {
    allowPast = true,
    allowFuture = false,
    timeZone = getUserTimeZone(),
  }: { allowPast?: boolean; allowFuture?: boolean; timeZone?: string } = {}
): boolean {
  const today = getTodayDate(timeZone);
  const cmp = compareYMD(ymd, today);
  if (cmp === 0) return true;         // today
  if (cmp < 0) return !!allowPast;    // past
  return !!allowFuture;               // future
}

/** Optional: short label like "August 14, 2025" in the user's tz. */
export function formatShortDate(
  ymd: string,
  timeZone: string = getUserTimeZone()
): string {
  const [y, m, d] = ymd.split("-").map(Number);
  if (!y || !m || !d) return "";
  const noonUtc = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  return noonUtc.toLocaleDateString("en-US", {
    timeZone,
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
