import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { Text, TouchableRipple } from 'react-native-paper';


import TabControl from "./components/TabControl";
import theme from './theme';

export default () => {
    // TODO wenn Zeit swipeable Element und noch Harden und co hinzufügen
    // TODO wenn Zeit iOS Animation 
    return (
      <View style={styles.container}>
        <TabControl
          values={['Giannis', 'LeBron', 'Luka']}
          onChange={value => {}}
        />
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.color.bg,
    padding: 8,
  },
});
