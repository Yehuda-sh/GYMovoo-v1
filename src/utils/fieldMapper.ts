/**
 * @file src/utils/fieldMapper.ts
 * Centralized bidirectional mapping between in-app (camelCase) and DB (lowercase) user fields.
 * Goal: eliminate scattered ad-hoc references to smartQuestionnaireData / smartquestionnairedata etc.
 *
 * @features
 * - Bidirectional field mapping (camelCase ↔ lowercase)
 * - Type-safe operations with comprehensive error handling
 * - Input validation and defensive programming
 * - Utility functions for validation and debugging
 * - Performance optimized with pre-computed mappings
 *
 * @example
 * ```typescript
 * import { fieldMapper } from './utils/fieldMapper';
 *
 * // Map DB data to runtime format
 * const dbUser = { smartquestionnairedata: { answers: { gender: 'male' } } };
 * const runtimeUser = fieldMapper.fromDB(dbUser);
 * // Result: { smartQuestionnaireData: { answers: { gender: 'male' } } }
 *
 * // Map runtime data to DB format
 * const updates = { smartQuestionnaireData: { answers: { goal: 'fitness' } } };
 * const dbUpdates = fieldMapper.toDB(updates);
 * // Result: { smartquestionnairedata: { answers: { goal: 'fitness' } } }
 *
 * // Extract smart questionnaire answers safely
 * const answers = fieldMapper.getSmartAnswers(user);
 * ```
 *
 * @enhancements_2025-09-01
 * - ✅ הוספת קבועים מרכזיים למניעת קוד קשיח
 * - ✅ שיפור בטיחות טיפוסים עם ולידציה מקיפה
 * - ✅ הוספת טיפול שגיאות עם try/catch
 * - ✅ פונקציות עזר לולידציה וניפוי שגיאות
 * - ✅ אופטימיזציה של ביצועים עם מיפויים מוקדמים
 * - ✅ תיעוד משופר עם דוגמאות מקיפות
 * - ✅ קוד הגנתי יותר עם בדיקות קלט
 */
import type { User, SmartQuestionnaireData } from "../types";

// ==============================
// Constants
// ==============================
const FIELD_MAPPING = {
  activityHistory: "activityhistory",
  smartQuestionnaireData: "smartquestionnairedata",
} as const;

const MAPPING_KEYS = {
  DB_TO_RUNTIME: Object.fromEntries(
    Object.entries(FIELD_MAPPING).map(([k, v]) => [v, k])
  ),
  RUNTIME_TO_DB: FIELD_MAPPING,
} as const;

// ==============================
// Type Definitions
// ==============================

// Define the canonical runtime shape (camelCase) we want internally.
export interface CanonicalUserShape {
  id?: string;
  name?: string;
  email?: string;
  createdAt?: string;
  activityHistory?: User["activityhistory"]; // keep original type
  smartQuestionnaireData?: SmartQuestionnaireData;
  // ...extend as needed
  [key: string]: unknown;
}

// ==============================
// Field Mapping Implementation
// ==============================

export const fieldMapper = {
  /** Map DB user (raw) to canonical runtime shape (non-destructive). */
  fromDB<T extends Record<string, unknown>>(raw: T): CanonicalUserShape & T {
    // Input validation
    if (!raw || typeof raw !== "object") {
      return raw as CanonicalUserShape & T;
    }

    const mapped: Record<string, unknown> = { ...raw };

    try {
      for (const [db, runtime] of Object.entries(MAPPING_KEYS.DB_TO_RUNTIME)) {
        if (db in mapped && !(runtime in mapped)) {
          mapped[runtime] = mapped[db];
        }
      }
    } catch (error) {
      // Log error but don't fail - return original data
      console.warn("[fieldMapper.fromDB] Error during mapping:", error);
    }

    return mapped as CanonicalUserShape & T;
  },

  /** Map canonical runtime user updates to DB field names (for persistence). */
  toDB<T extends Record<string, unknown>>(updates: T): T {
    // Input validation
    if (!updates || typeof updates !== "object") {
      return updates;
    }

    const mapped: Record<string, unknown> = {};

    try {
      for (const [key, value] of Object.entries(updates)) {
        if (key && typeof key === "string") {
          const dbKey =
            MAPPING_KEYS.RUNTIME_TO_DB[
              key as keyof typeof MAPPING_KEYS.RUNTIME_TO_DB
            ] || key.toLowerCase();
          mapped[dbKey] = value;
        }
      }
    } catch (error) {
      // Log error but don't fail - return original data
      console.warn("[fieldMapper.toDB] Error during mapping:", error);
      return updates;
    }

    return mapped as T;
  },

  /** Convenience helper: extract smart questionnaire answers resiliently. */
  getSmartAnswers(user: unknown): SmartQuestionnaireData["answers"] | null {
    try {
      // Input validation
      if (!user || typeof user !== "object") {
        return null;
      }

      const u = user as Record<string, unknown>;

      // Try both possible field names (camelCase and lowercase)
      const smartData = u.smartQuestionnaireData || u.smartquestionnairedata;

      if (!smartData || typeof smartData !== "object") {
        return null;
      }

      const data = smartData as Record<string, unknown>;
      const answers = data.answers;

      // Validate that answers is an object
      if (!answers || typeof answers !== "object") {
        return null;
      }

      return answers as SmartQuestionnaireData["answers"];
    } catch (error) {
      // Log error but return null for safety
      console.warn(
        "[fieldMapper.getSmartAnswers] Error extracting answers:",
        error
      );
      return null;
    }
  },

  /** Check if a field name exists in the mapping table. */
  hasMapping(fieldName: string): boolean {
    return (
      fieldName in MAPPING_KEYS.RUNTIME_TO_DB ||
      fieldName in MAPPING_KEYS.DB_TO_RUNTIME
    );
  },

  /** Get all mapped field names for debugging/validation. */
  getMappedFields(): { runtime: string[]; db: string[] } {
    return {
      runtime: Object.keys(MAPPING_KEYS.RUNTIME_TO_DB),
      db: Object.keys(MAPPING_KEYS.DB_TO_RUNTIME),
    };
  },

  /** Validate that an object has the expected structure. */
  validateStructure(obj: unknown): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!obj || typeof obj !== "object") {
      errors.push("Object is null or not an object");
      return { isValid: false, errors };
    }

    // Check for known field patterns
    const record = obj as Record<string, unknown>;
    const hasRuntimeFields = Object.keys(MAPPING_KEYS.RUNTIME_TO_DB).some(
      (key) => key in record
    );
    const hasDbFields = Object.keys(MAPPING_KEYS.DB_TO_RUNTIME).some(
      (key) => key in record
    );

    if (!hasRuntimeFields && !hasDbFields) {
      errors.push("Object contains no recognizable field mappings");
    }

    return { isValid: errors.length === 0, errors };
  },
};

export default fieldMapper;
