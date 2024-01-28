import { View, Text, StyleSheet, SafeAreaView, Pressable, useWindowDimensions } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect } from "react";

import { initializeApp, getApps, getApp } from 'firebase/app';
import { onAuthStateChanged, initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseConfig } from "../firebase-config";
import { getFirestore, collection, query, where, doc, getDocs, getDoc } from "firebase/firestore";

export default function SplashScreen({ navigation }) {

    const windowWidth = useWindowDimensions().width

    let app;
    let auth;

    if (!getApps().length) {
      try {
        app = initializeApp(firebaseConfig);
        auth = initializeAuth(app, {
          persistence: getReactNativePersistence(ReactNativeAsyncStorage),
        });
      } catch (error) {
        console.log("Error initializing app: ", error);
      }
    } else {
      app = getApp();
      auth = getAuth(app);
    }
    const db = getFirestore(app);

    const isFocused = useIsFocused();
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (isFocused) {
          print(user)
          if (user) {
            // User is signed in.
            // get challenge object from new-challenges.json if today's date is not in past-challenges.json
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            let day = new Date().getDate();
            let monthIndex = new Date().getMonth();
            let month = months[monthIndex];
            let year = new Date().getFullYear();

            let newChallenge = true;
            let nextChallenge;
            let index;
            // get today's challenge document reference
            const challengesRef = collection(db, 'challenges');
            const q = query(challengesRef, where('day', '==', day), where('month', '==', month), where('year', '==', year));

            // get today's challenge document data and store it in nextChallenge
            await getDocs(q)
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                // Access the document data here
                index = doc.id;
                nextChallenge = doc.data();
                });
            })
            .catch(error => {
                newChallenge = false;
                console.error('Error getting documents: ', error);
            });

            // check if user has already completed today's challenge (if it exists)
            if (index != undefined) {
                const journalRef = doc(db, "users", user.uid, "journals", index);

                await getDoc(journalRef)
                    .then(docSnapshot => {
                        if (docSnapshot.exists()) {
                            newChallenge = false;
                            console.log("Today's challenge has been completed");
                        } else {
                            console.log("Today's challenge has not been completed");
                        }
                    })
                    .catch(error => {
                        console.error("Error getting document: ", error);
                    })
            }

            let streak = 0;
              const userRef = doc(db, "users", user.uid);
              const userDoc = await getDoc(userRef)
              if (userDoc.exists()) {
                  userData = userDoc.data();
                  streak = userData.current_streak;
                  console.log("User's current streak: ", streak);
              } else {
                  console.log("User document not found.");
              }

            setTimeout(() => {
              navigation.navigate(newChallenge ? "Challenge1" : "Home Tabs", {challenge: nextChallenge, streak: streak,});
            }, 1000);
          } else {
            // No user is signed in.
            setTimeout(() => {
              navigation.navigate("Login0");
            }, 1000);
          }
        } else {
          console.log("Tried but not on splash");
        }
      });
      // Cleanup subscription on unmount
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }, [auth, isFocused]);


    return (
        <SafeAreaView style={styles.container}>
            <Pressable>
                <View style={styles.container}>
                    <Text style={[styles.title, {fontSize: windowWidth > 500 ? 70 : 35}]}>1%</Text>
                    <Text style={[styles.title, {fontSize: windowWidth > 500 ? 70 : 35}]}>Challenge</Text>
                </View>
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#A1D5AE",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        color: "white",
        fontWeight: "bold",
    },
});