import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo, type ReactNode } from "react";
import { Platform, StyleSheet, View } from "react-native";

import { AppToast } from "@/components/common/AppToast";
import { webMaxAppWidth } from "@/constants/theme";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

function WebAppShell({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createWebShellStyles(colors), [colors]);

  if (Platform.OS !== "web") {
    return children;
  }

  return (
    <View style={styles.outer}>
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

function RootLayoutNav() {
  const { isDark } = useTheme();

  return (
    <WebAppShell>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }} />
      <AppToast />
    </WebAppShell>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}

function createWebShellStyles(colors: ReturnType<typeof useTheme>["colors"]) {
  return StyleSheet.create({
    outer: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      backgroundColor: colors.border,
    },
    inner: {
      flex: 1,
      width: "100%",
      maxWidth: webMaxAppWidth,
      backgroundColor: colors.background,
    },
  });
}
