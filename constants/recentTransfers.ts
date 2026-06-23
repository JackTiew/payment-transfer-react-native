export type RecentTransfer = {
  id: string;
  name: string;
  bankId: string;
  bankName: string;
  accountNumber: string;
};

export const RECENT_TRANSFERS: RecentTransfer[] = [
  {
    id: "1",
    name: "Ali Ahmad",
    bankId: "maybank",
    bankName: "Maybank",
    accountNumber: "1234567890",
  },
  {
    id: "2",
    name: "Siti Aminah",
    bankId: "cimb",
    bankName: "CIMB Bank",
    accountNumber: "9876543210",
  },
  {
    id: "3",
    name: "Lee Wei Ming",
    bankId: "public",
    bankName: "Public Bank",
    accountNumber: "5555666677",
  },
];
