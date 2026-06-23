import * as Contacts from "expo-contacts";
import { Platform } from "react-native";

export type ContactRecipient = {
  id: string;
  name: string;
  phone?: string;
};

export function getContactDisplayName(contact: Contacts.Contact): string {
  if (contact.name?.trim()) {
    return contact.name.trim();
  }

  const parts = [contact.firstName, contact.middleName, contact.lastName]
    .filter((part) => part?.trim())
    .join(" ")
    .trim();

  return parts || "Unknown";
}

function getPrimaryPhone(contact: Contacts.Contact): string | undefined {
  return contact.phoneNumbers?.[0]?.number?.trim() || undefined;
}

function toContactRecipient(contact: Contacts.Contact): ContactRecipient | null {
  if (!contact.id) {
    return null;
  }

  const name = getContactDisplayName(contact);

  if (name === "Unknown") {
    return null;
  }

  return {
    id: contact.id,
    name,
    phone: getPrimaryPhone(contact),
  };
}

export async function isContactsAvailable(): Promise<boolean> {
  if (Platform.OS === "web") {
    return false;
  }

  return Contacts.isAvailableAsync();
}

export async function requestContactsAccess(): Promise<boolean> {
  const { status } = await Contacts.requestPermissionsAsync();
  return status === "granted";
}

export async function loadContactRecipients(): Promise<ContactRecipient[]> {
  if (!(await isContactsAvailable())) {
    return [];
  }

  const { data } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.PhoneNumbers],
    sort: Contacts.SortTypes.FirstName,
  });

  return data
    .map(toContactRecipient)
    .filter((contact): contact is ContactRecipient => contact !== null);
}

export async function pickContact(): Promise<ContactRecipient | null> {
  if (!(await isContactsAvailable())) {
    return null;
  }

  if (Platform.OS === "android") {
    const hasAccess = await requestContactsAccess();

    if (!hasAccess) {
      return null;
    }
  }

  const contact = await Contacts.presentContactPickerAsync();

  if (!contact) {
    return null;
  }

  return toContactRecipient(contact);
}
