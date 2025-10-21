import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  // SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '../../components/ui/icon-symbol';
import DaySelector from '../components/DaySelector';
import { Contact } from '../types';
import { debugScheduledNotifications, scheduleNotificationsForContact } from '../utils/notifications';
import { addContact, deleteContact, loadContacts, updateContact } from '../utils/storage';

export default function ScheduleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [selectedDays, setSelectedDays] = useState<boolean[]>([
    false, false, false, false, false, false, false
  ]);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load existing contact data if in edit mode
  useEffect(() => {
    const loadExistingContact = async () => {
      if (params.id) {
        const contacts = await loadContacts();
        const existing = contacts.find(c => c.id === params.id);
        if (existing) {
          setSelectedDays(existing.schedule.days);
          const [h, m] = existing.schedule.time.split(':').map(Number);
          const newTime = new Date();
          newTime.setHours(h, m);
          setSelectedTime(newTime);
        }
      }
    };
    loadExistingContact();
  }, [params.id]);

  const handleDaysChange = (days: boolean[]) => {
    setSelectedDays(days);
  };

  const handleTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(false);
    if (time) {
      setSelectedTime(time);
    }
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSave = async () => {
    if (!selectedDays.some(d => d)) {
      Alert.alert('Error', 'Please select at least one day');
      return;
    }

    setSaving(true);

    try {
      const timeString = `${selectedTime.getHours().toString().padStart(2, '0')}:${selectedTime.getMinutes().toString().padStart(2, '0')}`;

      let contact: Contact;

      if (params.id) {
        // Edit mode: Load existing contact and preserve its data
        const contacts = await loadContacts();
        const existingContact = contacts.find(c => c.id === params.id);
        
        if (existingContact) {
          // Preserve all existing data, only update schedule
          contact = {
            ...existingContact,
            schedule: {
              days: selectedDays,
              time: timeString,
            },
          };
        } else {
          // Contact not found - this should never happen
          throw new Error('Contact not found');
        }
        await updateContact(contact);
      } else {
        // New contact mode: Use params data
        contact = {
          id: Date.now().toString(),
          name: params.name as string,
          phoneNumber: params.phoneNumber as string,
          schedule: {
            days: selectedDays,
            time: timeString,
          },
          callCount: 0,
        };
        await addContact(contact);
      }
      
      await scheduleNotificationsForContact(contact);
      await debugScheduledNotifications();
      
      Alert.alert('Success', params.id ? 'Contact updated!' : 'Contact added!', [
        { text: 'OK', onPress: () => router.push('/') },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save contact. Please try again.');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };
const showRemoveContactAlert = () => {
    Alert.alert(
      'Remove Contact',
      'This will remove the contact from your schedule. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove Contact',
          style: 'destructive',
          onPress: removeContact,
        },
      ]
    );
  };
  const removeContact = async () => {
    try {
      await deleteContact(params.id as string);
      Alert.alert('Success', 'Contact removed!', [
        { text: 'OK', onPress: () => router.push('/') },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to remove contact. Please try again.');
      console.error('Remove error:', error);
    }
  };
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="rgba(106, 45, 212, 0.7)" />
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconSymbol name="calendar" size={22} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.headerTitle}>Schedule Calls</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Back button*/}
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>

        {/* Day Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Days</Text>
          <DaySelector days={selectedDays} onChange={handleDaysChange} />
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.timeButtonText}>
              🕐 {formatTime(selectedTime)}
            </Text>
          </TouchableOpacity>

          {showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={handleTimeChange}
            />
          )}
        </View>

        

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : 'Save Schedule'}
          </Text>
        </TouchableOpacity>

        {/* Delete Contact */}
        <TouchableOpacity style={styles.removeButton} onPress={showRemoveContactAlert}>
            <Text style={styles.removeButtonText}>Remove Contact</Text>
          </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: 'rgba(106, 45, 212, 0.9)',
    padding: 15,
    paddingTop: 60,
  },
  backButton: {
    color: '#6B7280',
    fontSize: 20,
    marginBottom: 50,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  contactInfo: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  contactName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  contactPhone: {
    fontSize: 16,
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  timeButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  timeButtonText: {
    fontSize: 18,
    color: '#6A2DD4',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#6A2DD4',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  saveButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  removeButton: {
    padding: 16,
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 16,
    color: '#DC2626',
    fontWeight: '600',
  },
});