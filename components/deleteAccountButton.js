import React from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';

import { initializeApp } from 'firebase/app';
import { getAuth, deleteUser } from 'firebase/auth';
import { getFirestore, collection, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { firebaseConfig } from "../firebase-config";

export default function DeleteAccountButton({ navigation }) {

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    const deleteAccount = async () => {
        const user = auth.currentUser;
        if (user == null) {
            return;
        }
        try {
            const journals = await getDocs(collection(db, "users", user.uid, "journals"));
            await Promise.all(journals.docs.map((journal) => deleteDoc(journal.ref)));
            await deleteDoc(doc(db, "users", user.uid));
            await deleteUser(user);
            navigation.navigate("Splash");
        } catch (error) {
            if (error.code === "auth/requires-recent-login") {
                Alert.alert(
                    "Please sign in again",
                    "For security, sign out, sign back in, and then delete your account."
                );
            } else {
                Alert.alert("Could not delete account", error.message);
            }
        }
    };

    const confirmDelete = () => {
        Alert.alert(
            "Delete account?",
            "This permanently deletes your account and all of your journal entries. This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: deleteAccount },
            ]
        );
    };

    return (
        <TouchableOpacity style={styles.button} onPress={confirmDelete}>
            <Text style={styles.text}>Delete account</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 10,
        position: "absolute",
        top: 60,
        left: 15,
    },
    text: {
        color: "white",
        fontSize: 13,
        textDecorationLine: "underline",
    },
});
