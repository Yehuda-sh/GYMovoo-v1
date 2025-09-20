/**
 * דוגמה לשימוש ב-Hook ה-RTL החדש
 *
 * דוגמאות קוד לשימוש ב-useRTL ו-useHebrewFormatters:
 *
 * // שימוש בסיסי ב-Hook
 * const { isRTL, textAlign, flexDirection, writingDirection } = useRTL();
 *
 * // שימוש בפורמטרים בעברית
 * const { formatNumber, formatDate, formatCurrency } = useHebrewFormatters();
 *
 * // דוגמה לקומפוננטה עם RTL
 * <View style={{ flexDirection }}>
 *   <Text style={{ textAlign, writingDirection }}>
 *     טקסט בעברית
 *   </Text>
 * </View>
 *
 * // דוגמה לפורמטים
 * <Text>{formatNumber(12345)}</Text> // "12,345"
 * <Text>{formatDate(new Date())}</Text> // "1 בינואר 2024"
 * <Text>{formatCurrency(99.99)}</Text> // "99.99 ₪"
 */
