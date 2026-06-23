import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  InputAccessoryView,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { ScreenHeader } from "@/components/ScreenHeader";
import { BANKS, type Bank } from "@/constants/banks";
import { spacing } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

const ACCOUNT_NUMBER_ACCESSORY_ID = "account-number-accessory";

function getParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default function NewTransferScreen() {
  const params = useLocalSearchParams<{ recipientName?: string }>();
  const initialRecipientName = getParam(params.recipientName);
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [recipientName, setRecipientName] = useState(initialRecipientName);
  const [bankModalVisible, setBankModalVisible] = useState(false);

  useEffect(() => {
    if (initialRecipientName) {
      setRecipientName(initialRecipientName);
    }
  }, [initialRecipientName]);

  const canConfirm =
    selectedBank !== null &&
    accountNumber.trim().length >= 6 &&
    recipientName.trim().length > 0;

  const handleConfirm = () => {
    Keyboard.dismiss();

    if (!selectedBank) {
      return;
    }

    router.push({
      pathname: "/transfer/amount",
      params: {
        bankId: selectedBank.id,
        bankName: selectedBank.name,
        accountNumber: accountNumber.trim(),
        recipientName: recipientName.trim(),
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
          <ScreenHeader title="New Transfer" />

          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.form}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.label}>Bank</Text>
            <Pressable
              onPress={() => {
                Keyboard.dismiss();
                setBankModalVisible(true);
              }}
              style={({ pressed }) => [
                styles.selectField,
                pressed && styles.fieldPressed,
              ]}
            >
              <Text
                style={[
                  styles.selectFieldText,
                  !selectedBank && styles.placeholderText,
                ]}
              >
                {selectedBank?.name ?? "Select a bank"}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color={colors.textSecondary}
              />
            </Pressable>

            <Text style={styles.label}>Account number</Text>
            <TextInput
              value={accountNumber}
              onChangeText={(text) =>
                setAccountNumber(text.replace(/\D/g, ""))
              }
              placeholder="Enter account number"
              placeholderTextColor={colors.textSecondary}
              keyboardType={Platform.OS === "web" ? "numeric" : "number-pad"}
              inputMode="numeric"
              inputAccessoryViewID={
                Platform.OS === "ios" ? ACCOUNT_NUMBER_ACCESSORY_ID : undefined
              }
              returnKeyType="done"
              blurOnSubmit
              onSubmitEditing={Keyboard.dismiss}
              style={[styles.input, styles.inputSpaced]}
            />

            <Text style={styles.label}>Recipient name</Text>
            <View style={styles.nameRow}>
              <TextInput
                value={recipientName}
                onChangeText={setRecipientName}
                placeholder="Enter recipient name"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="words"
                returnKeyType="done"
                blurOnSubmit
                onSubmitEditing={Keyboard.dismiss}
                style={[styles.input, styles.nameInput]}
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

      {Platform.OS === "ios" ? (
        <InputAccessoryView nativeID={ACCOUNT_NUMBER_ACCESSORY_ID}>
          <View style={styles.accessoryBar}>
            <Pressable onPress={Keyboard.dismiss} hitSlop={8}>
              <Text style={styles.accessoryDone}>Done</Text>
            </Pressable>
          </View>
        </InputAccessoryView>
      ) : null}

      <Modal
        visible={bankModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setBankModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setBankModalVisible(false)}
          />
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Select bank</Text>
            <FlatList
              data={BANKS}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setSelectedBank(item);
                    setBankModalVisible(false);
                  }}
                  style={({ pressed }) => [
                    styles.bankRow,
                    pressed && styles.fieldPressed,
                    selectedBank?.id === item.id && styles.bankRowSelected,
                  ]}
                >
                  <Text style={styles.bankName}>{item.name}</Text>
                  {selectedBank?.id === item.id && (
                    <Ionicons name="checkmark" size={20} color={colors.primary} />
                  )}
                </Pressable>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </View>
      </Modal>
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
      justifyContent: "space-between",
    },
    form: {
      flexGrow: 1,
      paddingBottom: spacing.lg,
    },
    label: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
      marginBottom: spacing.sm,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    selectField: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.lg,
    },
    selectFieldText: {
      fontSize: 16,
      color: colors.text,
    },
    placeholderText: {
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
    inputSpaced: {
      marginBottom: spacing.lg,
    },
    nameRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    nameInput: {
      flex: 1,
    },
    accessoryBar: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
    },
    accessoryDone: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.primary,
    },
    fieldPressed: {
      opacity: 0.6,
    },
    buttonDisabled: {
      opacity: 0.4,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.45)",
    },
    modalBackdrop: {
      flex: 1,
    },
    modalSheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xl,
      maxHeight: "60%",
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: spacing.md,
    },
    bankRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: spacing.md,
    },
    bankRowSelected: {
      backgroundColor: colors.background,
      marginHorizontal: -spacing.sm,
      paddingHorizontal: spacing.sm,
      borderRadius: 8,
    },
    bankName: {
      fontSize: 16,
      color: colors.text,
    },
    separator: {
      height: 1,
      backgroundColor: colors.border,
    },
  });
}
