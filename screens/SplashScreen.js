import { View, Text, StyleSheet, SafeAreaView, useWindowDimensions } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";

import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from "../firebase";
import { loadToday } from "../lib/challenge";

const INK = "#2B2724";

export default function SplashScreen({ navigation }) {

    const windowWidth = useWindowDimensions().width

    const isFocused = useIsFocused();

    const hasNavigated = useRef(false);

    useEffect(() => {
      const watchdog = setTimeout(() => {
        if (!hasNavigated.current) {
          hasNavigated.current = true;
          navigation.navigate("Login0");
        }
      }, 10000);

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (isFocused) {
          if (user) {
            // User is signed in.
            const { challenge, completed, streak } = await loadToday(db, user.uid);

            setTimeout(() => {
              if (!hasNavigated.current) {
                hasNavigated.current = true;
                clearTimeout(watchdog);
                navigation.navigate("Home", { challenge, streak });
              }
            }, 1000);
          } else {
            // No user is signed in.
            setTimeout(() => {
              if (!hasNavigated.current) {
                hasNavigated.current = true;
                clearTimeout(watchdog);
                navigation.navigate("Login0");
              }
            }, 100);
          }
        } else {
          console.log("Tried but not on splash");
        }
      });
      // Cleanup subscription on unmount
      return () => {
        clearTimeout(watchdog);
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }, [auth, isFocused]);


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <Text style={[styles.title, {fontSize: windowWidth > 500 ? 70 : 35}]}>1%</Text>
                <Text style={[styles.title, {fontSize: windowWidth > 500 ? 70 : 35}]}>Challenge</Text>
            </View>
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
        color: INK,
        fontWeight: "bold",
    },
});
