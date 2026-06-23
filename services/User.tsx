import AsyncStorage from "@react-native-async-storage/async-storage";

export type User = {
  name: string;
  accountNumber: string;
  balance: number;
};

const USER_STORAGE_KEY = "@user";

const DEFAULT_USER: User = {
  name: "User",
  accountNumber: "1111 2222 3333 4444",
  balance: 0,
};

async function readUser(): Promise<User> {
  const stored = await AsyncStorage.getItem(USER_STORAGE_KEY);

  if (!stored) {
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(DEFAULT_USER));
    return DEFAULT_USER;
  }

  return JSON.parse(stored) as User;
}

export async function getUserInfo(): Promise<User> {
  return readUser();
}

export async function updateUserBalance(balance: number): Promise<User> {
  const user = await readUser();
  const updatedUser: User = { ...user, balance };
  await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
  return updatedUser;
}
