import { Image, StyleSheet, useWindowDimensions } from "react-native";

export default function LargeImage( {src} ) {
    const windowWidth = useWindowDimensions().width;
    const size = Math.min(windowWidth * 0.8, 400);
    return (
        <Image source={src} style={[styles.image, { width: size, height: size }]} resizeMode="contain" accessible={false} />
    );
}

const styles = StyleSheet.create({
    image: {
        aspectRatio: 1,
    },
});