import React, { Component } from "react";
import {
  Text,
  View,
  Platform,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default class MenuDraw extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ""
    };
  }

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

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate("Auth");
  };

  componentDidMount() {
    this._getUser();
  }

  navLink(nav, text) {
    return (
      <TouchableOpacity
        style={{ height: 60}}
        onPress={() => this.props.navigation.navigate(nav)}
      >
        <Text style={styles.link}>{text}</Text>
      </TouchableOpacity>
    );
  }

  navLogout(text) {
    return (
      <TouchableOpacity
        style={{ height: 60}}
        onPress={this._signOutAsync}
      >
        <Text style={styles.link}>{text}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topLinks}>
          <View style={styles.profile}>
            <View style={styles.imgView}>
              <Image style={styles.img} source={require("../icons/a.jpg")} />
            </View>
            <View style={styles.profileText}>
              <Text style={styles.name}>{this.state.email}</Text>
            </View>
          </View>
        </View>
        <View style={styles.bottomLinks}>
          <View style={{ flexDirection: 'row' }}>
          <Icon
          name="md-home"
          size={40}
          />
          {this.navLink("Home", "Home")}
          </View>
          <View style={{ flexDirection: 'row' }}>
          <Icon
          name="md-cloud-upload"
          size={40}
          />
          {this.navLink("Upload", "Thêm đồ tìm thấy")}
          </View>
          <View style={{ flexDirection: 'row' }}>
          <Icon
          name="md-albums"
          size={40}
          />
          {this.navLink("Show", "Xem Đồ")}
          </View>
          <View style={{ flexDirection: 'row' }}>
          <Icon
          name="md-clipboard"
          size={40}
          />
          {this.navLink("MyCases", "Trường hợp của tôi")}
          </View>
          <View style={{ flexDirection: 'row' }}>
          <Icon
          name="md-log-out"
          size={40}
          />
          {this.navLogout("Logout")}
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.description} />
          <Text style={styles.version}>Version 1.1</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0091a7"
  },
  scroll: {
    flex: 1
  },
  profile: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 25,
    borderBottomWidth: 1,
    borderBottomColor: "black"
  },
  profileText: {
    flex: 3,
    flexDirection: "column",
    justifyContent: "space-around"
  },
  name: {
    fontSize: 20,
    paddingBottom: 5,
    color: "white",
    textAlign: "left"
  },
  imgView: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20
  },
  img: {
    height: 70,
    width: 70,
    borderRadius: 50
  },
  topLinks: {
    height: 160,
    backgroundColor: "lightgray"
  },
  bottomLinks: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 10,
    paddingBottom: 450
  },
  link: {
    flex: 1,
    fontSize: 16,
    padding: 5,
    paddingLeft: 15,
    margin: 4,
    textAlign: "left"
  },
  footer: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "lightgrey"
  },
  version: {
    flex: 1,
    textAlign: "right",
    marginRight: 20,
    color: "gray"
  },
  description: {
    flex: 1,
    marginLeft: 20,
    fontSize: 16
  }
});
