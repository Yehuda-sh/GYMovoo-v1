-- צירת טבלת workout_feedback ב-Supabase
-- יצירת טבלה לאחסון משוב על אימונים

CREATE TABLE IF NOT EXISTS workout_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id TEXT NOT NULL UNIQUE,
  feedback_data JSONB NOT NULL,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- יצירת אינדקס לחיפוש מהיר
CREATE INDEX IF NOT EXISTS idx_workout_feedback_workout_id ON workout_feedback(workout_id);
CREATE INDEX IF NOT EXISTS idx_workout_feedback_saved_at ON workout_feedback(saved_at);

-- הוספת RLS (Row Level Security)
ALTER TABLE workout_feedback ENABLE ROW LEVEL SECURITY;

-- מדיניות RLS - משתמש רואה רק את המשוב שלו
-- (נזכור להגדיר user_id בעתיד אם צריך)
CREATE POLICY "workout_feedback_access" ON workout_feedback
  FOR ALL USING (true); -- כרגע פתוח לכולם

-- הוספת trigger לעדכון updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_workout_feedback_updated_at 
  BEFORE UPDATE ON workout_feedback 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- הוספת comments לתיעוד
COMMENT ON TABLE workout_feedback IS 'טבלת משוב על אימונים - מהוגרת מ-AsyncStorage ל-Supabase';
COMMENT ON COLUMN workout_feedback.workout_id IS 'מזהה ייחודי לאימון';
COMMENT ON COLUMN workout_feedback.feedback_data IS 'נתוני משוב (דירוג קושי, הרגשה, הערות)';
COMMENT ON COLUMN workout_feedback.saved_at IS 'זמן שמירת המשוב';
