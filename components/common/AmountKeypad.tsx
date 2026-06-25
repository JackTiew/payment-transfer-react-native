import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { spacing } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

const KEYPAD_KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["", "0", "backspace"],
] as const;

const MAX_CENTS = 9999999999;

type AmountKeypadProps = {
  visible: boolean;
  amount: string;
  onAmountChange: (amount: string) => void;
  onDone: () => void;
  onClose: () => void;
  title?: string;
  dimBackground?: boolean;
  showAmountHeader?: boolean;
};

export function appendCentDigit(current: string, key: string): string {
  if (key === "backspace") {
    if (!current) {
      return "";
    }
    const next = Math.floor(Number.parseInt(current, 10) / 10);
    return next > 0 ? String(next) : "";
  }

  if (!/^\d$/.test(key)) {
    return current;
  }

  const currentCents = current ? Number.parseInt(current, 10) : 0;
  const nextCents = currentCents * 10 + Number.parseInt(key, 10);

  if (nextCents > MAX_CENTS) {
    return current;
  }

  return String(nextCents);
}

export function formatCentsDisplay(cents: string): string {
  const value = cents ? Number.parseInt(cents, 10) : 0;
  return (value / 100).toFixed(2);
}

export function centsToDecimal(cents: string): string {
  return formatCentsDisplay(cents);
}

export function decimalToCents(decimal: string): string {
  const numericAmount = Number.parseFloat(decimal);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return "";
  }

  return String(Math.round(numericAmount * 100));
}

export function AmountKeypad({
  visible,
  amount,
  onAmountChange,
  onDone,
  onClose,
  title = "Enter reload amount",
  dimBackground = true,
  showAmountHeader = true,
}: AmountKeypadProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const centsValue = amount ? Number.parseInt(amount, 10) : 0;
  const canSubmit = centsValue > 0;

  const handleKeyPress = (key: string) => {
    if (!key) {
      return;
    }
    onAmountChange(appendCentDigit(amount, key));
  };

  const keypadContent = (
    <View
      style={[
        styles.overlay,
        !dimBackground && styles.overlayTransparent,
        Platform.OS === "web" && styles.webOverlay,
      ]}
    >
      {dimBackground ? (
        <Pressable style={styles.backdrop} onPress={onClose} />
      ) : (
        <View style={styles.backdrop} />
      )}
      <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.md }]}>
        <View style={styles.sheetHeader}>
          <Pressable
            onPress={onClose}
            hitSlop={8}
            style={({ pressed }) => [
              styles.cancelButton,
              pressed && styles.cancelButtonPressed,
            ]}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
        <View style={styles.handle} />
        {showAmountHeader ? (
          <>
            <Text style={styles.sheetTitle}>{title}</Text>
            <Text style={styles.amountDisplay}>
              RM {formatCentsDisplay(amount)}
            </Text>
          </>
        ) : null}

        <View style={styles.keypad}>
          {KEYPAD_KEYS.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.keypadRow}>
              {row.map((key, keyIndex) =>
                key ? (
                  <Pressable
                    key={key}
                    onPress={() => handleKeyPress(key)}
                    style={({ pressed }) => [
                      styles.key,
                      pressed && styles.keyPressed,
                    ]}
                  >
                    {key === "backspace" ? (
                      <Ionicons
                        name="backspace-outline"
                        size={24}
                        color={colors.text}
                      />
                    ) : (
                      <Text style={styles.keyText}>{key}</Text>
                    )}
                  </Pressable>
                ) : (
                  <View key={`spacer-${keyIndex}`} style={styles.keySpacer} />
                ),
              )}
            </View>
          ))}
        </View>

        <Pressable
          onPress={onDone}
          disabled={!canSubmit}
          style={({ pressed }) => [
            styles.doneButton,
            !canSubmit && styles.doneButtonDisabled,
            pressed && canSubmit && styles.doneButtonPressed,
          ]}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </Pressable>
      </View>
    </View>
  );

  if (Platform.OS === "web") {
    if (!visible) {
      return null;
    }

    return <View style={styles.webRoot}>{keypadContent}</View>;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      {keypadContent}
    </Modal>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>["colors"]) {
  return StyleSheet.create({
    webRoot: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 1000,
    },
    overlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.45)",
    },
    webOverlay: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    overlayTransparent: {
      backgroundColor: "transparent",
    },
    cancelButton: {
      alignSelf: "flex-start",
      paddingVertical: spacing.sm,
    },
    cancelButtonPressed: {
      opacity: 0.6,
    },
    cancelText: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.iconAccent,
    },
    backdrop: {
      flex: 1,
    },
    sheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.sm,
    },
    sheetHeader: {
      marginBottom: spacing.sm,
    },
    handle: {
      alignSelf: "center",
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      marginBottom: spacing.lg,
    },
    sheetTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      textAlign: "center",
      marginBottom: spacing.sm,
    },
    amountDisplay: {
      fontSize: 32,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
      marginBottom: spacing.lg,
    },
    keypad: {
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    keypadRow: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    key: {
      flex: 1,
      aspectRatio: 1.6,
      maxHeight: 56,
      borderRadius: 12,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
    },
    keySpacer: {
      flex: 1,
    },
    keyPressed: {
      opacity: 0.6,
    },
    keyText: {
      fontSize: 22,
      fontWeight: "500",
      color: colors.text,
    },
    doneButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: "center",
    },
    doneButtonDisabled: {
      opacity: 0.4,
    },
    doneButtonPressed: {
      backgroundColor: colors.primaryPressed,
    },
    doneButtonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: "600",
    },
  });
}
