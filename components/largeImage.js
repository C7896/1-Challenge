import { Image, StyleSheet } from "react-native";

export default function LargeImage( {src} ) {
    return (
        <Image source={src} style={styles.image} />
    );
}

const styles = StyleSheet.create({
    image: {
        width: 400,
        height: 400,
    },
});