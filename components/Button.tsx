import { useMemo } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { spacing } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

type ButtonProps = PressableProps & {
  title: string;
};

export function Button({ title, style, disabled, onPress, ...props }: ButtonProps) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        button: {
          backgroundColor: colors.primary,
          paddingVertical: 14,
          paddingHorizontal: spacing.lg,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
        },
        buttonPressed: {
          backgroundColor: colors.primaryPressed,
        },
        buttonDisabled: {
          opacity: 0.4,
        },
        buttonText: {
          color: colors.white,
          fontSize: 16,
          fontWeight: "600",
        },
      }),
    [colors],
  );

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      {...props}
      style={(state) => {
        const resolvedStyle =
          typeof style === "function" ? style(state) : style;

        return [
          styles.button,
          state.pressed && !disabled && styles.buttonPressed,
          disabled && styles.buttonDisabled,
          resolvedStyle,
        ] as StyleProp<ViewStyle>;
      }}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}
