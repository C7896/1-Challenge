import { View, Text, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

const CORAL = "#E97555";

function FlameIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" accessible={false}>
      <Path
        d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5Z"
        stroke={CORAL}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function StreakContainer({ streak = 0, centered = false }) {
    const label = `${streak} day streak`;

    return (
        <View
          style={[styles.streakContainer, centered && styles.centeredContainer]}
          accessible
          accessibilityRole="text"
          accessibilityLabel={label}
        >
          <FlameIcon />
          <Text style={styles.text} numberOfLines={1}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
  streakContainer: {
    height: 38,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255, 255, 255, 0.34)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.88)",
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderRadius: 19,
  },
  centeredContainer: {
    alignSelf: "center",
    marginTop: 8,
  },
  text: {
    fontWeight: "400",
    color: CORAL,
    textAlign: "center",
    fontSize: 15,
    letterSpacing: -0.2,
  },
});
