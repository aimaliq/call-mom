import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Contact } from '../types';

interface Props {
  contact: Contact;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ContactCard({ contact, onEdit, onDelete }: Props) {
  const callNow = () => {
    Linking.openURL(`tel:${contact.phoneNumber}`);
  };

  const getDaysText = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const enabledDays = days.filter((_, i) => contact.schedule.days[i]);
    return enabledDays.join(', ');
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.phone}>{contact.phoneNumber}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.schedule}>
          📅 {getDaysText()} at {contact.schedule.time}
        </Text>
        <Text style={styles.stats}>
          🔥 {contact.callCount} calls | Last: {contact.lastCalled || 'Never'}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.callButton} onPress={callNow}>
          <Text style={styles.callButtonText}>📞 Call Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: '#6B7280',
  },
  info: {
    marginBottom: 12,
  },
  schedule: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 4,
  },
  stats: {
    fontSize: 12,
    color: '#6B7280',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  callButton: {
    flex: 2,
    backgroundColor: '#6A2DD4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  callButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  editButton: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#1F2937',
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#DC2626',
    fontWeight: '600',
  },
});