import { SafeAreaView, View, Text, Image, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";

import SignOutButton from "../components/signOutButton";
import DeleteAccountButton from "../components/deleteAccountButton";
import ExploreButton from "../components/exploreButton";
import PolicyLinks from "../components/policyLinks";

import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { CAUSES_URL } from "../constants/links";
import { getCachedUser, setCachedUser } from "../lib/userCache";

const globe = require("../assets/Globe.png");

export default function ProfileScreen({ navigation }) {

    // seeded from the last known values so the screen paints correct immediately
    // instead of flashing its empty defaults before the read returns
    const seed = getCachedUser(auth.currentUser?.uid) ?? {};
    const [name, setName] = useState(seed.name ?? "");
    const [username, setUsername] = useState(seed.username ?? "");
    const [challengesCompleted, setChallengesCompleted] = useState(seed.total_completed_challenges ?? 0);
    const [loaded, setLoaded] = useState(Boolean(getCachedUser(auth.currentUser?.uid)));

    const isFocused = useIsFocused();

    useEffect(() => {
        const getProfile = async () => {
            const user = auth.currentUser;
            if (!user) {
                return;
            }
            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setCachedUser(user.uid, data);
                    setName(data.name ?? "");
                    setUsername(data.username ?? "");
                    setChallengesCompleted(data.total_completed_challenges ?? 0);
                }
                setLoaded(true);
            } catch (error) {
                // keep whatever is already on screen rather than blanking the page
                console.error("Error reading profile: ", error);
            }
        };

        if (auth.currentUser) {
            getProfile();
        }
    }, [isFocused]);

    const email = auth.currentUser?.email ?? "";
    const displayName = username ? username.charAt(0).toUpperCase() + username.slice(1) : "";

    return (
        <View style={styles.root}>
            <SafeAreaView style={styles.safe}>
                <View style={styles.page}>
                    <Text style={styles.title}>Profile</Text>

                    <View style={styles.hero}>
                        <Image source={globe} style={styles.globe} resizeMode="contain" accessible={false} />
                        <Text style={styles.greeting}>
                            {!loaded
                                ? " "
                                : challengesCompleted > 0
                                    ? (displayName ? `We love you, ${displayName}!` : "We love you!")
                                    : (displayName ? `Welcome, ${displayName}.` : "Welcome.")}
                        </Text>
                        <Text style={styles.greetingSub}>
                            {!loaded
                                ? " "
                                : challengesCompleted > 0
                                    ? "Thank you for making the world a better place."
                                    : "One small challenge a day."}
                        </Text>
                    </View>

                    <View style={styles.card}>
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Name</Text>
                            <Text style={styles.rowValue} numberOfLines={1}>{name}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Username</Text>
                            <Text style={styles.rowValue} numberOfLines={1}>{loaded ? (username || "Not set") : ""}</Text>
                        </View>
                        <View style={[styles.row, styles.rowLast]}>
                            <Text style={styles.rowLabel}>Email</Text>
                            <Text style={styles.rowValue} numberOfLines={1}>{email}</Text>
                        </View>
                    </View>

                    <View style={styles.actions}>
                        <ExploreButton link={CAUSES_URL} />
                    </View>

                    <View style={styles.spacer} />

                    <View style={styles.footer}>
                        <PolicyLinks style={styles.policyLinks} onLight />
                        <DeleteAccountButton navigation={navigation} />
                    </View>
                </View>
            </SafeAreaView>

            <SignOutButton navigation={navigation} />
        </View>
    );
}

const INK = "#2B2724";

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#E9F4ED",
    },
    safe: {
        flex: 1,
    },
    page: {
        flex: 1,
        alignItems: "center",
        paddingTop: 4,
    },
    spacer: {
        flex: 1,
    },
    title: {
        color: INK,
        fontSize: 30,
        fontWeight: "bold",
    },
    hero: {
        alignItems: "center",
        marginTop: 8,
        marginBottom: 4,
    },
    globe: {
        width: 120,
        height: 120,
    },
    greeting: {
        color: INK,
        fontSize: 26,
        lineHeight: 32,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 10,
    },
    greetingSub: {
        // held to a narrower measure so it wraps into two balanced lines instead
        // of running the full width of the screen under a much shorter heading
        color: "rgba(43,39,36,0.72)",
        fontSize: 15,
        lineHeight: 21,
        textAlign: "center",
        marginTop: 6,
        maxWidth: 260,
    },
    card: {
        backgroundColor: "white",
        borderRadius: 18,
        width: 320,
        paddingHorizontal: 18,
        marginTop: 20,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#E4EBE6",
        gap: 16,
    },
    rowLast: {
        borderBottomWidth: 0,
    },
    rowLabel: {
        color: INK,
        fontSize: 15,
        fontWeight: "bold",
    },
    rowValue: {
        color: INK,
        fontSize: 15,
        flexShrink: 1,
        textAlign: "right",
    },
    actions: {
        alignItems: "center",
        marginTop: 22,
    },
    footer: {
        // pushed to the bottom of the page by the spacer above it
        alignItems: "center",
        paddingBottom: 118,
        gap: 2,
    },
    policyLinks: {
        justifyContent: "center",
    },
});
