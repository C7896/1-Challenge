import { SafeAreaView, ScrollView, View, Text, ImageBackground, Image, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";

import TabBar from "../components/tabBar";
import SignOutButton from "../components/signOutButton";
import DeleteAccountButton from "../components/deleteAccountButton";
import ExploreButton from "../components/exploreButton";
import TodayCard from "../components/todayCard";
import PolicyLinks from "../components/policyLinks";

import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { loadToday } from "../lib/challenge";
import { CAUSES_URL } from "../constants/links";

const blob = require("../assets/blob.png");
const blueCloud = require("../assets/blue_cloud.png");
const redCloud = require("../assets/red_cloud.png");
const yellowCloud = require("../assets/yellow_cloud.png");
const travels = require("../assets/Travels.png");
const globe = require("../assets/Globe.png");

export default function HomeScreen( {navigation} ) {

    const [streak, setStreak] = useState(0);
    const [personalImprovement, setPersonalImprovement] = useState(0);
    const [challengesCompleted, setChallengesCompleted] = useState(0);
    const [username, setUsername] = useState("");

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
                        setUsername(userData.username ?? "");
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
                    <ImageBackground source={redCloud} style={[styles.cloud, styles.cloudLeft]}>
                        <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.cloudNumber, styles.cloudTextRed]}>{streak}</Text>
                        <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.cloudLabelLarge, styles.cloudTextRed]}>day streak</Text>
                    </ImageBackground>

                    <ImageBackground source={yellowCloud} style={[styles.cloud, styles.cloudRight]}>
                        <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.cloudNumber, styles.cloudTextLight]}>{personalImprovement}x</Text>
                        <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.cloudLabel, styles.cloudTextLight]}>personal</Text>
                        <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.cloudLabel, styles.cloudTextLight]}>improvement</Text>
                    </ImageBackground>

                    <ImageBackground source={blueCloud} style={[styles.cloud, styles.cloudLeft]}>
                        <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.cloudNumber, styles.cloudTextLight]}>{challengesCompleted}</Text>
                        <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.cloudLabel, styles.cloudTextLight]}>challenges</Text>
                        <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.cloudLabel, styles.cloudTextLight]}>completed</Text>
                    </ImageBackground>

                    <Image source={travels} style={styles.travels} resizeMode="contain" accessible={false} />
                </ImageBackground>

                <View style={styles.greenSection}>
                    <View style={styles.greenRow}>
                        <Image source={globe} style={styles.globe} resizeMode="contain" accessible={false} />
                        <View style={styles.greenText}>
                            {challengesCompleted > 0 ? (
                                <>
                                    <Text style={styles.subtitle}>{username ? `We love you, ${username}!` : "We love you!"}</Text>
                                    <Text style={styles.text}>Thank you for making</Text>
                                    <Text style={styles.text}>the world a better place!</Text>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.subtitle}>{username ? `Welcome, ${username}.` : "Welcome."}</Text>
                                    <Text style={styles.text}>One small challenge a day.</Text>
                                </>
                            )}
                        </View>
                    </View>
                    <ExploreButton link={CAUSES_URL}/>
                    <PolicyLinks style={styles.policyLinks} onLight />
                    <DeleteAccountButton navigation={navigation} />
                </View>

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

            <SignOutButton navigation={navigation} />
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
        paddingBottom: 4,
    },
    travels: {
        position: "absolute",
        right: 10,
        bottom: 18,
        width: "34%",
        height: 72,
    },
    cloud: {
        // flex rather than a fixed height, so three clouds always divide whatever
        // space is left instead of overflowing on a short screen
        flex: 1,
        maxHeight: 96,
        minHeight: 58,
        width: "62%",
        justifyContent: "center",
        alignItems: "center",
    },
    cloudLeft: {
        alignSelf: "flex-start",
    },
    cloudRight: {
        alignSelf: "flex-end",
    },
    cloudNumber: {
        right: "18%",
        fontSize: 28,
        fontWeight: "bold",
    },
    cloudLabelLarge: {
        right: "18%",
        fontSize: 20,
        fontWeight: "bold",
    },
    cloudLabel: {
        right: "18%",
        fontSize: 16,
        fontWeight: "normal",
    },
    cloudTextRed: {
        color: "white",
    },
    cloudTextLight: {
        color: INK,
    },
    greenSection: {
        width: "100%",
        backgroundColor: "#A1D5AE",
        alignItems: "center",
        paddingTop: 10,
        // clears the floating tab bar, which sits 50 up and is 55 tall
        paddingBottom: 112,
        paddingHorizontal: 16,
        gap: 10,
    },
    greenRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    greenText: {
        flexShrink: 1,
    },
    globe: {
        width: 84,
        height: 84,
    },
    policyLinks: {
        justifyContent: "center",
    },
    title: {
        color: "white",
        fontSize: 30,
        fontWeight: "bold",
    },
    subtitle: {
        color: INK,
        fontSize: 22,
        fontWeight: "bold",
    },
    text: {
        color: INK,
        fontSize: 16,
        fontWeight: "normal",
    },
});
