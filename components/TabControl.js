import React, { useState, useEffect } from "react";
import {
  arrayOf,
  string,
  func,
  number,
  bool,
  node,
  oneOf,
  shape,
  object
} from "prop-types";
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
  ViewPropTypes
} from "react-native";
import * as Haptics from "expo-haptics";
import { PanGestureHandler } from "react-native-gesture-handler";

import theme from "../theme";

import iosTabControlStyles, {
  touchableHighlightColors,
  iosTabVerticalSpacing
} from "./iOSTabControlStyles";
import androidTabControlStyles from "./androidTabControlStyles";

const isIos = Platform.OS === "ios";

const wrapperStyles = StyleSheet.create({
  outerGapStyle: isIos ? { padding: theme.spacing.s } : { padding: 0 }
});

const tabControlStyles = isIos ? iosTabControlStyles : androidTabControlStyles;

export const iosVariants = [
  "scale-animation",
  "touchable-highlight",
  "move-animation"
];

const propTypeIosVariants = oneOf(iosVariants);

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
        onIndexChange={handleIndexChange}
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
};

export default TabControl;

function SegmentedControl({
  values: tabValues,
  selectedIndex,
  onIndexChange,
  renderSeparators,
  iosVariant
}) {
  return (
    <Container
      iosVariant={iosVariant}
      style={tabControlStyles}
      numberValues={tabValues.length}
      activeTabIndex={selectedIndex}
      onIndexChange={onIndexChange}
    >
      {tabValues.map((tabValue, index) => (
        <Tab
          label={tabValue}
          onPress={() => {
            onIndexChange(index);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }}
          isActive={selectedIndex === index}
          isFirst={index === 0}
          isLast={index === tabValues.length - 1}
          renderLeftSeparator={
            renderSeparators && shouldRenderLeftSeparator(index, selectedIndex)
          }
          key={tabValue}
          iosVariant={iosVariant}
        />
      ))}
    </Container>
  );
}

SegmentedControl.propTypes = {
  values: arrayOf(string).isRequired,
  onIndexChange: func.isRequired,
  renderSeparators: bool.isRequired,
  iosVariant: string.isRequired,
  selectedIndex: number
};

SegmentedControl.defaultProps = {
  selectedIndex: 0
};

function Container({
  iosVariant,
  children,
  numberValues,
  style,
  activeTabIndex,
  onIndexChange
}) {
  const { tabStyle, activeTabStyle, tabsContainerStyle } = style;

  const margin = theme.spacing.s;

  const [moveAnimation] = useState(new Animated.Value(0));
  const [containerWidth, setContainerWidth] = useState(0);
  useEffect(() => {
    const leftVal = (containerWidth / numberValues) * activeTabIndex;
    Animated.timing(moveAnimation, {
      toValue: leftVal,
      duration: 250
      // not supported by native animated module
      // useNativeDriver: true
    }).start();
  }, [containerWidth, activeTabIndex]);

  const onGestureEvent = evt => {
    const tabWidth = containerWidth / numberValues;
    let index = Math.floor(evt.nativeEvent.x / tabWidth);
    if (index > numberValues - 1) index = numberValues - 1;
    else if (index < 0) index = 0;
    if (index !== activeTabIndex) {
      onIndexChange(index);
    }
  };

  return isIos && iosVariant === "move-animation" ? (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <View
        style={[
          {
            marginHorizontal: margin,
            flexDirection: "row",
            position: "relative"
          },
          tabsContainerStyle
        ]}
        onLayout={event => {
          setContainerWidth(event.nativeEvent.layout.width);
        }}
      >
        <Animated.View
          style={{
            // works too
            // width: `${100 / numberValues}%`,
            width: containerWidth / numberValues,
            left: moveAnimation,
            top: iosTabVerticalSpacing,
            bottom: iosTabVerticalSpacing,
            position: "absolute",
            ...tabStyle,
            ...activeTabStyle
          }}
        ></Animated.View>
        {children}
      </View>
    </PanGestureHandler>
  ) : (
    <View
      style={[
        { marginHorizontal: margin, flexDirection: "row" },
        tabsContainerStyle
      ]}
    >
      {children}
    </View>
  );
}

Container.propTypes = {
  iosVariant: string.isRequired,
  children: node.isRequired,
  numberValues: number.isRequired,
  style: shape({
    tabsContainerStyle: ViewPropTypes.styles,
    tabStyle: ViewPropTypes.styles,
    tabTextStyle: ViewPropTypes.styles,
    activeTabStyle: ViewPropTypes.styles,
    activeTabTextStyle: ViewPropTypes.styles,
    firstTabStyle: ViewPropTypes.styles,
    lastTabStyle: ViewPropTypes.styles
  }).isRequired,
  onIndexChange: func.isRequired,
  activeTabIndex: number
};

Container.defaultProps = {
  activeTabIndex: 0
};

// Attempt with x/y to combine with scale animation
// function Container({
//   iosVariant,
//   children,
//   numberValues,
//   style,
//   activeTabIndex
// }) {
//   const { tabStyle, activeTabStyle, tabsContainerStyle } = style;

//   const margin = 4;

//   const [moveAnimation] = useState(new Animated.ValueXY({ x: 0, y: 0 }));
//   const [containerLayout, setContainerLayout] = useState({
//     width: 0,
//     height: 0,
//     x: 0,
//     y: 0
//   });

//   useEffect(() => {
//     const { x, y, width: containerWidth } = containerLayout;
//     const aniX = x + (containerWidth / numberValues) * activeTabIndex;
//     const aniY = y;
//     Animated.timing(moveAnimation, {
//       toValue: { x: aniX, y: aniY },
//       duration: 200
//       // useNativeDriver: true
//     }).start();
//   }, [containerLayout, activeTabIndex]);

