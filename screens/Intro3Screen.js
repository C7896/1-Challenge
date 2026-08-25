import { View, Pressable, Text, StyleSheet, SafeAreaView } from "react-native";
import React, { useRef } from "react";

import LargeImage from "../components/largeImage";
import IntroDots from "../components/introDots";

import { auth, db } from "../firebase";
import { loadToday } from "../lib/challenge";

const growth = require("../assets/Growth.png");

export default function Intro3Screen({ navigation }) {

    const pressed = useRef(false);

    const checkChallenges = async () => {
        if (!pressed.current) {
            pressed.current = true;
            const user = auth.currentUser;

            // no session (token refresh failed, or iOS restored this screen after a
            // kill): send them back to sign in rather than reading uid off null
            if (user == null) {
                pressed.current = false;
                navigation.reset({ index: 0, routes: [{ name: "Login0" }] });
                return;
            }

            try {
                const { challenge, streak } = await loadToday(db, user.uid);
                navigation.navigate("Home", { challenge, streak });
            } catch (error) {
                console.error("Error loading today's challenge: ", error);
                pressed.current = false;
                navigation.navigate("Home");
            }
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.group}>
                <LargeImage src={growth} trimBottom={0.17} />
                <Text style={[styles.text, styles.title]}>Why</Text>
                <Text style={[styles.text, styles.body]}>A 1% improvement</Text>
                <Text style={[styles.text, styles.body]}>every day is a 37x</Text>
                <Text style={[styles.text, styles.body]}>improvement a year!</Text>
                <Text style={[styles.text, styles.reminder]}>We'll remind you at 9:00 AM.</Text>
            </View>
            <View style={styles.ctaBlock}>
                <IntroDots active={2} color="white" />
                <Pressable style={styles.buttonContainer} onPress={checkChallenges}>
                    <Text style={styles.buttonText}>Start Challenge!</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#9884BA",
        alignItems: "center",
        justifyContent: "center",
    },
    group: {
        // image and copy sit together as one block, centred on the screen
        alignItems: "center",
        justifyContent: "center",
    },
    ctaBlock: {
        alignSelf: "center",
        alignItems: "center",
        marginTop: 20,
        // the dots and button used to sit tight against the home indicator on a
        // short screen; this keeps a clear gap below the last tappable thing
        marginBottom: 28,
    },
    text: {
        color: "white",
        textAlign: "center",
    },
    title: {
        fontSize: 35,
        fontWeight: "bold",
    },
    body: {
        fontSize: 30,
        fontWeight: "normal",
    },
    reminder: {
        fontSize: 14,
        fontWeight: "normal",
        marginTop: 10,
    },
    buttonContainer: {
        borderWidth: 2,
        borderColor: "white",
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 42,
        paddingVertical: 12,
        marginTop: 12,
    },
    buttonText: {
        color: "white",
        fontSize: 30,
        fontWeight: "bold"
    },
});