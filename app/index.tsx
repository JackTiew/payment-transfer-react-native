import { type Href, router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AccountSection } from "@/components/homepage/AccountSection";
import { HomeHeader } from "@/components/homepage/HomeHeader";
import { QuickActionsSection } from "@/components/homepage/QuickActionsSection";
import { TestingSection } from "@/components/homepage/TestingSection";
import { spacing } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { resetAllData } from "@/services/Transaction";
import { getUserInfo, type User } from "@/services/User";
import { showNotification } from "@/utils/common";

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HomeHeader userName={user.name} />

        <AccountSection
          accountNumber={user.accountNumber}
          balance={user.balance}
          balanceVisible={balanceVisible}
          onToggleBalance={() => setBalanceVisible((visible) => !visible)}
        />

        <View style={styles.actionsContainer}>
          <QuickActionsSection onActionPress={handleQuickAction} />
          <TestingSection isResetting={isResetting} onReset={handleReset} />
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
    actionsContainer: {
      gap: spacing.lg,
    },
  });
}
