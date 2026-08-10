import { View, Text, Image, TextInput, Pressable, Alert, KeyboardAvoidingView, StyleSheet } from "react-native";
import React, { useState, useRef } from 'react';
import LargeImage from "../components/largeImage";
import LoginScreenButton from "../components/loginScreenButton";

import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { collection, query, where, doc, getDocs, getDoc } from "firebase/firestore"
import { auth, db } from "../firebase";
import { friendlyAuthError } from "../authErrors";

const location = require("../assets/Location.png");
const mail = require("../assets/mail.png");
const lock = require("../assets/lock.png");

export default function Login0Screen( {navigation} ) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const pressed = useRef(false);

    const handleSignIn = () => {
        if (!pressed.current) {
            pressed.current = true;
            signInWithEmailAndPassword(auth, email, password)
            .then (async (userCredential) => {
                console.log('User Signed In!');

                // get challenge object from new-challenges.json if today's date is not in past-challenges.json
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                let day = new Date().getDate();
                let monthIndex = new Date().getMonth();
                let month = months[monthIndex];
                let year = new Date().getFullYear();

                let newChallenge = true;
                let nextChallenge;
                let index;
                // get today's challenge document reference
                const challengesRef = collection(db, 'challenges');
                const q = query(challengesRef, where('day', '==', day), where('month', '==', month), where('year', '==', year));

                // get today's challenge document data and store it in nextChallenge
                await getDocs(q)
                .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                    // Access the document data here
                    index = doc.id;
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

                // check if user has already completed today's challenge (if it exists)
                if (nextChallenge !== undefined) {
                    const journalRef = doc(db, "users", userCredential.user.uid, "journals", `${year}-${month}-${day}`);

                    await getDoc(journalRef)
                        .then(docSnapshot => {
                            if (docSnapshot.exists()) {
                                newChallenge = false;
                                console.log("Today's challenge has been completed");
                            } else {
                                console.log("Today's challenge has not been completed");
                            }
                        })
                        .catch(error => {
                            console.error("Error getting document: ", error);
                        })
                }

                let streak = 0;
                const userRef = doc(db, "users", userCredential.user.uid);
                const userDoc = await getDoc(userRef)
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    streak = userData.current_streak;
                    console.log("User's current streak: ", streak);
                } else {
                    console.log("User document not found.");
                }

                navigation.navigate(newChallenge ? "Challenge1" : "Home", {challenge: nextChallenge, streak: streak,});
            })
            .catch(error => {
                pressed.current = false;
                const { title, body } = friendlyAuthError(error);
                Alert.alert(title, body);
            })
        }
    }

    const handleForgotPassword = async () => {
        const address = email.trim();
        if (address.length === 0) {
            Alert.alert("Enter your email first", "Type the email address for your account, then tap Forgot password again.");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, address);
        } catch (error) {
            if (error.code === 'auth/too-many-requests') {
                Alert.alert("Too many attempts", "Please wait a few minutes and try again.");
                return;
            }
            if (error.code === 'auth/invalid-email') {
                Alert.alert("That email does not look right", "Check the address and try again.");
                return;
            }
            // other errors deliberately fall through so this never reveals whether an account exists
        }
        Alert.alert(
            "Check your email",
            "If an account exists for that address, we just sent a link to reset your password. It can take a minute to arrive, and it may land in spam."
        );
    };

    return(
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <LargeImage src={location}/>
                <Text style={styles.title}>1% Challenge</Text>
            </View>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <View style={styles.inputContainer}>
                    <Image source={mail} style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => setEmail(text)}
                        placeholder="Email"
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="email"
                    />
                </View>
                <View style={[styles.inputContainer, {marginBottom: 5}]}>
                    <Image source={lock} style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => setPassword(text)}
                        placeholder="Password"
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="off"
                    />
                </View>
                <Pressable onPress={handleForgotPassword} style={styles.forgotRow}>
                    <Text style={styles.forgotText}>Forgot password?</Text>
                </Pressable>
                <Pressable style={[styles.buttoncontainer, {backgroundColor:"#FFC0A2"}]} onPress={handleSignIn}>
                    <Text style={styles.buttontext}>Login</Text>
                </Pressable>
            </KeyboardAvoidingView>
            <View style={[styles.container, {justifyContent: "flex-end", paddingBottom: 40}]}>
                <LoginScreenButton title="Sign up" nav={navigation} dest="Sign up" background={false} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FF815E",
        justifyContent: "center",
        alignItems: "center",
    },
    topContainer: {
        flex: 2.7,
        justifyContent: "flex-end",
        alignItems: "center",
        marginBottom: 20,
    },
    inputContainer: {
        backgroundColor: "white",
        width: 300,
        height: 50,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center", 
        borderRadius: 20,
        paddingLeft: 10,
        marginBottom: 5,
    },
    input: {
        width: 256,
        height: 45,
        paddingLeft: 5,
    },
    icon: {
        width: 24,
        height: 24,
        paddingLeft: 5,
    },
    forgotRow: {
        width: 300,
        alignItems: "flex-end",
        marginBottom: 15,
    },
    forgotText: {
        color: "white",
        fontSize: 14,
        textDecorationLine: "underline",
    },
    title: {
        color: "white",
        fontSize: 50,
        fontWeight: "bold",
    },
    buttoncontainer: {
        width: 211,
        height: 56,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    buttontext: {
        color: "white",
        fontSize: 22,
        fontWeight: "bold",
    },
});