import { View, Text, Image, TextInput, Pressable, Alert, Keyboard, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, useWindowDimensions, Animated, Easing } from "react-native";
import React, { useState, useRef } from 'react';
import LargeImage from "../components/largeImage";
import PolicyLinks from "../components/policyLinks";
import SocialSignInButtons from "../components/socialSignInButtons";
import { AUTH_SCHEMES } from "../constants/theme";

import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from "../firebase";
import { friendlyAuthError } from "../authErrors";
import { loadToday } from "../lib/challenge";
import { prewarmCaches } from "../lib/prewarm";

const location = require("../assets/Location.png");
const mail = require("../assets/mail.png");
const lock = require("../assets/lock.png");

const scheme = AUTH_SCHEMES.coral;

export default function Login0Screen( {navigation} ) {

    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    const heroSize = Math.min(windowWidth * 0.65, windowHeight * 0.27, 260);

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [emailOpen, setEmailOpen] = useState(false);

    const pressed = useRef(false);
    const scrollRef = useRef(null);
    const scrollViewportHeight = useRef(0);
    const formSectionY = useRef(0);
    const emailToggleY = useRef(0);
    const emailPanelHeight = useRef(0);
    const emailReveal = useRef(new Animated.Value(0)).current;

    const toggleEmailLogin = () => {
        if (emailOpen) {
            Keyboard.dismiss();
            scrollRef.current?.scrollTo({ y: 0, animated: true });
            Animated.timing(emailReveal, {
                toValue: 0,
                duration: 180,
                easing: Easing.in(Easing.quad),
                useNativeDriver: false,
            }).start(() => setEmailOpen(false));
            return;
        }

        setEmailOpen(true);
        requestAnimationFrame(() => {
            Animated.timing(emailReveal, {
                toValue: 1,
                duration: 260,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: false,
            }).start(() => {
                // Move only far enough to keep the full expanded panel above
                // the pinned account footer. A measured target avoids the
                // overshoot and snap-back caused by scrollToEnd.
                const panelBottom = formSectionY.current + emailToggleY.current + 12 + emailPanelHeight.current;
                const targetY = Math.max(0, panelBottom - scrollViewportHeight.current + 12);
                scrollRef.current?.scrollTo({ y: targetY, animated: true });
            });
        });
    };

    const handleSignIn = () => {
        if (!pressed.current) {
            pressed.current = true;
            signInWithEmailAndPassword(auth, email, password)
            .then (async (userCredential) => {
                console.log('User Signed In!');

                prewarmCaches(db, userCredential.user.uid);
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
            <ScrollView
                ref={scrollRef}
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                contentInsetAdjustmentBehavior="automatic"
                showsVerticalScrollIndicator={false}
                bounces={false}
                alwaysBounceVertical={false}
                onLayout={({ nativeEvent }) => {
                    scrollViewportHeight.current = nativeEvent.layout.height;
                }}
            >
            <View style={styles.topContainer}>
                <LargeImage src={location} size={heroSize}/>
                <Text style={styles.title}>1% Challenge</Text>
            </View>
            <KeyboardAvoidingView
                style={styles.container}
                behavior="padding"
                onLayout={({ nativeEvent }) => {
                    formSectionY.current = nativeEvent.layout.y;
                }}
            >
                <SocialSignInButtons
                    muted={scheme.muted}
                    dividerLabel="or"
                    googleLabel="Sign in with Google"
                    onSignedIn={({ needsProfile, suggestedName }) => {
                        // someone signing in with Apple or Google for the first time
                        // has no username yet, so they finish setting up first
                        if (needsProfile) {
                            navigation.navigate("SignupProfile", { social: true, suggestedName });
                        } else {
                            navigation.reset({ index: 0, routes: [{ name: "Home" }] });
                        }
                    }}
                />

                {!emailOpen ? (
                    <Pressable
                        style={({ pressed: isPressed }) => [styles.emailLoginToggle, isPressed && styles.emailLoginTogglePressed]}
                        onPress={toggleEmailLogin}
                        onLayout={({ nativeEvent }) => {
                            emailToggleY.current = nativeEvent.layout.y;
                        }}
                        accessibilityRole="button"
                        accessibilityLabel="Log in with email"
                    >
                        <Text style={styles.emailLoginToggleText}>Log in with email</Text>
                    </Pressable>
                ) : null}

                {emailOpen ? (
                    <Animated.View
                        onLayout={({ nativeEvent }) => {
                            emailPanelHeight.current = nativeEvent.layout.height;
                        }}
                        style={[
                            styles.emailPanel,
                            {
                                maxHeight: emailReveal.interpolate({ inputRange: [0, 1], outputRange: [0, 230] }),
                                marginTop: emailReveal.interpolate({ inputRange: [0, 1], outputRange: [0, 12] }),
                                opacity: emailReveal,
                                transform: [{
                                    translateY: emailReveal.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] }),
                                }],
                            },
                        ]}
                    >
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
                    </Animated.View>
                ) : null}

            </KeyboardAvoidingView>
            </ScrollView>
            <View style={styles.footer}>
                <Pressable onPress={() => navigation.navigate("Sign up")} hitSlop={{ top: 12, bottom: 12 }}>
                    <Text style={styles.signupText}>
                        Don't have an account? <Text style={styles.signupLink}>Sign up here</Text>
                    </Text>
                </Pressable>
                <PolicyLinks small color={scheme.muted} style={styles.policyLinks} />
            </View>
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
        paddingBottom: 12,
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
    emailLoginToggle: {
        width: 280,
        height: 56,
        borderRadius: 28,
        backgroundColor: scheme.cta,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    emailLoginTogglePressed: {
        opacity: 0.86,
    },
    emailLoginToggleText: {
        color: scheme.ctaText,
        fontSize: 18,
        fontWeight: "600",
    },
    emailPanel: {
        width: 300,
        alignItems: "center",
        overflow: "hidden",
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
        // Outside the ScrollView so expanding the email accordion never moves
        // these account and policy links out of the viewport.
        flexShrink: 0,
        width: "100%",
        backgroundColor: scheme.bg,
        alignItems: "center",
        paddingTop: 12,
        paddingBottom: 8,
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
