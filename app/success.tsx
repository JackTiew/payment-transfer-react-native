import { Ionicons } from "@expo/vector-icons";
import { type Href, router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { spacing } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

type SuccessType = "reload" | "transfer";

function getParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function formatAmount(amount: string): string {
  const numericAmount = Number.parseFloat(amount);

  if (!Number.isFinite(numericAmount)) {
    return "0.00";
  }

  return numericAmount.toFixed(2);
}

function SummaryRow({
  label,
  value,
  highlight = false,
  valueColor,
  styles,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  valueColor?: string;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text
        style={[
          styles.rowValue,
          highlight && styles.rowValueHighlight,
          valueColor ? { color: valueColor } : undefined,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

export default function SuccessScreen() {
  const params = useLocalSearchParams<{
    type: SuccessType;
    title: string;
    date: string;
    amount: string;
    bankName?: string;
    accountNumber?: string;
    recipientName?: string;
    recipientReference?: string;
    paymentDetails?: string;
  }>();

  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const type = getParam(params.type) as SuccessType;
  const title = getParam(params.title);
  const date = getParam(params.date);
  const formattedAmount = formatAmount(getParam(params.amount));
  const bankName = getParam(params.bankName);
  const accountNumber = getParam(params.accountNumber);
  const recipientName = getParam(params.recipientName);
  const recipientReference = getParam(params.recipientReference);
  const paymentDetails = getParam(params.paymentDetails);

  const isReload = type === "reload";
  const screenTitle = isReload ? "Reload Successful" : "Transfer Successful";
  const amountLabel = isReload
    ? `+RM ${formattedAmount}`
    : `-RM ${formattedAmount}`;
  const amountColor = isReload ? colors.success : colors.danger;

  const handleDone = () => {
    router.replace("/" as Href);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.iconCircle}>
            <Ionicons
              name="checkmark-circle"
              size={88}
              color={colors.success}
            />
          </View>

          <Text style={styles.screenTitle}>{screenTitle}</Text>
          <Text style={styles.subtitle}>
            {isReload
              ? "Your reload has been completed successfully."
              : "Your transfer has been completed successfully."}
          </Text>

          <View style={styles.summaryCard}>
            <SummaryRow label="Transaction" value={title} styles={styles} />
            <SummaryRow label="Date" value={date} styles={styles} />
            <SummaryRow
              label="Amount"
              value={amountLabel}
              styles={styles}
              highlight
              valueColor={amountColor}
            />

            {!isReload ? (
              <>
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
                  label="Recipient reference"
                  value={recipientReference}
                  styles={styles}
                />
                <SummaryRow
                  label="Payment details"
                  value={paymentDetails}
                  styles={styles}
                />
              </>
            ) : null}
          </View>
        </ScrollView>

        <Button title="Back to Home" onPress={handleDone} />
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
      paddingTop: spacing.xl,
      paddingBottom: spacing.lg,
    },
    flex: {
      flex: 1,
    },
    content: {
      alignItems: "center",
      paddingBottom: spacing.lg,
    },
    iconCircle: {
      width: 90,
      height: 90,
      borderRadius: 56,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing.lg,
    },
    screenTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
      marginBottom: spacing.sm,
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
      fontSize: 28,
      fontWeight: "700",
    },
  });
}
