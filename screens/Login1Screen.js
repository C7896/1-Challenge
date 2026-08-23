import { View, Text, Image, TextInput, Pressable, Alert, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import React, { useState, useRef } from 'react';
import LargeImage from "../components/largeImage";
import PolicyLinks from "../components/policyLinks";
import BackButton from "../components/backButton";
import { AUTH_SCHEMES } from "../constants/theme";

import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from "../firebase";
import { friendlyAuthError } from "../authErrors";
import { loadToday } from "../lib/challenge";

const location = require("../assets/Location.png");
const mail = require("../assets/mail.png");
const lock = require("../assets/lock.png");

const scheme = AUTH_SCHEMES.coral;

export default function Login0Screen( {navigation} ) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);

    const pressed = useRef(false);

    const handleSignIn = () => {
        if (!pressed.current) {
            pressed.current = true;
            signInWithEmailAndPassword(auth, email, password)
            .then (async (userCredential) => {
                console.log('User Signed In!');

                const { challenge, completed, streak } = await loadToday(db, userCredential.user.uid);
                navigation.navigate("Home", { challenge, streak });
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
        <SafeAreaView style={styles.safeArea}>
            <BackButton navigation={navigation} />
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
            <View style={styles.topContainer}>
                <LargeImage src={location}/>
                <Text style={styles.title}>1% Challenge</Text>
            </View>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <View style={styles.inputContainer}>
                    <Image source={mail} style={styles.icon} resizeMode="contain" />
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => setEmail(text)}
                        placeholder="Email"
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="email"
                        keyboardType="email-address"
                    />
                </View>
                <View style={[styles.inputContainer, {marginBottom: 15}]}>
                    <Image source={lock} style={styles.icon} resizeMode="contain" />
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => setPassword(text)}
                        placeholder="Password"
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="off"
                    />
                    <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={10} style={styles.toggleButton}>
                        <Text style={styles.toggleText}>{showPassword ? "Hide" : "Show"}</Text>
                    </Pressable>
                </View>
                <Pressable style={[styles.buttoncontainer, {backgroundColor: scheme.cta}]} onPress={handleSignIn}>
                    <Text style={styles.buttontext}>Login</Text>
                </Pressable>
                <Pressable onPress={handleForgotPassword} style={styles.forgotRow} hitSlop={{ top: 12, bottom: 12 }}>
                    <Text style={styles.forgotText}>Forgot password?</Text>
                </Pressable>

                {/* Apple and Google sign-in mount here once Sign In with Apple is enabled on the App ID */}
            </KeyboardAvoidingView>
            <View style={styles.footer}>
                <Pressable onPress={() => navigation.navigate("Sign up")} hitSlop={{ top: 12, bottom: 12 }}>
                    <Text style={styles.signupText}>
                        Don't have an account? <Text style={styles.signupLink}>Sign up here</Text>
                    </Text>
                </Pressable>
                <PolicyLinks small color={scheme.muted} style={styles.policyLinks} />
            </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: scheme.bg,
        justifyContent: "center",
        alignItems: "center",
    },
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
        paddingTop: 16,
        // no bottom padding: the footer sets its own, and the SafeAreaView
        // already reserves the home indicator below that
        paddingBottom: 0,
    },
    topContainer: {
        justifyContent: "flex-end",
        alignItems: "center",
        marginBottom: 20,
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
    forgotRow: {
        marginTop: 12,
        alignItems: "center",
    },
    footer: {
        // sits as low as the layout allows while staying above the home indicator,
        // so a reviewer can still see the way to create an account without scrolling
        alignItems: "center",
        paddingTop: 28,
        paddingBottom: 0,
        gap: 8,
    },
    signupText: {
        color: scheme.text,
        fontSize: 15,
    },
    signupLink: {
        fontWeight: "bold",
        textDecorationLine: "underline",
    },
    forgotText: {
        // solid, not muted: this is a functional link, and muted white over coral
        // composites to roughly 2.0:1. The muted treatment is for the policy links.
        color: scheme.text,
        fontSize: 14,
        textDecorationLine: "underline",
    },
    title: {
        color: scheme.text,
        fontSize: 50,
        fontWeight: "bold",
    },
    buttoncontainer: {
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
    toggleButton: {
        paddingHorizontal: 12,
    },
    toggleText: {
        fontSize: 13,
        color: "rgba(43,39,36,0.45)",
    },
    policyLinks: {
        // spacing to the signup line comes from the footer's gap; this used to add
        // 24 on top of it, which read as two unrelated blocks
        marginTop: 0,
    },
});
