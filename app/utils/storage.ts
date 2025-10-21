import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contact } from '../types';

const CONTACTS_KEY = '@call_mom_contacts';

export const saveContacts = async (contacts: Contact[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  } catch (error) {
    console.error('Error saving contacts:', error);
  }
};

export const loadContacts = async (): Promise<Contact[]> => {
  try {
    const data = await AsyncStorage.getItem(CONTACTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading contacts:', error);
    return [];
  }
};

export const addContact = async (contact: Contact): Promise<void> => {
  const contacts = await loadContacts();
  contacts.push(contact);
  await saveContacts(contacts);
};

export const updateContact = async (updatedContact: Contact): Promise<void> => {
  const contacts = await loadContacts();
  const index = contacts.findIndex(c => c.id === updatedContact.id);
  if (index !== -1) {
    contacts[index] = updatedContact;
    await saveContacts(contacts);
  }
};

export const deleteContact = async (contactId: string): Promise<void> => {
  const contacts = await loadContacts();
  const filtered = contacts.filter(c => c.id !== contactId);
  await saveContacts(filtered);
};