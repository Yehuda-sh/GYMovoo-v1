# Storage & Data Management | ניהול אחסון ונתונים

## Overview | סקירה כללית

המעבר לשרת מרכזי הושלם. **מקור אמת יחיד:** Supabase PostgreSQL.

> **Status:** ✅ הושלם | **Updated:** September 3, 2025 | **Security:** Production Ready

## What Changed | מה השתנה

**Removed:**

- Express local server
- Local storage files
- Manual data management

**Added:**

- Supabase PostgreSQL
- Row Level Security (RLS)
- Real-time subscriptions
- Automatic backups
- Offline-first storage

## Architecture | ארכיטקטורה

```
React Native App
├── AsyncStorage (Local Cache)
│   ├── User preferences
│   ├── Workout drafts
│   └── Personal records
└── Supabase Client
    ├── PostgreSQL Database
    ├── Real-time subscriptions
    └── Row Level Security
```

## Core Services | שירותים עיקריים

| Service                    | Purpose            | Status   |
| -------------------------- | ------------------ | -------- |
| `userStore.ts`             | ניהול מצב משתמש    | Enhanced |
| `storageCleanup.ts`        | ניקוי אחסון חכם    | Enhanced |
| `personalRecordService.ts` | ניהול שיאים אישיים | Enhanced |
| `formatters.ts`            | עיצוב נתונים       | Enhanced |

## Implementation | יישום

### Local Storage (AsyncStorage):

```typescript
import { storageCleanup } from "./storageCleanup";
import { personalRecordService } from "./personalRecordService";

// Smart cleanup
await storageCleanup.cleanOldData();

// Personal records
const records = await personalRecordService.detectPersonalRecords(workout);
```

### Supabase Integration:

```typescript
// Real-time data sync
const { data, error } = await supabase
  .from("workouts")
  .select("*")
  .eq("user_id", userId);
```

## Security | אבטחה

### Row Level Security (RLS):

```sql
-- Users can only access their own data
CREATE POLICY user_data_policy ON workouts
  FOR ALL USING (auth.uid() = user_id);
```

**Features:**

- Encryption at rest and in transit
- Row-level security
- GDPR compliance
- Audit logging

## Performance | ביצועים

**Caching Strategy:**

1. AsyncStorage (Immediate access)
2. Memory cache (Runtime optimization)
3. Supabase (Source of truth)

**Targets:**

- Cache hit rate: 85%+
- Response time: <500ms
- Storage efficiency: 90%+
- Sync success rate: 99%+

## Development Guidelines | הנחיות פיתוח

**Best Practices:**

```typescript
// ✅ Use service abstractions
import { personalRecordService } from "../services/personalRecordService";
const result = await personalRecordService.detectPersonalRecords(workout);

// ❌ Avoid direct storage access
import AsyncStorage from "@react-native-async-storage/async-storage";
const data = await AsyncStorage.getItem("raw_key");
```

- Use service abstractions instead of direct storage access
- Implement cleanup strategies for optimal performance
- Monitor storage health with built-in analytics
- Handle offline scenarios gracefully

## Troubleshooting | פתרון בעיות

### Common Issues:

**Storage Full:**

```typescript
const storageInfo = await storageCleanup.getStorageInfo();
if (storageInfo.isFull) {
  await storageCleanup.emergencyCleanup();
}
```

**Sync Failures:**

```typescript
try {
  await userStore.syncToSupabase();
} catch (error) {
  logger.warn("Sync failed, using local data", { error });
}
```

**Diagnostic Commands:**

```typescript
await storageCleanup.logStorageStatus();
await personalRecordService.healthCheck();
await userStore.validateState();
```

## Resources | משאבים

**Documentation:**

- [Supabase Docs](https://supabase.com/docs)
- [React Native AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [Project Architecture Guide](../docs/TECHNICAL_ARCHITECTURE_GUIDE.md)

**Support:**

- Bug Reports: Create an issue in the repository
- Feature Requests: Discuss in project discussions

---

**Remember: Always use the enhanced service layer instead of direct storage access!**

**זכור: השתמש תמיד בשכבת השירות המשופרת במקום גישה ישירה לאחסון!**
