import { ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from "react";

import ChallengeButton from "../components/challengeButton";
import StreakContainer from "../components/streakContainer";
import FlipClock from "../components/flipClock";
import BackButton from "../components/backButton";

const backgroundChallengeOne = require('../assets/backgroundChallengeOne.png');

export default function Challenge1Screen({ navigation, route }) {
  const { challenge, streak = 0 } = route.params ?? {};

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  let first = true;

  const getTimeRemaining = () => {
    // counts down to midnight, when the next challenge appears
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const total = Math.max(0, Math.floor((midnight - now) / 1000));
    setHours(Math.floor(total / 3600));
    setMinutes(Math.floor((total % 3600) / 60));
    setSeconds(total % 60);
  };

  useEffect(() => {
    if (first) {
      getTimeRemaining();
    }
    const interval = setInterval(() => getTimeRemaining(), 1000);

    return () => clearInterval(interval);
  }, []);

  if (!challenge) {
    return null;
  }

  return (
  <SafeAreaView style={styles.container}>
    <BackButton navigation={navigation} />
    <View style={{flex: 1}}/>
    <ImageBackground source={backgroundChallengeOne} style={styles.image}>
      <Text style={[styles.text, styles.title]}>New Challenge</Text>
      <FlipClock hours={hours} minutes={minutes} seconds={seconds} />
      <StreakContainer streak={streak} centered />
    </ImageBackground>
    <View style={{ flex: 2 }} />
    <View style={styles.bottomContainer}>
      <ChallengeButton title="Let's Go!" nav={navigation} destination="Challenge2" challenge={challenge} />
    </View>
    <View style={{flex: 0.5}} />
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF815E',
    alignItems: 'center',
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 402.94,
    gap: 14,
  },
  bottomContainer: {
    // sized to its content: flex plus a large bottom margin squeezed the box
    // shorter than the button and clipped the label
    alignItems: 'center',
    justifyContent: "center",
    // the tab bar is on this screen now, so the button clears it
    marginBottom: 110,
  },
  text: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  title: {
    fontSize: 35,
    paddingBottom: 12,
  },
  timerText: {
    fontSize: 30,
    paddingBottom: 12,
  },
  unlockText: {
    fontSize: 30,
  },

});
