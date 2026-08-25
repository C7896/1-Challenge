import { SafeAreaView, StyleSheet, Text, View, Image, Pressable, useWindowDimensions } from 'react-native';
import React, { useEffect } from 'react';
import StreakContainer from "../components/streakContainer";
import { registerForPushNotificationsAsync } from "../NotificationInitializer";
import { scheduleDailyNotification } from "../ScheduleNotification";

const earth = require('../assets/mother_nature.png');

// Laid out from the design's own 432 x 936 frame: the title sits a little above
// a third of the way down, the illustration fills the middle, and the streak and
// the button sit together on the bottom edge.
const DH = 936;
const TITLE_TOP = 120;
const CTA_BOTTOM = 10;
const TAB_BAR_SPACE = 105;
const ART_WIDTH = 0.76;

export default function Challenge4Screen({ navigation, route }) {
  const { streak = 0 } = route.params ?? {};

  useEffect(() => {
    async function setupNotifications() {
      try {
        const granted = await registerForPushNotificationsAsync();
        if (granted) {
          await scheduleDailyNotification();
        }
      } catch (error) {
        console.error('Error setting up notifications:', error);
      }
    }

    setupNotifications();
  }, []);

  const { height } = useWindowDimensions();
  const scale = height / DH;

  return (
      <SafeAreaView style={styles.container}>
          <Text style={[styles.title, { marginTop: TITLE_TOP * scale }]}>Challenge Complete</Text>

          {/* the illustration takes the space between the title and the bottom
              group rather than being pinned to either */}
          <View style={styles.artArea}>
              <Image source={earth} style={styles.art} resizeMode="contain" accessible={false} />
          </View>

          <View style={[styles.bottom, { paddingBottom: TAB_BAR_SPACE * scale + CTA_BOTTOM }]}>
              <StreakContainer streak={streak} />
              <Pressable
                  style={styles.button}
                  onPress={() => navigation.reset({ index: 0, routes: [{ name: "Home" }] })}
                  accessibilityRole="button"
              >
                  <Text style={styles.buttonText}>Return Home</Text>
              </Pressable>
          </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF815E',
    alignItems: 'center',
  },
  title: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    fontSize: 30,
    paddingHorizontal: 24,
  },
  artArea: {
    flex: 1,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
  },
  art: {
    width: `${ART_WIDTH * 100}%`,
    aspectRatio: 430 / 437,
  },
  bottom: {
    alignItems: "center",
    gap: 18,
  },
  button: {
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 42,
    paddingVertical: 12,
  },
  buttonText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
});
