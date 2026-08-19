import { View, Text, Image, TextInput, Pressable, Alert, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import React, { useState, useRef } from 'react';
import LargeImage from "../components/largeImage";
import LoginScreenButton from "../components/loginScreenButton";

import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from "../firebase";
import { friendlyAuthError } from "../authErrors";
import { loadToday } from "../lib/challenge";

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
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
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
                        keyboardType="email-address"
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
                <Pressable onPress={handleForgotPassword} style={styles.forgotRow} hitSlop={{ top: 12, bottom: 12 }}>
                    <Text style={styles.forgotText}>Forgot password?</Text>
                </Pressable>
                <Pressable style={[styles.buttoncontainer, {backgroundColor:"#FFC0A2"}]} onPress={handleSignIn}>
                    <Text style={styles.buttontext}>Login</Text>
                </Pressable>
            </KeyboardAvoidingView>
            <View style={[styles.container, {justifyContent: "flex-end", paddingBottom: 40}]}>
                <LoginScreenButton title="Sign up" nav={navigation} dest="Sign up" background={false} />
            </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const INK = "#2B2724";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FF815E",
        justifyContent: "center",
        alignItems: "center",
    },
    safeArea: {
        flex: 1,
        backgroundColor: "#FF815E",
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
        color: INK,
        fontSize: 22,
        fontWeight: "bold",
    },
});