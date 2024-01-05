import { StatusBar } from 'expo-status-bar';
import { Button, ImageBackground, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const backgroundChallengeOne = require('./assets/backgroundChallengeOne.png');

const HomeScreen = () => {
    return (
      <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}/>
      <ImageBackground source={backgroundChallengeOne} style={styles.backgroundimage}>
        <Text style={styles.timer}>
          10:29 left
        </Text>
        <Text>

        </Text>
        <Text style={styles.titleText}>
          New Challenge
        </Text>
        <Text>

        </Text>
      </ImageBackground>

      <View style={{flex: 0.6}}/>

      <View style={styles.bottomContainer}>
        <View style={styles.streak}>
          <Text style={styles.streakText}>10 🔥</Text>
        </View>
        <View style={{flex: 0.2}}/>
        <View style={styles.button}>
          <Pressable style={{alignItems: 'center'}} onPress={() => console.log('Pressed')}>
            <Text style={styles.unlockText}>
              Unlock
            </Text>
          </Pressable>
        </View>
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
  backgroundimage: {
    justifyContent: 'center',
    width: '100%',
    height: 402.94,
  },
  titleText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: "#FFF",
    textAlign: 'center',
  },
  timer: {
    fontSize: 30,
    fontWeight: 'bold',
    color: "#FFF",
    textAlign: 'center',
  },
  button: {
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
  streak: {
    backgroundColor: '#FFC0A2',
    width: 82,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  streakText: {
    fontSize: 20,
    fontWeight: 'Bold',
    color: "#FFF",
  },
  unlockText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff', 
  },

});
