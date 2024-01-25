import { View, Text, Image, TextInput, Pressable, Alert, KeyboardAvoidingView, StyleSheet } from "react-native";
import React, { useState } from 'react';
import LargeImage from "../components/largeImage";
import LoginScreenButton from "../components/loginScreenButton";

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from "../firebase-config";
import { getFirestore, collection, query, where, doc, getDocs, getDoc } from "firebase/firestore"

const location = require("../assets/Location.png");
const mail = require("../assets/mail.png");
const lock = require("../assets/lock.png");

export default function Login0Screen( {navigation} ) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

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
    getDocs(q)
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


    const handleSignIn = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then (async (userCredential) => {
            console.log('User Signed In!');

            // check if user has already completed today's challenge (if it exists)
            if (index != undefined) {
                const journalRef = doc(db, "users", userCredential.user.uid, "journals", index);

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

            navigation.navigate(newChallenge ? "Challenge1" : "Home Tabs", {navigation: navigation, challenge: nextChallenge,});
        })
        .catch(error => {
            console.log(error);
            Alert.alert(error.message);

        })
    }

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
                        autoCorrect="false"
                        autoComplete="email"
                    />
                </View>
                <View style={[styles.inputContainer, {marginBottom: 15}]}>
                    <Image source={lock} style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => setPassword(text)}
                        placeholder="Password"
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect="false"
                        autoComplete="off"
                    />
                </View>
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