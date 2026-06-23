export const colors = {
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
} as const;

export const spacing = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const theme = {
  colors,
  spacing,
} as const;
