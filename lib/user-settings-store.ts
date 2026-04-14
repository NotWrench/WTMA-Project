import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SETTINGS_PREFERENCE_KEYS } from "@/lib/settings-preferences";

export type CurrencyCode = "EUR" | "GBP" | "INR" | "USD";

interface UserSettingsState {
  currency: CurrencyCode;
  incognitoBalances: boolean;
  language: string;
  resetUserSettings: () => void;
  setCurrency: (currency: CurrencyCode) => void;
  setIncognitoBalances: (enabled: boolean) => void;
  setLanguage: (language: string) => void;
  setTypographyScale: (scale: number) => void;
  typographyScale: number;
}

const DEFAULT_USER_SETTINGS = {
  currency: "INR" as CurrencyCode,
  incognitoBalances: false,
  language: "en-US",
  typographyScale: 3,
};

const normalizeTypographyScale = (scale: number) =>
  Math.min(5, Math.max(1, Math.round(scale)));

export const useUserSettingsStore = create<UserSettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_USER_SETTINGS,
      setLanguage: (language) => set({ language }),
      setCurrency: (currency) => set({ currency }),
      setTypographyScale: (scale) =>
        set({ typographyScale: normalizeTypographyScale(scale) }),
      setIncognitoBalances: (enabled) => set({ incognitoBalances: enabled }),
      resetUserSettings: () => set({ ...DEFAULT_USER_SETTINGS }),
    }),
    {
      name: SETTINGS_PREFERENCE_KEYS.userSettings,
      storage: createJSONStorage(() => window.localStorage),
      partialize: (state) => ({
        language: state.language,
        currency: state.currency,
        typographyScale: state.typographyScale,
        incognitoBalances: state.incognitoBalances,
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<UserSettingsState> | null;

        return {
          ...currentState,
          ...persisted,
          typographyScale: normalizeTypographyScale(
            persisted?.typographyScale ?? currentState.typographyScale
          ),
        };
      },
    }
  )
);
