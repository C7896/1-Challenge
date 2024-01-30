import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import LargeImage from '../components/largeImage';
import ClearButton from "../components/clearButton";
import StreakContainer from "../components/streakContainer";

const earth = require('../assets/mother_nature.png');

export default function Challenge4Screen({ navigation, route }) {
  const { streak } = route.params;

  return (
      <SafeAreaView style={styles.container}>
          <View style={{flex: 3.2}} />
          <View style={styles.container}>
              <Text style={[styles.text, styles.title, {paddingBottom: 75}]}>Challenge Complete</Text>
              <LargeImage src={earth} />
          </View>
          <View style={{flex: 3}} />
          <View style={styles.bottomContainer}>
              <StreakContainer streak={streak} />
              <ClearButton title="Go Home" nav={navigation} destination="Home" top={10} />
          </View>
          <View style={{flex: 0.5}} />
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 3,
    backgroundColor: '#FF815E',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  },
  streakText: {
    fontSize: 20,
  },
});