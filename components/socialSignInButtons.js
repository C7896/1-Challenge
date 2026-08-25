import { useEffect, useRef, useState } from "react";
import { View, Text, Image, Pressable, Alert, ActivityIndicator, StyleSheet } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";

import { isAppleAvailable, signInWithApple, signInWithGoogle, friendlySocialError } from "../lib/socialAuth";
import { useVerticalScale } from "../lib/verticalScale";

const INK = "#2B2724";
const googleBrandButton = require("../assets/google-signin-brand.png");

// Both providers land here. onSignedIn receives { needsProfile, suggestedName }
// so the caller can send a brand new account to the profile step and an existing
// one straight to Home.
export default function SocialSignInButtons({
    onSignedIn,
    dividerLabel = "or",
    googleLabel = "Continue with Google",
    muted,
}) {
    const s = useVerticalScale();
    const [appleReady, setAppleReady] = useState(false);
    const [busy, setBusy] = useState(null);
    const running = useRef(false);

    useEffect(() => {
        let cancelled = false;
        isAppleAvailable().then((ok) => {
            if (!cancelled) {
                setAppleReady(ok);
            }
        });
        return () => { cancelled = true; };
    }, []);

    const run = async (provider, fn) => {
        if (running.current) {
            return;
        }
        running.current = true;
        setBusy(provider);
        try {
            const outcome = await fn();
            onSignedIn(outcome);
        } catch (error) {
            const friendly = friendlySocialError(error);
            // a cancelled sign in is not a failure and gets no alert
            if (friendly) {
                Alert.alert(friendly.title, friendly.body);
            }
        } finally {
            running.current = false;
            setBusy(null);
        }
    };

    return (
        <View style={styles.wrap}>
            {appleReady ? (
                <View style={[styles.buttonRow, { marginBottom: 10 * s }]}>
                    {/* Apple's own button. Guideline 4.8 and their brand rules both
                        require the real control rather than an imitation. */}
                    <AppleAuthentication.AppleAuthenticationButton
                        buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
                        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                        cornerRadius={28}
                        style={[styles.appleButton, { height: 52 * s }]}
                        onPress={() => run("apple", signInWithApple)}
                    />
                </View>
            ) : null}

            <View style={[styles.buttonRow, { marginBottom: 10 * s }]}>
                <Pressable
                    style={({ pressed }) => [
                        styles.googleButton,
                        { height: 52 * s },
                        pressed && styles.googleButtonPressed,
                        busy !== null && styles.googleButtonDisabled,
                    ]}
                    onPress={() => run("google", signInWithGoogle)}
                    disabled={busy !== null}
                    accessibilityRole="button"
                    accessibilityLabel={googleLabel}
                    accessibilityState={{ disabled: busy !== null, busy: busy === "google" }}
                >
                    {/* Crop the current Google "G" directly from Google's
                        pre-approved iOS button asset so the mark is never redrawn. */}
                    <View style={styles.googleLogoCrop} pointerEvents="none">
                        <Image source={googleBrandButton} style={styles.googleBrandAsset} resizeMode="stretch" />
                    </View>
                    <Text style={styles.googleButtonText}>{googleLabel}</Text>
                </Pressable>
            </View>

            {busy ? (
                <View style={styles.busyRow}>
                    <ActivityIndicator color={muted ?? INK} />
                    <Text style={[styles.busyText, muted ? { color: muted } : null]}>Signing you in...</Text>
                </View>
            ) : null}

            <View style={[styles.dividerRow, { marginTop: 8 * s, marginBottom: 16 * s }]}>
                <View style={[styles.rule, muted ? { backgroundColor: muted } : null]} />
                <Text style={[styles.dividerText, muted ? { color: muted } : null]}>{dividerLabel}</Text>
                <View style={[styles.rule, muted ? { backgroundColor: muted } : null]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        alignItems: "center",
        alignSelf: "stretch",
    },
    buttonRow: {
        alignItems: "center",
        marginBottom: 10,
    },
    appleButton: {
        width: 280,
        height: 52,
    },
    googleButton: {
        width: 280,
        height: 52,
        borderRadius: 26,
        borderWidth: 1,
        borderColor: "#747775",
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        shadowColor: "#2B2724",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 5,
        elevation: 3,
    },
    googleButtonPressed: {
        backgroundColor: "#F8F9FA",
        shadowOpacity: 0.06,
    },
    googleButtonDisabled: {
        opacity: 0.62,
    },
    googleLogoCrop: {
        width: 20,
        height: 20,
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
    },
    googleBrandAsset: {
        position: "absolute",
        width: 188,
        height: 44,
        left: -16,
        top: -12,
    },
    googleButtonText: {
        color: "#1F1F1F",
        fontSize: 14,
        lineHeight: 20,
        fontWeight: "500",
    },
    busyRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 6,
    },
    busyText: {
        color: INK,
        fontSize: 13,
    },
    dividerRow: {
        flexDirection: "row",
        alignItems: "center",
        width: 280,
        gap: 12,
        marginTop: 8,
        marginBottom: 16,
    },
    rule: {
        flex: 1,
        height: 1,
        backgroundColor: "rgba(43,39,36,0.25)",
    },
    dividerText: {
        color: INK,
        fontSize: 13,
    },
});
