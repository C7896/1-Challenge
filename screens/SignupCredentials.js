import { View, Text, Image, TextInput, Pressable, Alert, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import React, { useState } from 'react';
import LargeImage from "../components/largeImage";
import PolicyLinks from "../components/policyLinks";
import BackButton from "../components/backButton";
import { AUTH_SCHEMES } from "../constants/theme";
import { setDraft } from "../lib/signupDraft";

const emailPassword = require("../assets/auth-email-password.png");
const mail = require("../assets/mail.png");
const lock = require("../assets/lock.png");

const scheme = AUTH_SCHEMES.peach;

export default function SignupCredentials( {navigation} ) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleContinue = () => {
        const trimmedEmail = email.trim();
        if (trimmedEmail.length === 0) {
            Alert.alert("Add your email", "Enter the email address you want to use.");
            return;
        }
        // Catch a typo'd address here rather than after the next screen. Firebase
        // rejects it either way, but it used to do so only once the name and
        // username had already been filled in.
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmedEmail)) {
            Alert.alert("That email does not look right", "Check the address and try again.");
            return;
        }
        if (password.length < 8) {
            Alert.alert("Pick a longer password", "Passwords need at least 8 characters.");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Passwords do not match", "Check both password fields and try again.");
            return;
        }

        setDraft({ email: trimmedEmail, password });
        navigation.navigate("SignupProfile");
    }

    return(
        <SafeAreaView style={styles.safeArea}>
            <BackButton navigation={navigation} onLight />
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.topContainer}>
                    <LargeImage src={emailPassword}/>
                    <Text style={styles.title}>Your login details</Text>
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
                    <View style={styles.inputContainer}>
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
                    <View style={[styles.inputContainer, {marginBottom: 15}]}>
                        <Image source={lock} style={styles.icon} resizeMode="contain" />
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setConfirmPassword(text)}
                            placeholder="Confirm password"
                            secureTextEntry={!showConfirmPassword}
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoComplete="off"
                        />
                        <Pressable onPress={() => setShowConfirmPassword((v) => !v)} hitSlop={10} style={styles.toggleButton}>
                            <Text style={styles.toggleText}>{showConfirmPassword ? "Hide" : "Show"}</Text>
                        </Pressable>
                    </View>
                    <Pressable style={styles.buttoncontainer} onPress={handleContinue}>
                        <Text style={styles.buttontext}>Continue</Text>
                    </Pressable>
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
    toggleButton: {
        paddingHorizontal: 12,
    },
    toggleText: {
        fontSize: 13,
        color: "rgba(43,39,36,0.45)",
    },
    policyLinks: {
        marginTop: 24,
    },
});
