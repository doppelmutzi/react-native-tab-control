import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  Platform
} from "react-native";
import { Switch, RadioButton } from "react-native-paper";

import Constants from "expo-constants";

import TabControl from "./components/TabControl";
import theme from "./theme";
// img ratio 1,7 for portrait
import imgLuka from "./assets/luka.jpg"; // source https://thegamehaus.com/nba/could-luka-doncic-win-the-2020-mvp/2019/11/24/
import imgGiannis from "./assets/giannis.jpg"; // source https://static01.nyt.com/images/2020/01/04/sports/03nba-takeaways3-print/merlin_166319154_b92292b2-1a0f-437d-a694-8a97b586227d-superJumbo.jpg?quality=90&auto=webp
import imgLeBron from "./assets/leBron.jpg"; // source https://images5.alphacoders.com/966/966886.jpg

import { androidTabBarHeight } from "./components/androidTabControlStyles";

export default function App() {
  console.disableYellowBox = true;

  const isIos = Platform.OS === "ios";
  const [showSeparatorsIos, setShowSeparatorsIos] = useState(true);
  const [variant, setVariant] = useState("move-animation");

  const [imgSource, setImgSource] = useState(imgGiannis);
  const [viewportWidth] = useState(Math.round(Dimensions.get("window").width));
  const [viewportHeight] = useState(
    Math.round(Dimensions.get("window").height)
  );

  return (
    <>
      <Image
        source={imgSource}
        style={{
          position: "absolute",
          left: 0,
          top: isIos
            ? 0 // the image should shine through the status bar
            : androidTabBarHeight + Constants.statusBarHeight,
          width: viewportWidth,
          height: viewportHeight
        }}
      />
      <View
        style={[
          styles.container,
          isIos
            ? { justifyContent: "flex-end" }
            : { justifyContent: "flex-start" }
        ]}
      >
        <View
          style={
            isIos
              ? styles.tabControlContainerIos
              : styles.tabControlContainerAndroid
          }
        >
          <TabControl
            values={["Giannis", "LeBron", "Luka"]}
            onChange={value => {
              if (value === "Giannis") {
                setImgSource(imgGiannis);
              } else if (value === "LeBron") {
                setImgSource(imgLeBron);
              } else {
                setImgSource(imgLuka);
              }
            }}
            renderSeparators={showSeparatorsIos}
            iosVariant={variant}
          />
          {isIos && renderVariantSwitcherIos()}
        </View>
      </View>
    </>
  );

  function renderVariantSwitcherIos() {
    const { s, xl } = theme.spacing;
    const { normal: fontFamily } = theme.fontFamily;
    const { labelColor } = theme.color;
    const Row = ({ children }) => (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: xl,
          marginBottom: xl
        }}
      >
        {children}
      </View>
    );
    const Label = ({ children }) => (
      <Text style={{ fontFamily, color: labelColor, marginRight: s }}>
        {children}
      </Text>
    );

    const RightAlignedView = ({ children }) => (
      <View
        style={{
          flex: 1,
          alignItems: "flex-end"
        }}
      >
        {children}
      </View>
    );

    return (
      <View style={{ marginVertical: xl }}>
        <Row>
          <Label>Show Separators</Label>
          <RightAlignedView>
            <Switch
              value={showSeparatorsIos}
              onValueChange={() => {
                setShowSeparatorsIos(!showSeparatorsIos);
              }}
            />
          </RightAlignedView>
        </Row>
        <Row>
          <Label>iOS Variant: TouchableHighlight</Label>
          <RightAlignedView>
            <RadioButton
              value="touchable-highlight"
              status={
                variant === "touchable-highlight" ? "checked" : "unchecked"
              }
              onPress={() => {
                setVariant("touchable-highlight");
              }}
            />
          </RightAlignedView>
        </Row>
        <Row>
          <Label>iOS Variant: On Press Animation</Label>
          <RightAlignedView>
            <RadioButton
              value="scale-animation"
              status={variant === "scale-animation" ? "checked" : "unchecked"}
              onPress={() => {
                setVariant("scale-animation");
              }}
            />
          </RightAlignedView>
        </Row>
        <Row>
          <Label>iOS Variant: Motion Animation</Label>
          <RightAlignedView>
            <RadioButton
              value="move-animation"
              status={variant === "move-animation" ? "checked" : "unchecked"}
              onPress={() => {
                setVariant("move-animation");
              }}
            />
          </RightAlignedView>
        </Row>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    paddingTop: Constants.statusBarHeight,
    width: "100%",
    height: "100%"
  },
  tabControlContainerIos: {
    paddingTop: 20,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.color.bg,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: theme.color.bg
  },
  tabControlContainerAndroid: {
    width: "100%",
    backgroundColor: theme.color.bg
  }
});
