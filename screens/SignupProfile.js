import { View, Text, Image, TextInput, Pressable, Alert, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import React, { useState, useRef } from 'react';
import LargeImage from "../components/largeImage";
import PolicyLinks from "../components/policyLinks";
import BackButton from "../components/backButton";
import { AUTH_SCHEMES } from "../constants/theme";
import { getDraft, clearDraft } from "../lib/signupDraft";

import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "../firebase";

const authName = require("../assets/auth-name.png");
const user = require("../assets/user.png");

const scheme = AUTH_SCHEMES.yellow;

export default function SignupProfile( {navigation, route} ) {

    // Arriving from Apple or Google: the account already exists and is signed in,
    // so this screen writes the profile rather than creating a login.
    const { social = false, suggestedName = "" } = route.params ?? {};

    const [name, setName] = useState(suggestedName);
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

        if (social) {
            const signedIn = auth.currentUser;
            if (signedIn == null) {
                Alert.alert("Sign in again", "That sign in did not finish. Please try again.");
                navigation.reset({ index: 0, routes: [{ name: "Login0" }] });
                return;
            }
            pressed.current = true;
            setDoc(doc(db, "users", signedIn.uid), {
                name: trimmedName,
                username: trimmedUsername,
                current_streak: 0,
                longest_streak: 0,
                total_completed_challenges: 0,
            })
            .then(() => {
                clearDraft();
                navigation.reset({ index: 0, routes: [{ name: "Intro1" }] });
            })
            .catch((e) => {
                // Without this document every later counter write fails forever, so
                // the account is left signed in and the person is asked to retry
                // rather than being sent on into a broken state.
                console.error("Error creating profile for social sign in: ", e);
                pressed.current = false;
                Alert.alert("Could not save your profile", "Nothing was saved. Check your connection and try again.");
            });
            return;
        }

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
                // An auth user with no users/{uid} document can never complete a
                // challenge: every counter update fails NOT_FOUND forever. Undo
                // the signup instead of stranding them there.
                console.error("Error adding document: ", e);
                pressed.current = false;
                await user.delete().catch(() => {});
                Alert.alert("Could not finish creating your account", "Nothing was saved. Please check your connection and try again.");
                return;
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
            <BackButton
                navigation={navigation}
                onLight
                onBack={social ? () => {
                    // Backing out of a social sign up would otherwise leave a signed
                    // in account with no profile document, which can never complete a
                    // challenge. Sign out so the account is not left half made.
                    signOut(auth).catch(() => {});
                    navigation.reset({ index: 0, routes: [{ name: "Login0" }] });
                } : undefined}
            />
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
        width: 280,
        height: 56,
        borderRadius: 28,
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
