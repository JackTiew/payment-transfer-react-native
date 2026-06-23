import AsyncStorage from "@react-native-async-storage/async-storage";

import { RECENT_TRANSFERS_STORAGE_KEY, TRANSACTIONS_STORAGE_KEY, USER_STORAGE_KEY } from "@/constants/types";
import { getUserInfo, updateUserBalance } from "@/services/User";
import { formatDate } from "@/utils/common";

export type Transaction = {
  id: string;
  title: string;
  date: string;
  amount: number;
  bankId?: string;
  bankName?: string;
  accountNumber?: string;
  recipientReference?: string;
  recipientName?: string;
  paymentDetails?: string;
};

export type RecentTransfer = {
  id: string;
  name: string;
  bankId: string;
  bankName: string;
  accountNumber: string;
};

export type TransferInput = {
  bankId: string;
  bankName: string;
  accountNumber: string;
  amount: number;
  recipientReference: string;
  paymentDetails?: string;
  recipientName?: string;
};


const MAX_RECENT_TRANSFERS = 5;

async function readTransactions(): Promise<Transaction[]> {
  const stored = await AsyncStorage.getItem(TRANSACTIONS_STORAGE_KEY);

  if (!stored) {
    return [];
  }

  return JSON.parse(stored) as Transaction[];
}

async function saveTransactions(transactions: Transaction[]): Promise<void> {
  await AsyncStorage.setItem(
    TRANSACTIONS_STORAGE_KEY,
    JSON.stringify(transactions),
  );
}

async function readRecentTransfers(): Promise<RecentTransfer[]> {
  const stored = await AsyncStorage.getItem(RECENT_TRANSFERS_STORAGE_KEY);

  if (!stored) {
    return [];
  }

  return JSON.parse(stored) as RecentTransfer[];
}

async function saveRecentTransfers(recent: RecentTransfer[]): Promise<void> {
  await AsyncStorage.setItem(
    RECENT_TRANSFERS_STORAGE_KEY,
    JSON.stringify(recent),
  );
}

function getRecentDisplayName(input: TransferInput): string {
  return input.recipientName?.trim() || input.recipientReference.trim();
}

async function upsertRecentTransfer(input: TransferInput): Promise<void> {
  const recent = await readRecentTransfers();
  const name = getRecentDisplayName(input);
  const entry: RecentTransfer = {
    id: `${Date.now()}`,
    name,
    bankId: input.bankId,
    bankName: input.bankName,
    accountNumber: input.accountNumber,
  };

  const filtered = recent.filter(
    (item) =>
      !(
        item.bankId === entry.bankId &&
        item.accountNumber === entry.accountNumber
      ),
  );

  filtered.unshift(entry);
  await saveRecentTransfers(filtered.slice(0, MAX_RECENT_TRANSFERS));
}

export async function getRecentTransfers(): Promise<RecentTransfer[]> {
  return readRecentTransfers();
}

export async function reload(amount: number): Promise<Transaction> {
  if (amount <= 0) {
    throw new Error("Reload amount must be greater than zero.");
  }

  const user = await getUserInfo();
  const transaction: Transaction = {
    id: `${Date.now()}`,
    title: "Fund In",
    date: formatDate(new Date()),
    amount,
  };

  const transactions = await readTransactions();
  transactions.unshift(transaction);
  await saveTransactions(transactions);
  await updateUserBalance(user.balance + amount);

  return transaction;
}

export async function transfer(input: TransferInput): Promise<Transaction> {
  if (input.amount <= 0) {
    throw new Error("Transfer amount must be greater than zero.");
  }

  if (!input.recipientReference.trim()) {
    throw new Error("Recipient reference is required.");
  }

  const user = await getUserInfo();

  if (user.balance < input.amount) {
    throw new Error("Insufficient balance.");
  }

  const transaction: Transaction = {
    id: `${Date.now()}`,
    title: `Transfer to ${input.recipientName?.trim() || input.recipientReference.trim()}`,
    date: formatDate(new Date()),
    amount: -input.amount,
    bankId: input.bankId,
    bankName: input.bankName,
    accountNumber: input.accountNumber,
    recipientReference: input.recipientReference.trim(),
    recipientName: input.recipientName?.trim() || undefined,
    paymentDetails: input.paymentDetails?.trim() || undefined,
  };

  const transactions = await readTransactions();
  transactions.unshift(transaction);
  await saveTransactions(transactions);
  await updateUserBalance(user.balance - input.amount);
  await upsertRecentTransfer(input);

  return transaction;
}

export async function getTransactions(): Promise<Transaction[]> {
  return readTransactions();
}

export async function resetAllData(): Promise<void> {
  await Promise.all([
    AsyncStorage.removeItem(TRANSACTIONS_STORAGE_KEY),
    AsyncStorage.removeItem(RECENT_TRANSFERS_STORAGE_KEY),
    AsyncStorage.removeItem(USER_STORAGE_KEY),
  ]);
}
