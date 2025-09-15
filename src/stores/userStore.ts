import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../core/types/user.types";
import type { QuestionnaireData } from "../features/questionnaire/types";
import { StorageKeys } from "../constants/StorageKeys";
import { logger } from "../utils/logger";

interface UserStore {
  user: User | null;
  hydrated: boolean;
  hasSeenWelcome: boolean;

  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
  isLoggedIn: () => Promise<boolean>;
  clearAllUserData: () => Promise<void>;

  setSmartQuestionnaireData: (data: QuestionnaireData) => void;
  getSmartQuestionnaireAnswers: () => QuestionnaireData["answers"] | null;
  resetSmartQuestionnaire: () => void;

  getCompletionStatus: () => {
    hasBasicInfo: boolean;
    hasSmartQuestionnaire: boolean;
    isFullySetup: boolean;
  };

  setHydrated?: () => void;
  markWelcomeSeen: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      hydrated: false,
      hasSeenWelcome: false,
      setHydrated: () => set({ hydrated: true }),
      markWelcomeSeen: () => set({ hasSeenWelcome: true }),

      setUser: async (user) => {
        try {
          if (user && !user.questionnaireData) {
            try {
              const savedResults = await AsyncStorage.getItem(
                StorageKeys.SMART_QUESTIONNAIRE_RESULTS
              );
              if (savedResults) {
                const smartData = JSON.parse(savedResults);
                user = {
                  ...user,
                  questionnaireData: smartData,
                  hasQuestionnaire: true,
                };
              }
            } catch (error) {
              logger.warn(
                "UserStore",
                "Failed to load saved questionnaire results",
                error
              );
            }
          }
          set({ user });
        } catch (error) {
          logger.error("UserStore", "Error setting user", error);
          set({ user });
        }
      },

      updateUser: (updates) => {
        try {
          set((state) => ({
            user: state.user ? { ...state.user, ...updates } : null,
          }));
        } catch (error) {
          logger.error("UserStore", "Error updating user", error);
        }
      },

      logout: async () => {
        try {
          const keysToRemove = [
            "user-storage",
            "smart_questionnaire_results",
            "user_gender_preference",
            "selected_equipment",
          ];
          await AsyncStorage.multiRemove(keysToRemove);
          await AsyncStorage.setItem("user_logged_out", "true");
          set({ user: null });
        } catch (error) {
          logger.error("Auth", "Error during logout", error);
          set({ user: null });
          throw error;
        }
      },

      setSmartQuestionnaireData: (data) => {
        try {
          const state = get();
          if (state.user?.email) {
            set((st) => {
              if (!st.user) return st;
              return {
                user: {
                  ...st.user,
                  questionnaireData: data,
                  hasQuestionnaire: true,
                },
              };
            });
          }

          AsyncStorage.setItem(
            StorageKeys.SMART_QUESTIONNAIRE_RESULTS,
            JSON.stringify(data)
          ).catch((err) =>
            logger.error("Store", "Error saving questionnaire", err)
          );
        } catch (error) {
          logger.error(
            "Store",
            "Error setting smart questionnaire data",
            error
          );
        }
      },

      getSmartQuestionnaireAnswers: () => {
        const state = get();
        return state.user?.questionnaireData?.answers || null;
      },

      resetSmartQuestionnaire: () => {
        set((state) => {
          if (!state.user) return { user: null };
          const {
            questionnaireData,
            hasQuestionnaire,
            ...userWithoutQuestionnaire
          } = state.user;
          return {
            user: userWithoutQuestionnaire,
          };
        });

        AsyncStorage.multiRemove([
          StorageKeys.SMART_QUESTIONNAIRE_RESULTS,
          StorageKeys.USER_GENDER_PREFERENCE,
          StorageKeys.SELECTED_EQUIPMENT,
        ]);
      },

      getCompletionStatus: () => {
        const state = get();
        const user = state.user;

        const hasSmartQuestionnaire = !!(
          user?.hasQuestionnaire ||
          user?.questionnaireData?.metadata?.completedAt ||
          (user?.questionnaireData &&
            Object.keys(user.questionnaireData).length > 0)
        );

        const hasBasicInfo = !!(user?.id || user?.email || user?.name);
        const isFullySetup = hasSmartQuestionnaire && hasBasicInfo;

        return {
          hasBasicInfo,
          hasSmartQuestionnaire,
          isFullySetup,
        };
      },

      isLoggedIn: async () => {
        const state = get();
        if (state.user === null) return false;
        const loggedOut = await AsyncStorage.getItem("user_logged_out");
        return loggedOut !== "true";
      },

      clearAllUserData: async () => {
        try {
          const allKeys = await AsyncStorage.getAllKeys();
          await AsyncStorage.multiRemove(allKeys);
          set({ user: null });
        } catch (error) {
          logger.error("Storage", "Error clearing data", error);
          throw error;
        }
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        hasSeenWelcome: state.hasSeenWelcome,
      }),
      onRehydrateStorage: () => () => {
        useUserStore.setState({ hydrated: true });
      },
    }
  )
);

export type { User } from "../core/types/user.types";
export type { QuestionnaireData } from "../features/questionnaire/types";

export const useUser = () => useUserStore((state) => state.user);
export const useIsLoggedIn = () => useUserStore((state) => state.user !== null);
export const useQuestionnaireCompleted = () =>
  useUserStore((state) => state.user?.questionnaireData?.answers !== undefined);
