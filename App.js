import * as React from "react";
import { View, StyleSheet } from "react-native";
import Constants from "expo-constants";

import TabControl from "./components/TabControl";
import theme from "./theme";

export default function App() {
  return (
    <View style={styles.container}>
      <TabControl
        values={["Giannis", "LeBron", "Luka"]}
        onChange={value => {
          console.log(value);
        }}
        renderSeparators
        iosVariant="move-animation"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    padding: 0,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.color.bg
  }
});
