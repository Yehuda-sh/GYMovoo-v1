/**
 * @file src/utils/fieldMapper.ts
 * Centralized bidirectional mapping between in-app (camelCase) and DB (lowercase) user fields.
 * Goal: eliminate scattered ad-hoc references to smartQuestionnaireData / smartquestionnairedata etc.
 */
import type { User, SmartQuestionnaireData } from "../types";

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

// Low-level mapping table (add entries if new DB fields appear)
const toDBKey: Record<string, string> = {
  activityHistory: "activityhistory",
  smartQuestionnaireData: "smartquestionnairedata",
};

const fromDBKey: Record<string, string> = Object.fromEntries(
  Object.entries(toDBKey).map(([k, v]) => [v, k])
);

export const fieldMapper = {
  /** Map DB user (raw) to canonical runtime shape (non-destructive). */
  fromDB<T extends Record<string, unknown>>(raw: T): CanonicalUserShape & T {
    if (!raw || typeof raw !== "object")
      return raw as unknown as CanonicalUserShape & T;
    const mapped: Record<string, unknown> = { ...raw };
    for (const [db, runtime] of Object.entries(fromDBKey)) {
      if (db in mapped && !(runtime in mapped)) {
        mapped[runtime] = mapped[db];
      }
    }
    return mapped as CanonicalUserShape & T;
  },

  /** Map canonical runtime user updates to DB field names (for persistence). */
  toDB<T extends Record<string, unknown>>(updates: T): T {
    if (!updates || typeof updates !== "object") return updates;
    const mapped: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates)) {
      const dbKey = toDBKey[key] || key.toLowerCase();
      mapped[dbKey] = value;
    }
    return mapped as T;
  },

  /** Convenience helper: extract smart questionnaire answers resiliently. */
  getSmartAnswers(user: unknown): SmartQuestionnaireData["answers"] | null {
    const u = user as
      | {
          smartQuestionnaireData?: SmartQuestionnaireData;
          smartquestionnairedata?: SmartQuestionnaireData;
        }
      | null
      | undefined;
    return (
      u?.smartQuestionnaireData?.answers ||
      u?.smartquestionnairedata?.answers ||
      null
    );
  },
};

export default fieldMapper;
