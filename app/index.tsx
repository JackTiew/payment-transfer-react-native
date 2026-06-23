import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, spacing } from "@/constants/theme";

const ACCOUNT_NUMBER = "xxxx xxxx xxxx 8888";
const BALANCE = "12,345.67";

const QUICK_ACTIONS = [
  { id: "transfer", label: "Transfer", icon: "swap-horizontal" as const },
  { id: "transactions", label: "View Transactions", icon: "list" as const },
  { id: "settings", label: "Settings", icon: "settings-outline" as const },
];

export default function HomeScreen() {
  const [balanceVisible, setBalanceVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>U</Text>
          </View>
          <Text style={styles.greeting}>Hello, User</Text>
        </View>

        <View style={styles.accountSection}>
          <Text style={styles.accountLabel}>Account</Text>
          <Text style={styles.accountNumber}>{ACCOUNT_NUMBER}</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balance}>
              {balanceVisible ? `RM ${BALANCE}` : "RM ••••••"}
            </Text>
            <Pressable
              onPress={() => setBalanceVisible((visible) => !visible)}
              hitSlop={8}
              accessibilityLabel={
                balanceVisible ? "Hide balance" : "Show balance"
              }
            >
              <Ionicons
                name={balanceVisible ? "eye-off-outline" : "eye-outline"}
                size={22}
                color={colors.onPrimaryMuted}
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.quickActionsSection}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          <View style={styles.quickActionsRow}>
            {QUICK_ACTIONS.map((action) => (
              <Pressable
                key={action.id}
                style={({ pressed }) => [
                  styles.quickAction,
                  pressed && styles.quickActionPressed,
                ]}
              >
                <Ionicons
                  name={action.icon}
                  size={28}
                  color={colors.primary}
                />
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "700",
  },
  greeting: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.text,
  },
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
  quickActionsSection: {
    flex: 1,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xl,
  },
  quickActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  quickAction: {
    flex: 1,
    alignItems: "center",
    gap: spacing.sm,
  },
  quickActionPressed: {
    opacity: 0.6,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.text,
    textAlign: "center",
  },
});
