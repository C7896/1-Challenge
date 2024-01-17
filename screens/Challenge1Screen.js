import { ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import ChallengeButton from "../components/challengeButton";
import StreakContainer from "../components/streakContainer";

const backgroundChallengeOne = require('../assets/backgroundChallengeOne.png');

export default function Challenge1Screen( {route} ) {
  const { navigation } = route.params;
  const { challenge } = route.params;

    return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}/>
      <ImageBackground source={backgroundChallengeOne} style={styles.image}>
        <Text style={[styles.text, styles.timerText]}>10:29 left</Text>
        <Text style={[styles.text, styles.title]}>New Challenge</Text>
      </ImageBackground>
      <View style={{ flex: 2 }} />
      <View style={styles.bottomContainer}>
        <StreakContainer />
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
