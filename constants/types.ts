export type NotificationType = 'success' | 'error' | 'info';
export type BiometricAuthMethod = 'biometric' | 'passcode' | 'manual';
export type SuccessType = 'reload' | 'transfer';

export const TRANSACTIONS_STORAGE_KEY = '@transactions';
export const RECENT_TRANSFERS_STORAGE_KEY = '@recent_transfers';
export const USER_STORAGE_KEY = '@user';

export type RecentTransfer = {
	id: string;
	name: string;
	bankId: string;
	bankName: string;
	accountNumber: string;
};

export type Bank = {
	id: string;
	name: string;
};
