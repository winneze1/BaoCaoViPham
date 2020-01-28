import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TextInput,
  Keyboard,
  Picker,
  PermissionsAndroid
} from "react-native";

import ImagePicker from "react-native-image-crop-picker";
import firebase from "react-native-firebase";
import Button from "react-native-button";
import uuid from "uuid/v4"; // Import UUID to generate UUID
import AsyncStorage from "@react-native-community/async-storage";
import HeaderCompnent from "./HeaderComponent";

import { getItemFromAsyncStorage } from "./Function";
const LearnAppRef = firebase.database().ref("LearnApp/cases");
export default class UploadScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    let tabBarLabel = "Báo Cáo";
    let tabBarIcon = () => (
      <Image
        source={require("../icons/upload.png")}
        style={{ width: 26, height: 26, tintColor: "dodgerblue" }}
      />
    );
    return { tabBarLabel, tabBarIcon };
  };

  constructor() {
    super();
    this.state = {
      imagePickArrayRef: [],
      imagePickArray: [],
      imageShowArray: [],
      image: null,
      typeDescription: "",
      typeViolation: "An Toàn Giao Thông",
      email: "",
      shortEmail: "",
      proofs: [],
      reason: ""
    };
  }

  async requestPermission() {
    try {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
    } catch (err) {
      alert(`${err.toString()}`);
    }
  }

  pickSingleWithCamera(mediaType = "photo") {
    ImagePicker.openCamera({
      width: 500,
      height: 500,
      includeExif: true,
      mediaType
    })
      //day image vao mang roi lay mang do ra map
      .then(image => {
        console.log(this.state.imagePickArray);
        this.setState({
          imagePickArrayRef: [...this.state.imagePickArrayRef, image]
        });
      })
      .then(imagePickArray => {
        this.setState({
          imagePickArray: this.state.imagePickArrayRef.map(i => {
            return {
              uri: i.path,
              width: i.width,
              height: i.height,
              mime: i.mime
            };
          })
        });
      })
      .catch(e => alert(e));
  }

  pickMultiple() {
    ImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: false,
      includeExif: true,
      forceJpg: true
    })
      .then(imagePickArray => {
        ///console.log(imagePickArray);
        this.setState({
          imagePickArray: imagePickArray.map(i => {
            return {
              uri: i.path,
              width: i.width,
              height: i.height,
              mime: i.mime
            };
          })
        });
        console.log(this.state.imagePickArray);
      })
      .catch(e => alert(e));
  }

  setProofs(url, width, height, mime, filename) {
    const proof = {
      filename: filename,
      url: url,
      width: width,
      height: height,
      mime: mime
    };
    this.setState({
      proofs: [...this.state.proofs, proof]
    });
  }
  async uploadImageArray(imagePickArray) {
    for (var i = 0; i < imagePickArray.length; i++) {
      var uri = imagePickArray[i].uri;
      var width = imagePickArray[i].width;
      var height = imagePickArray[i].height;
      var mime = imagePickArray[i].mime;

      var ext = uri.split(".").pop(); // Extract image extension
      var filename = `${uuid()}.${ext}`; // Generate unique name

      // Stop loop to wait until this function finished
      await new Promise((resolve, reject) => {
        const imageRef = firebase
          .storage()
          .ref(`LearnApp/${this.state.shortEmail}/images`)
          .child(filename);

        return imageRef
          .put(uri, { contentType: mime })
          .then(() => {
            return imageRef.getDownloadURL();
          })
          .then(url => {
            resolve(url);
            this.setProofs(url, width, height, mime, filename);
          })
          .catch(error => {
            console.log(`Some files upload failed`);
            reject(error);
            console.log("Error uploading image: ", error);
          });
      });
    }
    alert("All files uploaded successfully");
  }

  async componentDidMount() {
    await this.requestPermission();
    const email = await getItemFromAsyncStorage("email");
    const shortEmail = email.split("@").shift();
    this.setState({
      email: email,
      shortEmail: shortEmail
    });
  }

  // Link from storage to Realtime Database
  async submit() {
    if (
      this.state.typeDescription.trim() === "" ||
      this.state.typeViolation.trim() === ""
    ) {
      alert("Mô tả và Vi phạm không được bỏ trống");
      return;
    }
    try {
      await this.uploadImageArray(this.state.imagePickArray);
      const truongHop = {
        id: require("random-string")({ length: 10 }),
        uploader: this.state.email,
        description: this.state.typeDescription,
        violation: this.state.typeViolation,
        status: "Đang chờ xử lý",
        proofs: this.state.proofs,
        reason: ""
      };
      LearnAppRef.push(truongHop);
      this.setState({
        proofs: []
      });
      alert("Submit successfully !");
    } catch (error) {
      alert(error);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.subViewContainer}>
          <View>
            <Text>Vui lòng nhập chi tiết lỗi vi phạm</Text>
          </View>
          <View>
            <TextInput
              style={{
                height: 100,
                width: 300,
                margin: 20,
                padding: 10,
                borderColor: "dodgerblue",
                borderWidth: 1
              }}
              borderTopColor="dodgerblue"
              borderTopWidth={3}
              borderBottomColor="dodgerblue"
              borderBottomWidth={3}
              borderLeftColor="dodgerblue"
              borderLeftWidth={3}
              borderRightColor="dodgerblue"
              borderRightWidth={3}
              onChangeText={text => {
                this.setState(() => {
                  return {
                    typeDescription: text
                  };
                });
              }}
            />
          </View>
          <View>
            <Text>Chọn loại vi phạm</Text>
            <Picker
              selectedValue={this.state.typeViolation}
              style={{ height: 50, width: 200 }}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ typeViolation: itemValue })
              }
            >
              <Picker.Item
                label="An Toàn Giao Thông"
                value="An Toàn Giao Thông"
              />
              <Picker.Item label="Môi Trường" value="Môi Trường" />
            </Picker>
          </View>
          <View>
            <Text>Chọn ảnh hoặc chụp ảnh vi phạm</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Button
              containerStyle={styles.btnContainer}
              style={styles.text}
              onPress={() => this.pickMultiple()}
            >
              Choose
            </Button>
            <Button
              containerStyle={styles.btnContainer}
              style={styles.text}
              onPress={() => this.pickSingleWithCamera()}
            >
              Shoot
            </Button>
          </View>
          <View>
            <FlatList
              data={this.state.imagePickArray}
              renderItem={({ item, index }) => {
                return (
                  <View>
                    <Image style={styles.image} source={{ uri: item.uri }} />
                  </View>
                );
              }}
              keyExtractor={(item, uri) => item.uri}
            />
          </View>
          <View>
            <Button
              containerStyle={styles.btnContainer}
              style={styles.text}
              onPress={() => this.submit()}
            >
              Báo Cáo Vi Phạm
            </Button>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  subViewContainer: {
    alignItems: "center",
    width: "95%",
    height: "45%",
    marginTop: "5%",
    marginBottom: "2%"
  },
  btnContainer: {
    margin: "2%",
    padding: "1%",
    backgroundColor: "#1E90FF",
    width: 200
  },
  text: {
    color: "white",
    fontSize: 20,
    textAlign: "center"
  },
  image: {
    width: 350,
    height: 350,
    resizeMode: "contain"
  }
});
