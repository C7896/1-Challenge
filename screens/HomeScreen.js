import { SafeAreaView, View, Text, Image, StyleSheet, useWindowDimensions } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useIsFocused } from "@react-navigation/native";

import TabBar from "../components/tabBar";
import StatCloud from "../components/statCloud";
import ExploreButton from "../components/exploreButton";

import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { CAUSES_URL } from "../constants/links";

const background = require("../assets/homeBackground.png");
const greenBlob = require("../assets/greenBlob.png");
const blueCloud = require("../assets/clouds/blue.png");
const redCloud = require("../assets/clouds/red.png");
const yellowCloud = require("../assets/clouds/yellow.png");
const travels = require("../assets/Travels.png");
const globe = require("../assets/Globe.png");

// Every number below is read straight off the Figma design, whose frame is
// 430 x 933. The whole screen is scaled by one factor so the composition keeps
// its proportions on any device instead of drifting piece by piece.
const DW = 430;
const DH = 933;

export default function HomeScreen({ navigation }) {

    const [streak, setStreak] = useState(0);
    const [personalImprovement, setPersonalImprovement] = useState(0);
    const [challengesCompleted, setChallengesCompleted] = useState(0);

    const isFocused = useIsFocused();

    const { width, height } = useWindowDimensions();
    const s = Math.min(width / DW, height / DH);
    // the design is anchored to the top and centred horizontally, so a narrower
    // or shorter screen shrinks the whole composition rather than clipping it
    const originX = (width - DW * s) / 2;

    // Dev-only edge check. onLayout is useless on ImageBackground: it keeps only
    // style, imageStyle, imageRef, importantForAccessibility and children for its
    // outer View and spreads everything else onto the inner Image, whose native
    // view never emits layout. imageRef is the supported way in, and because the
    // inner image fills the container its window frame is the cloud's frame.
    const redRef = useRef(null);
    const yellowRef = useRef(null);
    const blueRef = useRef(null);

    useEffect(() => {
        if (!__DEV__) {
            return;
        }
        let cancelled = false;
        const BLEED = 4;
        const clouds = [["red", redRef], ["yellow", yellowRef], ["blue", blueRef]];
        const handle = requestAnimationFrame(() => {
            clouds.forEach(([name, ref]) => {
                const node = ref.current;
                if (cancelled || node == null || typeof node.measureInWindow !== "function") {
                    return;
                }
                node.measureInWindow((x, y, w) => {
                    if (cancelled || w == null) {
                        return;
                    }
                    const past = Math.max(-x, x + w - width);
                    if (past > BLEED) {
                        console.warn(`[edge] ${name} cloud is cut off: ${past.toFixed(1)}pt past the screen edge (allowed ${BLEED})`);
                    }
                });
            });
        });
        return () => {
            cancelled = true;
            cancelAnimationFrame(handle);
        };
    });

    useEffect(() => {
        const getStats = async () => {
            const user = auth.currentUser;
            if (!user) {
                return;
            }
            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setStreak(userData.current_streak ?? 0);
                    setPersonalImprovement(new Intl.NumberFormat('en-US', { notation: 'compact', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format((1.01 ** (userData.total_completed_challenges ?? 0))));
                    setChallengesCompleted(userData.total_completed_challenges ?? 0);
                    console.log("Successfully read user document");
                } else {
                    console.log("Error reading user document");
                }
            } catch (error) {
                // keep previously-loaded stats on screen rather than falling back to zeros
                console.error("Error reading user stats: ", error);
            }
        };

        if (auth.currentUser) {
            getStats();
        }
    }, [isFocused]);

    // design point -> screen point
    const x = (v) => originX + v * s;
    const p = (v) => v * s;

    return (
        <View style={styles.root}>
            {/* the coral, peach and green bands with the design's own curved
                boundaries, drawn as one image so the two curves cannot drift
                apart from each other on a different screen size */}
            <Image
                source={background}
                resizeMode="stretch"
                accessible={false}
                style={{ position: "absolute", left: 0, top: 0, width, height }}
            />

            <SafeAreaView>
                <Text style={[styles.title, { fontSize: p(34), marginTop: p(6) }]}>1% Challenge</Text>
            </SafeAreaView>

            <StatCloud
                source={redCloud}
                aspectRatio={195 / 118}
                imageRef={redRef}
                scale={s}
                value={`${streak}`}
                caption="day streak"
                style={{ position: "absolute", left: x(10), top: p(235), width: p(195) }}
            />

            <Image
                source={travels}
                resizeMode="contain"
                accessible={false}
                style={{ position: "absolute", left: x(228), top: p(222), width: p(192), height: p(168) }}
            />

            <StatCloud
                source={yellowCloud}
                aspectRatio={182 / 112}
                imageRef={yellowRef}
                scale={s}
                captionFirst
                value={`${personalImprovement}x`}
                caption={"Personal\nImprovement"}
                style={{ position: "absolute", left: x(68), top: p(392), width: p(182) }}
            />

            <StatCloud
                source={blueCloud}
                aspectRatio={180 / 116}
                imageRef={blueRef}
                scale={s}
                captionFirst
                value={`${challengesCompleted}`}
                caption={"Challenges\nCompleted"}
                style={{ position: "absolute", left: x(245), top: p(452), width: p(180) }}
            />

            <Image
                source={greenBlob}
                resizeMode="contain"
                accessible={false}
                style={{ position: "absolute", left: x(14), top: p(624), width: p(186), height: p(186) }}
            />
            <Image
                source={globe}
                resizeMode="contain"
                accessible={false}
                style={{ position: "absolute", left: x(52), top: p(648), width: p(124), height: p(150) }}
            />

            <View style={{ position: "absolute", left: x(212), top: p(652), width: p(206) }}>
                <Text style={[styles.greeting, { fontSize: p(23) }]}>
                    {challengesCompleted > 0 ? "We love you!" : "Welcome!"}
                </Text>
                <Text style={[styles.body, { fontSize: p(16), marginTop: p(6) }]}>
                    {challengesCompleted > 0
                        ? "Thank you for making\nthe world a better place!"
                        : "One small challenge a day\nmakes a better world."}
                </Text>
            </View>

            <View style={{ position: "absolute", left: x(212), top: p(758) }}>
                <ExploreButton link={CAUSES_URL} label="Explore more" onDark />
            </View>

            <TabBar nav={navigation} onLight />
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#FF815E",
    },
    green: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#A1D5AE",
    },
    title: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    greeting: {
        color: "white",
        fontWeight: "bold",
    },
    body: {
        color: "white",
    },
});
