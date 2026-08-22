import { View, Pressable, Image, Alert, StyleSheet } from "react-native";
import { useRef } from "react";

import { auth, db } from "../firebase";
import { loadToday } from "../lib/challenge";

// Two full sets rather than one set plus tintColor. tintColor applied to some of
// these glyphs and silently did nothing to others, which left them white and
// invisible on a light screen, so the colour is baked into the asset instead.
const icons = {
    dark: {
        home: require("../assets/tab/home-light.png"),
        today: require("../assets/tab/today-light.png"),
        log: require("../assets/tab/book-light.png"),
        profile: require("../assets/tab/user-light.png"),
    },
    light: {
        home: require("../assets/tab/home-ink.png"),
        today: require("../assets/tab/today-ink.png"),
        log: require("../assets/tab/book-ink.png"),
        profile: require("../assets/tab/user-ink.png"),
    },
};

export default function TabBar( {nav, onLight} ) {
    const set = onLight ? icons.light : icons.dark;
    const opening = useRef(false);

    // the tab has to fetch today's challenge before it can open it, so it repeats
    // what the Today card on Home does rather than routing through Home
    const openToday = async () => {
        if (opening.current) {
            return;
        }
        const user = auth.currentUser;
        if (user == null) {
            return;
        }
        opening.current = true;
        try {
            const { challenge, completed, streak } = await loadToday(db, user.uid);
            if (completed === null) {
                Alert.alert("Could not check today", "We could not tell whether you have finished today's challenge. Check your connection and try again.");
                return;
            }
            if (completed) {
                // Say so before moving. Landing on Past Challenges with no
                // explanation looked like the tab had sent you to the wrong place.
                Alert.alert(
                    "Today's challenge is complete",
                    "Nice work. Here are your past challenges.",
                    [{ text: "OK", onPress: () => nav.popTo("Log") }]
                );
            } else {
                nav.navigate("Challenge1", { challenge, streak });
            }
        } catch (error) {
            Alert.alert("Could not load today's challenge", "Check your connection and try again.");
        } finally {
            opening.current = false;
        }
    };

    return (
        <View style={[styles.container, onLight && styles.containerLight]}>
            <Pressable onPress={() => {nav.popTo("Home")}} accessibilityRole="button" accessibilityLabel="Home">
                <Image source={set.home} style={styles.image} resizeMode="contain" />
            </Pressable>
            <Pressable onPress={openToday} accessibilityRole="button" accessibilityLabel="Today's challenge">
                <Image source={set.today} style={styles.image} resizeMode="contain" />
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
        width: 268,
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
