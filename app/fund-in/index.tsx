import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  AmountKeypad,
  centsToDecimal,
  formatCentsDisplay,
} from "@/components/common/AmountKeypad";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { spacing } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

export default function FundInScreen() {
  const { colors } = useTheme();
  const [amount, setAmount] = useState("");
  const [keypadVisible, setKeypadVisible] = useState(true);
  const styles = useMemo(() => createStyles(colors), [colors]);

  useFocusEffect(
    useCallback(() => {
      setKeypadVisible(true);
    }, []),
  );

  const handleDone = () => {
    setKeypadVisible(false);
    router.push({
      pathname: "/fund-in/confirm",
      params: { amount: centsToDecimal(amount) },
    });
  };

  const handleClose = () => {
    setKeypadVisible(false);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScreenHeader title="Fund In" showBack={false} />

        <View style={styles.amountCard}>
          <Text style={styles.cardLabel}>Enter reload amount</Text>
          <Text style={styles.amountDisplay}>
            RM {formatCentsDisplay(amount)}
          </Text>
        </View>
      </View>

      <AmountKeypad
        visible={keypadVisible}
        amount={amount}
        onAmountChange={setAmount}
        onDone={handleDone}
        onClose={handleClose}
        dimBackground={false}
        showAmountHeader={false}
      />
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
    amountCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.lg,
    },
    cardLabel: {
      fontSize: 12,
      fontWeight: "500",
      color: colors.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: spacing.sm,
    },
    amountDisplay: {
      fontSize: 32,
      fontWeight: "700",
      color: colors.text,
      paddingBottom: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
  });
}
