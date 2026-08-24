import React, { useState } from 'react';
import { TouchableOpacity, Text, Alert, Modal, View, TextInput, Pressable, StyleSheet } from 'react-native';

import { EmailAuthProvider, reauthenticateWithCredential, deleteUser } from 'firebase/auth';
import { collection, doc, getDocs, deleteDoc, writeBatch } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { clearCachedUser } from '../lib/userCache';
import { cancelDailyNotification } from '../ScheduleNotification';

export default function DeleteAccountButton({ navigation }) {

    const [visible, setVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [busy, setBusy] = useState(false);

    const close = () => { setVisible(false); setPassword(''); };

    const runDelete = async () => {
        const user = auth.currentUser;
        if (user == null || !user.email) { close(); return; }
        if (password.length === 0) {
            Alert.alert("Enter your password", "Type your password to confirm.");
            return;
        }
        setBusy(true);
        try {
            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(user, credential);
        } catch (error) {
            setBusy(false);
            if (error.code === 'auth/too-many-requests') {
                Alert.alert("Too many attempts", "Please wait a few minutes and try again.");
            } else if (error.code === 'auth/network-request-failed') {
                Alert.alert("No connection", "Check your internet connection and try again.");
            } else {
                Alert.alert("That password did not match", "Check it and try again.");
            }
            return;
        }
        try {
            const journals = await getDocs(collection(db, "users", user.uid, "journals"));
            const refs = journals.docs.map((d) => d.ref);
            for (let i = 0; i < refs.length; i += 400) {
                const batch = writeBatch(db);
                refs.slice(i, i + 400).forEach((ref) => batch.delete(ref));
                await batch.commit();
            }
            await deleteDoc(doc(db, "users", user.uid));
        } catch (error) {
            setBusy(false);
            Alert.alert("Could not finish deleting", "Some entries may already have been removed. Please check your connection and tap Delete account again to finish.");
            return;
        }
        // stop the 9am reminder before the account goes away
        await cancelDailyNotification().catch(() => {});
        clearCachedUser();

        try {
            await deleteUser(user);
        } catch (error) {
            setBusy(false);
            Alert.alert("Almost done", "Your journal entries are deleted but your login is still active. Please tap Delete account once more.");
            return;
        }
        setBusy(false);
        close();
        navigation.reset({ index: 0, routes: [{ name: "Splash" }] });
    };

    return (
        <>
            <TouchableOpacity style={styles.button} onPress={() => setVisible(true)} accessibilityRole="button" accessibilityLabel="Delete account">
                <Text style={styles.text}>Delete account</Text>
            </TouchableOpacity>
            <Modal
                visible={visible}
                transparent
                animationType="fade"
                onRequestClose={close}
            >
                <View style={styles.backdrop}>
                    <View style={styles.card}>
                        <Text style={styles.title}>Delete your account</Text>
                        <Text style={styles.body}>
                            This permanently deletes your account and every journal entry you have written. It cannot be undone. Enter your password to confirm.
                        </Text>
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Password"
                            secureTextEntry
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!busy}
                        />
                        <TouchableOpacity style={styles.deleteButton} onPress={runDelete} disabled={busy}>
                            <Text style={styles.deleteButtonText}>{busy ? "Deleting..." : "Delete everything"}</Text>
                        </TouchableOpacity>
                        <Pressable onPress={close} disabled={busy} style={styles.cancelButton}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 13,
        alignSelf: "center",
    },
    text: {
        // sits on the green section now, where white measures about 1.8:1
        color: "#2B2724",
        fontSize: 15,
        textDecorationLine: "underline",
    },
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 24,
        width: "85%",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "black",
        marginBottom: 10,
    },
    body: {
        fontSize: 14,
        color: "black",
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 16,
        color: "black",
    },
    deleteButton: {
        backgroundColor: "#FF815E",
        borderRadius: 20,
        paddingVertical: 14,
        alignItems: "center",
        marginBottom: 12,
    },
    deleteButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    cancelButton: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        alignItems: "center",
        alignSelf: "center",
    },
    cancelText: {
        color: "#888",
        textAlign: "center",
        fontSize: 14,
    },
});
