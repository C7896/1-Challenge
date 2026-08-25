import { useWindowDimensions } from "react-native";

// These screens were laid out against a 852pt tall phone (iPhone 17). On a
// shorter one the fixed heights and paddings add up to more than the screen and
// the bottom of the page falls off the edge. Rather than reflowing the layout,
// which would make a small phone look like a different app, everything vertical
// shrinks by one factor. Phones at or above the reference height are untouched.
const REFERENCE_HEIGHT = 852;

export function useVerticalScale() {
    const { height } = useWindowDimensions();
    return Math.min(1, height / REFERENCE_HEIGHT);
}
