import { useMemo } from "react";
import Toast, {
  BaseToast,
  type ToastConfig,
} from "react-native-toast-message";

import { useTheme } from "@/contexts/ThemeContext";

export function AppToast() {
  const { colors } = useTheme();

  const toastConfig: ToastConfig = useMemo(
    () => ({
      success: (props) => (
        <BaseToast
          {...props}
          style={{
            borderLeftColor: colors.success,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          text1Style={{
            fontSize: 16,
            fontWeight: "600",
            color: colors.text,
          }}
          text2Style={{
            fontSize: 14,
            color: colors.textSecondary,
          }}
          text2NumberOfLines={3}
        />
      ),
      error: (props) => (
        <BaseToast
          {...props}
          style={{
            borderLeftColor: colors.danger,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          text1Style={{
            fontSize: 16,
            fontWeight: "600",
            color: colors.text,
          }}
          text2Style={{
            fontSize: 14,
            color: colors.textSecondary,
          }}
          text2NumberOfLines={3}
        />
      ),
      info: (props) => (
        <BaseToast
          {...props}
          style={{
            borderLeftColor: colors.primary,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          text1Style={{
            fontSize: 16,
            fontWeight: "600",
            color: colors.text,
          }}
          text2Style={{
            fontSize: 14,
            color: colors.textSecondary,
          }}
          text2NumberOfLines={3}
        />
      ),
    }),
    [colors],
  );

  return <Toast config={toastConfig} topOffset={60} />;
}
