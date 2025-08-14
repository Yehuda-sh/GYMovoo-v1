-- מחיקה ויצירה מחדש של טבלת users עם כל השדות
-- זה ימחק נתונים קיימים! גבה אותם אם נדרש

-- מחיקת טבלה קיימת
DROP TABLE IF EXISTS public.users CASCADE;

-- יצירת טבלה חדשה עם כל השדות
CREATE TABLE public.users (
  id text PRIMARY KEY,
  name text,
  email text UNIQUE,
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
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- עדכון אוטומטי לשדה updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger as $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language plpgsql;

-- יצירת trigger
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- RLS (פוליסי DEV – לא מאובטח לפרודקשן!)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- קריאה ציבורית
CREATE POLICY "public can select users"
ON public.users FOR SELECT
TO anon
USING (true);

-- כתיבה/עדכון/מחיקה לצורכי פיתוח (לא לפרודקשן)
CREATE POLICY "public can modify users (dev)"
ON public.users FOR ALL
TO anon
USING (true)
WITH CHECK (true);
