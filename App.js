import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';


import TabControl from "./components/TabControl";
import theme from './theme';

export default () => {
  // TODO ios selektiertes element wird etwas kleiner (siehe maps / dm coupon)
  // TODO wenn Zeit iOS Animation 
  // TODO eigenes prop shape (interface für tab control)
  // TODO wenn Zeit swipeable Element und noch Harden und co hinzufügen
    
    return (
      <View style={styles.container}>
        <TabControl
          values={['Giannis', 'LeBron', 'Luka']}
          onChange={value => {}}
          renderSeparators
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