//   const scaleValue = new Animated.Value(0);
//   const activeTabScale = scaleValue.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: [1, 0.97, 0.95]
//   });
//   const transformStyle = { transform: [{ scale: activeTabScale }] };
//   const timingProps = {
//     toValue: 1,
//     duration: 50,
//     easing: Easing.linear,
//     useNativeDriver: true
//   };

//   return iosVariant === "move-animation" ? (
//     <>
//       <Animated.View
//         style={[
//           {
//             // works too
//             // width: `${100 / numberValues}%`,
//             width: containerLayout.width / numberValues,
//             height: containerLayout.height,
//             ...tabStyle,
//             ...activeTabStyle,
//             position: "absolute"
//           },
//           moveAnimation.getLayout()
//         ]}
//       ></Animated.View>
//       <View
//         style={[
//           {
//             marginHorizontal: margin,
//             flexDirection: "row"
//           }
//           // PROBLEM layering
//           // tabsContainerStyle
//         ]}
//         onLayout={event => {
//           const { width, height, x, y } = event.nativeEvent.layout;
//           console.log(width, height, x, y);
//           setContainerLayout({ width, height, x, y });
//         }}
//       >
//         <TouchableHighlight
//           onPressIn={() => {
//             Animated.timing(scaleValue, timingProps).start();
//           }}
//           onPressOut={() => {
//             Animated.timing(scaleValue, {
//               ...timingProps,
//               toValue: 0
//             }).start();
//           }}
//         >
//           <Animated.View
//             style={[{ width: "100%", height: 50 }, transformStyle]}
//           >
//             {children}
//           </Animated.View>
//         </TouchableHighlight>
//       </View>
//     </>
//   ) : (
//     <View
//       style={[
//         { marginHorizontal: margin, flexDirection: "row" },
//         tabsContainerStyle
//       ]}
//     >
//       {children}
//     </View>
//   );
// }

function shouldRenderLeftSeparator(index, selectedIndex) {
  const isFirst = index === 0;
  const isSelected = index === selectedIndex;
  const isPrevSelected = index - 1 === selectedIndex;
  if (isFirst || isSelected || isPrevSelected) {
    return false;
  }
  return true;
}

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
  const transformStyle = { transform: [{ scale: activeTabScale }] };
  const animatedViewStyle = [isActive ? transformStyle : {}, tabControlStyle];
  const timingProps = {
    toValue: 1,
    duration: 50,
    easing: Easing.linear,
    useNativeDriver: true
  };
  return (
    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
      {renderLeftSeparator && (
        <View
          style={{
            height: "50%",
            width: 1,
            backgroundColor: theme.color.separator
          }}
        ></View>
      )}
      <TouchableWithoutFeedback
        onPressIn={() => {
          Animated.timing(scaleValue, timingProps).start();
          onPress();
        }}
        onPressOut={() => {
          Animated.timing(scaleValue, {
            ...timingProps,
            toValue: 0
          }).start();
        }}
      >
        <Animated.View style={animatedViewStyle}>{children}</Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};
const IosTouchableHighlightTab = ({
  isActive,
  children,
  style: tabControlStyle,
  onPress,
  renderLeftSeparator
}) => (
  <>
    {renderLeftSeparator && (
      <View
        style={{
          width: 1,
          marginTop: 8,
          marginBottom: 8,
          backgroundColor: theme.color.separator
        }}
      ></View>
    )}
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
}) => (
  <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
    {renderLeftSeparator && (
      <View
        style={{
          height: "50%",
          width: 1,
          backgroundColor: theme.color.separator
        }}
      ></View>
    )}
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={tabControlStyle}>{children}</View>
    </TouchableWithoutFeedback>
  </View>
);

const AndroidTab = ({ children, style: tabControlStyle, onPress }) => (
  <TouchableNativeFeedback
    onPress={onPress}
    background={TouchableNativeFeedback.Ripple(theme.color.ripple, true)}
    // https://reactnative.dev/docs/touchablenativefeedback.html#useforeground
    // useForeground={!!TouchableNativeFeedback.canUseNativeForeground()}
  >
    <View style={tabControlStyle}>{children}</View>
  </TouchableNativeFeedback>
);

const OsSpecificTab = ({ iosVariant, ...otherProps }) => {
  let IosTab;
  if (iosVariant === "scale-animation") {
    IosTab = IosScaleTab;
  } else if (iosVariant === "touchable-highlight") {
    IosTab = IosTouchableHighlightTab;
  } else {
    IosTab = IosMoveTab;
  }
  return isIos ? <IosTab {...otherProps} /> : <AndroidTab {...otherProps} />;
};

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

function Tab({
  label,
  onPress,
  isActive,
  isFirst,
  isLast,
  renderLeftSeparator,
  iosVariant
}) {
  const {
    tabStyle,
    tabTextStyle,
    activeTabStyle,
    activeTabTextStyle,
    firstTabStyle,
    lastTabStyle
  } = tabControlStyles;
  let hasActiveState = isActive;
  if (isIos && iosVariant === "move-animation") {
    // do not add active tab style because this is done by parent component (moveable layer)
    hasActiveState = false;
  }
  return (
    <OsSpecificTab
      isActive={isActive}
      onPress={onPress}
      style={[
        tabStyle,
        hasActiveState && activeTabStyle,
        isFirst && firstTabStyle,
        isLast && lastTabStyle
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
