import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { spacing } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

const QUICK_ACTION_ROWS = [
  [
    { id: "fund-in", label: "Fund In", icon: "arrow-down-circle-outline" as const },
    { id: "transfer", label: "Transfer", icon: "swap-horizontal" as const },
  ],
  [
    { id: "transactions", label: "View Transactions", icon: "list" as const },
    { id: "settings", label: "Settings", icon: "settings-outline" as const },
  ],
];

type QuickActionsSectionProps = {
  onActionPress: (actionId: string) => void;
};

export function QuickActionsSection({ onActionPress }: QuickActionsSectionProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View>
      <Text style={styles.title}>Quick Actions</Text>
      <View style={styles.grid}>
        {QUICK_ACTION_ROWS.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((action) => (
              <Pressable
                key={action.id}
                onPress={() => onActionPress(action.id)}
                style={({ pressed }) => [
                  styles.action,
                  pressed && styles.actionPressed,
                ]}
              >
                <Ionicons name={action.icon} size={36} color={colors.iconAccent} />
                <Text style={styles.actionLabel}>{action.label}</Text>
              </Pressable>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>["colors"]) {
  return StyleSheet.create({
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: spacing.md,
    },
    grid: {
      gap: spacing.lg,
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
