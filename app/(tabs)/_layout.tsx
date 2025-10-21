import * as Notifications from 'expo-notifications';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Linking } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  // Handler per notification tap
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const phoneNumber = response.notification.request.content.data.phoneNumber;
      if (phoneNumber) {
        Linking.openURL(`tel:${phoneNumber}`);
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6A2DD4',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#F3F4F6',
          borderTopColor: '#E5E7EB',
          borderTopWidth: 1,
          height: 100,
          paddingBottom: 10,
          paddingTop: 15,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'My Calls',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="phone.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          href: null,  // This hides it from tab bar
          title: 'Schedule',
        }}
      />
      <Tabs.Screen
        name="add-contact"
        options={{
          href: null,  // This hides it from tab bar
          title: 'Add Contact',
        }}
      />
    </Tabs>
  );
}