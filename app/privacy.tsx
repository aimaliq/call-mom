import { useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="rgba(106, 45, 212, 0.7)" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      {/* Back button */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backButton}>← Back</Text>
      </TouchableOpacity>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.lastUpdated}>Last updated: October 21, 2025</Text>

        <Text style={styles.paragraph}>
          Call Mom is designed with your privacy in mind. This app helps you stay connected 
          with your loved ones through simple call reminders.
        </Text>

        <Text style={styles.sectionTitle}>Data Collection</Text>
        <Text style={styles.paragraph}>
          Call Mom stores all data locally on your device. We do not collect, transmit, or 
          store any of your personal information on external servers.
        </Text>

        <Text style={styles.sectionTitle}>Information We Store Locally</Text>
        <Text style={styles.paragraph}>
          • Contact names and phone numbers you add{'\n'}
          • Call schedules and preferences{'\n'}
          • Call history and statistics{'\n'}
          • Notification settings
        </Text>

        <Text style={styles.sectionTitle}>Permissions</Text>
        <Text style={styles.paragraph}>
          • <Text style={styles.bold}>Contacts:</Text> To let you select contacts from your phone{'\n'}
          • <Text style={styles.bold}>Notifications:</Text> To send you call reminders{'\n'}
          • <Text style={styles.bold}>Phone:</Text> To initiate calls when you tap the call button
        </Text>

        <Text style={styles.sectionTitle}>Data Security</Text>
        <Text style={styles.paragraph}>
          All your data remains on your device and is protected by your device's security 
          features. We never access or transmit your information.
        </Text>

        <Text style={styles.sectionTitle}>Third-Party Services</Text>
        <Text style={styles.paragraph}>
          Call Mom does not use any third-party analytics, advertising, or tracking services.
        </Text>

        <Text style={styles.sectionTitle}>Your Rights</Text>
        <Text style={styles.paragraph}>
          You can delete all your data at any time through the app's Settings → Clear All Data.
        </Text>

        <Text style={styles.sectionTitle}>Changes to This Policy</Text>
        <Text style={styles.paragraph}>
          We may update this privacy policy from time to time. Any changes will be reflected 
          in the app and on this page.
        </Text>

        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions about this privacy policy, please contact us through 
          the Feedback option in Settings.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: 'rgba(106, 45, 212, 0.9)',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  backButton: {
    fontSize: 20,
    color: '#6B7280',
    fontWeight: '400',
    padding: 15,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 16,
  },
  bold: {
    fontWeight: '600',
    color: '#000',
  },
});