import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { spacing } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

type ScreenHeaderProps = {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
};

export function ScreenHeader({
  title,
  onBack,
  showBack = true,
}: ScreenHeaderProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleBack = onBack ?? (() => router.back());

  return (
    <View style={styles.header}>
      {showBack ? (
        <Pressable
          onPress={handleBack}
          hitSlop={8}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
      ) : null}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>["colors"]) {
  return StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    backButton: {
      padding: spacing.sm,
      marginLeft: -spacing.sm,
    },
    backButtonPressed: {
      opacity: 0.6,
    },
    title: {
      fontSize: 22,
      fontWeight: "600",
      color: colors.text,
    },
  });
}
