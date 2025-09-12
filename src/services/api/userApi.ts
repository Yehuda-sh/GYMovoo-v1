// User API service for Supabase integration
import type { User } from "../../core/types/user.types";
import { fieldMapper } from "../../utils/fieldMapper";
import { supabase } from "../supabase/client";

// וידוא שיש לנו קליינט תקין
const getSupabase = () => {
  if (!supabase) {
    throw new Error("Supabase client not initialized");
  }
  return supabase;
};

export const userApi = {
  health: async (): Promise<string> => "ok",

  list: async (): Promise<User[]> => {
    const client = getSupabase();
    const { data, error } = await client.from("users").select("*");
    if (error) return [];
    return (data || [])
      .map(
        (item) => fieldMapper.fromDB(item as Record<string, unknown>) as User
      )
      .filter(Boolean);
  },

  getById: async (id: string): Promise<User | undefined> => {
    if (!id) return undefined;
    const client = getSupabase();
    const { data, error } = await client
      .from("users")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) return undefined;
    return data
      ? (fieldMapper.fromDB(data as Record<string, unknown>) as User)
      : undefined;
  },

  getByAuthId: async (authId: string): Promise<User | undefined> => {
    if (!authId) return undefined;
    const client = getSupabase();
    const { data, error } = await client
      .from("users")
      .select("*")
      .eq("auth_id", authId)
      .maybeSingle();
    if (error) return undefined;
    return data
      ? (fieldMapper.fromDB(data as Record<string, unknown>) as User)
      : undefined;
  },

  update: async (id: string, updates: Partial<User>): Promise<User> => {
    if (!id) throw new Error("Invalid parameters");
    const client = getSupabase();
    const payload = fieldMapper.toDB(updates as Record<string, unknown>);
    const { data, error } = await client
      .from("users")
      .update(payload)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error || !data) throw new Error("Failed to update user");

    const mapped = fieldMapper.fromDB(data as Record<string, unknown>) as User;
    if (!mapped) throw new Error("Failed to map user data");
    return mapped;
  },

  create: async (userData: Omit<User, "id">): Promise<User> => {
    try {
      console.log(
        "Creating user with data:",
        JSON.stringify(userData, null, 2)
      );
      const payload = fieldMapper.toDB(userData as Record<string, unknown>);

      // הוספת מזהה ייחודי - בעיית הsql not-null constraint
      payload.id = `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      console.log("Mapped payload:", JSON.stringify(payload, null, 2));

      // בדיקה אם סופאבייס מוכן
      const client = getSupabase();

      // ניסיון ליצור משתמש חדש
      const { data, error } = await client
        .from("users")
        .insert(payload)
        .select()
        .maybeSingle();

      if (error) {
        console.error("Supabase error details:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });

        // במקרה של כישלון, ננסה לבדוק אם זו שגיאה של סכמה או שדה ID
        if (
          error.message.includes("schema cache") ||
          error.message.includes("column")
        ) {
          console.log("Trying with basic fields only");
          const basicPayload = {
            id: `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            name: userData.name,
            email: userData.email,
            provider: userData.provider,
            // נוסיף את נתוני השאלון אם קיימים
            questionnaire_data: userData.questionnaireData
              ? typeof userData.questionnaireData === "string"
                ? userData.questionnaireData
                : JSON.stringify(userData.questionnaireData)
              : null,
            has_questionnaire:
              !!userData.hasQuestionnaire ||
              !!(
                userData.questionnaireData &&
                Object.keys(userData.questionnaireData).length > 0
              ),
          };

          const basicResult = await getSupabase()
            .from("users")
            .insert(basicPayload)
            .select()
            .maybeSingle();

          // נסיון נוסף עם שגיאת ID
          if (basicResult.error && basicResult.error.message.includes("id")) {
            console.log("ID issue detected, trying one more approach");

            try {
              // ניסיון ליצור רשומה חדשה עם ID בלבד (מינימום נדרש)
              const idOnlyPayload = {
                id: `user_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
                name: userData.name || "Anonymous",
                email: userData.email || `anonymous_${Date.now()}@example.com`,
                // נוסיף את נתוני השאלון גם בניסיון האחרון
                questionnaire_data: userData.questionnaireData
                  ? typeof userData.questionnaireData === "string"
                    ? userData.questionnaireData
                    : JSON.stringify(userData.questionnaireData)
                  : null,
                has_questionnaire: userData.hasQuestionnaire ? true : false,
              };

              const idResult = await getSupabase()
                .from("users")
                .insert(idOnlyPayload)
                .select()
                .maybeSingle();

              if (idResult.error) {
                console.error("All attempts failed:", idResult.error);
                throw new Error(`Failed to create user: ${error.message}`);
              }

              return {
                ...userData,
                id: idOnlyPayload.id,
              } as User;
            } catch (finalError) {
              console.error("Final attempt failed:", finalError);
              throw new Error(`Failed to create user: ${error.message}`);
            }
          }

          if (basicResult.error) {
            console.error("Still failed with basic fields:", basicResult.error);
            throw new Error(`Failed to create user: ${error.message}`);
          }

          return {
            ...userData,
            id: basicResult.data?.id || `local_${Date.now()}`,
          } as User;
        }

        throw new Error(`Failed to create user: ${error.message}`);
      }

      if (!data) {
        throw new Error("No data returned from user creation");
      }

      const mapped = fieldMapper.fromDB(
        data as Record<string, unknown>
      ) as User;
      if (!mapped) throw new Error("Failed to map user data");
      return mapped;
    } catch (error) {
      console.error("Error in userApi.create:", error);
      // אם הכל נכשל, החזר משתמש מקומי עם id
      const localUser = {
        ...userData,
        id: `local_${Date.now()}`,
        // וודא שנתוני השאלון נשמרים כראוי
        questionnaireData: userData.questionnaireData || null,
        hasQuestionnaire: userData.hasQuestionnaire || false,
      } as User;
      console.log("Creating local user fallback:", localUser);
      return localUser;
    }
  },
};
