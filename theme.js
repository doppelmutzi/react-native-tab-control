import { Platform } from "react-native";

export default {
  color: {
    bg: "#052D56",
    tabsContainerColor: "#073E75",
    borderColor: "#3779B2",
    inactiveTextColor: "white",
    activeBgColor: "#3779B2",
    activeTextColor: "white",
    separator: "#3779B2",
    ripple: "#053564"
  },
  fontSize: {
    l: 20,
    m: 15,
    s: 10
  },
  spacing: {
    xs: 3,
    s: 5,
    m: 7,
    l: 10,
    xl: 15
  },
  fontFamily: {
    normal: Platform.OS === "ios" ? "Cochin" : "Roboto"
  }
};
