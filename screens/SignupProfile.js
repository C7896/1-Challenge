import { View, Text, Image, TextInput, Pressable, Alert, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import React, { useState, useRef } from 'react';
import LargeImage from "../components/largeImage";
import PolicyLinks from "../components/policyLinks";
import { AUTH_SCHEMES } from "../constants/theme";
import { getDraft, clearDraft } from "../lib/signupDraft";

import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "../firebase";

const authName = require("../assets/auth-name.png");
const user = require("../assets/user.png");

const scheme = AUTH_SCHEMES.yellow;

export default function SignupProfile( {navigation} ) {

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');

    const pressed = useRef(false);

    const handleCreateAccount = () => {
        if (pressed.current) {
            return;
        }

        const trimmedName = name.trim();
        const trimmedUsername = username.trim();
        if (trimmedName.length === 0) { Alert.alert("Add your name", "Enter a name so we know what to call you."); return; }
        if (trimmedUsername.length === 0) { Alert.alert("Add a username", "Pick a short handle. It is what shows on your streak."); return; }

        const { email, password } = getDraft();
        if (email.length === 0 || password.length === 0) {
            Alert.alert("Let's get your email first", "Something interrupted the sign up. Enter your email and password again.");
            navigation.navigate("SignupCredentials");
            return;
        }

        pressed.current = true;
        createUserWithEmailAndPassword(auth, email, password)
        .then (async (userCredential) => {
            console.log('Account Created!')
            const user = userCredential.user;

            try {
                await setDoc(doc(db, "users", user.uid), {
                    name: trimmedName,
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

            clearDraft();
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
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.topContainer}>
                    <LargeImage src={authName}/>
                    <Text style={styles.title}>What should we call you?</Text>
                </View>
                <KeyboardAvoidingView style={styles.container} behavior="padding">
                    <View style={styles.inputContainer}>
                        <Image source={user} style={styles.icon} resizeMode="contain" />
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            onChangeText={(text) => setName(text)}
                            autoCapitalize="words"
                            autoCorrect={false}
                            maxLength={40}
                        />
                    </View>
                    <View style={[styles.inputContainer, {marginBottom: 15}]}>
                        <Image source={user} style={styles.icon} resizeMode="contain" />
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
                    <Pressable style={styles.buttoncontainer} onPress={handleCreateAccount}>
                        <Text style={styles.buttontext}>Create account</Text>
                    </Pressable>
                    <Text style={styles.agreementText}>By creating an account you agree to our Privacy Policy.</Text>
                    <PolicyLinks small color={scheme.muted} style={styles.policyLinks} />
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: scheme.bg,
    },
    scroll: {
        flex: 1,
        width: "100%",
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 16,
    },
    topContainer: {
        justifyContent: "flex-end",
        alignItems: "center",
        marginBottom: 20,
    },
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        color: scheme.text,
        fontSize: 34,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        paddingHorizontal: 24,
    },
    inputContainer: {
        backgroundColor: scheme.field,
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
        flex: 1,
        height: 45,
        paddingLeft: 5,
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 5,
    },
    buttoncontainer: {
        backgroundColor: scheme.cta,
        width: 211,
        height: 56,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    buttontext: {
        color: scheme.ctaText,
        fontSize: 22,
        fontWeight: "bold",
    },
    agreementText: {
        color: scheme.text,
        fontSize: 12,
        marginTop: 10,
    },
    policyLinks: {
        marginTop: 24,
    },
});
