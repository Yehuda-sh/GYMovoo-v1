-- טבלת users ל-Supabase תואמת למבנה src/types/index.ts (רוב השדות כ-JSONB)
create table if not exists public.users (
  id text primary key,
  name text,
  email text unique,
  avatar text,
  provider text,
  registration jsonb,
  smartQuestionnaireData jsonb,
  questionnaire jsonb,
  questionnaireData jsonb,
  scientificProfile jsonb,
  aiRecommendations jsonb,
  activityHistory jsonb,
  currentStats jsonb,
  preferences jsonb,
  trainingStats jsonb,
  subscription jsonb,
  workoutPlans jsonb,
  genderProfile jsonb,
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
