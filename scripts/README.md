# 🔧 GYMovoo Build Scripts

## 📋 Available Scripts

### `rtl-audit.mjs` - RTL Audit Tool

כלי בדיקה ותיקון אוטומטי לבעיות RTL בפרויקט.

#### שימוש:

```bash
# בדיקה בלבד (ללא שינויים)
npm run rtl:audit

# בדיקה עם תיקונים אוטומטיים
npm run rtl:fix

# בדיקה מפורטת (כולל דפוסים טובים)
npm run rtl:verbose

# הרצה ישירה עם פרמטרים
node scripts/rtl-audit.mjs --fix --verbose
```

#### מה הכלי בודק:

**✅ תיקונים אוטומטיים:**

- `marginLeft` → `marginStart`
- `marginRight` → `marginEnd`
- `paddingLeft` → `paddingStart`
- `paddingRight` → `paddingEnd`
- `borderLeftWidth` → `borderStartWidth`
- `borderRightWidth` → `borderEndWidth`
- `left` → `start` (position)
- `right` → `end` (position)

**👀 בדיקה ידנית נדרשת:**

- `flexDirection: "row"` - כדאי `row-reverse` ב-RTL
- `textAlign: "left"/"right"` - כדאי להשתמש ב-`getTextAlign()`
- `writingDirection` - כדאי להשתמש ב-`getTextDirection()`

**⚠️ דפוסים בעייתיים:**

- `I18nManager.isRTL` - צריך להשתמש ב-`isRTL()` מ-rtlHelpers
- אימוג'ים לפני טקסט עברי - צריך להיות אחרי

**✅ דפוסים טובים (במצב verbose):**

- שימוש ב-rtlHelpers
- שימוש בפונקציות אימוג'י חדשות
- שימוש ב-`row-reverse`

#### פלט:

הכלי יוצר:

- דוח מפורט בקונסול
- קובץ `rtl-audit-report.json` עם כל הממצאים
- סטטיסטיקות לפי קטגוריות

#### דוגמת פלט:

```
🔎 GYMovoo RTL Audit Tool
══════════════════════════════════════════════════
📊 Scan Results:
   Files scanned: 127
   Files changed: 8 (with --fix)
   Issues found:  15

📋 Summary by Category:
   🔧 rn-spacing: 12
   👀 manual-check: 8
   ⚠️ anti-pattern: 3
   ✅ best-practice: 22

📄 Detailed Findings:
──────────────────────────────────────────────────
📁 src/components/common/AppButton.tsx
   🔧 marginLeft → marginStart (2 occurrences)
   👀 flexDirection: "row" - consider row-reverse for RTL (1 occurrences)

💾 Report saved: rtl-audit-report.json

✅ Auto-fixes applied! Please review changes with git diff
   Manual review needed for items marked with 👀

🎯 Next Steps:
   1. Review findings marked with ⚠️ and 👀
   2. Use rtlHelpers functions instead of hardcoded values
   3. Follow the hebrew-ui-guide.md for best practices
   4. Test RTL layout on device/simulator
```

#### המלצות:

1. **הרץ לפני commit:** `npm run rtl:audit`
2. **תקן בעיות פשוטות:** `npm run rtl:fix`
3. **בדוק שינויים:** `git diff`
4. **טפל בבעיות ידניות** המסומנות ב-👀
5. **בדוק על מכשיר** שהכל עובד

---

## 🔄 CI/CD Integration

ניתן להוסיף לפייפליין:

```yaml
- name: RTL Audit
  run: |
    npm run rtl:audit
    if [ -f rtl-audit-report.json ]; then
      echo "RTL issues found, see artifact"
      exit 1
    fi
```

## 📝 Adding New Patterns

עריכת `rtl-audit.mjs`:

```javascript
// הוסף לפרמטרים החדשים
patterns.rn.push({
  re: /newPattern/g,
  fix: "newReplacement",
  msg: "description",
});
```
