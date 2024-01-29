import { SafeAreaView, View, Text, ImageBackground, Image, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";

import TabBar from "../components/tabBar";
import SignOutButton from "../components/signOutButton";
import ExploreButton from "../components/exploreButton";

import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebase-config";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const blob = require("../assets/blob.png");
const blueCloud = require("../assets/blue_cloud.png");
const redCloud = require("../assets/red_cloud.png");
const yellowCloud = require("../assets/yellow_cloud.png");
const travels = require("../assets/Travels.png");
const globe = require("../assets/Globe.png");

export default function HomeScreen( {navigation} ) {

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    const [streak, setStreak] = useState(0);
    const [personalImprovement, setPersonalImprovement] = useState(0);
    const [challengesCompleted, setChallengesCompleted] = useState(0);

    useEffect(() => {
        const getStats = async ()  => {
            const user = auth.currentUser;
            const userRef = doc(db, "users", userCredential.user.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                setStreak(userData.current_streak);
                setPersonalImprovement( new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format((1.01 ** userData.total_completed_challenges)) );
                setChallengesCompleted(userData.total_completed_challenges);
                console.log("Successfully read user document");
            } else {
                console.log("Error reading user document");
            }
        }

        return () => getStats();
    }, [auth]);

    return (
        <View style={styles.orangeContainer} >
            <SafeAreaView style={styles.orangeContainer} >
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>1% Challenge</Text>
                </View>
            </SafeAreaView>
            <SafeAreaView style={styles.greenContainer} >
                <Image source={globe} style={styles.globe} />
                <View style={{ marginRight: 25 }}>
                    <Text style={styles.subtitle}>We love you!</Text>
                    <Text style={styles.text}>Thank you for making</Text>
                    <Text style={styles.text}>the world a better place!</Text>
                </View>
            </SafeAreaView>
            <ImageBackground source={blob} style={styles.image}>
                    <ImageBackground source={redCloud} style={[styles.cloud, styles.red]}>
                        <Text style={[styles.title, {right: "18%"}]}>{streak}</Text>
                        <Text style={[styles.subsubtitle, {right: "18%"}]}>day streak</Text>
                    </ImageBackground>
                    <ImageBackground source={yellowCloud} style={[styles.cloud, styles.yellow]}>
                        <Text style={[styles.title, {right: "18%"}]}>{personalImprovement}x</Text>
                        <Text style={[styles.text, {right: "18%"}]}>personal</Text>
                        <Text style={[styles.text, {right: "18%"}]}>improvement</Text>
                    </ImageBackground>
                    <ImageBackground source={blueCloud} style={[styles.cloud, styles.blue]}>
                    <Text style={[styles.title, {right: "18%"}]}>{challengesCompleted}</Text>
                        <Text style={[styles.text, {right: "18%"}]}>challenges</Text>
                        <Text style={[styles.text, {right: "18%"}]}>completed</Text>
                    </ImageBackground>
                    <Image source={travels} style={styles.travels} />
            </ImageBackground>
            <ExploreButton link={"https://compassionate-service-496680.framer.app/"}/>
            <SignOutButton navigation={navigation} />
            <TabBar nav={navigation} />
        </View>
    );
}

const styles = StyleSheet.create({
    orangeContainer: {
        flex: 1,
        backgroundColor: "#FF815E",
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        position: "absolute",
        bottom: "15%",
        width: "100%",
        height: "75%",
        justifyContent: "space-around",
        alignItems: "center",
    },
    greenContainer: {
        flex: 1,
        width: "100%",
        backgroundColor: "#A1D5AE",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        borderWidth: 2,
        borderColor: "white",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        paddingHoriontal: 12,
        paddingVertical: 10,
        marginTop: 20,
    },
    cloud: {
        width: "65%",
        height: 133,
        justifyContent: "center",
        alignItems: "center",
    },
    red: {
        top: "15%",
        right: "20%",
    },
    yellow: {
        top: "15%",
        right: "10%",
    },
    blue: {
        top: "2%",
        left: "41%",
    },
    travels: {
        width: "50%",
        height: 180,
        bottom: "56%",
        left: "22%",
    },
    globe: {
        width: "45%",
        height: 150,
        marginTop: 50,
    },
    title: {
        color: "white",
        fontSize: 35,
        fontWeight: "bold",
        top: "1.5%",
    },
    subtitle: {
        color: "white",
        fontSize: 30,
        fontWeight: "bold",
    },
    subsubtitle: {
        color: "white",
        fontSize: 25,
        fontWeight: "bold",
    },
    text: {
        color: "white",
        fontSize: 20,
        fontWeight: "normal",
    },
});