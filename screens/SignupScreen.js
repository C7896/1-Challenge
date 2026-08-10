import { View, Text, Image, TextInput, StyleSheet, Pressable, Alert, KeyboardAvoidingView } from "react-native";
import React, { useState, useRef } from 'react';
import LargeImage from "../components/largeImage";
import LoginScreenButton from "../components/loginScreenButton";
import PolicyLinks from "../components/policyLinks";

import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "../firebase";

const mountain = require("../assets/Victory.png");
const user = require("../assets/user.png");
const mail = require("../assets/mail.png");
const lock = require("../assets/lock.png");

export default function SignupScreen( {navigation} ) {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const pressed = useRef(false);

    const handleCreateAccount = () => {
        if (pressed.current) {
            return;
        }

        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim();
        if (trimmedUsername.length === 0) { Alert.alert("Add a username", "Enter a name so we know what to call you."); return; }
        if (trimmedEmail.length === 0) { Alert.alert("Add your email", "Enter the email address you want to use."); return; }
        if (password.length < 8) { Alert.alert("Pick a longer password", "Passwords need at least 8 characters."); return; }

        pressed.current = true;
        createUserWithEmailAndPassword(auth, trimmedEmail, password)
        .then (async (userCredential) => {
            console.log('Account Created!')
            const user = userCredential.user;

            try {
                await setDoc(doc(db, "users", user.uid), {
                    username: trimmedUsername,
                    current_streak: 0,
                    longest_streak: 0,
                    total_completed_challenges: 0,
                });
                console.log("Blank user document created");
            } catch (e) {
                console.error("Error adding document: ", e);
            }

            sendEmailVerification(user).catch(() => {});

            navigation.navigate("Intro1");
        })
        .catch(error => {
            pressed.current = false;
            if (error.code === 'auth/email-already-in-use') {
                Alert.alert("That email is already registered", "Try signing in instead, or use Forgot password if you cannot remember it.");
            } else if (error.code === 'auth/invalid-email') {
                Alert.alert("That email does not look right", "Check the address and try again.");
            } else if (error.code === 'auth/weak-password') {
                Alert.alert("Pick a longer password", "Passwords need at least 8 characters.");
            } else {
                Alert.alert("Could not create your account", "Something went wrong. Please try again.");
            }
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
                        autoCorrect={false}
                        autoComplete="off"
                        maxLength={40}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Image source={mail} style={styles.icon} />
                    <TextInput
                        placeholder="Email"
                        onChangeText={(text) => setEmail(text)}
                        style={styles.input}
                        autoCapitalize="none"
                        autoCorrect={false}
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
                        autoCorrect={false}
                        autoComplete="off"
                    />
                </View>
                <Pressable style={styles.buttoncontainer} onPress={handleCreateAccount}>
                     <Text style={styles.buttontext}>Create Account</Text>
                </Pressable>
                <Text style={styles.agreementText}>By creating an account you agree to our Privacy Policy.</Text>
                <PolicyLinks style={styles.policyLinks} />
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
    agreementText: {
        color: "white",
        fontSize: 12,
        marginTop: 10,
    },
    policyLinks: {
        marginTop: 4,
    },
});