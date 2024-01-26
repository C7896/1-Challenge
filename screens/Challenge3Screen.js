import { SafeAreaView, View, Text, Image, KeyboardAvoidingView, TextInput, Pressable, StyleSheet } from "react-native";
import React, { useState } from "react";

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from "../firebase-config";
import { getFirestore, doc, setDoc, updateDoc, increment, serverTimestamp } from "firebase/firestore"

const topBlob = require("../assets/topBlob.png");


export default function Challenge3Screen({ navigation, route }) {
    const { challenge } = route.params;

    const [action, setAction] = useState('');
    const [reflection, setReflection] = useState('');

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    const createJournalDoc = () => {
        const user = auth.currentUser;
        if (user != null) {
            
            // add journal to user
            setDoc(doc(db, "users", user.uid, "journals", String(challenge.ID)), {
                day: challenge.day,
                month: challenge.month,
                year: challenge.year,
                challenge: challenge.challenge,
                action: action,
                reflection: reflection,
                timestamp: serverTimestamp(),
            })
            .then(() => {
                console.log("Journal doc created, id = ", challenge.ID);
            })
            .catch(error => {
                console.error("Error adding document: ", error);
            });

            updateDoc(doc(db, "users", user.uid), {
                total_completed_challenges: increment(1), 
            })
            .then(() => {
                console.log("User's total_completed_challenges incremented by 1");
            })
            .catch(error => {
                console.error("Error incrementing user's total_completed_challenges: ", error);
            });

            navigation.navigate("Challenge4", {navigation: navigation, challenge: challenge});
        } else {
            console.log("User is not signed in");
        }
    }

    return(
        <View style={styles.container}>
            <Image source={topBlob} style={styles.image} />
            <SafeAreaView style={styles.clearContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Challenge:</Text>
                    <Text style={styles.body}>{challenge.challenge}</Text>
                </View>
                <View style={{flex: 0.5}} />
                <KeyboardAvoidingView behavior="padding" style={[styles.textContainer, {flex: 6, flexWrap: "no-wrap",}]}>
                    <Text style={styles.body}>What did you do?</Text>
                    <TextInput
                        style={styles.questionInput}
                        onChangeText={(text) => setAction(text)}
                        placeholder="I..."
                        multiline
                        autoCorrect={false}
                        autoComplete="off"
                    />
                    <Text style={styles.body}>How did it make you feel?</Text>
                    <TextInput
                        style={[styles.questionInput, {height: 300}]}
                        onChangeText={(text) => setReflection(text)}
                        placeholder="I felt..."
                        multiline
                        autoCorrect={false}
                        autoComplete="off"
                    />
                </KeyboardAvoidingView>
                <View style={{flex: 0.5}} />
                <Pressable style={styles.buttonContainer} onPress={createJournalDoc}>
                    <Text style={styles.buttonText}>Complete</Text>
                </Pressable>
            </SafeAreaView>
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
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "flex-start",
        marginHorizontal: 20,
    },
    questionInput: {
        backgroundColor: "white",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        borderRadius: 15,
        width: 350,
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