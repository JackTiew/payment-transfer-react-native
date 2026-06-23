import { StyleSheet } from "react-native";

import { lightColors, spacing } from "@/constants/theme";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: lightColors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: lightColors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: lightColors.textSecondary,
    lineHeight: 24,
  },
  button: {
    backgroundColor: lightColors.primary,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    backgroundColor: lightColors.primaryPressed,
  },
  buttonText: {
    color: lightColors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
