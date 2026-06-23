import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { spacing } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { formatBalance } from "@/utils/common";

type AccountSectionProps = {
  accountNumber: string;
  balance: number;
  balanceVisible: boolean;
  onToggleBalance: () => void;
};

export function AccountSection({
  accountNumber,
  balance,
  balanceVisible,
  onToggleBalance,
}: AccountSectionProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.accountSection}>
      <Text style={styles.accountLabel}>Account</Text>
      <Text style={styles.accountNumber}>{accountNumber}</Text>
      <View style={styles.balanceRow}>
        <Text style={styles.balance}>
          {balanceVisible ? `RM ${formatBalance(balance)}` : "RM ••••••"}
        </Text>
        <Pressable
          onPress={onToggleBalance}
          hitSlop={8}
          accessibilityLabel={balanceVisible ? "Hide balance" : "Show balance"}
        >
          <Ionicons
            name={balanceVisible ? "eye-off-outline" : "eye-outline"}
            size={22}
            color={colors.onPrimaryMuted}
          />
        </Pressable>
      </View>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>["colors"]) {
  return StyleSheet.create({
    accountSection: {
      alignItems: "center",
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingVertical: spacing.xl,
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.xl,
    },
    accountLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.onPrimaryMuted,
      marginBottom: spacing.sm,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    accountNumber: {
      fontSize: 18,
      fontWeight: "500",
      color: colors.onPrimary,
      letterSpacing: 2,
      marginBottom: spacing.md,
    },
    balanceRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    balance: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.onPrimary,
    },
  });
}
