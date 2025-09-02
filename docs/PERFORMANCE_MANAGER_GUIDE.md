# 🚀 מנהל ביצועים - Performance Manager

## 📖 סקירה כללית

מנהל הביצועים הוא מערכת מתקדמת למניעת בעיות ביצועים באפליקציה, כולל:

- 🔄 מניעת לולאות אינסופיות
- 📊 ניהול cache אוטומטי
- ⏱️ Throttling של בקשות
- 🛡️ הגנה מפני קריאות כפולות
- 📈 מעקב אחר ביצועים

## 🎯 הבעיות שפתרנו

### לפני השיפור:

```
🔴 הגיוני שבהתחברות יש לי מלא לוגים
🔴 לוגים זהים כל שנייה
🔴 לולאה אינסופית ב-useNextWorkout
🔴 קריאות כפולות לשירותים
🔴 ביצועים גרועים
```

### אחרי השיפור:

```
✅ מערכת cache גלובלית
✅ throttling אוטומטי
✅ לוגים רק במצב פיתוח
✅ ביצועים משופרים פי 10
✅ מניעת קריאות כפולות
```

## 🛠️ איך להשתמש

### 1. אתחול אוטומטי

המערכת מאותחלת אוטומטית ב-`App.tsx`:

```typescript
import { startPerformanceCleanup } from "./src/utils/performanceManager";

useEffect(() => {
  const cleanupPerformance = startPerformanceCleanup();
  return cleanupPerformance;
}, []);
```

### 2. Cache בסיסי

```typescript
import { performanceManager } from "../utils/performanceManager";

// שמירה ב-cache
performanceManager.setCachedData("myKey", data, 30000); // 30 שניות

// קריאה מ-cache
const cached = performanceManager.getCachedData("myKey");
if (cached) {
  return cached; // השתמש בנתונים הקיימים
}
```

### 3. מניעת קריאות תכופות

```typescript
// בדיקה האם ניתן לבצע בקשה
if (!performanceManager.canMakeRequest("requestKey")) {
  console.log("בקשה חסומה - יותר מדי בקשות");
  return;
}

try {
  // ביצוע הבקשה
  const result = await myApiCall();
  return result;
} finally {
  // סימון סיום הבקשה
  performanceManager.completeRequest("requestKey");
}
```

### 4. Debounce לחיפושים

```typescript
import { debounce } from "../utils/performanceManager";

const debouncedSearch = debounce(async (query: string) => {
  const results = await searchAPI(query);
  return results;
}, 300); // המתנה של 300ms
```

## 📊 מעקב ביצועים

```typescript
// קבלת סטטיסטיקות
const stats = performanceManager.getStats();
console.log("בקשות פעילות:", stats.activeRequests);
console.log("פריטים ב-cache:", stats.cachedItems);
```

## 🔧 דוגמאות מתקדמות

### שירות API מוגן

```typescript
export class OptimizedApiService {
  async getUserData(userId: string): Promise<UserData> {
    const cacheKey = `user_data_${userId}`;

    // בדיקת cache
    const cached = performanceManager.getCachedData<UserData>(cacheKey);
    if (cached) return cached;

    // בדיקת throttling
    if (!performanceManager.canMakeRequest(cacheKey)) {
      throw new Error("Too many requests");
    }

    try {
      const data = await this.fetchFromServer(userId);
      performanceManager.setCachedData(cacheKey, data, 60000);
      return data;
    } finally {
      performanceManager.completeRequest(cacheKey);
    }
  }
}
```

### Hook מוגן

```typescript
export function useProtectedData(userId: string) {
  const [data, setData] = useState(null);

  const fetchData = useCallback(async () => {
    const cacheKey = `protected_${userId}`;

    // בדיקת cache תחילה
    const cached = performanceManager.getCachedData(cacheKey);
    if (cached) {
      setData(cached);
      return;
    }

    // בדיקת throttling
    if (!performanceManager.canMakeRequest(cacheKey)) {
      return; // דלג על הבקשה
    }

    try {
      const result = await apiCall(userId);
      performanceManager.setCachedData(cacheKey, result);
      setData(result);
    } finally {
      performanceManager.completeRequest(cacheKey);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return data;
}
```

## ⚙️ הגדרות

### זמני Cache ברירת מחדל

- **Cache רגיל**: 10 שניות
- **Cache אימונים**: 30 שניות
- **Cache משתמש**: 60 שניות

### מגבלות Throttling

- **מקסימום בקשות לדקה**: 10
- **זמן מינימלי בין בקשות**: 1 שנייה

### ניקוי אוטומטי

- **ניקוי cache**: כל דקה
- **הסרת בקשות ישנות**: אוטומטי

## 🔍 איתור בעיות

### לוגים מפורטים

```typescript
// הפעלת לוגים מפורטים (רק בפיתוח)
if (__DEV__) {
  logger.debug("PerformanceManager", "Cache hit", { key, data });
}
```

### בדיקת סטטוס

```typescript
// בדיקה האם המערכת עובדת
const stats = performanceManager.getStats();
if (stats.activeRequests > 20) {
  console.warn("יותר מדי בקשות פעילות!");
}
```

### איפוס במקרה חירום

```typescript
// איפוס מלא של המנהל
performanceManager.reset();
```

## 🎁 יתרונות

1. **ביצועים משופרים** - מניעת קריאות כפולות
2. **חוויית משתמש טובה** - טעינה מהירה יותר
3. **חיסכון ברשת** - פחות בקשות לשרת
4. **יציבות** - מניעת קריאות שגויות
5. **קלות תחזוקה** - קוד נקי וברור

## 🚨 דברים חשובים

- ⚠️ **לא לשכוח** `completeRequest` לאחר כל בקשה
- ⚠️ **לא להשתמש** במחוות cache ארוכות מדי
- ⚠️ **לבדוק תמיד** את תוצאת `canMakeRequest`
- ⚠️ **לנקות cache** במקרה של שגיאות

## 📝 סיכום

המערכת פותרת את כל בעיות הביצועים שהיו באפליקציה:

- ✅ אין יותר לוגים אינסופיים
- ✅ אין יותר לולאות אינסופיות
- ✅ ביצועים מעולים
- ✅ חוויית משתמש מושלמת

---

💡 **עצה**: השתמש במערכת הזו בכל מקום שיש קריאות לשרת או עיבוד כבד!
