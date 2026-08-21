import { View, Text, Pressable, StyleSheet } from "react-native";

export default function TodayCard({ loading, challenge, completed, streak, navigation, style }) {
    if (loading) {
        return (
            <View style={[styles.container, style]}>
                <Text style={styles.body}>Loading today's challenge...</Text>
            </View>
        );
    }

    if (completed) {
        return (
            <View style={[styles.container, style]}>
                <Text style={styles.label}>Completed today</Text>
                <Text style={styles.body} numberOfLines={2}>{challenge.challenge}</Text>
                <Pressable style={styles.button} onPress={() => navigation.popTo("Log")}>
                    <Text style={styles.buttonText}>See your entry</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={[styles.container, style]}>
            <Text style={styles.label}>Today's challenge</Text>
            <Text style={styles.body} numberOfLines={2}>{challenge.challenge}</Text>
            <Pressable style={styles.button} onPress={() => navigation.navigate("Challenge1", { challenge, streak })}>
                <Text style={styles.buttonText}>Start</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 2,
        borderColor: "white",
        borderRadius: 15,
        // solid, not transparent: on Home this floats over the blob
        backgroundColor: "#FF815E",
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: "center",
        alignSelf: "stretch",
        marginHorizontal: 20,
    },
    label: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 4,
    },
    body: {
        color: "white",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 8,
    },
    button: {
        borderWidth: 2,
        borderColor: "white",
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
        paddingVertical: 6,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});
