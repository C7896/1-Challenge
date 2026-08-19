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

    const [todayChallenge, setTodayChallenge] = useState(null);
    const [todayCompleted, setTodayCompleted] = useState(false);
    const [todayLoading, setTodayLoading] = useState(true);

    const isFocused = useIsFocused();

    useEffect(() => {
        const getStats = async () => {
            const user = auth.currentUser;

            if (user) {
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
            <SafeAreaView style={styles.safe}>
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>1% Challenge</Text>
                        <DeleteAccountButton navigation={navigation} />
                    </View>

                    <TodayCard
                        loading={todayLoading}
                        challenge={todayChallenge}
                        completed={todayCompleted}
                        streak={streak}
                        navigation={navigation}
                    />

                    <ImageBackground source={blob} style={styles.statsSection} resizeMode="cover">
                        <Image source={travels} style={styles.travels} resizeMode="contain" accessible={false} />

                        <ImageBackground source={redCloud} style={[styles.cloud, styles.cloudLeft]}>
                            <Text style={[styles.cloudNumber, styles.cloudTextRed]}>{streak}</Text>
                            <Text style={[styles.cloudLabelLarge, styles.cloudTextRed]}>day streak</Text>
                        </ImageBackground>

                        <ImageBackground source={yellowCloud} style={[styles.cloud, styles.cloudRight]}>
                            <Text style={[styles.cloudNumber, styles.cloudTextLight]}>{personalImprovement}x</Text>
                            <Text style={[styles.cloudLabel, styles.cloudTextLight]}>personal</Text>
                            <Text style={[styles.cloudLabel, styles.cloudTextLight]}>improvement</Text>
                        </ImageBackground>

                        <ImageBackground source={blueCloud} style={[styles.cloud, styles.cloudLeft]}>
                            <Text style={[styles.cloudNumber, styles.cloudTextLight]}>{challengesCompleted}</Text>
                            <Text style={[styles.cloudLabel, styles.cloudTextLight]}>challenges</Text>
                            <Text style={[styles.cloudLabel, styles.cloudTextLight]}>completed</Text>
                        </ImageBackground>
                    </ImageBackground>

                    <View style={styles.greenSection}>
                        <View style={styles.greenRow}>
                            <Image source={globe} style={styles.globe} resizeMode="contain" accessible={false} />
                            <View style={styles.greenText}>
                                {challengesCompleted > 0 ? (
                                    <>
                                        <Text style={styles.subtitle}>We love you!</Text>
                                        <Text style={styles.text}>Thank you for making</Text>
                                        <Text style={styles.text}>the world a better place!</Text>
                                    </>
                                ) : (
                                    <>
                                        <Text style={styles.subtitle}>Welcome.</Text>
                                        <Text style={styles.text}>One small challenge a day.</Text>
                                    </>
                                )}
                            </View>
                        </View>
                        <ExploreButton link={CAUSES_URL}/>
                        <PolicyLinks style={styles.policyLinks} onLight />
                    </View>
                </ScrollView>
            </SafeAreaView>

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
    safe: {
        flex: 1,
    },
    scroll: {
        flex: 1,
        // the scroll area stops above the floating tab bar, so content can never
        // sit underneath it at any scroll position or on any screen height
        marginBottom: 105,
    },
    scrollContent: {
        paddingBottom: 16,
    },
    header: {
        alignItems: "center",
        paddingTop: 8,
        paddingBottom: 4,
    },
    statsSection: {
        width: "100%",
        marginTop: 12,
        alignItems: "center",
        paddingVertical: 16,
        gap: 4,
    },
    travels: {
        width: "48%",
        height: 96,
        alignSelf: "flex-end",
        marginRight: 8,
    },
    cloud: {
        width: "66%",
        height: 120,
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
        fontSize: 35,
        fontWeight: "bold",
    },
    cloudLabelLarge: {
        right: "18%",
        fontSize: 25,
        fontWeight: "bold",
    },
    cloudLabel: {
        right: "18%",
        fontSize: 20,
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
        paddingVertical: 24,
        paddingHorizontal: 16,
        gap: 16,
        marginTop: 16,
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
        width: 130,
        height: 130,
    },
    policyLinks: {
        justifyContent: "center",
    },
    title: {
        color: "white",
        fontSize: 35,
        fontWeight: "bold",
    },
    subtitle: {
        color: INK,
        fontSize: 30,
        fontWeight: "bold",
    },
    text: {
        color: INK,
        fontSize: 20,
        fontWeight: "normal",
    },
});
