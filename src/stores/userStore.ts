import { create } from "zustand";

type QuestionnaireAnswers = {
  [key: number]: string;
};

export interface User {
  name?: string;
  email?: string;
  avatar?: string; // URL או נתיב מקומי
  provider?: string; // לדוגמה: "google", "facebook" וכו'

  questionnaire?: QuestionnaireAnswers;
}

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  setQuestionnaire: (answers: QuestionnaireAnswers) => void;
  logout: () => void;
  resetQuestionnaire: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  setQuestionnaire: (answers) =>
    set((state) => ({
      user: {
        ...(state.user || {}),
        questionnaire: answers,
      },
    })),
  logout: () => set({ user: null }),
  resetQuestionnaire: () =>
    set((state) => ({
      user: {
        ...(state.user || {}),
        questionnaire: {},
      },
    })),
}));
