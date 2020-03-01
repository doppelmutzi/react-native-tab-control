import React, { useState } from 'react';
import { arrayOf, string, func, number, bool, node } from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableHighlight,
  TouchableNativeFeedback,
  ViewPropTypes,
} from 'react-native';

import theme from "../theme"

import iosTabControlStyles, {
  touchableHighlightColors,
} from './iOSTabControlStyles';
import androidTabControlStyles from './androidTabControlStyles';

const isIos = Platform.OS === 'ios';

const wrapperStyles = StyleSheet.create({
  outerGapStyle: isIos ? { padding: theme.spacing.s } : { padding: 0 },
});

const tabControlStyles = isIos ? iosTabControlStyles : androidTabControlStyles;

const TabControl = ({ values, onChange, renderSeparators }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleIndexChange = index => {
    setSelectedIndex(index);
    onChange(values[index]);
  };

  return (
    <View style={wrapperStyles.outerGapStyle}>
      <SegmentedControl
        values={values}
        selectedIndex={selectedIndex}
        onTabPress={handleIndexChange}
        renderSeparators={renderSeparators}
      />
    </View>
  );
};

TabControl.propTypes = {
  values: arrayOf(string).isRequired,
  onChange: func.isRequired,
  renderSeparators: bool
};

TabControl.defaultProps = {
  renderSeparators: false
}

export default TabControl;

function SegmentedControl({ values: tabValues, selectedIndex, onTabPress, renderSeparators }) {
  console.log(renderSeparators)
  const { tabsContainerStyle } = tabControlStyles;
  return (
    <View style={[{ flexDirection: 'row' }, tabsContainerStyle]}>
      {tabValues.map((tabValue, index) => (
        <Tab
          label={tabValue}
          onPress={() => onTabPress(index)}
          isActive={selectedIndex === index}
          isFirst={index === 0}
          isLast={index === tabValues.length - 1}
          renderLeftSeparator={renderSeparators && shouldRenderLeftSeparator(index, selectedIndex)}
          key={tabValue}
        />
      ))}
    </View>
  );
}

function shouldRenderLeftSeparator(index, selectedIndex) {
  const isFirst = index === 0;
  const isSelected = index === selectedIndex;
  const isPrevSelected = index - 1 === selectedIndex;
  console.log(index, selectedIndex, isFirst, isSelected, isPrevSelected);
  if (isFirst || isSelected || isPrevSelected) {
    return false;
  }
  return true;
}

SegmentedControl.propTypes = {
  values: arrayOf(string).isRequired,
  onTabPress: func.isRequired,
  renderSeparators: bool.isRequired,
  selectedIndex: number
};

SegmentedControl.defaultProps = {
  selectedIndex: 0,
};

const OsSpecificTouchableHighlight = ({
  isActive,
  children,
  style: tabControlStyle,
  onPress,
  renderLeftSeparator
}) =>
// TODO ios selektiertes element wird etwas kleiner (siehe maps / dm coupon)
  isIos ? (
    <>
      {renderLeftSeparator && <View style={{width: 1, marginTop: 8, marginBottom: 8, backgroundColor: theme.color.separator}}></View>}
      <TouchableHighlight
      underlayColor={
        isActive
        ? touchableHighlightColors.active
        : touchableHighlightColors.default
      }
      style={tabControlStyle}
      onPress={onPress}
      >
      {children}
      </TouchableHighlight>
    </>
    ) : (
    <TouchableNativeFeedback
      onPress={onPress}
      background={TouchableNativeFeedback.Ripple(theme.color.ripple, true)}
      // useForeground={!!TouchableNativeFeedback.canUseNativeForeground()}
    >
      <View style={tabControlStyle}>{children}</View>
    </TouchableNativeFeedback>
  );

OsSpecificTouchableHighlight.propTypes = {
  children: node.isRequired,
  onPress: func.isRequired,
  style: arrayOf(ViewPropTypes.style).isRequired,
  isActive: bool,
  renderLeftSeparator: bool
};

OsSpecificTouchableHighlight.defaultProps = {
  isActive: false,
  renderLeftSeparator: false
};

function Tab({ label, onPress, isActive, isFirst, isLast, renderLeftSeparator }) {
  const {
    tabStyle,
    tabTextStyle,
    activeTabStyle,
    activeTabTextStyle,
    firstTabStyle,
    lastTabStyle,
  } = tabControlStyles;
  return (
    <OsSpecificTouchableHighlight
      isActive={isActive}
      onPress={onPress}
      style={[
        tabStyle,
        isActive ? activeTabStyle : {},
        isFirst ? firstTabStyle : {},
        isLast ? lastTabStyle : {},
      ]}
      renderLeftSeparator={renderLeftSeparator}
    >
      <Text style={[tabTextStyle, isActive ? activeTabTextStyle : {}]}>
        {label}
      </Text>
    </OsSpecificTouchableHighlight>
  );
}

Tab.propTypes = {
  label: string.isRequired,
  onPress: func.isRequired,
  isActive: bool.isRequired,
  isFirst: bool.isRequired,
  isLast: bool.isRequired,
  renderLeftSeparator: bool.isRequired
};
