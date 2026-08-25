import { View, StyleSheet } from "react-native";

export default function IntroDots({ active, color, style }) {
    return (
        <View style={[styles.row, style]}>
            {[0, 1, 2].map((index) => (
                <View
                    key={index}
                    style={[
                        styles.dot,
                        { backgroundColor: color, opacity: index === active ? 1 : 0.3 },
                    ]}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});
