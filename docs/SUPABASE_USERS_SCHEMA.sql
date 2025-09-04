-- טבלת users ל-Supabase תואמת למבנה src/types/index.ts (רוב השדות כ-JSONB)
-- עודכן: 03/09/2025 - תיקון שדה auth_id חסר והסרת שדות מיותרים
create table if not exists public.users (
  -- שדות בסיסיים
  id text primary key,
  auth_id text unique, -- חסר בסכמה הקודמת - נדרש ל-Supabase Auth
  name text,
  email text unique,
  avatar text,

  -- נתוני שאלון (JSONB)
  smartquestionnairedata jsonb,
  questionnaire jsonb,
  questionnairedata jsonb,

  -- פרופילים והעדפות
  genderprofile jsonb,
  preferences jsonb,

  -- נתוני אימון
  activityhistory jsonb,
  trainingstats jsonb,
  workoutplans jsonb,

  -- נתונים מתקדמים
  scientificprofile jsonb,
  airecommendations jsonb,
  subscription jsonb,

  -- timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- עדכון אוטומטי לשדה updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at
before update on public.users
for each row execute procedure public.set_updated_at();

-- RLS (פוליסי DEV – לא מאובטח לפרודקשן!)
alter table public.users enable row level security;

-- מחיקת policies קיימים אם יש
drop policy if exists "public can select users" on public.users;
drop policy if exists "public can modify users (dev)" on public.users;

-- קריאה ציבורית
create policy "public can select users"
on public.users for select
to anon
using (true);

-- כתיבה/עדכון/מחיקה לצורכי פיתוח (לא לפרודקשן)
create policy "public can modify users (dev)"
on public.users for all
to anon
using (true)
with check (true);

-- הערות חשובות:
-- 1. auth_id - נדרש ל-Supabase Auth integration
-- 2. הוסרו שדות מיותרים: provider, registration, currentStats
-- 3. כל השדות ה-JSONB תואמים ל-types ב-src/types/index.ts
-- 4. השמות ב-DB הם lowercase, ב-TypeScript הם camelCase (fieldMapper מטפל בזה)
