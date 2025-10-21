import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; // ← AGGIUNTO
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Linking,
  // SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '../../components/ui/icon-symbol';
import ContactCard from '../components/ContactCard';
import { Contact } from '../types';
import { cancelNotificationsForContact, requestPermissions } from '../utils/notifications';
import { deleteContact, loadContacts } from '../utils/storage';

export default function HomeScreen() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);

  // ← changed useEffect with useFocusEffect
  useFocusEffect(
    React.useCallback(() => {
      loadData();
      requestPermissions();
    }, [])
  );

  const loadData = async () => {
    const data = await loadContacts();
    setContacts(data);
  };

  const handleDelete = (contactId: string) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await cancelNotificationsForContact(contactId);
            await deleteContact(contactId);
            loadData();
          },
        },
      ]
    );
  };

  const makeCall = async (phoneNumber: string, contactId: string) => {
    try {
      const url = `tel:${phoneNumber}`;
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
        
        // Update call count and last called date
        const updatedContacts = contacts.map(contact => {
          if (contact.id === contactId) {
            return {
              ...contact,
              callCount: contact.callCount + 1,
              lastCalled: new Date().toLocaleDateString()
            };
          }
          return contact;
        });
        
        setContacts(updatedContacts);
        // Use the correct storage function instead of direct AsyncStorage
        const { saveContacts } = await import('../utils/storage');
        await saveContacts(updatedContacts);
      } else {
        Alert.alert('Error', 'Phone calls are not supported on this device');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to make call');
    }
  };

  const formatScheduleDays = (days: boolean[]) => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const activeDays = days
      .map((active, index) => active ? dayNames[index] : null)
      .filter(Boolean);
    
    if (activeDays.length === 7) return 'Every day';
    if (activeDays.length === 0) return 'No days selected';
    return activeDays.join(', ');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="rgba(106, 45, 212, 0.7)" />
      <View style={styles.header}>
       <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
          <IconSymbol name="phone.fill" size={24} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.headerTitle}>My Calls</Text>
        </View>
         {contacts.length === 0 && (
        <TouchableOpacity 
          style={styles.addIcon}
          onPress={() => router.push('/add-contact')}>
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      )}
      </View>
    </View>

      {contacts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📱</Text>
          <Text style={styles.emptyTitle}>No contacts yet</Text>
          <Text style={styles.emptyText}>
            Add your first contact to start scheduling calls
          </Text>
        </View>
      ) : contacts.length === 1 ? (
        <View style={styles.singleCardContainer}>
          <View style={styles.singleCard}>
            {/* Contact Info */}
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contacts[0].name}</Text>
              <Text style={styles.contactPhone}>{contacts[0].phoneNumber}</Text>
            </View>

            {/* Scheduled Calls Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Scheduled Calls</Text>
              <Text style={styles.scheduleDays}>{formatScheduleDays(contacts[0].schedule.days)}</Text>
              <Text style={styles.scheduleTime}>at {contacts[0].schedule.time}</Text>
            </View>

            {/* Stats Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Stats</Text>
              <Text style={styles.statText}>🔥 {contacts[0].callCount} calls</Text>
              <Text style={styles.statText}>📞 Last: {contacts[0].lastCalled || 'Never'}</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.callButton}
                onPress={() => makeCall(contacts[0].phoneNumber, contacts[0].id)}
              >
                <Text style={styles.callButtonText}>Call Now</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => router.push(`/schedule?id=${contacts[0].id}`)}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ContactCard
              contact={item}
              onEdit={() => router.push(`/schedule?id=${item.id}`)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Show Add Contact button only when no contacts exist */}
      {contacts.length === 0 && (
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/add-contact')}
        >
          <Text style={styles.addButtonText}>+ Add Contact</Text>
        </TouchableOpacity>
      )}
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
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginTop: 5,
  },
  list: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#6A2DD4',
    margin: 20,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  addIcon: {
    color: 'white',
    fontSize: 28,
    fontWeight: '600',
    alignItems: 'flex-end',
  },
  // Single card styles
  singleCardContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  singleCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  contactInfo: {
    alignItems: 'center',
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  contactName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  contactPhone: {
    fontSize: 18,
    color: '#6B7280',
    fontFamily: 'monospace',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  scheduleDays: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 4,
  },
  scheduleTime: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'monospace',
  },
  statText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  callButton: {
    flex: 1,
    backgroundColor: '#6A2DD4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  callButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  editButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
});