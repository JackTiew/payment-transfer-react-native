import { type Href, router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { ScreenHeader } from "@/components/ScreenHeader";
import { spacing } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { transfer } from "@/services/Transaction";
import { requireAuthentication } from "@/services/BiometricAuth";
import { showNotification } from "@/utils/common";

function formatAmount(amount: string | string[] | undefined): string {
  const value = Array.isArray(amount) ? amount[0] : amount;
  const numericAmount = Number.parseFloat(value ?? "0");

  if (!Number.isFinite(numericAmount)) {
    return "0.00";
  }

  return numericAmount.toFixed(2);
}

function getParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default function TransferConfirmScreen() {
  const params = useLocalSearchParams<{
    bankId: string;
    bankName: string;
    accountNumber: string;
    amount: string;
    recipientReference: string;
    paymentDetails: string;
    recipientName?: string;
  }>();
  const { colors } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const bankId = getParam(params.bankId);
  const bankName = getParam(params.bankName);
  const accountNumber = getParam(params.accountNumber);
  const formattedAmount = formatAmount(params.amount);
  const recipientReference = getParam(params.recipientReference);
  const paymentDetails = getParam(params.paymentDetails) || '-';
  const recipientName = getParam(params.recipientName);

  const handleApprove = async () => {
    const numericAmount = Number.parseFloat(formattedAmount);

    if (!bankId || !bankName || !accountNumber || !recipientReference) {
      showNotification("Transfer failed", "Transfer details are incomplete.", "error");
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      showNotification("Transfer failed", "Please enter a valid transfer amount.", "error");
      return;
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const isAuthenticated = await requireAuthentication({
        promptMessage: "Approve transfer with biometrics",
        fallbackTitle: "Approve transfer",
        fallbackMessage:
          "Biometric authentication is unavailable. Confirm to complete this transfer.",
      });

      if (!isAuthenticated) {
        return;
      }

      const transaction = await transfer({
        bankId,
        bankName,
        accountNumber,
        amount: numericAmount,
        recipientReference,
        paymentDetails: paymentDetails || undefined,
        recipientName: recipientName || undefined,
      });
      router.replace({
        pathname: "/success",
        params: {
          type: "transfer",
          title: transaction.title,
          date: transaction.date,
          amount: String(Math.abs(transaction.amount)),
          bankName: transaction.bankName ?? "",
          accountNumber: transaction.accountNumber ?? "",
          recipientName: transaction.recipientName ?? "",
          recipientReference: transaction.recipientReference ?? "",
          paymentDetails: transaction.paymentDetails ?? "",
        },
      } as Href);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Transfer failed.";
      showNotification("Transfer failed", message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScreenHeader title="Confirm Transfer" />

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.summaryCard}>
            <SummaryRow label="Bank" value={bankName} styles={styles} />
            <SummaryRow
              label="Account number"
              value={accountNumber}
              styles={styles}
            />
            <SummaryRow
              label="Recipient name"
              value={recipientName}
              styles={styles}
            />
            <SummaryRow
              label="Amount"
              value={`RM ${formattedAmount}`}
              styles={styles}
              highlight
            />
            <SummaryRow
              label="Recipient reference"
              value={recipientReference}
              styles={styles}
            />
            <SummaryRow
              label="Payment details"
              value={paymentDetails}
              styles={styles}
            />
          </View>
        </ScrollView>

        {isSubmitting ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <Button title="Approve" onPress={handleApprove} />
        )}
      </View>
    </SafeAreaView>
  );
}

function SummaryRow({
  label,
  value,
  styles,
  highlight = false,
}: {
  label: string;
  value: string;
  styles: ReturnType<typeof createStyles>;
  highlight?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, highlight && styles.rowValueHighlight]}>
        {value}
      </Text>
    </View>
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
    flex: {
      flex: 1,
    },
    content: {
      paddingBottom: spacing.lg,
    },
    summaryCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.lg,
      gap: spacing.lg,
    },
    row: {
      gap: spacing.sm,
    },
    rowLabel: {
      fontSize: 12,
      fontWeight: "500",
      color: colors.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    rowValue: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
    },
    rowValueHighlight: {
      fontSize: 24,
      fontWeight: "700",
    },
  });
}
