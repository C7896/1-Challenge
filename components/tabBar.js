import { Animated, View, Pressable, Image, Alert, StyleSheet } from "react-native";
import { useEffect, useRef } from "react";
import { useNavigationState } from "@react-navigation/native";

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
    const navigationTimer = useRef(null);
    const activeRoute = useNavigationState((state) => state.routes[state.index]?.name);
    const activeIndex = activeRoute === "Profile"
        ? 3
        : activeRoute === "Log"
            ? 2
            : activeRoute?.startsWith("Challenge")
                ? 1
                : 0;
    const indicatorX = useRef(new Animated.Value(activeIndex * 60)).current;
    const barOpacity = useRef(new Animated.Value(1)).current;

    const animateIndicator = (index, onSelect) => {
        Animated.spring(indicatorX, {
            toValue: index * 60,
            damping: 18,
            stiffness: 190,
            mass: 0.8,
            useNativeDriver: true,
        }).start();

        if (onSelect) {
            clearTimeout(navigationTimer.current);
            navigationTimer.current = setTimeout(onSelect, 75);
        }
    };

    const animationFor = (index) => index < activeIndex ? "ios_from_left" : "ios_from_right";
    const openTab = (index, routeName) => {
        animateIndicator(index, () => nav.popTo(routeName, { tabAnimation: animationFor(index) }));
    };

    useEffect(() => {
        animateIndicator(activeIndex);
    }, [activeIndex, indicatorX]);

    useEffect(() => () => clearTimeout(navigationTimer.current), []);

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
                    [{ text: "OK", onPress: () => nav.popTo("Log", { tabAnimation: animationFor(2) }) }]
                );
            } else {
                Animated.timing(barOpacity, {
                    toValue: 0,
                    duration: 320,
                    useNativeDriver: true,
                }).start();
                nav.navigate("Challenge1", { challenge, streak, tabAnimation });
            }
        } catch (error) {
            Alert.alert("Could not load today's challenge", "Check your connection and try again.");
        } finally {
            opening.current = false;
        }
    };

    return (
        <Animated.View style={[styles.container, onLight && styles.containerLight, { opacity: barOpacity }]}>
            <Animated.View
                pointerEvents="none"
                style={[styles.activeIndicator, { transform: [{ translateX: indicatorX }] }]}
            />
            <Pressable style={styles.tabItem} onPress={() => openTab(0, "Home")} accessibilityRole="button" accessibilityLabel="Home">
                <Image source={set.home} style={styles.image} resizeMode="contain" />
            </Pressable>
            <Pressable style={styles.tabItem} onPress={() => { animateIndicator(1); openToday(animationFor(1)); }} accessibilityRole="button" accessibilityLabel="Today's challenge">
                <Image source={set.today} style={styles.image} resizeMode="contain" />
            </Pressable>
            <Pressable style={styles.tabItem} onPress={() => openTab(2, "Log")} accessibilityRole="button" accessibilityLabel="Past challenges">
                <Image source={set.log} style={styles.image} resizeMode="contain" />
            </Pressable>
            <Pressable style={styles.tabItem} onPress={() => openTab(3, "Profile")} accessibilityRole="button" accessibilityLabel="Profile">
                <Image source={set.profile} style={styles.image} resizeMode="contain" />
            </Pressable>
        </Animated.View>
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
    containerLight: {
        backgroundColor: "rgba(255, 255, 255, 0.38)",
        borderColor: "rgba(255, 255, 255, 0.72)",
    },
    activeIndicator: {
        position: "absolute",
        left: 22,
        top: 5,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(255, 255, 255, 0.62)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.88)",
        shadowColor: "#FFFFFF",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.42,
        shadowRadius: 8,
        elevation: 4,
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
