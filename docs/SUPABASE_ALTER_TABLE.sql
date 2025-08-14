-- הוספת עמודות חסרות לטבלת users קיימת
-- זה יתקן את הטבלה מבלי למחוק נתונים קיימים

-- הוספת עמודות JSONB החסרות
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS registration jsonb,
ADD COLUMN IF NOT EXISTS smartQuestionnaireData jsonb,
ADD COLUMN IF NOT EXISTS questionnaire jsonb,
ADD COLUMN IF NOT EXISTS questionnaireData jsonb,
ADD COLUMN IF NOT EXISTS scientificProfile jsonb,
ADD COLUMN IF NOT EXISTS aiRecommendations jsonb,
ADD COLUMN IF NOT EXISTS activityHistory jsonb,
ADD COLUMN IF NOT EXISTS currentStats jsonb,
ADD COLUMN IF NOT EXISTS preferences jsonb,
ADD COLUMN IF NOT EXISTS trainingStats jsonb,
ADD COLUMN IF NOT EXISTS subscription jsonb,
ADD COLUMN IF NOT EXISTS workoutPlans jsonb,
ADD COLUMN IF NOT EXISTS genderProfile jsonb,
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- עדכון אוטומטי לשדה updated_at (אם לא קיים)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger as $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language plpgsql;

-- יצירת trigger (אם לא קיים)
DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- הוספת/עדכון policies (אם נדרש)
DROP POLICY IF EXISTS "public can select users" ON public.users;
DROP POLICY IF EXISTS "public can modify users (dev)" ON public.users;

CREATE POLICY "public can select users"
ON public.users FOR SELECT
TO anon
USING (true);

CREATE POLICY "public can modify users (dev)"
ON public.users FOR ALL
TO anon
USING (true)
WITH CHECK (true);
