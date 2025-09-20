import { useEffect, useState } from "react";
import { isRTL, getRTLStyles, getDynamicStyles } from "../utils/rtlHelpers";

/**
 * Hook מותאם אישית לניהול RTL באפליקציה
 */
export const useRTL = () => {
  const [rtl, setRtl] = useState(isRTL());

  useEffect(() => {
    // רענן בכל render במקרה שהשתנה
    const currentRTL = isRTL();
    if (currentRTL !== rtl) {
      setRtl(currentRTL);
    }
  }, [rtl]);

  return {
    // מצב בסיסי
    isRTL: rtl,
    textAlign: rtl ? "right" : "left",
    flexDirection: rtl ? "row-reverse" : "row",
    writingDirection: rtl ? "rtl" : "ltr",

    // סגנונות מורכבים
    rtlStyles: getRTLStyles(),
    dynamicStyles: (spacing?: number) => getDynamicStyles(spacing),

    // עזרים
    alignItems: rtl ? "flex-end" : "flex-start",
    justifyContent: rtl ? "flex-end" : "flex-start",
    marginStart: rtl ? "marginRight" : "marginLeft",
    marginEnd: rtl ? "marginLeft" : "marginRight",
    paddingStart: rtl ? "paddingRight" : "paddingLeft",
    paddingEnd: rtl ? "paddingLeft" : "paddingRight",
  };
};

/**
 * Hook לפורמטים בעברית
 */
export const useHebrewFormatters = () => {
  return {
    formatNumber: (num: number) => num.toLocaleString("he-IL"),
    formatDate: (date: Date) => date.toLocaleDateString("he-IL"),
    formatTime: (date: Date) => date.toLocaleTimeString("he-IL"),
    formatCurrency: (amount: number) => `${amount.toLocaleString("he-IL")} ₪`,
    formatPercent: (value: number) => `${value.toFixed(1)}%`,
  };
};
