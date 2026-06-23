import Toast from "react-native-toast-message";

export function formatDate(date: Date): string {
  return date.toLocaleString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

type NotificationType = "success" | "error" | "info";

function resolveNotificationType(
  title: string,
  type?: NotificationType,
): NotificationType {
  if (type) {
    return type;
  }

  const normalizedTitle = title.toLowerCase();

  if (normalizedTitle.includes("fail") || normalizedTitle.includes("error")) {
    return "error";
  }

  if (normalizedTitle.includes("success")) {
    return "success";
  }

  return "info";
}

export function showNotification(
  title: string,
  message?: string,
  type?: NotificationType,
): void {
  Toast.show({
    type: resolveNotificationType(title, type),
    text1: title,
    text2: message,
    position: "top",
    visibilityTime: 3500,
  });
}
