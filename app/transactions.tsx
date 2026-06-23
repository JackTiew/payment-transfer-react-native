import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { spacing } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import {
  getTransactions,
  type Transaction,
} from "@/services/Transaction";

function formatAmount(amount: number): string {
  return Math.abs(amount).toFixed(2);
}

function getTransactionTitle(item: Transaction): string {
  if (item.amount < 0) {
    const name = item.recipientName?.trim() || item.recipientReference?.trim();

    if (name) {
      return `Transfer to ${name}`;
    }
  }

  return item.title;
}

export default function TransactionsScreen() {
  const { colors } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const styles = useMemo(() => createStyles(colors), [colors]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadTransactions = async () => {
        setIsLoading(true);

        try {
          const data = await getTransactions();

          if (isActive) {
            setTransactions(data);
          }
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      };

      loadTransactions();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const renderItem = ({ item }: { item: Transaction }) => {
    const isFundIn = item.amount >= 0;
    const amountLabel = isFundIn
      ? `RM ${formatAmount(item.amount)}`
      : `-RM ${formatAmount(item.amount)}`;

    return (
      <View style={styles.transactionRow}>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionTitle}>{getTransactionTitle(item)}</Text>
          <Text style={styles.transactionDate}>{item.date}</Text>
        </View>
        <Text
          style={[
            styles.transactionAmount,
            isFundIn ? styles.amountIn : styles.amountOut,
          ]}
        >
          {amountLabel}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Transactions</Text>
        </View>

        {isLoading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : transactions.length === 0 ? (
          <View style={styles.centerContent}>
            <View style={styles.emptyIconCircle}>
              <Ionicons
                name="receipt-outline"
                size={48}
                color={colors.textSecondary}
              />
            </View>
            <Text style={styles.emptyTitle}>No transactions at the moment</Text>
          </View>
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            showsVerticalScrollIndicator={false}
          />
        )}
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
      paddingTop: spacing.md,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginBottom: spacing.lg,
      paddingHorizontal: spacing.lg,
    },
    backButton: {
      padding: spacing.sm,
      marginLeft: -spacing.sm,
    },
    backButtonPressed: {
      opacity: 0.6,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: "600",
      color: colors.text,
    },
    centerContent: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.lg,
    },
    emptyIconCircle: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing.lg,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      textAlign: "center",
      marginBottom: spacing.sm,
    },
    listContent: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
    },
    transactionRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: spacing.md,
      paddingVertical: spacing.md,
    },
    transactionInfo: {
      flex: 1,
    },
    transactionTitle: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
      marginBottom: spacing.sm,
    },
    transactionDate: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    transactionAmount: {
      fontSize: 15,
      fontWeight: "600",
    },
    amountIn: {
      color: colors.success,
    },
    amountOut: {
      color: colors.danger,
    },
    separator: {
      height: 1,
      backgroundColor: colors.border,
    },
  });
}
