import { SafeAreaView, View, Text, ImageBackground, Image, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";

import TabBar from "../components/tabBar";
import TodayCard from "../components/todayCard";

import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { loadToday } from "../lib/challenge";

const blob = require("../assets/blob.png");
const blueCloud = require("../assets/blue_cloud.png");
const redCloud = require("../assets/red_cloud.png");
const yellowCloud = require("../assets/yellow_cloud.png");
const travels = require("../assets/Travels.png");

export default function HomeScreen( {navigation} ) {

    const [streak, setStreak] = useState(0);
    const [personalImprovement, setPersonalImprovement] = useState(0);
    const [challengesCompleted, setChallengesCompleted] = useState(0);

    const [todayChallenge, setTodayChallenge] = useState(null);
    const [todayCompleted, setTodayCompleted] = useState(false);
    const [todayLoading, setTodayLoading] = useState(true);

    const isFocused = useIsFocused();

    // the card is parked directly under the header and the blob reserves exactly
    // the card's own height, both measured rather than guessed, so this holds on
    // any screen size and any safe area inset
    const [headerHeight, setHeaderHeight] = useState(0);
    const [cardHeight, setCardHeight] = useState(0);

    useEffect(() => {
        const getStats = async () => {
            const user = auth.currentUser;

            if (user) {
                try {
                    const userRef = doc(db, "users", user.uid);
                    const userDoc = await getDoc(userRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setStreak(userData.current_streak);
                        setPersonalImprovement(new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format((1.01 ** userData.total_completed_challenges)));
                        setChallengesCompleted(userData.total_completed_challenges);
                        console.log("Successfully read user document");
                    } else {
                        console.log("Error reading user document");
                    }
                } catch (error) {
                    // keep previously-loaded stats on screen rather than falling back to zeros
                    console.error("Error reading user stats: ", error);
                }
            }
        };

        const getTodayChallenge = async () => {
            const user = auth.currentUser;
            if (user) {
                setTodayLoading(true);
                const { challenge, completed } = await loadToday(db, user.uid);
                setTodayChallenge(challenge);
                setTodayCompleted(completed);
                setTodayLoading(false);
            }
        };

        if (auth.currentUser) {
            getStats();
            getTodayChallenge();
        }
    }, [isFocused]);

    return (
        <View style={styles.root}>
            <SafeAreaView onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}>
                <View style={styles.header}>
                    <Text style={styles.title}>1% Challenge</Text>
                </View>
            </SafeAreaView>

                <ImageBackground source={blob} style={[styles.statsSection, { paddingTop: cardHeight + 10 }]} resizeMode="cover">
                    <ImageBackground source={redCloud} resizeMode="contain" style={[styles.cloud, styles.cloudLeft, { aspectRatio: 191 / 200 }]}>
                        <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.cloudNumber, styles.cloudTextRed]}>{streak}</Text>
                        <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.cloudLabelLarge, styles.cloudTextRed]}>day streak</Text>
                    </ImageBackground>

                    <ImageBackground source={yellowCloud} resizeMode="contain" style={[styles.cloud, styles.cloudRight, { aspectRatio: 184 / 185 }]}>
                        <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.cloudNumber, styles.cloudTextLight]}>{personalImprovement}x</Text>
                        <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.cloudLabel, styles.cloudTextLight]}>personal</Text>
                        <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.cloudLabel, styles.cloudTextLight]}>improvement</Text>
                    </ImageBackground>

                    <ImageBackground source={blueCloud} resizeMode="contain" style={[styles.cloud, styles.cloudLeft, { aspectRatio: 172 / 179 }]}>
                        <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.cloudNumber, styles.cloudTextLight]}>{challengesCompleted}</Text>
                        <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.cloudLabel, styles.cloudTextLight]}>challenges</Text>
                        <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.cloudLabel, styles.cloudTextLight]}>completed</Text>
                    </ImageBackground>

                    <Image source={travels} style={styles.travels} resizeMode="contain" accessible={false} />
                </ImageBackground>

            {/* floats over the top of the blob so it costs no layout height and
                nothing below it is pushed off the screen */}
            <View
                style={[styles.todayOverlay, { top: headerHeight + 6 }]}
                onLayout={(e) => setCardHeight(e.nativeEvent.layout.height)}
                pointerEvents="box-none"
            >
                <TodayCard
                    loading={todayLoading}
                    challenge={todayChallenge}
                    completed={todayCompleted}
                    streak={streak}
                    navigation={navigation}
                />
            </View>

            <TabBar nav={navigation} />
        </View>
    );
}

const INK = "#2B2724";

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#FF815E",
    },
    header: {
        alignItems: "center",
        paddingTop: 4,
    },
    todayOverlay: {
        position: "absolute",
        left: 0,
        right: 0,
    },
    statsSection: {
        flex: 1,
        width: "100%",
        // paddingTop is set inline; it leaves the top of the blob clear for the card
        justifyContent: "space-evenly",
        // clears the floating tab bar, which sits 50 up and is 55 tall
        paddingBottom: 112,
    },
    travels: {
        // back to the original artwork size, parked bottom right where the blue
        // cloud does not reach
        position: "absolute",
        right: 2,
        bottom: 108,
        width: "50%",
        height: 170,
    },
    cloud: {
        // height comes from flex, width follows the artwork's own aspect ratio.
        // The clouds are near square, so forcing them into a wide box was cropping
        // the top and bottom off every one of them.
        flex: 1,
        maxHeight: 172,
        minHeight: 96,
        justifyContent: "center",
        alignItems: "center",
    },
    cloudLeft: {
        alignSelf: "flex-start",
        marginLeft: 12,
    },
    cloudRight: {
        alignSelf: "flex-end",
        marginRight: 12,
    },
    cloudNumber: {
        fontSize: 28,
        fontWeight: "bold",
    },
    cloudLabelLarge: {
        fontSize: 20,
        fontWeight: "bold",
    },
    cloudLabel: {
        fontSize: 16,
        fontWeight: "normal",
    },
    cloudTextRed: {
        color: "white",
    },
    cloudTextLight: {
        color: INK,
    },
    title: {
        color: "white",
        fontSize: 30,
        fontWeight: "bold",
    },
});
