import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  Clipboard,
  Linking,
  // SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '../../components/ui/icon-symbol';

export default function SettingsScreen() {
  const router = useRouter();
  const showAboutAlert = () => {
    Alert.alert(
      'About Call Mom',
      'Thank you for downloading Call Mom!\n\nCall Mom is a simple app to help you remember to call your loved ones. Set up schedules and get reminders to stay connected with the people who matter most.\n\nThis is a beta version and more features are coming soon!',
      [{ text: 'OK' }]
    );
  };

  const showNotificationsAlert = () => {
    Alert.alert(
      'Notifications',
      'Notification settings coming in V1.1',
      [{ text: 'OK' }]
    );
  };

  const showContactOptions = () => {
    Alert.alert(
      'Contact Us',
      'Email or follow us on Instagram:',
      [
        {
          text: 'Tap to copy email',
          onPress: () => {
            Clipboard.setString('support@callmom.app');
            Alert.alert('Email copied!', 'support@callmom.app has been copied to clipboard');
          }
        },
        {
          text: 'Open Instagram',
          onPress: () => {
            Linking.openURL('https://instagram.com/callmom_app').catch(() => {
              Alert.alert('Error', 'Failed to open Instagram. Please check if it is installed.');
            });
          }
        },
        {
          text: 'Cancel',
          style: 'destructive'
        }
      ]
    );
  };

  const showClearDataAlert = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your contacts and schedules. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: clearAllData,
        },
      ]
    );
  };

    const clearAllData = async () => {
      try {
        await AsyncStorage.removeItem('@call_mom_contacts');
        Alert.alert('Success', 'All data has been cleared.', [
          {
            text: 'OK',
            onPress: () => router.replace('/'),
          },
        ]);
      } catch (error) {
        Alert.alert('Error', 'Failed to clear data. Please try again.');
        console.error('Error clearing data:', error);
      }
    };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="rgba(106, 45, 212, 0.7)" />
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconSymbol name="gearshape.fill" size={24} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <TouchableOpacity style={styles.row} onPress={showAboutAlert}>
            <View style={styles.rowLeft}>
              <IconSymbol name="info.circle" size={18} color="#6B7280" style={{ marginRight: 8 }} />
              <Text style={styles.rowText}>About Call Mom</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={showNotificationsAlert}>
            <View style={styles.rowLeft}>
              <IconSymbol name="bell.fill" size={18} color="#6B7280" style={{ marginRight: 8 }} />
              <Text style={styles.rowText}>Notifications</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={() => Linking.openSettings()}>
            <View style={styles.rowLeft}>
              <IconSymbol name="lock.fill" size={18} color="#6B7280" style={{ marginRight: 8 }} />
              <Text style={styles.rowText}>App Permissions</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={showContactOptions}>
            <View style={styles.rowLeft}>
              <IconSymbol name="heart.fill" size={18} color="#6B7280" style={{ marginRight: 8 }} />
              <Text style={styles.rowText}>Send Feedback</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          
          <View style={styles.versionRow}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
          
          <TouchableOpacity style={styles.clearButton} onPress={showClearDataAlert}>
            <Text style={styles.clearButtonText}>Clear All Data</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerLinks}>
          <TouchableOpacity onPress={() => router.push('/privacy')}>
            <Text style={styles.footerLinkText}>Privacy</Text>
          </TouchableOpacity>
          <Text style={styles.footerSeparator}> • </Text>
          <TouchableOpacity onPress={() => router.push('/terms')}>
            <Text style={styles.footerLinkText}>Terms & Conditions</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  rowText: {
    fontSize: 18,
    color: '#1F2937',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 20,
    color: '#9CA3AF',
  },
  versionRow: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  versionText: {
    fontSize: 15,
    color: '#9CA3AF',
  },
  clearButton: {
    padding: 16,
    alignItems: 'flex-start',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#DC2626',
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLinkText: {
    fontSize: 14,
    color: '#72a1ecff',
    textAlign: 'center',
  },
  footerSeparator: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
