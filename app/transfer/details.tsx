import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/common/Button";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { spacing } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

function getParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default function TransferDetailsScreen() {
  const params = useLocalSearchParams<{
    bankId: string;
    bankName: string;
    accountNumber: string;
    amount: string;
    recipientName?: string;
  }>();
  const bankId = getParam(params.bankId);
  const bankName = getParam(params.bankName);
  const accountNumber = getParam(params.accountNumber);
  const amount = getParam(params.amount);
  const recipientName = getParam(params.recipientName);
  const { colors } = useTheme();
  const [recipientReference, setRecipientReference] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");
  const styles = useMemo(() => createStyles(colors), [colors]);

  const canConfirm = recipientReference.trim().length > 0;

  const handleConfirm = () => {
    router.push({
      pathname: "/transfer/confirm",
      params: {
        bankId,
        bankName,
        accountNumber,
        amount,
        recipientName,
        recipientReference: recipientReference.trim(),
        paymentDetails: paymentDetails.trim(),
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <ScreenHeader title="Transfer Details" />

          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.form}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Recipient reference</Text>
              </View>
              <TextInput
                value={recipientReference}
                onChangeText={setRecipientReference}
                placeholderTextColor={colors.textSecondary}
                style={styles.input}
              />
            </View>

            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Payment details</Text>
                <Text style={styles.optional}>(Optional)</Text>
              </View>
              <TextInput
                value={paymentDetails}
                onChangeText={setPaymentDetails}
                placeholderTextColor={colors.textSecondary}
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <Button
            title="Confirm"
            onPress={handleConfirm}
            disabled={!canConfirm}
            style={!canConfirm && styles.buttonDisabled}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>["colors"]) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    flex: {
      flex: 1,
    },
    container: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.lg,
    },
    form: {
      paddingBottom: spacing.lg,
    },
    fieldGroup: {
      marginBottom: spacing.lg,
    },
    labelRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: spacing.sm,
    },
    label: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.text,
    },
    optional: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    input: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      fontSize: 16,
      color: colors.text,
    },
    textArea: {
      minHeight: 120,
      paddingTop: spacing.md,
    },
    buttonDisabled: {
      opacity: 0.4,
    },
  });
}
