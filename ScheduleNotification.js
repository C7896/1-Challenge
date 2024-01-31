// ScheduleNotification.js
import * as Notifications from 'expo-notifications';

export async function scheduleDailyNotification() {
  const trigger = new Date();
  trigger.setHours(9, 0, 0); // Set the time to 9:00 AM
  trigger.setDate(trigger.getDate() + 1); // Schedule for the next day

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "One Percent Challenge",
      body: "New Challenge Out! Let's make a change!",
    },
    trigger: {
      hour: 9,
      minute: 0,
      repeats: true
    },
  });
}
