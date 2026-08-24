import { SafeAreaView, View, Text, Image, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Alert, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";

import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { getCachedJournals, setCachedJournals } from "../lib/userCache";

const topBlob = require("../assets/topBlob.png");

const INK = "#2B2724";

export default function LogDetailsScreen({ navigation, route }) {
    const { journal } = route.params ?? {};

    const [action, setAction] = useState(journal?.action ?? "");
    const [reflection, setReflection] = useState(journal?.reflection ?? "");
    const [saving, setSaving] = useState(false);
    const saved = useRef({ action: journal?.action ?? "", reflection: journal?.reflection ?? "" });

    useEffect(() => {
        if (!journal) {
            navigation.popTo("Home");
        }
    }, [journal]);

    if (!journal) {
        return null;
    }

    const changed = action.trim() !== saved.current.action || reflection.trim() !== saved.current.reflection;

    const save = async () => {
        if (saving) {
            return;
        }
        const trimmedAction = action.trim();
        const trimmedReflection = reflection.trim();
        if (trimmedAction.length === 0 || trimmedReflection.length === 0) {
            Alert.alert("Keep both boxes filled", "An entry needs what you did and how it felt.");
            return;
        }
        const user = auth.currentUser;
        if (user == null) {
            return;
        }

        setSaving(true);
        try {
            // Only the text. The counters and the streak belong to the day this was
            // completed and must not move because someone reworded their entry.
            await updateDoc(doc(db, "users", user.uid, "journals", journal.docId), {
                action: trimmedAction,
                reflection: trimmedReflection,
            });
            saved.current = { action: trimmedAction, reflection: trimmedReflection };

            // keep the cached list in step so the log does not show stale text
            const cached = getCachedJournals(user.uid);
            if (cached) {
                setCachedJournals(user.uid, cached.map((j) =>
                    j.docId === journal.docId ? { ...j, action: trimmedAction, reflection: trimmedReflection } : j
                ));
            }
            navigation.goBack();
        } catch (error) {
            console.error("Error saving edited entry: ", error);
            Alert.alert("Could not save your changes", "Check your connection and try again.");
        } finally {
            setSaving(false);
        }
    };

    return(
        <View style={styles.container}>
            <Image source={topBlob} style={styles.image} />
            <SafeAreaView style={styles.safe}>
                <KeyboardAvoidingView style={styles.safe} behavior="padding">
                    <ScrollView
                        style={styles.scroll}
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator
                    >
                        {/* the challenge sits inside the peach, where ink reads against
                            the light background rather than white on coral */}
                        <View style={styles.header}>
                            <Text style={styles.date}>{journal.month} {journal.day}</Text>
                            <Text style={styles.challenge}>{journal.challenge}</Text>
                        </View>

                        <Text style={styles.question}>What did you do?</Text>
                        <TextInput
                            style={styles.answerBox}
                            value={action}
                            onChangeText={setAction}
                            multiline
                            placeholder="What did you do?"
                            placeholderTextColor="rgba(43,39,36,0.35)"
                        />

                        <Text style={styles.question}>How did it make you feel?</Text>
                        <TextInput
                            style={styles.answerBox}
                            value={reflection}
                            onChangeText={setReflection}
                            multiline
                            placeholder="How did it make you feel?"
                            placeholderTextColor="rgba(43,39,36,0.35)"
                        />

                        {/* pinned to the bottom of the screen rather than sitting
                            directly under the boxes */}
                        <View style={styles.footer}>
                            {changed ? (
                                <Pressable style={styles.saveButton} onPress={save} disabled={saving}>
                                    <Text style={styles.saveText}>{saving ? "Saving..." : "Save changes"}</Text>
                                </Pressable>
                            ) : (
                                <Text style={styles.hint}>Tap either box to edit this entry.</Text>
                            )}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
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
        top: 0,
        width: "100%",
        height: "34%",
        resizeMode: "cover",
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 56,
        paddingBottom: 24,
    },
    footer: {
        marginTop: "auto",
        alignItems: "center",
        paddingTop: 24,
    },
    header: {
        // sized to sit inside the peach shape so the challenge does not hang over
        // the edge onto the coral below it
        minHeight: 128,
        justifyContent: "center",
        paddingRight: 8,
        marginBottom: 18,
    },
    date: {
        color: "rgba(43,39,36,0.6)",
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 4,
    },
    challenge: {
        color: INK,
        fontSize: 24,
        fontWeight: "bold",
        lineHeight: 30,
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
    saveButton: {
        backgroundColor: "#FFC0A2",
        width: 220,
        height: 52,
        borderRadius: 26,
        alignItems: "center",
        justifyContent: "center",
    },
    saveText: {
        color: INK,
        fontSize: 18,
        fontWeight: "bold",
    },
    hint: {
        color: "rgba(255,255,255,0.8)",
        fontSize: 13,
        textAlign: "center",
    },
});
