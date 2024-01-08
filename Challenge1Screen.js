import { StatusBar } from 'expo-status-bar';
import { Button, ImageBackground, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const backgroundChallengeOne = require('../assets/backgroundChallengeOne.png');

const HomeScreen = ( {route} ) => {
  const { challenge } = route.params;

    return (
      <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}/>
      <ImageBackground source={backgroundChallengeOne} style={styles.image}>
        <Text style={[styles.text, styles.timerText]}>10:29 left</Text>
        <Text style={[styles.text, styles.title]}>New Challenge</Text>
      </ImageBackground>
      <View style={{ flex: 0.6 }}/>
      <View style={styles.bottomContainer}>
        <View style={styles.streakContainer}>
          <Text style={[styles.text, styles.streakText]}>10 🔥</Text>
        </View>
        <View style={{flex: 0.2}}/>
        <Pressable style={styles.buttonContainer} onPress={() => console.log('Pressed')}>
          <Text style={[styles.text, styles.unlockText]}>Unlock</Text>
        </Pressable>
      </View>
    </SafeAreaView>
    );
};

export default HomeScreen;

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
  buttonContainer: {
    borderWidth: 2,
    borderColor: "#FFF",
    borderRadius: 15,
    width: 182,
    height: 60, 
    justifyContent: 'center',
  },
  bottomContainer: {
    flex: 1,
    alignItems: 'center',
  },
  streakContainer: {
    backgroundColor: '#FFC0A2',
    width: 82,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
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
  streakText: {
    fontSize: 20,
  },
  unlockText: {
    fontSize: 30,
  },

});
