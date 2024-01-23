import { View, Text, Image, TextInput, StyleSheet } from "react-native";
import LargeImage from "../components/largeImage";
import LoginScreenButton from "../components/loginScreenButton";
import LoginChallengeButton from "../components/loginChallengeButton";
import pastChallengesList from "../past-challenges.json";
import newChallengesList from "../next-challenges.json";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, userCredential} from '@react-native-firebase/auth';
import {initializeApp} from 'firebase/app';
import { firebaseConfig } from "../firebase-config";
import React, { useState } from 'react';

const location = require("../assets/Location.png");
const mail = require("../assets/mail.png");
const lock = require("../assets/lock.png");

export default function Login0Screen( {navigation} ) {

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
            newChallenge = false;
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

    const handleSignIn = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then ((userCredential) => {
            console.log('Account Created!')
            //Add Screen Navigation
        })
        .catch(error => {
            console.log(error)
        })
    }

    return(
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <LargeImage src={location}/>
                <Text style={styles.title}>1% Challenge</Text>
            </View>
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <Image source={mail} style={styles.icon} />
                    <TextInput style={styles.input} placeholder="Email"/>
                </View>
                <View style={[styles.inputContainer, {marginBottom: 15}]}>
                    <Image source={lock} style={styles.icon} />
                    <TextInput style={styles.input} placeholder="Password" secureTextEntry/>
                </View>
                <LoginChallengeButton title="Login" nav={navigation} dest="Home Tabs" newChallenge={newChallenge} challenge={nextChallenge} />
            </View>
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
});