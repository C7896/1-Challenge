import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import React, { useState } from 'react';
import LargeImage from "../components/largeImage";
import LoginScreenButton from "../components/loginScreenButton";
import LoginChallengeButton from "../components/loginChallengeButton";
import pastChallengesList from "../past-challenges.json";
import newChallengesList from "../next-challenges.json";
import { isSearchBarAvailableForCurrentPlatform } from "react-native-screens";

import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, userCredential} from 'firebase/auth';
import {initializeApp} from 'firebase/app';
import { firebaseConfig } from "../firebase-config";

const mountain = require("../assets/Victory.png");
const user = require("../assets/user.png");
const mail = require("../assets/mail.png");
const lock = require("../assets/lock.png");

export default function SignupScreen( {navigation} ) {

    // get challenge object from new-challenges.json if today's date is not in past-challenges.json
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let day = new Date().getDate();
    let monthIndex = new Date().getMonth();
    let month = months[monthIndex];
    let year = new Date().getFullYear();

    let newChallenge = true;

    if (pastChallengesList[pastChallengesList.length-1].day === day) {
        if (pastChallengesList[pastChallengesList.length-1].month === month) {
            if (pastChallengesList[pastChallengesList.length-1].year === year){
                newChallenge = false;
            }
        }
    }

    const nextChallenge = newChallengesList.find(item => {
        if (item.month !== month || item.day !== day) {
            return false;
        }
        return true;
    });
    if (nextChallenge === undefined) {
        newChallenge = false;
    }


    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const handleCreateAccount = () => {
        createUserWithEmailAndPassword(auth, email, password)
        .then ((userCredential) => {
            console.log('Account Created!')
            const user = userCredential.user;
            console.log(user)
            //Add Screen Navigation
        })
        .catch(error => {
            console.log(error)
        })
    }


    return(
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <LargeImage src={mountain}/>
                <Text style={styles.title}>1% Challenge</Text>
            </View>
            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Image source={user} style={styles.icon} />
                    <TextInput style={styles.input} placeholder="Username"/>
                </View>
                <View style={styles.inputContainer}>
                    <Image source={mail} style={styles.icon} />
                    <TextInput
                        placeholder="Email"
                        onChangeText={(text) => setEmail(text)}
                        style={styles.input}
                    />
                </View>
                <View style={[styles.inputContainer, {marginBottom: 15}]}>
                    <Image source={lock} style={styles.icon} />
                    <TextInput
                        placeholder="Password"
                        onChangeText={(text) => setPassword(text)}
                        style={styles.input}
                        secureTextEntry
                    />
                </View>
                <Pressable style={styles.buttoncontainer} onPress={handleCreateAccount}>
                     <Text style={styles.buttontext}>Create Account</Text>
                </Pressable>
            </View>
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