export const SETTINGS_PREFERENCE_KEYS = {
  currency: "trackami-currency",
  incognitoBalances: "trackami-incognito-balances",
  language: "trackami-language",
  theme: "trackami-theme",
  typographyScale: "trackami-typography-scale",
} as const;

const TYPOGRAPHY_SCALE_PERCENT_MAP = {
  1: 94,
  2: 97,
  3: 100,
  4: 103,
  5: 106,
} as const;

export function applyTypographyScale(scale: number) {
  const normalizedScale = Math.min(5, Math.max(1, Math.round(scale))) as
    | 1
    | 2
    | 3
    | 4
    | 5;
  const percent = TYPOGRAPHY_SCALE_PERCENT_MAP[normalizedScale];

  document.documentElement.style.fontSize = `${percent}%`;
  document.documentElement.dataset.typographyScale = `${normalizedScale}`;
}

export function applyIncognitoBalances(enabled: boolean) {
  document.documentElement.dataset.incognitoBalances = enabled
    ? "true"
    : "false";
}

export function readStoredTypographyScale(): number {
  const rawValue = window.localStorage.getItem(
    SETTINGS_PREFERENCE_KEYS.typographyScale
  );
  const parsedValue = Number(rawValue);

  if (!Number.isFinite(parsedValue)) {
    return 3;
  }

  return Math.min(5, Math.max(1, Math.round(parsedValue)));
}

export function readStoredIncognitoBalances(): boolean {
  return (
    window.localStorage.getItem(SETTINGS_PREFERENCE_KEYS.incognitoBalances) ===
    "true"
  );
}
