import { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, Alert, ActivityIndicator, StyleSheet } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";

import { isAppleAvailable, signInWithApple, signInWithGoogle, friendlySocialError } from "../lib/socialAuth";

const INK = "#2B2724";

// Both providers land here. onSignedIn receives { needsProfile, suggestedName }
// so the caller can send a brand new account to the profile step and an existing
// one straight to Home.
export default function SocialSignInButtons({ onSignedIn, dividerLabel = "or", muted }) {
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
                <View style={styles.buttonRow}>
                    {/* Apple's own button. Guideline 4.8 and their brand rules both
                        require the real control rather than an imitation. */}
                    <AppleAuthentication.AppleAuthenticationButton
                        buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
                        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                        cornerRadius={28}
                        style={styles.appleButton}
                        onPress={() => run("apple", signInWithApple)}
                    />
                </View>
            ) : null}

            <View style={styles.buttonRow}>
                {/* Google's own button, for the same reason: their brand guidelines
                    do not allow a redrawn mark. */}
                <View style={styles.googleClip}>
                    <GoogleSigninButton
                        size={GoogleSigninButton.Size.Wide}
                        color={GoogleSigninButton.Color.Light}
                        style={styles.googleButton}
                        onPress={() => run("google", signInWithGoogle)}
                        disabled={busy !== null}
                    />
                </View>
            </View>

            {busy ? (
                <View style={styles.busyRow}>
                    <ActivityIndicator color={muted ?? INK} />
                    <Text style={[styles.busyText, muted ? { color: muted } : null]}>Signing you in...</Text>
                </View>
            ) : null}

            <View style={styles.dividerRow}>
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
    googleClip: {
        width: 280,
        height: 52,
        borderRadius: 28,
        overflow: "hidden",
    },
    googleButton: {
        // slightly oversized inside the clip so its square corners are cut off
        // cleanly and no white shows at the rounded edges
        width: 292,
        height: 58,
        marginLeft: -6,
        marginTop: -3,
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
