import React, { Component } from "react";
import {
  ActivityIndicator,
  StatusBar,
  View,
  Text,
  Platform,
  TextInput,
  Alert,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Image
} from "react-native";
import firebase from "react-native-firebase";
import Button from "react-native-button";
import AsyncStorage from "@react-native-community/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import bgImage from "../icons/Rain_Tanjim.jpg";
import logo from "../icons/logo.png";
const { width: WIDTH } = Dimensions.get("window");
export default class SignInScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.unsubscriber = null;
    this.state = {
      isAuthenticated: false,
      typedEmail: "",
      typedPassword: "",
      user: null,
      showPass: true,
      press: false
    };
  }
  componentDidMount() {
    this.unsubscriber = firebase.auth().onAuthStateChanged(changedUser => {
      this.setState({ user: changedUser });
    });
  }
  componentWillUnmount() {
    if (this.unsubscriber) {
      this.unsubscriber();
    }
  }

  onRegister = () => {
    if (
      this.state.typedEmail.trim() === "" ||
      this.state.typedPassword.trim() === ""
    ) {
      alert("Không được bỏ trống");
      return;
    }
    firebase
      .auth()
      .createUserWithEmailAndPassword(
        this.state.typedEmail,
        this.state.typedPassword
      )
      .then(loggedInUser => {
        this.setState({ user: loggedInUser });
        alert(`Register with user : ${JSON.stringify(loggedInUser.toJSON())}`);
      })
      .catch(error => {
        alert(`Register fail with error: ${error}`);
      });
  };

  onAnonymousLogin = () => {
    firebase
      .auth()
      .signInAnonymously()
      .then(async () => {
        await AsyncStorage.setItem("email", "Guest");
        this.props.navigation.navigate("App");
      })
      .catch(error => {
        console.log(`Login failed. Error = ${error}`);
      });
  };

  onLogin = () => {
    if (
      this.state.typedEmail.trim() === "" ||
      this.state.typedPassword.trim() === ""
    ) {
      alert("Không được bỏ trống");
      return;
    }
    firebase
      .auth()
      .signInWithEmailAndPassword(
        this.state.typedEmail,
        this.state.typedPassword
      )
      .then(async () => {
        await AsyncStorage.setItem("email", this.state.typedEmail);
        this.props.navigation.navigate("App");
      })
      .catch(error => {
        alert(`Login fail with error: ${error}`);
      });
  };

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
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "tomato"
            }}
          >
            Tìm đồ thất lạc
          </Text>
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
            placeholderTextColor="#ffffff"
            underlineColorAndroid="transparent"
            keyboardType="email-address"
            placeholder="Enter your email"
            autoCapitalize="none"
            onChangeText={text => {
              this.setState({ typedEmail: text });
            }}
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
            keyboardType="default"
            placeholder="Enter your password"
            onChangeText={text => {
              this.setState({ typedPassword: text });
            }}
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

        <TouchableOpacity style={styles.btnLogin} onPress={this.onRegister}>
          <Text style={styles.text}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnLogin} onPress={this.onLogin}>
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
