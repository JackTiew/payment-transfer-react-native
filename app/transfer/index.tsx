import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { type Href, router } from "expo-router";
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

import { ScreenHeader } from "@/components/ScreenHeader";
import { spacing } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import {
  isContactsAvailable,
  loadContactRecipients,
  pickContact,
  requestContactsAccess,
  type ContactRecipient,
} from "@/services/Contacts";
import {
  getRecentTransfers,
  type RecentTransfer,
} from "@/services/Transaction";
import { showNotification } from "@/utils/common";

type TransferListItem =
  | { type: "new"; id: "new" }
  | { type: "header"; id: string; title: string }
  | { type: "empty"; id: string; message: string }
  | { type: "action"; id: string; label: string }
  | {
      type: "recent";
      id: string;
      name: string;
      bankId: string;
      bankName: string;
      accountNumber: string;
    }
  | {
      type: "contact";
      id: string;
      name: string;
      phone?: string;
    };

function buildListData(
  recentTransfers: RecentTransfer[],
  contacts: ContactRecipient[],
  contactsUnavailable: boolean,
  contactsPermissionDenied: boolean,
): TransferListItem[] {
  const items: TransferListItem[] = [
    { type: "new", id: "new" },
    { type: "header", id: "recent-header", title: "Recent" },
  ];

  if (recentTransfers.length === 0) {
    items.push({
      type: "empty",
      id: "recent-empty",
      message: "No recent transfers yet",
    });
  } else {
    items.push(
      ...recentTransfers.map((transfer) => ({
        type: "recent" as const,
        ...transfer,
      })),
    );
  }

  items.push({ type: "header", id: "contacts-header", title: "Contacts" });

  if (contactsUnavailable) {
    items.push({
      type: "empty",
      id: "contacts-unavailable",
      message: "Contacts are not available on this device.",
    });
  } else if (contactsPermissionDenied) {
    items.push({
      type: "action",
      id: "contacts-permission",
      label: "Allow access to contacts",
    });
  } else {
    items.push({
      type: "action",
      id: "browse-contacts",
      label: "Select from contacts",
    });

    if (contacts.length === 0) {
      items.push({
        type: "empty",
        id: "contacts-empty",
        message: "No contacts found",
      });
    } else {
      items.push(
        ...contacts.map((contact) => ({
          type: "contact" as const,
          ...contact,
        })),
      );
    }
  }

  return items;
}

export default function TransferScreen() {
  const { colors } = useTheme();
  const [listData, setListData] = useState<TransferListItem[]>(
    buildListData([], [], false, false),
  );
  const [isLoading, setIsLoading] = useState(true);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const loadData = useCallback(async () => {
    setIsLoading(true);

    try {
      const [recent, unavailable] = await Promise.all([
        getRecentTransfers(),
        isContactsAvailable().then((available) => !available),
      ]);

      let contacts: ContactRecipient[] = [];
      let permissionDenied = false;

      if (!unavailable) {
        const hasAccess = await requestContactsAccess();

        if (hasAccess) {
          contacts = await loadContactRecipients();
        } else {
          permissionDenied = true;
        }
      }

      setListData(
        buildListData(recent, contacts, unavailable, permissionDenied),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const openNewTransfer = (recipientName?: string) => {
    if (recipientName) {
      router.push({
        pathname: "/transfer/new",
        params: { recipientName },
      });
      return;
    }

    router.push("/transfer/new" as Href);
  };

  const handleNewTransfer = () => {
    openNewTransfer();
  };

  const handleRecentTransfer = (
    item: Extract<TransferListItem, { type: "recent" }>,
  ) => {
    router.push({
      pathname: "/transfer/amount",
      params: {
        bankId: item.bankId,
        bankName: item.bankName,
        accountNumber: item.accountNumber,
        recipientName: item.name,
      },
    });
  };

  const handleContactSelect = (
    item: Extract<TransferListItem, { type: "contact" }>,
  ) => {
    openNewTransfer(item.name);
  };

  const handleBrowseContacts = async () => {
    const contact = await pickContact();

    if (contact) {
      openNewTransfer(contact.name);
    }
  };

  const handleContactsPermission = async () => {
    const hasAccess = await requestContactsAccess();

    if (hasAccess) {
      await loadData();
      return;
    }

    showNotification(
      "Contacts access denied",
      "Enable contacts permission in your device settings to select recipients.",
      "error",
    );
  };

  const handleAction = (id: string) => {
    if (id === "contacts-permission") {
      handleContactsPermission();
      return;
    }

    if (id === "browse-contacts") {
      handleBrowseContacts();
    }
  };

  const renderItem = ({ item }: { item: TransferListItem }) => {
    if (item.type === "new") {
      return (
        <Pressable
          onPress={handleNewTransfer}
          style={({ pressed }) => [
            styles.newTransferRow,
            pressed && styles.rowPressed,
          ]}
        >
          <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
          <Text style={styles.newTransferText}>New Transfer</Text>
        </Pressable>
      );
    }

    if (item.type === "header") {
      return <Text style={styles.sectionTitle}>{item.title}</Text>;
    }

    if (item.type === "empty") {
      return <Text style={styles.emptyText}>{item.message}</Text>;
    }

    if (item.type === "action") {
      return (
        <Pressable
          onPress={() => handleAction(item.id)}
          style={({ pressed }) => [
            styles.actionRow,
            pressed && styles.rowPressed,
          ]}
        >
          <Ionicons name="people-outline" size={24} color={colors.primary} />
          <Text style={styles.actionText}>{item.label}</Text>
        </Pressable>
      );
    }

    if (item.type === "contact") {
      return (
        <Pressable
          onPress={() => handleContactSelect(item)}
          style={({ pressed }) => [styles.recentRow, pressed && styles.rowPressed]}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.recentInfo}>
            <Text style={styles.recentName}>{item.name}</Text>
            {item.phone ? (
              <Text style={styles.recentDetails}>{item.phone}</Text>
            ) : null}
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </Pressable>
      );
    }

    return (
      <Pressable
        onPress={() => handleRecentTransfer(item)}
        style={({ pressed }) => [styles.recentRow, pressed && styles.rowPressed]}
      >
        <View style={styles.recentInfo}>
          <Text style={styles.recentName}>{item.name}</Text>
          <Text style={styles.recentDetails}>
            {item.bankName} · {item.accountNumber}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScreenHeader title="Transfer" />
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={listData}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={({ leadingItem }) =>
              leadingItem?.type === "new" ||
              leadingItem?.type === "header" ||
              leadingItem?.type === "empty" ||
              leadingItem?.type === "action"
                ? null
                : (
                  <View style={styles.separator} />
                )
            }
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
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
    },
    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    listContent: {
      paddingBottom: spacing.lg,
    },
    newTransferRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      paddingVertical: spacing.md,
    },
    newTransferText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.primary,
    },
    actionRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      paddingVertical: spacing.md,
    },
    actionText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.primary,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 1,
      paddingTop: spacing.sm,
      paddingBottom: spacing.sm,
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      paddingVertical: spacing.sm,
    },
    recentRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: spacing.md,
      gap: spacing.md,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.primary,
    },
    recentInfo: {
      flex: 1,
      marginRight: spacing.md,
    },
    recentName: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
      marginBottom: 4,
    },
    recentDetails: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    rowPressed: {
      opacity: 0.6,
    },
    separator: {
      height: 1,
      backgroundColor: colors.border,
    },
  });
}
