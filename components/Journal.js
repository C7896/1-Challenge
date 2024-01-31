import {View, Text, TouchableOpacity, StyleSheet} from "react-native";

export default function Journal({ journal, color, size, onPress }) {

  const handlePress = () => {
    onPress(journal);
  }

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={[styles.container, {backgroundColor: color}]}>
        <View style={styles.dateContainer}>
          <Text style={styles.month}>{journal.month}</Text>
          <Text style={styles.day}>{journal.day}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.text, {fontSize: size}]}>{journal.challenge}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 84,
    width: 381,
    flexDirection: "row",
    paddingLeft: 12,
    paddingVertical: 8,
    justifyContent: 'left',
    alignItems: 'center',
    columnGap: 15,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 129, 94, 1)',
  },
  month: {
    color: 'rgba(173, 173, 173, 1)',
    fontSize: 20,
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
    paddingHorizontal: 16,
    paddingVertical: 4,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  textContainer: {
    width: 280,
    paddingRight: 10,
  },
  text: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});