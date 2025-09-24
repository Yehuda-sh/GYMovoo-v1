// src/utils/formatters.ts
/**
 * Simple, mobile-first formatting utilities (Hebrew/RTL-friendly)
 */

/**
 * Format large numbers with K/M suffix (keeps sign, trims .0)
 * Examples: 1,200 -> "1K", 1,250 -> "1K", 1,500 -> "2K", 1,200,000 -> "1.2M"
 */
export const formatLargeNumber = (value: number): string => {
  if (!Number.isFinite(value)) return "0";
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);

  if (abs >= 1_000_000) {
    const n = (abs / 1_000_000).toFixed(1).replace(/\.0$/, "");
    return `${sign}${n}M`;
  }
  if (abs >= 1_000) {
    // round to nearest thousand for compactness
    const n = Math.round(abs / 1_000);
    return `${sign}${n}K`;
  }
  return `${sign}${abs}`;
};

/**
 * Format relative time in Hebrew (coarse, human-friendly)
 * Input: ISO string or Date
 * Output: "היום" | "אתמול" | "שלשום" | "לפני X ימים/שבוע/שבועות/חודשים"
 */
export const formatRelativeTime = (date: string | Date): string => {
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    if (!Number.isFinite(d.getTime())) return "תאריך לא חוקי";

    const ms = Date.now() - d.getTime();
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    if (days <= 0) return "היום";
    if (days === 1) return "אתמול";
    if (days === 2) return "שלשום";
    if (days <= 7) return `לפני ${days} ימים`;
    if (days <= 30) {
      const weeks = Math.floor(days / 7);
      return weeks === 1 ? "לפני שבוע" : `לפני ${weeks} שבועות`;
    }
    const months = Math.floor(days / 30);
    return months === 1 ? "לפני חודש" : `לפני ${months} חודשים`;
  } catch {
    return "תאריך לא חוקי";
  }
};

/**
 * Format workout date with optional duration (in minutes)
 * Example: "לפני שבוע • 45 ד׳"
 */
export const formatWorkoutDate = (
  date: string | Date,
  duration?: number
): string => {
  const relative = formatRelativeTime(date);
  if (Number.isFinite(duration) && (duration as number) > 0) {
    return `${relative} • ${Math.round(duration as number)} ד׳`;
  }
  return relative;
};

/**
 * Calculate weekly progress → { percentage, text }
 * Safe for zero/negative target; clamps to 0..100
 */
export const formatWeeklyProgress = (completed: number, target: number) => {
  if (!Number.isFinite(target) || target <= 0) {
    return { percentage: 0, text: "0%" };
  }
  const pct = Math.max(
    0,
    Math.min(100, Math.round((completed / target) * 100))
  );
  return { percentage: pct, text: `${pct}%` };
};

/**
 * Format progress ratio (e.g., "3/4 אימונים")
 */
export const formatProgressRatio = (
  completed: number,
  target: number,
  unit = "אימונים"
): string => {
  const c = Number.isFinite(completed) ? completed : 0;
  const t = Number.isFinite(target) ? target : 0;
  return `${c}/${t} ${unit}`;
};

/**
 * Get a MaterialCommunityIcons icon name by workout type/name (best-effort)
 * Returns a valid MDI name string
 */
export const getWorkoutIcon = (
  workoutType?: string,
  workoutName?: string
): string => {
  const name = (workoutName || "").toLowerCase();
  const type = (workoutType || "").toLowerCase();

  if (name.includes("חזה") || name.includes("chest")) return "dumbbell";
  if (name.includes("רגל") || name.includes("leg")) return "run";
  if (type === "cardio") return "run";
  if (name.includes("גב") || name.includes("back")) return "arm-flex";
  if (name.includes("כתף") || name.includes("shoulder")) return "weight-lifter";
  if (type === "strength") return "dumbbell";

  return "weight-lifter";
};

/**
 * Format equipment list to Hebrew (case-insensitive); defaults to "משקל גוף"
 */
export const formatEquipmentList = (equipment: string[]): string => {
  if (!Array.isArray(equipment) || equipment.length === 0) return "משקל גוף";

  const map: Record<string, string> = {
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
    foam_roller: "גליל עיסוי",
    yoga_mat: "מחצלת יוגה",
    free_weights: "משקולות חופשיות",
  };

  const translated = equipment
    .map((eq) => (typeof eq === "string" ? map[eq.toLowerCase()] || eq : ""))
    .filter((s) => !!s);

  return translated.length > 0 ? translated.join(", ") : "משקל גוף";
};

/**
 * Format duration in minutes:
 *  - < 60 → "XX ד׳"
 *  - >= 60 with remainder → "H:MM ש׳"
 *  - exact hours → "H ש׳"
 */
export const formatDuration = (minutes: number): string => {
  if (!Number.isFinite(minutes) || minutes <= 0) return "0 ד׳";
  const m = Math.round(minutes);
  if (m < 60) return `${m} ד׳`;

  const h = Math.floor(m / 60);
  const r = m % 60;
  if (r === 0) return `${h} ש׳`;
  return `${h}:${String(r).padStart(2, "0")} ש׳`;
};

/**
 * Format weight (kg):
 *  - invalid → "0 ק״ג"
 *  - >= 1000 kg → tons with one decimal (e.g., "1.2 טון")
 *  - otherwise → one decimal, but trim trailing .0
 */
export const formatWeight = (weight: number): string => {
  if (!Number.isFinite(weight)) return "0 ק״ג";
  const sign = weight < 0 ? "-" : "";
  const abs = Math.abs(weight);

  if (abs >= 1000) {
    const t = (abs / 1000).toFixed(1).replace(/\.0$/, "");
    return `${sign}${t} טון`;
    // Note: If you prefer metric tons explicitly, keep "טון" as is.
  }

  const kg = abs.toFixed(1).replace(/\.0$/, "");
  return `${sign}${kg} ק״ג`;
};
