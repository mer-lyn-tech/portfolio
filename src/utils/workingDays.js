// src/utils/workingDays.js
// Internship working-day helpers for PM-VIKAS

/**
 * Returns true if the given date is a working day.
 * Working days = Mon–Fri + all Saturdays EXCEPT the 2nd Saturday of the month.
 * Sundays are never working days.
 */
export function isWorkingDay(date) {
  const day = date.getDay();
  // Sunday: never a working day
  if (day === 0) return false;
  // 2nd Saturday of the month: not a working day
  if (day === 6) {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstSaturdayDate = ((6 - firstDayOfMonth.getDay() + 7) % 7) + 1;
    const secondSaturdayDate = firstSaturdayDate + 7;
    if (date.getDate() === secondSaturdayDate) return false;
  }
  return true;
}

/**
 * Count total working days (inclusive) between startDate and endDate.
 */
export function getTotalWorkingDays(startDate, endDate) {
  let count = 0;
  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  while (current <= end) {
    if (isWorkingDay(current)) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
}

/**
 * Calculate the end date of the internship given a start date and
 * the total number of working days required.
 */
export function getInternshipEndDate(startDate, totalDays) {
  let count = 0;
  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);
  while (count < totalDays) {
    if (isWorkingDay(current)) count++;
    if (count < totalDays) current.setDate(current.getDate() + 1);
  }
  return new Date(current);
}

// ── Internship constants ──
export const INTERNSHIP_START = new Date('2026-06-19');
export const INTERNSHIP_TOTAL_DAYS = 45;
export const INTERNSHIP_END = getInternshipEndDate(INTERNSHIP_START, INTERNSHIP_TOTAL_DAYS);
