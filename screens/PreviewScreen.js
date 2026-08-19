import { SafeAreaView, View, Text, Pressable, StyleSheet } from "react-native";
import React, { useCallback, useEffect, useState } from "react";

import LargeImage from "../components/largeImage";
import { db } from "../firebase";
import { loadToday } from "../lib/challenge";

const message = require("../assets/message.png");

export default function PreviewScreen({ navigation }) {

    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    const fetchToday = useCallback(() => {
        let cancelled = false;
        setLoading(true);
        setLoadError(false);
        loadToday(db, null)
            .then(({ challenge }) => {
                if (!cancelled) {
                    setChallenge(challenge);
                }
            })
            .catch(error => {
                console.error("Error loading today's challenge: ", error);
                if (!cancelled) {
                    setLoadError(true);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        return fetchToday();
    }, [fetchToday]);

    return (
        <SafeAreaView style={styles.container}>
            <Pressable onPress={() => navigation.navigate("Login0")} style={styles.backLink}>
                <Text style={styles.backText}>Back</Text>
            </Pressable>
            <LargeImage src={message} />
            <View style={styles.textContainer}>
                <Text style={styles.title}>Today's challenge</Text>
                {loading ? (
                    <Text style={styles.body}>Loading...</Text>
                ) : loadError ? (
                    <Pressable onPress={fetchToday}>
                        <Text style={styles.body}>Couldn't load. Tap to retry.</Text>
                    </Pressable>
                ) : (
                    <Text style={styles.body}>{challenge.challenge}</Text>
                )}
                <Text style={styles.step}>Do it.</Text>
                <Text style={styles.step}>Write what you did and how it felt.</Text>
                <Text style={styles.step}>Keep the streak.</Text>
                <Text style={styles.justification}>An account keeps your journal and streak private to you and saved across devices.</Text>
            </View>
            <View style={styles.buttonContainer}>
                <Pressable style={styles.primaryButton} onPress={() => navigation.navigate("Sign up")}>
                    <Text style={styles.primaryButtonText}>Create a free account</Text>
                </Pressable>
                <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate("Login1")}>
                    <Text style={styles.secondaryButtonText}>Log in</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const INK = "#2B2724";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FF815E",
        justifyContent: "center",
        alignItems: "center",
    },
    backLink: {
        position: "absolute",
        top: 12,
        left: 8,
        paddingHorizontal: 12,
        paddingVertical: 13,
        minWidth: 44,
        minHeight: 44,
        justifyContent: "center",
    },
    backText: {
        color: "white",
        fontSize: 15,
        textDecorationLine: "underline",
    },
    textContainer: {
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "flex-start",
        marginHorizontal: 20,
    },
    title: {
        color: "white",
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 10,
    },
    body: {
        color: "white",
        fontSize: 22,
        fontWeight: "normal",
        marginBottom: 16,
    },
    step: {
        color: "white",
        fontSize: 16,
        fontWeight: "normal",
        marginBottom: 4,
    },
    justification: {
        color: "white",
        fontSize: 13,
        marginTop: 16,
    },
    buttonContainer: {
        alignItems: "center",
        marginTop: 30,
        marginBottom: 20,
    },
    primaryButton: {
        backgroundColor: "#FFC0A2",
        width: 240,
        height: 56,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    primaryButtonText: {
        color: INK,
        fontSize: 18,
        fontWeight: "bold",
    },
    secondaryButton: {
        borderWidth: 2,
        borderColor: "white",
        borderRadius: 20,
        width: 240,
        height: 56,
        justifyContent: "center",
        alignItems: "center",
    },
    secondaryButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});
