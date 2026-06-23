import { Ionicons } from "@expo/vector-icons";
import { type Href, router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import { spacing } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { resetAllData } from "@/services/Transaction";
import { getUserInfo, type User } from "@/services/User";
import { showNotification } from "@/utils/common";

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

function formatBalance(balance: number): string {
  return balance.toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function HomeScreen() {
  const { colors } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const loadUser = useCallback(async () => {
    const userInfo = await getUserInfo();
    setUser(userInfo);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [loadUser]),
  );

  const handleQuickAction = (actionId: string) => {
    if (actionId === "fund-in") {
      router.push("/fund-in" as Href);
    }
    if (actionId === "transfer") {
      router.push("/transfer" as Href);
    }
    if (actionId === "settings") {
      router.push("/settings");
    }
    if (actionId === "transactions") {
      router.push("/transactions");
    }
  };

  const handleReset = async () => {
    if (isResetting) {
      return;
    }

    setIsResetting(true);

    try {
      await resetAllData();
      setBalanceVisible(false);
      await loadUser();
      showNotification(
        "Reset successful",
        "All local data has been cleared.",
        "success",
      );
    } finally {
      setIsResetting(false);
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const avatarInitial = user.name.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatarInitial}</Text>
          </View>
          <Text style={styles.greeting}>Hello, {user.name}</Text>
        </View>

        <View style={styles.accountSection}>
          <Text style={styles.accountLabel}>Account</Text>
          <Text style={styles.accountNumber}>{user.accountNumber}</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balance}>
              {balanceVisible
                ? `RM ${formatBalance(user.balance)}`
                : "RM ••••••"}
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

        <View style={styles.actionsContainer}>
          <View>
            <Text style={styles.quickActionsTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {QUICK_ACTION_ROWS.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.quickActionsRow}>
                  {row.map((action) => (
                    <Pressable
                      key={action.id}
                      onPress={() => handleQuickAction(action.id)}
                      style={({ pressed }) => [
                        styles.quickAction,
                        pressed && styles.quickActionPressed,
                      ]}
                    >
                      <Ionicons
                        name={action.icon}
                        size={36}
                        color={colors.iconAccent}
                      />
                      <Text style={styles.quickActionLabel}>{action.label}</Text>
                    </Pressable>
                  ))}
                </View>
              ))}
            </View>
          </View>

          <View style={styles.testingSection}>
            <Text style={styles.quickActionsTitle}>Testing Purpose</Text>
            <View style={styles.quickActionsRow}>
              <Pressable
                onPress={handleReset}
                disabled={isResetting}
                style={({ pressed }) => [
                  styles.quickAction,
                  (pressed || isResetting) && styles.quickActionPressed,
                ]}
              >
                {isResetting ? (
                  <ActivityIndicator size="small" color={colors.iconAccent} />
                ) : (
                  <Ionicons
                    name="refresh-outline"
                    size={36}
                    color={colors.iconAccent}
                  />
                )}
                <Text style={styles.quickActionLabel}>Reset Data</Text>
              </Pressable>
              <View style={styles.quickActionSpacer} />
            </View>
          </View>
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
    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
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
    actionsContainer: {
      gap: spacing.lg,
    },
    quickActionsTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: spacing.md,
    },
    quickActionsGrid: {
      gap: spacing.lg,
    },
    quickActionsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: spacing.sm,
    },
    quickAction: {
      flex: 1,
      alignItems: "center",
      gap: spacing.md,
      paddingVertical: spacing.sm,
    },
    quickActionSpacer: {
      flex: 1,
    },
    quickActionPressed: {
      opacity: 0.6,
    },
    quickActionLabel: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
    },
    testingSection: {
      marginTop: spacing.xl,
    },
  });
}
