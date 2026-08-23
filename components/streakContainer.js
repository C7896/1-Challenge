import { View, Text, StyleSheet } from "react-native";

const INK = "#2B2724";

export default function StreakContainer({ streak, centered = false }) {
    return(
        <View style={[styles.streakContainer, centered && styles.centeredContainer]}>
          <Text style={[styles.text, centered && styles.textOnDark]}>{streak} 🔥</Text>
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
  centeredContainer: {
    alignSelf: "center",
    marginTop: 20,
  },
  text: {
    fontWeight: "bold",
    color: INK,
    textAlign: "center",
    fontSize: 20,
  },
  textOnDark: {
    color: "white",
  },
});
