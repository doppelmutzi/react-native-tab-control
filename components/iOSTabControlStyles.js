import { StyleSheet } from "react-native";

import theme from "../theme";

const {
  tabsContainerColor,
  inactiveTextColor,
  activeBgColor,
  activeTextColor
} = theme.color;

const borderRadius = 7;
const gap = 2;

export const iosTabVerticalSpacing = gap;

export default StyleSheet.create({
  tabsContainerStyle: {
    backgroundColor: tabsContainerColor,
    borderColor: tabsContainerColor,
    borderRadius,
    paddingTop: gap,
    paddingBottom: gap
  },
  tabStyle: {
    flex: 1,
    marginVertical: iosTabVerticalSpacing,
    borderRadius
    // marginLeft: 2 * gap,
    // marginRight: 2 * gap
  },
  tabTextStyle: {
    color: inactiveTextColor,
    fontFamily: theme.fontFamily.normal,
    fontSize: theme.fontSize.l,
    paddingVertical: 2 * gap,
    paddingHorizontal: 2 * gap,
    alignSelf: "center"
  },
  activeTabStyle: {
    backgroundColor: activeBgColor
  },
  activeTabTextStyle: {
    color: activeTextColor
  },
  firstTabStyle: { marginLeft: 0 },
  lastTabStyle: { marginRight: 0 }
});

export const touchableHighlightColors = {
  default: "#1D4F81",
  active: "#326EA2"
};
