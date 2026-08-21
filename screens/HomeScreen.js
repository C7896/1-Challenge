import { SafeAreaView, View, Text, ImageBackground, Image, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";

import TabBar from "../components/tabBar";

import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const blob = require("../assets/blob.png");
const blueCloud = require("../assets/clouds/blue.png");
const redCloud = require("../assets/clouds/red.png");
const yellowCloud = require("../assets/clouds/yellow.png");
const travels = require("../assets/Travels.png");

export default function HomeScreen( {navigation} ) {

    const [streak, setStreak] = useState(0);
    const [personalImprovement, setPersonalImprovement] = useState(0);
    const [challengesCompleted, setChallengesCompleted] = useState(0);

    const isFocused = useIsFocused();

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

        if (auth.currentUser) {
            getStats();
        }
    }, [isFocused]);

    return (
        <View style={styles.root}>
            <SafeAreaView>
                <View style={styles.header}>
                    <Text style={styles.title}>1% Challenge</Text>
                </View>
            </SafeAreaView>

            <ImageBackground source={blob} style={styles.statsSection} resizeMode="cover">
                <ImageBackground source={redCloud} resizeMode="contain" style={[styles.cloud, styles.cloudLeft, { aspectRatio: 226 / 142 }]}>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.cloudNumber, styles.cloudTextRed]}>{streak}</Text>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.cloudLabelLarge, styles.cloudTextRed]}>day streak</Text>
                </ImageBackground>

                <ImageBackground source={yellowCloud} resizeMode="contain" style={[styles.cloud, styles.cloudRight, { aspectRatio: 197 / 133 }]}>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.cloudNumber, styles.cloudTextLight]}>{personalImprovement}x</Text>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.cloudLabel, styles.cloudTextLight]}>personal</Text>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.cloudLabel, styles.cloudTextLight]}>improvement</Text>
                </ImageBackground>

                <ImageBackground source={blueCloud} resizeMode="contain" style={[styles.cloud, styles.cloudLeft, { aspectRatio: 200 / 128 }]}>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.cloudNumber, styles.cloudTextLight]}>{challengesCompleted}</Text>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.cloudLabel, styles.cloudTextLight]}>{challengesCompleted === 1 ? "challenge" : "challenges"}</Text>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.cloudLabel, styles.cloudTextLight]}>completed</Text>
                </ImageBackground>

                <Image source={travels} style={styles.travels} resizeMode="contain" accessible={false} />
            </ImageBackground>

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
    statsSection: {
        flex: 1,
        width: "100%",
        paddingTop: 4,
        justifyContent: "space-evenly",
        // clears the floating tab bar, which sits 50 up and is 55 tall
        paddingBottom: 112,
    },
    travels: {
        // the artwork carries the bottom third of the screen now that the clouds
        // are smaller, so it gets real size
        position: "absolute",
        right: 0,
        bottom: 100,
        width: "62%",
        height: 235,
    },
    cloud: {
        // height comes from flex, width follows the artwork's own aspect ratio.
        // The clouds are near square, so forcing them into a wide box was cropping
        // the top and bottom off every one of them.
        flex: 1,
        // large enough that three of them nearly fill the blob, which is what
        // closes up the empty band that used to sit through the middle
        maxHeight: 148,
        minHeight: 88,
        justifyContent: "center",
        alignItems: "center",
    },
    cloudLeft: {
        alignSelf: "flex-start",
        marginLeft: 6,
    },
    cloudRight: {
        alignSelf: "flex-end",
        marginRight: 6,
    },
    cloudNumber: {
        fontSize: 30,
        fontWeight: "bold",
    },
    cloudLabelLarge: {
        fontSize: 21,
        fontWeight: "bold",
    },
    cloudLabel: {
        fontSize: 17,
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
