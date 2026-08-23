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

const globe = require("../assets/Globe.png");

export default function ProfileScreen({ navigation }) {

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [challengesCompleted, setChallengesCompleted] = useState(0);

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
                    setName(data.name ?? "");
                    setUsername(data.username ?? "");
                    setChallengesCompleted(data.total_completed_challenges ?? 0);
                }
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

    return (
        <View style={styles.root}>
            <SafeAreaView style={styles.safe}>
                <View style={styles.page}>
                    <Text style={styles.title}>Profile</Text>

                    <View style={styles.hero}>
                        <Image source={globe} style={styles.globe} resizeMode="contain" accessible={false} />
                        <Text style={styles.greeting}>
                            {challengesCompleted > 0
                                ? (username ? `We love you, ${username}!` : "We love you!")
                                : (username ? `Welcome, ${username}.` : "Welcome.")}
                        </Text>
                        <Text style={styles.greetingSub}>
                            {challengesCompleted > 0
                                ? "Thank you for making the world a better place."
                                : "One small challenge a day."}
                        </Text>
                    </View>

                    <View style={styles.card}>
                        {name.length > 0 ? (
                            <View style={styles.row}>
                                <Text style={styles.rowLabel}>Name</Text>
                                <Text style={styles.rowValue} numberOfLines={1}>{name}</Text>
                            </View>
                        ) : null}
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Username</Text>
                            <Text style={styles.rowValue} numberOfLines={1}>{username || "Not set"}</Text>
                        </View>
                        <View style={[styles.row, styles.rowLast]}>
                            <Text style={styles.rowLabel}>Email</Text>
                            <Text style={styles.rowValue} numberOfLines={1}>{email}</Text>
                        </View>
                    </View>

                    <View style={styles.actions}>
                        <ExploreButton link={CAUSES_URL} />
                    </View>

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
    title: {
        color: INK,
        fontSize: 30,
        fontWeight: "bold",
    },
    hero: {
        alignItems: "center",
        marginTop: 8,
    },
    globe: {
        width: 120,
        height: 120,
    },
    greeting: {
        color: INK,
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 4,
        paddingHorizontal: 24,
    },
    greetingSub: {
        color: INK,
        fontSize: 16,
        textAlign: "center",
        marginTop: 2,
        paddingHorizontal: 24,
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
        alignItems: "center",
        marginTop: 24,
        gap: 2,
    },
    policyLinks: {
        justifyContent: "center",
    },
});
