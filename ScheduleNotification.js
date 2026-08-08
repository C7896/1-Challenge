// ScheduleNotification.js
import * as Notifications from 'expo-notifications';

export async function scheduleDailyNotification() {
  // clear any previously scheduled copies so relaunches don't stack duplicates
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "One Percent Challenge",
      body: "New Challenge Out! Let's make a change!",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 9,
      minute: 0,
    },
  });
}
