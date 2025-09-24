// src/hooks/useRTL.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import { isRTL, getRTLStyles, getDynamicStyles } from "../utils/rtlHelpers";
import type { ViewStyle, TextStyle } from "react-native";

/**
 * Hook לניהול RTL: מחזיר דגל, עזרים וכיווני טקסט/פריסה.
 * קליל, יציב, ולא יוצר אובייקטים חדשים בכל רנדר.
 */
export const useRTL = () => {
  const [rtl, setRtl] = useState<boolean>(isRTL());

  // רענון פנימי אם השתנה מקור האמת (למקרה נדיר של שינוי דינמי)
  useEffect(() => {
    const current = isRTL();
    if (current !== rtl) setRtl(current);
  }, [rtl]);

  // פונקציה יזומה לרענון ידני (אם תצטרך לכפתור/אירוע)
  const refreshRTL = useCallback(() => {
    setRtl(isRTL());
  }, []);

  // ערכים לוגיים יציבים
  const textAlign = useMemo<TextStyle["textAlign"]>(
    () => (rtl ? "right" : "left"),
    [rtl]
  );
  const flexDirection = useMemo<ViewStyle["flexDirection"]>(
    () => (rtl ? "row-reverse" : "row"),
    [rtl]
  );
  const writingDirection = useMemo<TextStyle["writingDirection"]>(
    () => (rtl ? "rtl" : "ltr"),
    [rtl]
  );
  const alignItems = useMemo<ViewStyle["alignItems"]>(
    () => (rtl ? "flex-end" : "flex-start"),
    [rtl]
  );
  const justifyContent = useMemo<ViewStyle["justifyContent"]>(
    () => (rtl ? "flex-end" : "flex-start"),
    [rtl]
  );

  // מחזירים פונקציות שמייצרות style נכון (במקום מחרוזות של שמות-מפתחות)
  const logicalMargin = useCallback(
    (start = 0, end = 0): ViewStyle =>
      rtl
        ? { marginRight: start, marginLeft: end }
        : { marginLeft: start, marginRight: end },
    [rtl]
  );
  const logicalPadding = useCallback(
    (start = 0, end = 0): ViewStyle =>
      rtl
        ? { paddingRight: start, paddingLeft: end }
        : { paddingLeft: start, paddingRight: end },
    [rtl]
  );

  // סגנונות מה-helpers (יוצר פעם לכל שינוי RTL)
  const rtlStyles = getRTLStyles();
  const dynamicStyles = useCallback(
    (spacing?: number) => getDynamicStyles(spacing),
    []
  );

  return {
    // מצב בסיסי
    isRTL: rtl,
    textAlign,
    flexDirection,
    writingDirection,

    // עזרים פרקטיים
    alignItems,
    justifyContent,
    logicalMargin,
    logicalPadding,

    // סגנונות מוכנים
    rtlStyles,
    dynamicStyles,

    // רענון ידני (אופציונלי לשימושך)
    refreshRTL,
  };
};

/**
 * Hook לפורמטים בעברית – מספרים, תאריך, שעה, מטבע, אחוז.
 * עם גיבוי פשוט במקרה שאין Intl (נדיר היום, אבל בטוח).
 */
export const useHebrewFormatters = () => {
  return {
    formatNumber: (num: number) => {
      try {
        return new Intl.NumberFormat("he-IL").format(num);
      } catch {
        return String(num);
      }
    },
    formatDate: (date: Date) => {
      try {
        return new Intl.DateTimeFormat("he-IL").format(date);
      } catch {
        return date.toDateString();
      }
    },
    formatTime: (date: Date) => {
      try {
        return new Intl.DateTimeFormat("he-IL", { timeStyle: "short" }).format(
          date
        );
      } catch {
        return date.toTimeString().slice(0, 5);
      }
    },
    formatCurrency: (amount: number) => {
      try {
        return new Intl.NumberFormat("he-IL", {
          style: "currency",
          currency: "ILS",
          maximumFractionDigits: 0,
        }).format(amount);
      } catch {
        return `${amount} ₪`;
      }
    },
    formatPercent: (value: number) => {
      if (!isFinite(value)) return "0%";
      try {
        return new Intl.NumberFormat("he-IL", {
          style: "percent",
          maximumFractionDigits: 1,
        }).format(value / 100);
      } catch {
        return `${value.toFixed(1)}%`;
      }
    },
  };
};
