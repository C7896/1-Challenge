import { SafeAreaView, View, Text, Image, KeyboardAvoidingView, TextInput, Pressable, ScrollView, Keyboard, Alert, StyleSheet, useWindowDimensions } from "react-native";
import React, { useState, useEffect, useRef } from "react";

import { doc, runTransaction, serverTimestamp } from "firebase/firestore"
import { auth, db } from "../firebase";
import { todayParts } from "../lib/challenge";
import { setCachedToday } from "../lib/userCache";

import CloseKeyboard from "../components/closeKeyboard";
import { useVerticalScale } from "../lib/verticalScale";

const topBlob = require("../assets/topBlob.png");

// Same treatment as the log entry screen, which shows the same two questions.
// The shape keeps the asset's proportions so its own curve is the edge, the
// challenge sits inside it, and the questions start below it.
const SHAPE_ASPECT = 430 / 274;
const SHAPE_TOP = -72;
const SHAPE_GAP = 16;
const CONTENT_TOP = 46;
const HEADER_TEXT_LIFT = -56;
// the floating tab bar occupies this much of the bottom edge
const TAB_BAR_SPACE = 105;

const INK = "#2B2724";


export default function Challenge3Screen({ navigation, route }) {
    const { challenge } = route.params ?? {};

    const { width } = useWindowDimensions();
    const scale = useVerticalScale();
    const shapeBottom = SHAPE_TOP + width / SHAPE_ASPECT;
    const headerHeight = Math.max(96, shapeBottom + SHAPE_GAP - CONTENT_TOP);

    const [action, setAction] = useState('');
    const [reflection, setReflection] = useState('');

    const pressed = useRef(false);

    const createJournalDoc = async () => {
        if (pressed.current) {
            return;
        }

        const trimmedAction = action.trim();
        const trimmedReflection = reflection.trim();
        if (trimmedAction.length === 0 || trimmedReflection.length === 0) {
            Alert.alert("Tell us what you did", "Fill in both boxes before completing today's challenge.");
            return;
        }

        const user = auth.currentUser;
        if (user == null) {
            console.log("User is not signed in");
            return;
        }

        // The key comes from the clock at submit time, never from the challenge
        // captured when the screen opened. Someone who opens the challenge at
        // 23:58 and taps Complete at 00:01 would otherwise write under
        // yesterday's key while "yesterday" is computed from now, so the code
        // would look for the very document it is about to write, decide the
        // streak was broken, and reset it.
        const { key: todayKey, day, month, year } = todayParts();
        if (challenge.year !== year || challenge.month !== month || challenge.day !== day) {
            Alert.alert(
                "That challenge was for another day",
                "The date changed while this was open. Your streak is safe. Open today's challenge to carry on."
            );
            navigation.reset({ index: 0, routes: [{ name: "Home" }] });
            return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayKey = todayParts(yesterday).key;

        pressed.current = true;

        try {
            const journalRef = doc(db, "users", user.uid, "journals", todayKey);
            const userRef = doc(db, "users", user.uid);
            const yesterdayRef = doc(db, "users", user.uid, "journals", yesterdayKey);

            // One transaction for the read and both writes, so the counters can
            // never move without the journal landing, and a retry can never
            // increment twice. The new streak is computed here rather than
            // re-read afterwards; that second read was the failure window that
            // let a retry double count.
            const result = await runTransaction(db, async (tx) => {
                const existing = await tx.get(journalRef);
                const userSnap = await tx.get(userRef);
                const yesterdaySnap = await tx.get(yesterdayRef);

                if (existing.exists()) {
                    // Already done today. Never overwrite what was written, and
                    // never count it twice.
                    return { alreadyDone: true, streak: userSnap.exists() ? (userSnap.data().current_streak ?? 0) : 0 };
                }

                const data = userSnap.exists() ? userSnap.data() : {};
                const newStreak = yesterdaySnap.exists() ? (data.current_streak ?? 0) + 1 : 1;
                const newTotal = (data.total_completed_challenges ?? 0) + 1;
                const newLongest = Math.max(data.longest_streak ?? 0, newStreak);

                tx.set(journalRef, {
                    day,
                    month,
                    year,
                    challenge: challenge.challenge,
                    action: trimmedAction,
                    reflection: trimmedReflection,
                    timestamp: serverTimestamp(),
                });

                tx.set(userRef, {
                    current_streak: newStreak,
                    longest_streak: newLongest,
                    total_completed_challenges: newTotal,
                    last_completed_key: todayKey,
                }, { merge: true });

                return { alreadyDone: false, streak: newStreak };
            });

            // today is now done, so the tab must not offer the challenge again.
            // Writing the answer rather than clearing it keeps the tab instant.
            setCachedToday(user.uid, todayKey, {
                challenge,
                completed: true,
                streak: result.streak,
                source: "firestore",
            });

            if (result.alreadyDone) {
                Alert.alert("Already done today", "Today's entry is saved. You can read it in Past Challenges.");
                navigation.reset({ index: 0, routes: [{ name: "Home" }] });
                return;
            }

            navigation.navigate("Challenge4", { streak: result.streak });
        } catch (error) {
            console.error("Error saving journal entry: ", error);
            pressed.current = false;
            Alert.alert("Could not save your entry", "Nothing was saved. Check your connection and try again.");
        }
    }


    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => setKeyboardVisible(true)
        );
        const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => setKeyboardVisible(false)
        );

        // Cleanup listeners when component unmounts
        return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
        };
    }, []);

    useEffect(() => {
        if (!challenge) {
            navigation.popTo("Home");
        }
    }, [challenge]);

    if (!challenge) {
        return null;
    }

    return(
        <View style={styles.container}>
            <Image source={topBlob} style={styles.image} />
            <SafeAreaView style={styles.safe}>
                <KeyboardAvoidingView style={styles.safe} behavior="padding">
                    <ScrollView
                        style={styles.scroll}
                        contentContainerStyle={[styles.scrollContent, { paddingBottom: TAB_BAR_SPACE * scale + 16 }]}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={[styles.header, { minHeight: headerHeight }]}>
                            <Text style={styles.title}>Challenge:</Text>
                            <Text style={styles.challenge}>{challenge.challenge}</Text>
                        </View>

                        <Text style={styles.question}>What did you do?</Text>
                        <TextInput
                            style={styles.answerBox}
                            onChangeText={(text) => setAction(text)}
                            placeholder="I..."
                            placeholderTextColor="rgba(43,39,36,0.35)"
                            multiline
                            autoCorrect={false}
                            autoComplete="off"
                            maxLength={2000}
                        />

                        <Text style={styles.question}>How did it make you feel?</Text>
                        <TextInput
                            style={[styles.answerBox, { minHeight: 120 * scale }]}
                            onChangeText={(text) => setReflection(text)}
                            placeholder="I felt..."
                            placeholderTextColor="rgba(43,39,36,0.35)"
                            multiline
                            autoCorrect={false}
                            autoComplete="off"
                            maxLength={2000}
                        />

                        {/* clear of the floating tab bar, whatever the screen size */}
                        <View style={styles.footer}>
                            <Pressable style={styles.buttonContainer} onPress={createJournalDoc}>
                                <Text style={styles.buttonText}>Complete</Text>
                            </Pressable>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
            <CloseKeyboard visible={isKeyboardVisible} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FF815E",
    },
    safe: {
        flex: 1,
    },
    image: {
        position: "absolute",
        top: SHAPE_TOP,
        width: "100%",
        aspectRatio: SHAPE_ASPECT,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: CONTENT_TOP,
    },
    header: {
        justifyContent: "center",
        paddingRight: 8,
        paddingBottom: SHAPE_GAP,
        transform: [{ translateY: HEADER_TEXT_LIFT }],
    },
    title: {
        color: "rgba(43,39,36,0.6)",
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 4,
    },
    challenge: {
        color: INK,
        fontSize: 22,
        fontWeight: "bold",
        lineHeight: 28,
    },
    question: {
        color: "white",
        fontSize: 20,
        marginBottom: 8,
    },
    answerBox: {
        backgroundColor: "white",
        borderRadius: 15,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 18,
        minHeight: 64,
        color: INK,
        fontSize: 17,
        lineHeight: 23,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    footer: {
        marginTop: "auto",
        alignItems: "center",
        paddingTop: 24,
    },
    buttonContainer: {
        backgroundColor: "#FFC0A2",
        width: 220,
        height: 52,
        borderRadius: 26,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: INK,
        fontSize: 18,
        fontWeight: "bold",
    },
});
