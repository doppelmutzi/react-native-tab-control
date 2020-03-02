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

const propTypeIosVariants = oneOf(["scale-animation", "touchable-highlight", "move-animation"])

const TabControl = ({ values, onChange, renderSeparators, iosVariant }) => {
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
        iosVariant={iosVariant}
        renderSeparators={renderSeparators}
      />
    </View>
  );
};

TabControl.propTypes = {
  values: arrayOf(string).isRequired,
  onChange: func.isRequired,
  iosVariant: propTypeIosVariants.isRequired,
  renderSeparators: bool
};

TabControl.defaultProps = {
  renderSeparators: false
}

export default TabControl;

// TODO 2 different containers. Extra container mit moving part for iosVariant === "move-animation"
function SegmentedControl({ values: tabValues, selectedIndex, onTabPress, renderSeparators, iosVariant }) {
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
          iosVariant={iosVariant}
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
  iosVariant: string.isRequired,
  selectedIndex: number
};

SegmentedControl.defaultProps = {
  selectedIndex: 0,
};

const IosScaleTab = ({
  isActive,
  children,
  style: tabControlStyle,
  onPress,
  renderLeftSeparator
}) => {
  const scaleValue = new Animated.Value(0);
  const activeTabScale = scaleValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.97, 0.95]
  });
  const transformStyle = {transform: [{ scale: activeTabScale }]};
  const animatedViewStyle = [isActive ? transformStyle : {}, tabControlStyle];
  const timingProps = {
    toValue: 1,
    duration: 50,
    easing: Easing.linear,
    useNativeDriver: true
  };
  return  (
    <View style={{flex: 1, flexDirection: "row", alignItems: "center"}}>
      {renderLeftSeparator && <View style={{height: "50%", width: 1, backgroundColor: theme.color.separator}}></View>}
      <TouchableWithoutFeedback 
      onPressIn={() => {
          Animated.timing(scaleValue, timingProps).start();
          onPress();
        }}
        onPressOut={() => {
          Animated.timing(scaleValue, {
            ...timingProps,
            toValue: 0,
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
      // https://reactnative.dev/docs/touchablehighlight#underlaycolor
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

// TODO remove code duplicates for separator (jsx)

const IosMoveTab = ({
  children,
  style: tabControlStyle,
  onPress,
  renderLeftSeparator
}) =>  (
  <View style={{flex: 1, flexDirection: "row", alignItems: "center"}}>
  {
    renderLeftSeparator && <View style={{height: "50%", width: 1, backgroundColor: theme.color.separator}}></View>
  }
    <TouchableWithoutFeedback
    onPress={onPress}>
    <View style={tabControlStyle}>
        {children}
      </View>
    </TouchableWithoutFeedback>
  </View>
);



const AndroidTab = ({
    children,
    style: tabControlStyle,
    onPress
  }) => (
  <TouchableNativeFeedback
    onPress={onPress}
    background={TouchableNativeFeedback.Ripple(theme.color.ripple, true)}
    // https://reactnative.dev/docs/touchablenativefeedback.html#useforeground
    // useForeground={!!TouchableNativeFeedback.canUseNativeForeground()}
  >
    <View style={tabControlStyle}>{children}</View>
  </TouchableNativeFeedback>
);

const OsSpecificTab = ({iosVariant, ...otherProps}) => {
  let IosTab;
  if (iosVariant === "scale-animation") {
    IosTab = IosScaleTab;
  }
  else if (iosVariant === "touchable-highlight") {
    IosTab = IosTouchableHighlightTab;
  }
  else {
    IosTab = IosMoveTab;
  }
  return isIos ? <IosTab  {...otherProps} />
  : <AndroidTab {...otherProps} />
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
  let hasActiveState = isActive;
  if (isIos && iosVariant === "move-animation") {
    // do not add active tab style because this is done by parent component (moveable layer)
    hasActiveState = false
  }
  return (
    <OsSpecificTab
      isActive={isActive}
      onPress={onPress}
      style={[
        tabStyle,
        hasActiveState && activeTabStyle,
        isFirst && firstTabStyle,
        isLast && lastTabStyle,
      ]}
      renderLeftSeparator={renderLeftSeparator}
      iosVariant={iosVariant}
    >
      <Text style={[tabTextStyle, isActive && activeTabTextStyle]}>
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
  iosVariant: string.isRequired
};
