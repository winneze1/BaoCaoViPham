import React from 'react';
import {
  ActivityIndicator,
  Button,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';

export default class OtherScreen extends React.Component {
    
    _signOutAsync = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
      };

    render() {
      return (
        <View style={styles.container}>
          <Button title="I'm done, sign me out" onPress={this._signOutAsync} />
          <StatusBar barStyle="default" />
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});