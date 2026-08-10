import { View, Pressable, Text, StyleSheet, SafeAreaView } from "react-native";
import React, { useRef } from "react";

import LargeImage from "../components/largeImage";

import { auth, db } from "../firebase";
import { loadToday } from "../lib/challenge";

const growth = require("../assets/Growth.png");

export default function Intro3Screen({ navigation }) {

    const pressed = useRef(false);

    const checkChallenges = async () => {
        if (!pressed.current) {
            pressed.current = true;
            const user = auth.currentUser;

            const { challenge, completed, streak } = await loadToday(db, user.uid);
            navigation.navigate(completed ? "Home" : "Challenge1", { challenge, streak });
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <LargeImage src={growth} />
            <View style={styles.hContainer} >
                <View style={[styles.container, styles.textContainer]}>
                    <Text style={[styles.text, styles.title]}>Why</Text>
                    <Text style={[styles.text, styles.body]}>A 1% improvement</Text>
                    <Text style={[styles.text, styles.body]}>everyday is a 37x</Text>
                    <Text style={[styles.text, styles.body]}>improvement a year!</Text>
                    <Text style={[styles.text, styles.reminder]}>We'll remind you at 9:00 AM.</Text>
                    <Pressable style={styles.buttonContainer} onPress={checkChallenges}>
                        <Text style={styles.buttonText}>Start Challenge!</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#9884BA",
        alignItems: "left",
        justifyContent: "center",
    },
    textContainer: {
        flex: 1,
        paddingLeft: "10%",
    },
    hContainer: {
        flexDirection: "row",
    },
    text: {
        color: "white",
        paddingLeft: 3,
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
        marginTop: 20,
    },
    buttonText: {
        color: "white",
        fontSize: 30,
        fontWeight: "bold"
    },
});