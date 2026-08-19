import {View, Text, TouchableOpacity, StyleSheet} from "react-native";

const INK = "#2B2724";

// Rows rotate through screens/LogScreen.js's `colors` array. The light ones need
// ink text; coral and deep blue are dark enough to keep white.
const LIGHT_ROW_COLORS = new Set(["#FFCF5B", "#DCE18B", "#A1D5AE", "#92C1D2"]);

const getChallengeTextColor = (color) => (LIGHT_ROW_COLORS.has(color) ? INK : "white");

export default function Journal({ journal, color, size, onPress }) {

  const handlePress = () => {
    onPress(journal);
  }

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={[styles.container, {backgroundColor: color}]}>
        <View style={styles.dateContainer}>
          <Text style={styles.month} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>{journal.month}</Text>
          <Text style={styles.day}>{journal.day}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.text, {fontSize: size, color: getChallengeTextColor(color)}]}>{journal.challenge}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 84,
    width: "100%",
    flexDirection: "row",
    paddingLeft: 12,
    paddingVertical: 8,
    justifyContent: 'flex-start',
    alignItems: 'center',
    columnGap: 15,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 129, 94, 1)',
  },
  month: {
    color: 'rgba(107, 107, 107, 1)',
    fontSize: 14,
    fontWeight: "bold",
  },
  day: {
    color: "black",
    fontSize: 30,
    fontWeight: "bold",
  },
  dateContainer: {
    width: 69,
    height: 69,
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  text: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});