import { View, Pressable, Image, StyleSheet } from "react-native";

// Two sets rather than one set plus tintColor. tintColor silently failed to apply
// to the original home and book glyphs, which left them white and invisible on a
// light screen, so the colour is baked into the asset instead.
const icons = {
    dark: {
        home: require("../assets/tab/home-light.png"),
        log: require("../assets/tab/book-light.png"),
        profile: require("../assets/tab/user-light.png"),
    },
    light: {
        home: require("../assets/tab/home-ink.png"),
        log: require("../assets/tab/book-ink.png"),
        profile: require("../assets/tab/user-ink.png"),
    },
};

export default function TabBar( {nav, onLight} ) {
    const set = onLight ? icons.light : icons.dark;

    return (
        <View style={[styles.container, onLight && styles.containerLight]}>
            <Pressable onPress={() => {nav.popTo("Home")}} accessibilityRole="button" accessibilityLabel="Home">
                <Image source={set.home} style={styles.image} resizeMode="contain" />
            </Pressable>
            <Pressable onPress={() => {nav.popTo("Log")}} accessibilityRole="button" accessibilityLabel="Past challenges">
                <Image source={set.log} style={styles.image} resizeMode="contain" />
            </Pressable>
            <Pressable onPress={() => {nav.popTo("Profile")}} accessibilityRole="button" accessibilityLabel="Profile">
                <Image source={set.profile} style={styles.image} resizeMode="contain" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 210,
        height: 55,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        borderRadius: 100,
        position: "absolute",
        alignSelf: "center",
        bottom: 50,
    },
    containerLight: {
        backgroundColor: "rgba(255, 255, 255, 0.92)",
    },
    image: {
        width: 32,
        height: 32,
    },
});
