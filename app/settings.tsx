import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo } from "react";
import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { spacing } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

export default function SettingsScreen() {
  const { colors, isDark, setColorScheme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Dark theme</Text>
          <Switch
            value={isDark}
            onValueChange={(enabled) =>
              setColorScheme(enabled ? "dark" : "light")
            }
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>["colors"]) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginBottom: spacing.xl,
    },
    backButton: {
      padding: spacing.sm,
      marginLeft: -spacing.sm,
    },
    backButtonPressed: {
      opacity: 0.6,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: "600",
      color: colors.text,
    },
    settingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    settingLabel: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
    },
  });
}
