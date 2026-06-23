import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { spacing } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

type TestingSectionProps = {
  isResetting: boolean;
  onReset: () => void;
};

export function TestingSection({ isResetting, onReset }: TestingSectionProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Testing Purpose</Text>
      <View style={styles.row}>
        <Pressable
          onPress={onReset}
          disabled={isResetting}
          style={({ pressed }) => [
            styles.action,
            (pressed || isResetting) && styles.actionPressed,
          ]}
        >
          {isResetting ? (
            <ActivityIndicator size="small" color={colors.iconAccent} />
          ) : (
            <Ionicons name="refresh-outline" size={36} color={colors.iconAccent} />
          )}
          <Text style={styles.actionLabel}>Reset Data</Text>
        </Pressable>
        <View style={styles.spacer} />
      </View>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>["colors"]) {
  return StyleSheet.create({
    section: {
      marginTop: spacing.xl,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: spacing.md,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: spacing.sm,
    },
    action: {
      flex: 1,
      alignItems: "center",
      gap: spacing.md,
      paddingVertical: spacing.sm,
    },
    spacer: {
      flex: 1,
    },
    actionPressed: {
      opacity: 0.6,
    },
    actionLabel: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
    },
  });
}
