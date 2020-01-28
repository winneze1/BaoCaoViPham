import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TextInput,
  Dimensions,
  TouchableOpacity
} from "react-native";

import bgImage from './images/Rain_Tanjim.jpg';
import logo from './images/logo.png'
import Icon from "react-native-vector-icons/Ionicons";

const { width: WIDTH } = Dimensions.get("window");

export default class login extends Component {
  constructor() {
    super();
    this.state = {
      showPass: true,
      press: false
    };
  }

  showPass = () => {
    if (this.state.press == false) {
      this.setState({ showPass: false, press: true });
    } else {
      this.setState({ showPass: true, press: false });
    }
  };

  render() {
    return (
      <ImageBackground source={bgImage} style={styles.backgroundContainer}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.logoText}>Báo Cáo Vi Phạm</Text>
        </View>

        <View style={styles.inputContainer}>
          <Icon
            name={"ios-person"}
            size={28}
            color={"rgba(255,255,255,0.7)"}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder={"Username"}
            placeholderTextColor="#ffffff"
            underlineColorAndroid="transparent"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon
            name={"ios-lock"}
            size={28}
            color={"rgba(255,255,255,0.7)"}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder={"Password"}
            secureTextEntry={this.state.showPass}
            placeholderTextColor={"rgba(255,255,255,0.7)"}
            underlineColorAndroid="transparent"
          />

          <TouchableOpacity
            style={styles.btnEye}
            onPress={this.showPass.bind(this)}
          >
            <Icon
              name={this.state.press == false ? "ios-eye" : "ios-eye-off"}
              size={26}
              color={"rgba(255,255,255,0.7)"}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btnLogin} >
          <Text style={styles.text}>Login</Text>
        </TouchableOpacity>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 50
  },
  logo: {
    width: 120,
    height: 120
  },
  inputContainer: {
    marginTop: 10
  },
  input: {
    width: WIDTH - 55,
    height: 45,
    borderRadius: 25,
    fontSize: 16,
    paddingLeft: 45,
    backgroundColor: "rgba(0,0,0,0.35)",
    color: "rgba(255,255,255,0.7)",
    marginHorizontal: 25
  },
  inputIcon: {
    position: "absolute",
    top: 8,
    left: 37
  },
  btnEye: {
    position: "absolute",
    top: 8,
    right: 37
  },
  btnLogin: {
    width: WIDTH - 55,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#005e00",
    justifyContent: "center",
    marginTop: 20
  },
  text: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
    textAlign: "center"
  }
});
