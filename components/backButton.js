import { SafeAreaView, Pressable, Text, StyleSheet } from "react-native";

const INK = "#2B2724";

export default function BackButton({ navigation, onLight }) {
    return (
        <SafeAreaView style={styles.safeArea} pointerEvents="box-none">
            <Pressable
                style={[styles.button, onLight && styles.buttonLight]}
                onPress={() => navigation.goBack()}
                accessibilityRole="button"
                accessibilityLabel="Back"
                hitSlop={8}
            >
                <Text style={[styles.chevron, onLight && styles.chevronLight]}>‹</Text>
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 10,
    },
    button: {
        // in normal flow, not absolute: the SafeAreaView's inset is padding, and
        // padding does not move absolutely positioned children, which is how this
        // button ended up on top of the status bar clock
        marginTop: 8,
        marginLeft: 16,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(255,255,255,0.35)",
        justifyContent: "center",
        alignItems: "center",
    },
    buttonLight: {
        backgroundColor: "rgba(43,39,36,0.08)",
    },
    chevron: {
        fontSize: 30,
        fontWeight: "600",
        lineHeight: 34,
        color: "white",
        paddingBottom: 2,
        paddingRight: 2,
    },
    chevronLight: {
        color: INK,
    },
});
