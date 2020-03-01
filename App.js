import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';


import TabControl from "./components/TabControl";
import theme from './theme';

export default () => {
    // TODO wenn Zeit swipeable Element und noch Harden und co hinzufügen
    // TODO wenn Zeit iOS Animation 
    // TODO eigenes prop shape (interface für tab control)
    
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
