import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Dimensions, Platform } from "react-native";
import Constants from "expo-constants";

import TabControl from "./components/TabControl";
import theme from "./theme";
// img ratio 1,7 for portrait
import imgLuka from "./assets/luka.jpg"; // source https://thegamehaus.com/nba/could-luka-doncic-win-the-2020-mvp/2019/11/24/
import imgGiannis from "./assets/giannis.jpg"; // source https://static01.nyt.com/images/2020/01/04/sports/03nba-takeaways3-print/merlin_166319154_b92292b2-1a0f-437d-a694-8a97b586227d-superJumbo.jpg?quality=90&auto=webp
import imgLeBron from "./assets/leBron.jpg"; // source https://img.bleacherreport.net/img/images/photos/003/846/523/hi-res-6a5bbbd06990dfdf097b936c2966afae_crop_north.jpg?h=533&w=800&q=70&crop_x=center&crop_y=top

export default function App() {
  const [imgSource, setImgSource] = useState(imgGiannis);
  const [viewportWidth] = useState(Math.round(Dimensions.get("window").width));
  const [viewportHeight] = useState(
    Math.round(Dimensions.get("window").height)
  );

  return (
    <>
      <Image
        source={imgSource}
        style={{ width: viewportWidth, height: viewportHeight }}
      />
      <View
        style={[
          styles.container,
          Platform.OS === "ios"
            ? { justifyContent: "flex-end" }
            : { justifyContent: "flex-start" }
        ]}
      >
        <View
          style={
            Platform.OS === "ios"
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
            renderSeparators
            iosVariant="move-animation"
          />
        </View>
      </View>
    </>
  );
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
    paddingBottom: 40,
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
