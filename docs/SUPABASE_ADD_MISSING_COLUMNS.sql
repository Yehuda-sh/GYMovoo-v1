-- הוספת העמודות החסרות לטבלה קיימת (בלי למחוק נתונים)

ALTER TABLE public.users 
ADD COLUMN smartQuestionnaireData jsonb,
ADD COLUMN questionnaireData jsonb,
ADD COLUMN scientificProfile jsonb,
ADD COLUMN aiRecommendations jsonb,
ADD COLUMN activityHistory jsonb,
ADD COLUMN currentStats jsonb,
ADD COLUMN trainingStats jsonb,
ADD COLUMN workoutPlans jsonb,
ADD COLUMN genderProfile jsonb;
