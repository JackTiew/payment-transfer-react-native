import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { spacing } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

type HomeHeaderProps = {
  userName: string;
};

export function HomeHeader({ userName }: HomeHeaderProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const avatarInitial = userName.charAt(0).toUpperCase();

  return (
    <View style={styles.header}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{avatarInitial}</Text>
      </View>
      <Text style={styles.greeting}>Hello, {userName}</Text>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>["colors"]) {
  return StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      marginBottom: spacing.xl,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: {
      color: colors.white,
      fontSize: 20,
      fontWeight: "700",
    },
    greeting: {
      fontSize: 22,
      fontWeight: "600",
      color: colors.text,
    },
  });
}
