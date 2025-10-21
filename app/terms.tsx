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

export default function TermsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="rgba(106, 45, 212, 0.7)" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Terms of Service</Text>
      </View>

      {/* Back button */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backButton}>← Back</Text>
      </TouchableOpacity>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.lastUpdated}>Last updated: October 21, 2025</Text>

        <Text style={styles.paragraph}>
          By using this app, you agree to these terms. Please read 
          them carefully.
        </Text>

        <Text style={styles.sectionTitle}>Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By downloading and using Call Mom, you accept and agree to be bound by these 
          Terms of Service.
        </Text>

        <Text style={styles.sectionTitle}>Description of Service</Text>
        <Text style={styles.paragraph}>
          Call Mom is a personal reminder app that helps you schedule and remember to call 
          your family and loved ones. The app provides:
        </Text>
        <Text style={styles.paragraph}>
          • Contact management{'\n'}
          • Call scheduling and reminders{'\n'}
          • Local notifications{'\n'}
          • Call statistics tracking
        </Text>

        <Text style={styles.sectionTitle}>User Responsibilities</Text>
        <Text style={styles.paragraph}>
          You are responsible for:{'\n'}
          • Maintaining the accuracy of contact information{'\n'}
          • Setting appropriate notification times{'\n'}
          • Ensuring you have permission to contact the people you add{'\n'}
          • Respecting others' preferences for communication
        </Text>

        <Text style={styles.sectionTitle}>Permitted Use</Text>
        <Text style={styles.paragraph}>
          Call Mom is intended for personal, non-commercial use to help you stay connected 
          with family and friends. You may NOT use this app for:
        </Text>
        <Text style={styles.paragraph}>
          • Spam or unsolicited communications{'\n'}
          • Commercial solicitation{'\n'}
          • Harassment or abuse{'\n'}
          • Any illegal purposes
        </Text>

        <Text style={styles.sectionTitle}>Disclaimer of Warranties</Text>
        <Text style={styles.paragraph}>
          Call Mom is provided "as is" without warranties of any kind. We do not guarantee 
          that notifications will always be delivered on time, as this depends on your 
          device's operating system and settings.
        </Text>

        <Text style={styles.sectionTitle}>Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          We are not liable for any missed calls, notifications, or any consequences 
          resulting from the use or inability to use this app.
        </Text>

        <Text style={styles.sectionTitle}>Data and Privacy</Text>
        <Text style={styles.paragraph}>
          All data is stored locally on your device. We do not collect or transmit your 
          personal information. Please see our Privacy Policy for more details.
        </Text>

        <Text style={styles.sectionTitle}>Modifications to Service</Text>
        <Text style={styles.paragraph}>
          We reserve the right to modify or discontinue the app at any time, with or 
          without notice.
        </Text>

        <Text style={styles.sectionTitle}>Changes to Terms</Text>
        <Text style={styles.paragraph}>
          We may update these terms from time to time. Continued use of the app after 
          changes constitutes acceptance of the new terms.
        </Text>

        <Text style={styles.sectionTitle}>Contact</Text>
        <Text style={styles.paragraph}>
          For questions about these terms, please contact us through the Feedback option 
          in Settings.
        </Text>

        <Text style={styles.footer}>
          Thank you for using Call Mom to stay connected with your loved ones! 💜
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
    padding: 15,
    paddingTop: 60,
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
  footer: {
    fontSize: 15,
    color: '#6A2DD4',
    textAlign: 'center',
    marginTop: 32,
    fontStyle: 'italic',
  },
});