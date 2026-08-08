import { ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from "react";

import ChallengeButton from "../components/challengeButton";
import StreakContainer from "../components/streakContainer";

const backgroundChallengeOne = require('../assets/backgroundChallengeOne.png');

export default function Challenge1Screen({ navigation, route }) {
  const { challenge } = route.params;
  const { streak } = route.params;

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  let first = true;

  const getTimeRemaining = () => {
    const now = new Date();
  
    // Calculate hours and minutes
    const hours = now.getMinutes() !== 0 ? 23 - now.getHours() : 24 - now.getHours();
    let minutes = now.getMinutes() !== 0 ? 60 - now.getMinutes() : 0;
    
    // Format minutes to always be two digits
    minutes = minutes < 10 ? `0${minutes}` : minutes;
  
    // Update state
    setHours(hours);
    setMinutes(minutes);
  };
  

  useEffect(() => {
    if (first) {
      getTimeRemaining();
    }
    const interval = setInterval(() => getTimeRemaining(), 1000);

    return () => clearInterval(interval);
  }, []);

  return (
  <SafeAreaView style={styles.container}>
    <View style={{flex: 1}}/>
    <ImageBackground source={backgroundChallengeOne} style={styles.image}>
      <Text style={[styles.text, styles.timerText]}>{hours}:{minutes} left</Text>
      <Text style={[styles.text, styles.title]}>New Challenge</Text>
    </ImageBackground>
    <View style={{ flex: 2 }} />
    <View style={styles.bottomContainer}>
      <StreakContainer streak={streak} />
      <ChallengeButton title="Next" nav={navigation} destination="Challenge2" challenge={challenge} />
    </View>
    <View style={{flex: 0.5}} />
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF815E',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  image: {
    justifyContent: 'center',
    width: '100%',
    height: 402.94,
  },
  bottomContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center",
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
