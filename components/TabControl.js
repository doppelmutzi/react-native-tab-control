import React, { useState } from 'react';
import { arrayOf, string, func, number, bool, node, oneOf} from 'prop-types';
import {
  View,
  Text,
  Animated,
  Easing,
  StyleSheet,
  Platform,
  TouchableHighlight,
  TouchableWithoutFeedback,
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
  const { tabsContainerStyle } = tabControlStyles;
  return (
    <View style={[{ flexDirection: 'row' }, tabsContainerStyle]}>
      {tabValues.map((tabValue, index) => (
        <Tab
          label={tabValue}
          onPress={() => {
            onTabPress(index);
          }}
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

const IosAnimatedTab = ({
  isActive,
  children,
  style: tabControlStyle,
  onPress,
  renderLeftSeparator
}) => {
  let scaleValue = new Animated.Value(0);
  const activeTabScale = scaleValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.97, 0.95]
  });
  const transformStyle = {transform: [{ scale: activeTabScale }]};
  const animatedViewStyle = [isActive ? transformStyle : {}, tabControlStyle];
  return  (
    <View style={{flex: 1, flexDirection: "row", alignItems: "center"}}>
      {renderLeftSeparator && <View style={{height: "50%", width: 1, backgroundColor: theme.color.separator}}></View>}
      <TouchableWithoutFeedback 
      onPressIn={() => {
          scaleValue.setValue(0);
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: 50,
            easing: Easing.linear,
            useNativeDriver: true
          }).start();
  
          onPress();
        }}
        onPressOut={() => {
          Animated.timing(scaleValue, {
            toValue: 0,
            duration: 50,
            easing: Easing.linear,
            useNativeDriver: true
          }).start();
        }}
      >
        <Animated.View style={animatedViewStyle}>
          {children}
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
    )
}
const IosTouchableHighlightTab = ({
  isActive,
  children,
  style: tabControlStyle,
  onPress,
  renderLeftSeparator
}) =>  (
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
  );

const AndroidTab = ({
    children,
    style: tabControlStyle,
    onPress
  }) => (
  <TouchableNativeFeedback
    onPress={onPress}
    background={TouchableNativeFeedback.Ripple(theme.color.ripple, true)}
    // useForeground={!!TouchableNativeFeedback.canUseNativeForeground()}
  >
    <View style={tabControlStyle}>{children}</View>
  </TouchableNativeFeedback>
);

const OsSpecificTab = (props) => {
  const IosTab = props.iosVariant === "scale-animation" ? IosAnimatedTab : IosTouchableHighlightTab;
  return isIos ? <IosTab  {...props} />
  : <AndroidTab {...props} />
}

OsSpecificTab.propTypes = {
  children: node.isRequired,
  onPress: func.isRequired,
  style: arrayOf(ViewPropTypes.style).isRequired,
  isActive: bool,
  renderLeftSeparator: bool
};

OsSpecificTab.defaultProps = {
  isActive: false,
  renderLeftSeparator: false
};

function Tab({ label, onPress, isActive, isFirst, isLast, renderLeftSeparator, iosVariant }) {
  const {
    tabStyle,
    tabTextStyle,
    activeTabStyle,
    activeTabTextStyle,
    firstTabStyle,
    lastTabStyle,
  } = tabControlStyles;
  return (
    <OsSpecificTab
      isActive={isActive}
      onPress={onPress}
      style={[
        tabStyle,
        isActive ? activeTabStyle : {},
        isFirst ? firstTabStyle : {},
        isLast ? lastTabStyle : {},
      ]}
      renderLeftSeparator={renderLeftSeparator}
      iosVariant={iosVariant}
    >
      <Text style={[tabTextStyle, isActive ? activeTabTextStyle : {}]}>
        {label}
      </Text>
    </OsSpecificTab>
  );
}

Tab.propTypes = {
  label: string.isRequired,
  onPress: func.isRequired,
  isActive: bool.isRequired,
  isFirst: bool.isRequired,
  isLast: bool.isRequired,
  renderLeftSeparator: bool.isRequired,
  iosVariant: oneOf(["scale-animation", "touchable-highlight"])
};

Tab.defaultProps = {
  iosVariant: "scale-animation"
}
