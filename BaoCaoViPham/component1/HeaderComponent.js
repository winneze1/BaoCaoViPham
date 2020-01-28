import React, { Component } from "react";
import { Text, View, Image, TouchableHighlight, Alert } from "react-native";
import Button from "react-native-button";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-community/async-storage";
export default class HeaderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ""
    };
  }
  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate("Auth");
  };

  _getUser = async () => {
    var value, collect;
    try {
      value = await AsyncStorage.getItem("email").then(value => {
        collect = value;
      });
    } catch (error) {
      console.log("Error: ", error);
    }
    {
      this.setState({
        email: collect
      });
    }
  };

  componentDidMount() {
    this._getUser();
  }

  render() {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around"
        }}
      >
        <Icon
          name="md-menu"
          size={50}
          onPress={() => this.props.navigation.toggleDrawer()}
        />
        <Text
          style={{
            fontSize: 15,
            fontWeight: "bold",
            paddingTop: "2%"
          }}
        >
          Welcome user {this.state.email}
        </Text>
        <Icon
          name="md-exit"
          size={50}
          onPress={() =>
            Alert.alert(
              "Đăng xuất",
              "Chắc chưa?",
              [
                {
                  text: "Cancel",
                  onPress: () => alert("Cancel Pressed!")
                },
                { text: "OK", onPress: this._signOutAsync }
              ],
              { cancelable: false }
            )
          }
        />
      </View>
    );
  }
}
