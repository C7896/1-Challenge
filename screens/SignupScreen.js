import { View, Text, Image, TextInput, StyleSheet, Pressable, Alert, KeyboardAvoidingView } from "react-native";
import React, { useState } from 'react';
import LargeImage from "../components/largeImage";
import LoginScreenButton from "../components/loginScreenButton";

import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from "../firebase-config";
import { getFirestore, collection, query, where, doc, setDoc, getDocs } from "firebase/firestore"

const mountain = require("../assets/Victory.png");
const user = require("../assets/user.png");
const mail = require("../assets/mail.png");
const lock = require("../assets/lock.png");

export default function SignupScreen( {navigation} ) {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
    // get today's challenge document reference
    const challengesRef = collection(db, 'challenges');
    const q = query(challengesRef, where('day', '==', day), where('month', '==', month), where('year', '==', year));

    // get today's challenge document data and store it in nextChallenge
    getDocs(q)
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


    const handleCreateAccount = () => {
        createUserWithEmailAndPassword(auth, email, password)
        .then ((userCredential) => {
            console.log('Account Created!')
            const user = userCredential.user;
            console.log(user);
            
            try {
                setDoc(doc(db, "users", user.uid), {
                    username: username,
                    current_streak: 0,
                    longest_streak: 0,
                    total_completed_challenges: 0,
                });
                console.log("Blank user document created");
            } catch (e) {
                console.error("Error adding document: ", e);
            }

            const dummyChallenge = {
                ID: 0,
                day: 14,
                month: "Jan",
                year: 2024,
                challenge: "This is a dummy challenge.",
            }
            
            navigation.navigate("Intro1", {navigation: navigation, challenge: newChallenge ? nextChallenge : dummyChallenge,});
        })
        .catch(error => {
            console.log(error);
            Alert.alert(error.message);
        });
    }


    return(
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <LargeImage src={mountain}/>
                <Text style={styles.title}>1% Challenge</Text>
            </View>
            <KeyboardAvoidingView style={styles.formContainer} behavior="padding">
                <View style={styles.inputContainer}>
                    <Image source={user} style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        onChangeText={(text) => setUsername(text)}
                        autoCapitalize="none"
                        autoCorrect="false"
                        autoComplete="off"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Image source={mail} style={styles.icon} />
                    <TextInput
                        placeholder="Email"
                        onChangeText={(text) => setEmail(text)}
                        style={styles.input}
                        autoCapitalize="none"
                        autoCorrect="false"
                        autoComplete="email"
                    />
                </View>
                <View style={[styles.inputContainer, {marginBottom: 15}]}>
                    <Image source={lock} style={styles.icon} />
                    <TextInput
                        placeholder="Password"
                        onChangeText={(text) => setPassword(text)}
                        style={styles.input}
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect="false"
                        autoComplete="off"
                    />
                </View>
                <Pressable style={styles.buttoncontainer} onPress={handleCreateAccount}>
                     <Text style={styles.buttontext}>Create Account</Text>
                </Pressable>
            </KeyboardAvoidingView>
            <View style={[styles.container, {justifyContent: "flex-end", paddingBottom: 40}]}>
                <LoginScreenButton title="Login" nav={navigation} dest="Login1" background={false} />
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
        flex: 6,
        justifyContent: "flex-end",
        alignItems: "center",
        marginBottom: 20,
    },
    formContainer: {
        flex: 3,
        justifyContent: "flex-start",
        alignItems: "center",
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
        backgroundColor: "#FFC0A2",
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