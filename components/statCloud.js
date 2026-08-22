import { ImageBackground, Text, StyleSheet } from "react-native";

// One stat cloud. The design puts the caption above the value on the yellow and
// blue clouds and below it on the red one, so the order is a prop rather than
// two near-identical components.
export default function StatCloud({ source, aspectRatio, value, caption, captionFirst, style, imageRef, scale = 1 }) {
    const captionLines = caption.split("\n");

    const captionBlock = captionLines.map((line, i) => (
        <Text key={i} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6} style={[styles.caption, { fontSize: 15 * scale }]}>{line}</Text>
    ));

    return (
        <ImageBackground
            source={source}
            resizeMode="stretch"
            imageRef={imageRef}
            style={[styles.cloud, { aspectRatio }, style]}
        >
            {captionFirst ? captionBlock : null}
            <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.5} style={[styles.value, { fontSize: 30 * scale }]}>{value}</Text>
            {captionFirst ? null : captionBlock}
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    cloud: {
        justifyContent: "center",
        alignItems: "center",
    },
    // sizes are set inline from the screen scale; adjustsFontSizeToFit is iOS
    // only, so on Android an oversized string would tail-truncate instead of
    // shrinking. Keeping the value short is what actually protects it.
    value: {
        color: "white",
        fontWeight: "bold",
    },
    caption: {
        color: "white",
        fontWeight: "600",
    },
});
