import { View, Pressable, Image, Alert, StyleSheet } from "react-native";
import { useRef } from "react";
import { StackActions } from "@react-navigation/native";

import { auth, db } from "../firebase";
import { useVerticalScale } from "../lib/verticalScale";
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
    const set = icons.light;
    // Home lays itself out from a scaled design frame, so on a short phone its
    // content rises to meet a bar pinned at a fixed number of points. The bar
    // scales with it instead. Phones at the reference height are unaffected.
    const s = useVerticalScale();
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
            // Home, launch and sign in all answer this for today already, so the
            // usual case returns without a round trip
            const { challenge, completed, streak } = await loadToday(db, user.uid, { preferCache: true });
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
        <View style={[styles.container, {
            width: 268 * s,
            height: 55 * s,
            bottom: 40 * s,
            borderRadius: 100 * s,
        }]}>
            <Pressable style={[styles.tabItem, { width: 32 * s, height: 44 * s }]} onPress={() => openTab(0, "Home")} accessibilityRole="button" accessibilityLabel="Home" accessibilityState={{ selected: activeIndex === 0 }}>
                <View style={[styles.slot, { width: 44 * s, height: 40 * s, borderRadius: 20 * s }, activeIndex === 0 && styles.slotActive]}>
                    <Image source={set.home} style={[styles.image, { width: 32 * s, height: 32 * s }]} resizeMode="contain" />
                </View>
            </Pressable>
            <Pressable style={[styles.tabItem, { width: 32 * s, height: 44 * s }]} onPress={() => openToday(animationFor(1))} accessibilityRole="button" accessibilityLabel="Today's challenge" accessibilityState={{ selected: activeIndex === 1 }}>
                <View style={[styles.slot, { width: 44 * s, height: 40 * s, borderRadius: 20 * s }, activeIndex === 1 && styles.slotActive]}>
                    <Image source={set.today} style={[styles.image, { width: 32 * s, height: 32 * s }]} resizeMode="contain" />
                </View>
            </Pressable>
            <Pressable style={[styles.tabItem, { width: 32 * s, height: 44 * s }]} onPress={() => openTab(2, "Log")} accessibilityRole="button" accessibilityLabel="Past challenges" accessibilityState={{ selected: activeIndex === 2 }}>
                <View style={[styles.slot, { width: 44 * s, height: 40 * s, borderRadius: 20 * s }, activeIndex === 2 && styles.slotActive]}>
                    <Image source={set.log} style={[styles.image, { width: 32 * s, height: 32 * s }]} resizeMode="contain" />
                </View>
            </Pressable>
            <Pressable style={[styles.tabItem, { width: 32 * s, height: 44 * s }]} onPress={() => openTab(3, "Profile")} accessibilityRole="button" accessibilityLabel="Profile" accessibilityState={{ selected: activeIndex === 3 }}>
                <View style={[styles.slot, { width: 44 * s, height: 40 * s, borderRadius: 20 * s }, activeIndex === 3 && styles.slotActive]}>
                    <Image source={set.profile} style={[styles.image, { width: 32 * s, height: 32 * s }]} resizeMode="contain" />
                </View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 268,
        height: 55,
        // Frosted white, the same treatment as the flip clock cards: translucent
        // white with a brighter rim and a soft shadow so the pill still reads as
        // an object. The glyphs are ink, because white on a white pill measures
        // about 1.4 to 1, which is what made them vanish before. Ink measures
        // 10.3 at worst here.
        backgroundColor: "rgba(255, 255, 255, 0.62)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.9)",
        shadowColor: "#2B2724",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.16,
        shadowRadius: 6,
        elevation: 4,
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
    slot: {
        width: 44,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    slotActive: {
        // marks the tab you are on. A soft ink chip now that the pill is light,
        // still static rather than a moving pill.
        backgroundColor: "rgba(43, 39, 36, 0.12)",
    },
    image: {
        width: 32,
        height: 32,
    },
});
