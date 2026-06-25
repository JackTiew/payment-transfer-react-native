export type ColorScheme = "light" | "dark";

export type ThemeColors = {
  primary: string;
  primaryPressed: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  tabInactive: string;
  white: string;
  onPrimary: string;
  onPrimaryMuted: string;
  iconAccent: string;
  success: string;
  danger: string;
};

export const lightColors: ThemeColors = {
  primary: "#0000DE",
  primaryPressed: "#0000B8",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  text: "#0F172A",
  textSecondary: "#64748B",
  border: "#E2E8F0",
  tabInactive: "#94A3B8",
  white: "#FFFFFF",
  onPrimary: "#FFFFFF",
  onPrimaryMuted: "rgba(255, 255, 255, 0.75)",
  iconAccent: "#0000DE",
  success: "#16A34A",
  danger: "#DC2626",
};

export const darkColors: ThemeColors = {
  primary: "#0000DE",
  primaryPressed: "#0000B8",
  background: "#0B1120",
  surface: "#1E293B",
  text: "#F8FAFC",
  textSecondary: "#94A3B8",
  border: "#334155",
  tabInactive: "#64748B",
  white: "#FFFFFF",
  onPrimary: "#FFFFFF",
  onPrimaryMuted: "rgba(255, 255, 255, 0.75)",
  iconAccent: "#8B93FF",
  success: "#22C55E",
  danger: "#EF4444",
};

export const spacing = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

/** iPhone 14 Pro Max logical width (430pt). Used to cap web layout width. */
export const webMaxAppWidth = 430;

export function getColors(scheme: ColorScheme): ThemeColors {
  return scheme === "dark" ? darkColors : lightColors;
}
