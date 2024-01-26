import { View, Text, StyleSheet } from "react-native";

export default function StreakContainer({ streak }) {
    return(
        <View style={styles.streakContainer}>
          <Text style={[styles.text, styles.streakText]}>{streak} 🔥</Text>
        </View>
    );
}

const styles = StyleSheet.create({
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
    fontSize: 20,
  },
});