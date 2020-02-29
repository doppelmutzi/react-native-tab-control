import { StyleSheet } from 'react-native';

import theme from "../theme"

const {
  tabsContainerColor,
  inactiveTextColor,
  activeBgColor,
   activeTextColor,
} = theme.color;

const borderRadius = 7;
const gap = 2;

// Refactoren um Ähnlichkeit zu dieser 3rd party lib aufzulösen
export default StyleSheet.create({
  tabsContainerStyle: {
    backgroundColor: tabsContainerColor,
    borderColor: tabsContainerColor,
    borderRadius,
    paddingTop: gap,
    paddingBottom: gap,
  },
  tabStyle: {
    flex: 1,
    borderRadius,
    marginLeft: 2 * gap,
    marginRight: 2 * gap,
  },
  tabTextStyle: {
    color: inactiveTextColor,
    fontFamily: theme.fontFamily.normal,
    fontSize: theme.fontSize.l,
    paddingVertical: 2 * gap,
    paddingHorizontal: 2 * gap,
    alignSelf: 'center',
  },
  activeTabStyle: {
    backgroundColor: activeBgColor,
  },
  activeTabTextStyle: {
    color: activeTextColor,
  },
  firstTabStyle: { marginLeft: gap },
  lastTabStyle: { marginRight: gap },
});

export const touchableHighlightColors = {
  default: '#1D4F81',
  active: '#326EA2',
};
