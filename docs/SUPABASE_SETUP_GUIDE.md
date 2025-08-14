# Supabase – חיבור מהיר (CLI בלבד)

> מדריך מינימלי לשילוב Supabase בפרויקט, ללא GUI. שומר על חוזים קיימים (EXPO_PUBLIC_STORAGE_BASE_URL).

## התקנה וחיבור (Windows PowerShell)

```powershell
winget install Supabase.SupabaseCLI
supabase login
cd c:\projects\GYMovoo
supabase init
supabase link --project-ref <PROJECT_REF>
```

## הרצה מקומית (דורש Docker)

```powershell
supabase start
# עצירה/איפוס
supabase stop
supabase db reset
```

## Storage – bucket ציבורי (וידאו/תמונות)

צור מיגרציה עם המדיניות הבאה (דוגמה):

```sql
insert into storage.buckets (id, name, public)
select 'public','public', true
where not exists (select 1 from storage.buckets where id = 'public');

create policy "public read"
on storage.objects for select
to public
using ( bucket_id = 'public' );

-- כתיבה/עדכון/מחיקה – דרך Service Role בלבד או פונקציית Edge חתומה
create policy "service insert"
on storage.objects for insert to service_role
with check ( bucket_id = 'public' );

create policy "service update"
on storage.objects for update to service_role
using ( bucket_id = 'public' )
with check ( bucket_id = 'public' );

create policy "service delete"
on storage.objects for delete to service_role
using ( bucket_id = 'public' );
```

החלת המיגרציה:

```powershell
supabase db migrate new "init_public_bucket"
# ערוך את קובץ ה-SQL שנוצר, הדבק את המדיניות לעיל
supabase db push
supabase db remote commit # לאחר קישור לפרויקט ענן
```

## משתני סביבה

- צד לקוח (Expo):

```powershell
$env:EXPO_PUBLIC_SUPABASE_URL = "https://<project>.supabase.co"
$env:EXPO_PUBLIC_SUPABASE_ANON_KEY = "<ANON_KEY>"
# לשמירה על חוזה קיים – ניתן להגדיר גם base מפורש
$env:EXPO_PUBLIC_STORAGE_BASE_URL = "$env:EXPO_PUBLIC_SUPABASE_URL/storage/v1/object/public/public"
```

## שימוש בקוד

- לקוח: `src/services/supabase/client.ts`
- עזרי Storage: `src/services/supabase/storage.ts`

דוגמת שימוש ב-URL ציבורי:

```ts
import { buildPublicUrl } from "../services/supabase/storage";

const url = buildPublicUrl("videos/intro.mp4");
```

הערות:

- לא שינינו את `userApi`/`workoutApi` – שרת נשאר מקור אמת.
- ניתן בהמשך להחליף נקודת אחסון לקבצים כך שתשתמש ב-`buildPublicUrl` מבלי לשבור את ה-API.
