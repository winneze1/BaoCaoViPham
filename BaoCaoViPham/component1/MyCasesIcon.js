import React, { Component } from "react";
import { FlatList, Text, View, Image } from "react-native";

export default class MyCasesIcon extends Component {
  render() {
    return (
      <View>
        <Image
          source={require("../icons/info.png")}
          style={{ width: 26, height: 26, tintColor: "dodgerblue" }}
        />
      </View>
    );
  }
}
