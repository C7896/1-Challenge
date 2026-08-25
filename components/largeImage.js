import { Image, StyleSheet, useWindowDimensions } from "react-native";

import { useVerticalScale } from "../lib/verticalScale";

// trimBottom is the fraction of the frame that is empty transparent pixels below
// the artwork. Pulling that much back off the bottom margin means the copy sits
// against the drawing itself rather than against the PNG's padding, which is
// what made the gap under each illustration look so large.
export default function LargeImage({ src, size: requestedSize, trimBottom = 0 }) {
    const windowWidth = useWindowDimensions().width;
    const scale = useVerticalScale();
    const size = (requestedSize ?? Math.min(windowWidth * 0.8, 400)) * scale;
    return (
        <Image
            source={src}
            style={[styles.image, { width: size, height: size, marginBottom: -size * trimBottom }]}
            resizeMode="contain"
            accessible={false}
        />
    );
}

const styles = StyleSheet.create({
    image: {
        aspectRatio: 1,
    },
});
