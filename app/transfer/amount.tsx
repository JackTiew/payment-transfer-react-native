import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
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

function getParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default function TransferAmountScreen() {
  const params = useLocalSearchParams<{
    bankId: string;
    bankName: string;
    accountNumber: string;
    recipientName?: string;
  }>();
  const bankId = getParam(params.bankId);
  const bankName = getParam(params.bankName);
  const accountNumber = getParam(params.accountNumber);
  const recipientName = getParam(params.recipientName);

  const { colors } = useTheme();
  const [amount, setAmount] = useState("");
  const [keypadVisible, setKeypadVisible] = useState(true);
  const styles = useMemo(() => createStyles(colors), [colors]);

  useEffect(() => {
    setAmount("");
  }, [bankId, accountNumber]);

  useFocusEffect(
    useCallback(() => {
      setKeypadVisible(true);
    }, []),
  );

  const handleDone = () => {
    setKeypadVisible(false);
    router.push({
      pathname: "/transfer/details",
      params: {
        bankId,
        bankName,
        accountNumber,
        recipientName,
        amount: centsToDecimal(amount),
      },
    });
  };

  const handleClose = () => {
    setKeypadVisible(false);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScreenHeader title="Transfer" showBack={false} />

        <View style={styles.recipientCard}>
          {recipientName ? (
            <>
              <Text style={styles.cardLabel}>Recipient</Text>
              <Text style={styles.cardValue}>{recipientName}</Text>
            </>
          ) : null}
          <Text
            style={[
              styles.cardLabel,
              recipientName ? styles.cardLabelSpaced : undefined,
            ]}
          >
            Bank
          </Text>
          <Text style={styles.cardValue}>{bankName}</Text>
          <Text style={[styles.cardLabel, styles.cardLabelSpaced]}>
            Account number
          </Text>
          <Text style={styles.cardValue}>{accountNumber}</Text>
          <Text style={[styles.cardLabel, styles.cardLabelSpaced]}>
            Enter amount
          </Text>
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
    recipientCard: {
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
    cardLabelSpaced: {
      marginTop: spacing.md,
    },
    cardValue: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
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
