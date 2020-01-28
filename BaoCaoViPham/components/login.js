import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Image,
  Alert,
  Platform,
  TouchableHighlight,
  Dimensions,
  TextInput
} from "react-native";
import firebase from "react-native-firebase";
import Button from "react-native-button";

export default class login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false
    };
  }

  onAnonymousLogin = () => {
    firebase
      .auth()
      .signInAnonymously()
      .then(() => {
        console.log(`Login successfully`);
        this.setState({
          isAuthenticated: true
        });
      })
      .catch(error => {
        console.log(`Login fail ${error}`);
      });
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          backgroundColor: "white",
          borderRadius: Platform.OS === "ios" ? 30 : 0
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
            margin: 40
          }}
        >
          Login with FireBase
        </Text>
        <Button
          containerStyle={{
            padding: 10,
            borderRadius: 4,
            backgroundColor: "#0080ff"
          }}
          style={{ fontSize: 18, color: "white" }}
          onPress={this.onAnonymousLogin}
        >
          Login anonymous{" "}
        </Button>
        <Text style={{ fontSize: 15, margin: 20 }}>
          {this.state.isAuthenticated === true
            ? "Login successfully in anonymous"
            : ""}
        </Text>
      </View>
    );
  }
}
