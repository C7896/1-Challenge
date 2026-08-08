// NotificationInitializer.js
import * as Notifications from 'expo-notifications';

// Requests notification permission (iOS prompt / Android 13+ runtime permission).
// Returns true if granted. Fails silently when denied so the user isn't nagged
// on every launch.
export async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus === 'granted';
}
