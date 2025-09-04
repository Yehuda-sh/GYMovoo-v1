/**
 * Simple formatting utilities
 */

/**
 * Format large numbers with K/M suffix
 */
export const formatLargeNumber = (value: number): string => {
  if (!value || isNaN(value)) return "0";
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${Math.round(value / 1000)}K`;
  return value.toString();
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals = 0): string => {
  if (!value || isNaN(value)) return "0%";
  const clampedValue = Math.min(100, Math.max(0, value));
  return `${clampedValue.toFixed(decimals)}%`;
};

/**
 * Format workout count with Hebrew pluralization
 */
export const formatWorkoutCount = (count: number): string => {
  if (!count || count === 0) return "0 אימונים";
  if (count === 1) return "אימון אחד";
  if (count === 2) return "2 אימונים";
  return `${count} אימונים`;
};

/**
 * Format days count with Hebrew pluralization
 */
export const formatDaysCount = (days: number): string => {
  if (!days || days === 0) return "0 ימים";
  if (days === 1) return "יום אחד";
  if (days === 2) return "יומיים";
  return `${days} ימים`;
};

/**
 * Format date to Hebrew locale
 */
export const formatDate = (date: string | Date): string => {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "תאריך לא חוקי";
    return dateObj.toLocaleDateString("he-IL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "תאריך לא חוקי";
  }
};

/**
 * Format time to Hebrew locale
 */
export const formatTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "שעה לא חוקית";
    return dateObj.toLocaleTimeString("he-IL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "שעה לא חוקית";
  }
};

/**
 * Format relative time
 */
export const formatRelativeTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "תאריך לא חוקי";

    const diffInMs = Date.now() - dateObj.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "היום";
    if (diffInDays === 1) return "אתמול";
    if (diffInDays === 2) return "שלשום";
    if (diffInDays <= 7) return `לפני ${diffInDays} ימים`;
    if (diffInDays <= 30) {
      const weeks = Math.floor(diffInDays / 7);
      return weeks === 1 ? "לפני שבוע" : `לפני ${weeks} שבועות`;
    }
    const months = Math.floor(diffInDays / 30);
    return months === 1 ? "לפני חודש" : `לפני ${months} חודשים`;
  } catch {
    return "תאריך לא חוקי";
  }
};

/**
 * Format duration in minutes
 */
export const formatDuration = (minutes: number): string => {
  if (!minutes || minutes === 0) return "0 דקות";
  if (minutes < 60) return `${minutes} דקות`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return hours === 1 ? "שעה" : `${hours} שעות`;
  }

  const hoursText = hours === 1 ? "שעה" : `${hours} שעות`;
  return `${hoursText} ו${remainingMinutes} דקות`;
};

/**
 * Format workout date with duration
 */
export const formatWorkoutDate = (
  date: string | Date,
  duration?: number
): string => {
  const relativeDate = formatRelativeTime(date);
  if (duration && duration > 0) {
    return `${relativeDate} • ${duration} דקות`;
  }
  return relativeDate;
};

/**
 * Calculate weekly progress
 */
export const formatWeeklyProgress = (completed: number, target: number) => {
  if (!target || target <= 0) return { percentage: 0, text: "0%" };
  const percentage = Math.min(100, Math.round((completed / target) * 100));
  return { percentage, text: `${percentage}%` };
};

/**
 * Format progress ratio
 */
export const formatProgressRatio = (
  completed: number,
  target: number,
  unit = "אימונים"
): string => {
  return `${completed}/${target} ${unit}`;
};

/**
 * Get workout icon based on type
 */
export const getWorkoutIcon = (
  workoutType?: string,
  workoutName?: string
): string => {
  const name = workoutName?.toLowerCase() || "";
  const type = workoutType?.toLowerCase() || "";

  if (name.includes("חזה") || name.includes("chest")) return "dumbbell";
  if (name.includes("רגל") || name.includes("leg") || type === "cardio")
    return "run";
  if (name.includes("גב") || name.includes("back")) return "arm-flex";
  if (name.includes("כתף") || name.includes("shoulder")) return "weight-lifter";
  if (type === "strength") return "dumbbell";
  if (type === "cardio") return "run";

  return "weight-lifter";
};

/**
 * Format equipment list to Hebrew names
 */
export const formatEquipmentList = (equipment: string[]): string => {
  if (!equipment || equipment.length === 0) return "משקל גוף";

  const equipmentMap: { [key: string]: string } = {
    dumbbells: "דמבלים",
    barbell: "מוט ומשקולות",
    bodyweight: "משקל גוף",
    resistance_bands: "גומיות התנגדות",
    cable_machine: "מכונת כבלים",
    smith_machine: "מכונת סמית",
    leg_press: "מכונת לחיצת רגליים",
    chest_press: "מכונת לחיצת חזה",
    lat_pulldown: "מכונת משיכת גב",
    rowing_machine: "מכונת חתירה",
    treadmill: "הליכון",
    bike: "אופניים",
    squat_rack: "מתקן סקווט",
    pullup_bar: "מוט משיכה",
    preacher_curl: "מכונת כפיפת זרועות",
    trx: "TRX",
    kettlebell: "קטלבול",
    foam_roller: "גלגל קצף",
    yoga_mat: "מחצלת יוגה",
    free_weights: "משקולות חופשיות",
  };

  const translatedEquipment = equipment
    .map((eq) => equipmentMap[eq.toLowerCase()] || eq)
    .filter(Boolean);

  return translatedEquipment.length > 0
    ? translatedEquipment.join(", ")
    : "משקל גוף";
};
