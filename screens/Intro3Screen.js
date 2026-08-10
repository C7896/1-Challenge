import { View, Pressable, Text, StyleSheet, SafeAreaView } from "react-native";
import React, { useRef } from "react";

import LargeImage from "../components/largeImage";

import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore"
import { auth, db } from "../firebase";

const growth = require("../assets/Growth.png");

export default function Intro3Screen({ navigation }) {

    const pressed = useRef(false);

    const checkChallenges = async () => {
        if (!pressed.current) {
            pressed.current = true;
            const user = auth.currentUser;
            // get challenge object from new-challenges.json if today's date is not in past-challenges.json
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            let day = new Date().getDate();
            let monthIndex = new Date().getMonth();
            let month = months[monthIndex];
            let year = new Date().getFullYear();


            let newChallenge = true;
            let nextChallenge;
            // get today's challenge document reference
            const challengesRef = collection(db, 'challenges');
            const q = query(challengesRef, where('day', '==', day), where('month', '==', month), where('year', '==', year));

            // get today's challenge document data and store it in nextChallenge
            await getDocs(q)
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    // Access the document data here
                    nextChallenge = doc.data();
                });
            })
            .catch(error => {
                newChallenge = false;
                console.error('Error getting documents: ', error);
            });

            // no challenge doc for today means nothing to serve
            if (nextChallenge === undefined) {
                newChallenge = false;
            }

            // get user's current challenge streak
            let streak = 0;
            const userRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userRef)
            if (userDoc.exists()) {
                const userData = userDoc.data();
                streak = userData.current_streak;
                console.log("User's current streak: ", streak);
            } else {
                console.log("User document not found.");
            }

            navigation.navigate(newChallenge ? "Challenge1" : "Home", {challenge: nextChallenge, streak: streak,});
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