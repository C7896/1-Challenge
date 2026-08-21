// ScheduleNotification.js
import * as Notifications from 'expo-notifications';

// A stable identifier: re-scheduling replaces the existing reminder instead of
// adding a second one. Without it every call stacked another daily trigger.
const DAILY_REMINDER_ID = 'daily-challenge-reminder';

export async function scheduleDailyNotification() {
  // cancelAll also clears duplicates left behind by earlier versions of the app
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_REMINDER_ID,
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

// Re-arm the reminder for someone who already granted permission but has no
// reminder scheduled, for example after reinstalling. Never prompts: the prompt
// deliberately only appears after a completed challenge.
export async function ensureDailyNotificationScheduled() {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      return;
    }
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    if (scheduled.some((n) => n.identifier === DAILY_REMINDER_ID)) {
      return;
    }
    await scheduleDailyNotification();
  } catch (error) {
    console.error("Could not schedule the daily reminder: ", error);
  }
}

// Delivered reminders stay in Notification Centre forever otherwise, so a week
// away from the app leaves seven identical banners piled up.
export async function clearDeliveredNotifications() {
  try {
    await Notifications.dismissAllNotificationsAsync();
  } catch (error) {
    console.error("Could not clear delivered notifications: ", error);
  }
}
