import { View, Pressable, Text, Image, StyleSheet } from "react-native";
import React, { useRef } from "react";

import IntroDots from "../components/introDots";
import { useIntroLayout } from "../lib/introLayout";

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

    const layout = useIntroLayout();

    return (
        <View style={styles.container}>
            <Image source={growth} style={layout.image} resizeMode="contain" accessible={false} />

            <View style={layout.stack}>
                <Text style={[styles.text, layout.title]}>Why</Text>
                <Text style={[styles.text, layout.body]}>A 1% improvement</Text>
                <Text style={[styles.text, layout.body]}>every day is a 37x</Text>
                <Text style={[styles.text, layout.body]}>improvement a year!</Text>
                <Text style={[styles.text, layout.reminder]}>We'll remind you at 9:00 AM.</Text>
                <IntroDots style={layout.dots} active={2} color="white" />
                <Pressable
                    style={[styles.button, layout.button]}
                    onPress={checkChallenges}
                    accessibilityRole="button"
                >
                    <Text style={[styles.buttonText, layout.buttonText]}>Start Challenge!</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#9884BA",
    },
    text: {
        color: "white",
    },
    button: {
        borderColor: "white",
    },
    buttonText: {
        color: "white",
    },
});
