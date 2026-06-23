import { NotificationType } from '@/constants/types';
import Toast from 'react-native-toast-message';

export function formatDate(date: Date): string {
	return date.toLocaleString('en-MY', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	});
}

function resolveNotificationType(
	title: string,
	type?: NotificationType,
): NotificationType {
	if (type) {
		return type;
	}

	const normalizedTitle = title.toLowerCase();

	if (normalizedTitle.includes('fail') || normalizedTitle.includes('error')) {
		return 'error';
	}

	if (normalizedTitle.includes('success')) {
		return 'success';
	}

	return 'info';
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
		position: 'top',
		visibilityTime: 3500,
	});
}

export function formatAmount(amount: string): string {
	const numericAmount = Number.parseFloat(amount);

	if (!Number.isFinite(numericAmount)) {
		return '0.00';
	}

	return numericAmount.toFixed(2);
}

export function formatBalance(balance: number): string {
	return balance.toLocaleString('en-MY', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}
