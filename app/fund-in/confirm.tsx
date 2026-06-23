import { Ionicons } from "@expo/vector-icons";
import { type Href, router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/common/Button";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { spacing } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { requireAuthentication } from "@/services/BiometricAuth";
import { reload } from "@/services/Transaction";
import { formatAmount } from "@/utils/common";

export default function FundInConfirmScreen() {
  const { amount } = useLocalSearchParams<{ amount: string }>();
  const { colors } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const formattedAmount = formatAmount(amount);

  const handleBack = () => {
    router.back();
  };

  const handleConfirm = async () => {
    const numericAmount = Number.parseFloat(formattedAmount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0 || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const isAuthenticated = await requireAuthentication({
        promptMessage: "Confirm reload with biometrics",
        fallbackTitle: "Confirm reload",
        fallbackMessage:
          "Biometric authentication is unavailable. Confirm to complete this reload.",
      });

      if (!isAuthenticated) {
        return;
      }

      const transaction = await reload(numericAmount);
      router.replace({
        pathname: "/success",
        params: {
          type: "reload",
          title: transaction.title,
          date: transaction.date,
          amount: String(transaction.amount),
        },
      } as Href);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScreenHeader title="Confirm Reload" onBack={handleBack} />

        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="arrow-down-circle"
              size={88}
              color={colors.primary}
            />
          </View>

          <Text style={styles.subtitle}>
            Review your reload details before confirming
          </Text>

          <View style={styles.summaryCard}>
            <Text style={styles.cardLabel}>Reload amount</Text>
            <Text style={styles.amount}>RM {formattedAmount}</Text>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={colors.textSecondary}
              />
              <Text style={styles.infoText}>
                Funds will be added to your account balance immediately after
                confirmation.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          {isSubmitting ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <Button title="Confirm Reload" onPress={handleConfirm} />
          )}
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
      paddingBottom: spacing.lg,
    },
    content: {
      flex: 1,
      alignItems: "center",
      paddingTop: spacing.lg,
    },
    iconCircle: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing.lg,
    },
    subtitle: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 22,
      marginBottom: spacing.xl,
      paddingHorizontal: spacing.md,
    },
    summaryCard: {
      width: "100%",
      backgroundColor: colors.surface,
      borderRadius: 16,
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
      textAlign: "center",
    },
    amount: {
      fontSize: 40,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
      marginBottom: spacing.lg,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginBottom: spacing.lg,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.sm,
    },
    infoText: {
      flex: 1,
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    footer: {
      paddingTop: spacing.lg,
    },
  });
}
