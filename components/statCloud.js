import { ImageBackground, Text, StyleSheet } from "react-native";

// One stat cloud. The design puts the caption above the value on the yellow and
// blue clouds and below it on the red one, so the order is a prop rather than
// two near-identical components.
export default function StatCloud({ source, aspectRatio, value, caption, captionFirst, style, imageRef }) {
    const captionLines = caption.split("\n");

    const captionBlock = captionLines.map((line, i) => (
        <Text key={i} numberOfLines={1} adjustsFontSizeToFit style={styles.caption}>{line}</Text>
    ));

    return (
        <ImageBackground
            source={source}
            resizeMode="stretch"
            imageRef={imageRef}
            style={[styles.cloud, { aspectRatio }, style]}
        >
            {captionFirst ? captionBlock : null}
            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.value}>{value}</Text>
            {captionFirst ? null : captionBlock}
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    cloud: {
        justifyContent: "center",
        alignItems: "center",
    },
    value: {
        color: "white",
        fontSize: 30,
        fontWeight: "bold",
    },
    caption: {
        color: "white",
        fontSize: 15,
        fontWeight: "600",
    },
});
