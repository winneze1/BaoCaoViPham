import React, { Component } from "react";
import {
  ActivityIndicator,
  Button,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Image,
  Alert,  BackHandler,  ToastAndroid
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import HeaderComponent from "./HeaderComponent";
import {  StackActions } from 'react-navigation';
let backHandlerClickCount = 0;
export default class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    let tabBarLabel = "Home";
    let tabBarIcon = () => (
      <Image
        source={require("../icons/house.png")}
        style={{ width: 26, height: 26, tintColor: "dodgerblue" }}
      />
    );
    return { tabBarLabel, tabBarIcon };
  };
  constructor(props) {
    super(props);
    this.state = {
      userToken: "",
      _didFocusSubscription: props.navigation.addListener('didFocus', payload =>
        BackHandler.addEventListener('hardwareBackPress', () => this.onBackButtonPressAndroid(payload)))
    };
  }

  componentWillUnmount() {
    if (this.state._didFocusSubscription) {
      this.state._didFocusSubscription.remove();
    }
  }

  onBackButtonPressAndroid = () => {
    const shortToast = message => {
      ToastAndroid.showWithGravityAndOffset(
          message,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          25,
          50
      )}

      const {
        clickedPosition
      } = this.state;
      backHandlerClickCount += 1;
      if ((clickedPosition !== 1)) {
        if ((backHandlerClickCount < 2)) {
          shortToast('Ấn lần nữa để thoát!');
        } else {
          BackHandler.exitApp();
        }
      }

      // timeout for fade and exit
      setTimeout(() => {
        backHandlerClickCount = 0;
      }, 2000);

      if (((clickedPosition === 1) &&
          (this.props.navigation.isFocused()))) {
        Alert.alert(
          'Exit Application',
          'Do you want to quit application?', [{
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          }, {
            text: 'OK',
            onPress: () => BackHandler.exitApp()
          }], {
            cancelable: false
          }
        );
      } else {
        this.props.navigation.dispatch(StackActions.pop({
          n: 1
        }));
      }
      return true;
    }
  
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <HeaderComponent navigation={this.props.navigation} />
        </View>
        <View style={styles.body}>
          <View style={styles._btnNavigate}>
            <Button title="Thêm đồ tìm thấy" onPress={this._gotoUpload} />
          </View>
          <View style={styles._btnNavigate}>
            <Button
              title="Xem các món đồ thất lạc"
              onPress={this._gotoShowData}
            />
          </View>
          <View style={styles._btnNavigate}>
            <Button title="Các trường hợp tìm thấy của tôi" onPress={this._gotoMyCases} />
          </View>
        </View>
      </View>
    );
  }

  _gotoShowData = () => {
    this.props.navigation.navigate("Show");
  };

  _gotoUpload = () => {
    this.props.navigation.navigate("Upload");
  };

  _gotoMyCases = () => {
    this.props.navigation.navigate("MyCases");
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate("Auth");
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    backgroundColor: "#1E90FF"
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  _btnNavigate: {
    paddingTop: 10
  }
});
