import * as Notifications from 'expo-notifications';
import { Contact } from '../types';

// Setup notification behavior
Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const setupNotifications = async (): Promise<boolean> => {
  // Request permissions with explicit options
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const requestOptions: Notifications.NotificationPermissionsRequest = {
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowDisplayInCarPlay: false,
        allowCriticalAlerts: false,
        provideAppNotificationSettings: false,
        allowProvisional: false,
        allowAnnouncements: false,
      } as Notifications.IosNotificationPermissionsRequest,
    };
    
    const { status } = await Notifications.requestPermissionsAsync(requestOptions);
    finalStatus = status;
  }
  
  return finalStatus === 'granted';
};

export const requestPermissions = async (): Promise<boolean> => {
  return await setupNotifications();
};

export const scheduleNotificationsForContact = async (contact: Contact): Promise<void> => {
  console.log('=== SCHEDULING NOTIFICATIONS ===', contact.name);
  
  // Cancel existing notifications for this contact
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notification of scheduled) {
    if (notification.content.data?.contactId === contact.id) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }

  // Schedule new notifications
  const [hours, minutes] = contact.schedule.time.split(':').map(Number);
  console.log('Parsed time:', hours, ':', minutes);
  
  let scheduledCount = 0;
  
  // Use for...of instead of forEach for proper await handling
  for (let dayIndex = 0; dayIndex < contact.schedule.days.length; dayIndex++) {
    const enabled = contact.schedule.days[dayIndex];
    console.log('Day', dayIndex, '(', ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][dayIndex], ') enabled:', enabled);
    
    if (!enabled) continue;

    const triggerObj = {
      weekday: dayIndex + 1,
      hour: hours,
      minute: minutes,
      repeats: true,
    };
    console.log('Scheduling notification with trigger:', JSON.stringify(triggerObj, null, 2));

    const trigger: Notifications.CalendarTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      weekday: dayIndex + 1, // Sunday = 1
      hour: hours,
      minute: minutes,
      repeats: true,
    };

    const content: Notifications.NotificationContentInput = {
      title: `Hey, remeber to call ${contact.name}`,
      body: 'Tap to call.',
      data: { 
        contactId: contact.id,
        phoneNumber: contact.phoneNumber 
      },
      sound: true,
    };

    const result = await Notifications.scheduleNotificationAsync({
      content,
      trigger,
    });
    console.log('Notification scheduled with ID:', result);
    scheduledCount++;
  }
  
  console.log('Total notifications scheduled:', scheduledCount);
};

export const cancelNotificationsForContact = async (contactId: string): Promise<void> => {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notification of scheduled) {
    if (notification.content.data?.contactId === contactId) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
};

export const debugScheduledNotifications = async () => {
  const all = await Notifications.getAllScheduledNotificationsAsync();
  console.log('\n=== ALL SCHEDULED NOTIFICATIONS ===');
  console.log('Total count:', all.length);
  all.forEach((notif, index) => {
    console.log(`\n${index + 1}. ${notif.content.title}`);
    console.log('   Trigger:', JSON.stringify(notif.trigger, null, 2));
    console.log('   Data:', notif.content.data);
  });
  return all;
};