import { StyleSheet } from "react-native";

import theme from "../theme";

const { tabsContainerColor, borderColor, activeTextColor } = theme.color;

export const androidTabBarHeight = 40;

const fontStyles = {
  fontFamily: theme.fontFamily.normal,
  fontSize: theme.fontSize.l,
  color: activeTextColor
};

const gap = theme.spacing.s;

export default StyleSheet.create({
  tabsContainerStyle: {
    backgroundColor: tabsContainerColor,
    height: androidTabBarHeight
  },
  tabStyle: {
    flex: 1,
    paddingVertical: gap,
    paddingHorizontal: 2 * gap
  },
  tabTextStyle: { ...fontStyles, alignSelf: "center" },
  activeTabStyle: {
    borderBottomWidth: theme.spacing.xs,
    borderBottomColor: borderColor
  },
  activeTabTextStyle: {
    ...fontStyles
  },
  firstTabStyle: {},
  lastTabStyle: {}
});
