import * as LocalAuthentication from "expo-local-authentication";
import { Alert, Platform } from "react-native";

import { showNotification } from "@/utils/common";

export type BiometricAuthMethod = "biometric" | "passcode" | "manual";

function showManualConfirmation(
  title: string,
  message: string,
): Promise<boolean> {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined" && typeof window.confirm === "function") {
      return Promise.resolve(window.confirm(`${title}\n\n${message}`));
    }

    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => resolve(false),
        },
        {
          text: "Confirm",
          onPress: () => resolve(true),
        },
      ],
      {
        cancelable: true,
        onDismiss: () => resolve(false),
      },
    );
  });
}

function getAuthenticationErrorMessage(
  error: LocalAuthentication.LocalAuthenticationError,
): string {
  switch (error) {
    case "authentication_failed":
      return "Biometric verification failed. Please try again.";
    case "lockout":
      return "Too many failed attempts. Try again later.";
    case "not_enrolled":
      return "No biometrics are enrolled on this device.";
    case "not_available":
      return "Biometric authentication is not available.";
    case "passcode_not_set":
      return "Set a device passcode to secure this action.";
    case "timeout":
      return "Authentication timed out. Please try again.";
    case "unable_to_process":
      return "Unable to process authentication. Please try again.";
    default:
      return "Unable to verify your identity.";
  }
}

async function getPreferredAuthMethod(): Promise<BiometricAuthMethod> {
  if (Platform.OS === "web") {
    return "manual";
  }

  const [hasHardware, isEnrolled, enrolledLevel] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
    LocalAuthentication.getEnrolledLevelAsync(),
  ]);

  if (hasHardware && isEnrolled) {
    return "biometric";
  }

  if (enrolledLevel >= LocalAuthentication.SecurityLevel.SECRET) {
    return "passcode";
  }

  return "manual";
}

export async function getBiometricLabel(): Promise<string> {
  if (Platform.OS === "web") {
    return "device confirmation";
  }

  const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

  if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
    return "Face ID";
  }

  if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
    return Platform.OS === "ios" ? "Touch ID" : "Fingerprint";
  }

  if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
    return "Iris scan";
  }

  const method = await getPreferredAuthMethod();

  if (method === "passcode") {
    return "device passcode";
  }

  return "confirmation";
}

export async function requireAuthentication(options: {
  promptMessage: string;
  fallbackTitle?: string;
  fallbackMessage?: string;
}): Promise<boolean> {
  const {
    promptMessage,
    fallbackTitle = "Confirm identity",
    fallbackMessage = "Biometric authentication is unavailable. Confirm to continue.",
  } = options;

  if (Platform.OS === "web") {
    return showManualConfirmation(fallbackTitle, fallbackMessage);
  }

  const authMethod = await getPreferredAuthMethod();

  if (authMethod === "manual") {
    return showManualConfirmation(fallbackTitle, fallbackMessage);
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage,
    cancelLabel: "Cancel",
    fallbackLabel: "Use Passcode",
    disableDeviceFallback: false,
    promptDescription:
      authMethod === "passcode"
        ? "Use your device passcode to continue"
        : undefined,
  });

  if (result.success) {
    return true;
  }

  switch (result.error) {
    case "user_cancel":
    case "system_cancel":
    case "app_cancel":
      return false;
    case "user_fallback": {
      const passcodeResult = await LocalAuthentication.authenticateAsync({
        promptMessage,
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

      if (passcodeResult.success) {
        return true;
      }

      if (
        passcodeResult.error === "user_cancel" ||
        passcodeResult.error === "system_cancel" ||
        passcodeResult.error === "app_cancel"
      ) {
        return false;
      }

      showNotification(
        "Authentication failed",
        getAuthenticationErrorMessage(passcodeResult.error),
        "error",
      );
      return false;
    }
    case "not_enrolled":
    case "not_available":
    case "passcode_not_set":
      return showManualConfirmation(fallbackTitle, fallbackMessage);
    default:
      showNotification(
        "Authentication failed",
        getAuthenticationErrorMessage(result.error),
        "error",
      );
      return false;
  }
}
