import * as React from "react";
import { Animated, Button, Text, View } from "react-native";
import { useStyleSelectors } from "selectors-react-native";

export default function App() {
  const boxStyle = useStyleSelectors({
    ios: {
      backgroundColor: "red",
    },
    android: {
      backgroundColor: "blue",
    },
  });

  return (
    <View style={{ flex: 1, backgroundColor: "red", paddingTop: 50 }}>
      <View style={[{ borderWidth: 1, height: 50, width: 50 }]} />
    </View>
  );
}
