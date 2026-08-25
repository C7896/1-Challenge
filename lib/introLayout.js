import { useWindowDimensions } from "react-native";

// The onboarding screens are laid out from the design's own 334 x 714 frame,
// scaled by one factor, the same approach Home uses. Every gap then keeps its
// proportion instead of drifting between a small phone and a large one.
const DW = 334;
const DH = 714;

// design-frame coordinates, read off the mock
const IMAGE_TOP = 111;
const IMAGE_HEIGHT = 338;
const BLOCK_LEFT = 33;
const STACK_BOTTOM = 66;

export function useIntroLayout() {
    const { width, height } = useWindowDimensions();
    const s = Math.min(width / DW, height / DH);
    const originX = (width - DW * s) / 2;
    const originY = (height - DH * s) / 2;

    return {
        image: {
            position: "absolute",
            left: originX,
            top: originY + IMAGE_TOP * s,
            width: DW * s,
            height: IMAGE_HEIGHT * s,
        },
        // copy, dots and button are one column anchored to the bottom, so a
        // screen with an extra line grows upward instead of running into the
        // button the way the "Why" screen did
        stack: {
            position: "absolute",
            left: originX + BLOCK_LEFT * s,
            right: originX + BLOCK_LEFT * s,
            bottom: originY + STACK_BOTTOM * s,
            alignItems: "flex-start",
        },
        title: { fontSize: 24 * s, fontWeight: "bold", marginBottom: 6 * s },
        body: { fontSize: 21 * s, lineHeight: 28 * s },
        reminder: { fontSize: 12 * s, marginTop: 10 * s },
        dots: { marginTop: 24 * s },
        button: {
            marginTop: 14 * s,
            minWidth: 130 * s,
            height: 38 * s,
            borderRadius: 19 * s,
            borderWidth: 1.5,
            paddingHorizontal: 18 * s,
            alignItems: "center",
            justifyContent: "center",
        },
        buttonText: { fontSize: 15 * s, fontWeight: "bold" },
    };
}
