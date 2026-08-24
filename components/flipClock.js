import { useEffect, useRef, useState } from "react";
import { View, Text, Animated, Easing, StyleSheet } from "react-native";

// A split-flap card. When the digit changes the card folds through the middle,
// swaps its value while edge-on, then unfolds, which is how a real flip clock
// reads. rotateX on a small perspective gives the fold its depth.
function FlipDigit({ value, size }) {
    const [shown, setShown] = useState(value);
    const fold = useRef(new Animated.Value(0)).current;
    const previous = useRef(value);

    useEffect(() => {
        if (value === previous.current) {
            return;
        }
        previous.current = value;

        Animated.sequence([
            Animated.timing(fold, {
                toValue: 1,
                duration: 130,
                easing: Easing.in(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(fold, {
                toValue: 0,
                duration: 150,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();

        // swap the face while the card is edge-on, so the change is never seen
        const swap = setTimeout(() => setShown(value), 130);
        return () => clearTimeout(swap);
    }, [value, fold]);

    const rotateX = fold.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "90deg"] });

    return (
        <View style={[styles.card, { width: size * 0.66, height: size }]}>
            <Animated.View
                style={[
                    styles.face,
                    { transform: [{ perspective: 320 }, { rotateX }] },
                ]}
            >
                <Text style={[styles.digit, { fontSize: size * 0.56 }]}>{shown}</Text>
            </Animated.View>
            {/* the hinge the card folds along */}
            <View style={styles.hinge} pointerEvents="none" />
        </View>
    );
}

function Pair({ value, size }) {
    const text = String(value).padStart(2, "0");
    return (
        <View style={styles.pair}>
            <FlipDigit value={text[0]} size={size} />
            <FlipDigit value={text[1]} size={size} />
        </View>
    );
}

function Separator({ size }) {
    return <Text style={[styles.separator, { fontSize: size * 0.34 }]}>:</Text>;
}

// Shows whatever units are given. Hours are dropped once there are none left,
// so the last hour reads as minutes and seconds rather than a leading 00.
export default function FlipClock({ hours, minutes, seconds, size = 58, label }) {
    return (
        <View style={styles.wrap}>
            <View style={styles.row}>
                {hours > 0 ? (
                    <>
                        <Pair value={hours} size={size} />
                        <Separator size={size} />
                    </>
                ) : null}
                <Pair value={minutes} size={size} />
                <Separator size={size} />
                <Pair value={seconds} size={size} />
            </View>
            {label ? <Text style={styles.label}>{label}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        alignItems: "center",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    pair: {
        flexDirection: "row",
        gap: 4,
    },
    card: {
        backgroundColor: "#2B2724",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.35)",
        marginHorizontal: 2,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    face: {
        alignItems: "center",
        justifyContent: "center",
    },
    digit: {
        color: "white",
        fontWeight: "bold",
        fontVariant: ["tabular-nums"],
    },
    hinge: {
        position: "absolute",
        left: 0,
        right: 0,
        top: "50%",
        height: 1,
        backgroundColor: "rgba(0,0,0,0.55)",
    },
    separator: {
        color: "white",
        fontWeight: "bold",
        marginHorizontal: 5,
    },
    label: {
        color: "white",
        fontSize: 14,
        marginTop: 8,
        letterSpacing: 0.4,
    },
});
