import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AppToast } from "@/components/common/AppToast";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

function RootLayoutNav() {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }} />
      <AppToast />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}
