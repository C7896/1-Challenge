import { View, Pressable, Image, Alert, StyleSheet } from "react-native";
import { useRef } from "react";
import { StackActions } from "@react-navigation/native";

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

// Rendered once, above the navigator, so it never slides in and out with the
// page. That means it cannot use navigation hooks (there is no navigator context
// out there), so the current route arrives as a prop and navigation goes through
// the container ref.
export default function TabBar( {nav, activeRoute} ) {
    const set = icons.dark;
    const opening = useRef(false);
    const activeIndex = activeRoute === "Profile"
        ? 3
        : activeRoute === "Log"
            ? 2
            : activeRoute?.startsWith("Challenge")
                ? 1
                : 0;


    // tapping a tab cuts straight there rather than sliding
    const animationFor = () => "none";
    const go = (routeName, params) => {
        // popTo keeps the stack flat when the screen is already below us, and
        // falls back to navigate when it is not in the stack at all
        try {
            nav.dispatch(StackActions.popTo(routeName, params));
        } catch {
            nav.navigate(routeName, params);
        }
    };

    const openTab = (index, routeName) => {
        go(routeName, { tabAnimation: animationFor(index) });
    };

    // the tab has to fetch today's challenge before it can open it, so it repeats
    // what the Today card on Home does rather than routing through Home
    const openToday = async (tabAnimation) => {
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
                    [{ text: "OK", onPress: () => go("Log", { tabAnimation: animationFor(2) }) }]
                );
            } else {
                nav.navigate("Challenge1", { challenge, streak, tabAnimation });
            }
        } catch (error) {
            Alert.alert("Could not load today's challenge", "Check your connection and try again.");
        } finally {
            opening.current = false;
        }
    };

    return (
        <View style={styles.container}>
            <Pressable style={styles.tabItem} onPress={() => openTab(0, "Home")} accessibilityRole="button" accessibilityLabel="Home">
                <Image source={set.home} style={styles.image} resizeMode="contain" />
            </Pressable>
            <Pressable style={styles.tabItem} onPress={() => openToday(animationFor(1))} accessibilityRole="button" accessibilityLabel="Today's challenge">
                <Image source={set.today} style={styles.image} resizeMode="contain" />
            </Pressable>
            <Pressable style={styles.tabItem} onPress={() => openTab(2, "Log")} accessibilityRole="button" accessibilityLabel="Past challenges">
                <Image source={set.log} style={styles.image} resizeMode="contain" />
            </Pressable>
            <Pressable style={styles.tabItem} onPress={() => openTab(3, "Profile")} accessibilityRole="button" accessibilityLabel="Profile">
                <Image source={set.profile} style={styles.image} resizeMode="contain" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 268,
        height: 55,
        backgroundColor: "rgba(244, 250, 246, 0.30)",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.62)",
        borderRadius: 100,
        position: "absolute",
        alignSelf: "center",
        bottom: 40,
        shadowColor: "#315F40",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.16,
        shadowRadius: 22,
        elevation: 8,
    },
    tabItem: {
        width: 32,
        height: 44,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
    },
    image: {
        width: 32,
        height: 32,
    },
});
