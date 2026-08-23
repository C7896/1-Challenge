import { SafeAreaView, View, Text, Image, KeyboardAvoidingView, TextInput, Pressable, Keyboard, Alert, StyleSheet } from "react-native";
import React, { useState, useEffect, useRef } from "react";

import { doc, runTransaction, serverTimestamp } from "firebase/firestore"
import { auth, db } from "../firebase";
import { todayParts } from "../lib/challenge";

import CloseKeyboard from "../components/closeKeyboard";

const topBlob = require("../assets/topBlob.png");


export default function Challenge3Screen({ navigation, route }) {
    const { challenge } = route.params ?? {};

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
            <SafeAreaView style={styles.clearContainer}>
                <View style={[styles.textContainer, styles.challengeTextContainer]}>
                    <Text style={styles.title}>Challenge:</Text>
                    <Text style={styles.body}>{challenge.challenge}</Text>
                </View>
                <View style={{flex: 0.5}} />
                <KeyboardAvoidingView behavior="padding" style={[styles.textContainer, {flex: 6}]}>
                    <Text style={styles.body}>What did you do?</Text>
                    <TextInput
                        style={styles.questionInput}
                        onChangeText={(text) => setAction(text)}
                        placeholder="I..."
                        multiline
                        autoCorrect={false}
                        autoComplete="off"
                        maxLength={2000}
                    />
                    <Text style={styles.body}>How did it make you feel?</Text>
                    <TextInput
                        style={[styles.questionInput, {height: 300}]}
                        onChangeText={(text) => setReflection(text)}
                        placeholder="I felt..."
                        multiline
                        autoCorrect={false}
                        autoComplete="off"
                        maxLength={2000}
                    />
                </KeyboardAvoidingView>
                <View style={{flex: 0.5}} />
                <Pressable style={styles.buttonContainer} onPress={createJournalDoc}>
                    <Text style={styles.buttonText}>Complete</Text>
                </Pressable>
            </SafeAreaView>
            <CloseKeyboard visible={isKeyboardVisible} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 2,
        backgroundColor: "#FF815E",
        justifyContent: "center",
        alignItems: "center",
    },
    clearContainer: {
        flex: 2,
        // an explicit width: the parent centres its children, which otherwise
        // shrink-wraps this box and makes any child percentage width circular
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        position: "absolute",
        width: "100%",
        height: "35%",
        bottom: "80%",
    },
    textContainer: {
        flex: 2,
        justifyContent: "center",
        alignItems: "stretch",
        // the parent centres its children, which shrink-wraps this box and left
        // the inputs' width: "100%" with no width to resolve against
        alignSelf: "stretch",
        marginHorizontal: 20,
    },
    challengeTextContainer: {
        transform: [{ translateY: -110 }],
    },
    questionInput: {
        backgroundColor: "white",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        borderRadius: 15,
        width: "100%",
        height: 50,
        paddingHorizontal: 10,
        marginBottom: 10,
        color: "black",
        fontSize: 20,
        fontWeight: "normal",
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        elevation: 5,
    },
    buttonContainer: {
        borderWidth: 2,
        borderColor: "white",
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 42,
        paddingVertical: 12,
        marginTop: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 30,
        fontWeight: "bold"
    },
    title: {
        color: "white",
        fontSize: 30,
        fontWeight: "bold",
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        elevation: 5,
    },
    subtitle: {
        color: "white",
        fontSize: 25,
        fontWeight: "bold",
    },
    body: {
        color: "white",
        fontSize: 25,
        fontWeight: "normal",
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        elevation: 5,
    }
});
