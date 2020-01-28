import React, { Component } from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";

import ImagePicker from "react-native-image-crop-picker";
import firebase from "react-native-firebase";
import Button from "react-native-button";
import uuid from "uuid/v4"; // Import UUID to generate UUID

export default class CustomizedImagePicker extends Component {
  constructor() {
    super();
    this.state = {
      imagePickArrayRef: [],
      imagePickArray: [],
      imageShowArray: [],
      image: null
    };
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

  async uploadImageArray(imagePickArray) {
    for (var i = 0; i < imagePickArray.length; i++) {
      var path = imagePickArray[i].uri;
      var width = imagePickArray[i].width;
      var height = imagePickArray[i].height;
      var mime = imagePickArray[i].mime;

      var ext = path.split(".").pop(); // Extract image extension
      var filename = `${uuid()}.${ext}`; // Generate unique name

      // Stop loop to wait until this function finished
      await new Promise((resolve, reject) => {
        const imageRef = firebase.storage().ref(`LearnApp/${filename}`);

        return imageRef
          .put(path, { contentType: mime })
          .then(() => {
            return imageRef.getDownloadURL();
          })
          .then(url => {
            resolve(url);
            this.storageDatabaseRef(url, width, height, mime, filename);
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

  // Link from storage to Realtime Database
  storageDatabaseRef(url, width, height, mime, filename) {
    const image = {
      name: filename,
      url: url,
      width: width,
      height: height,
      mime: mime
    };
    firebase
      .database()
      .ref("LearnApp")
      .push(image);
  }

  getURLfromDatabse() {
    firebase
      .database()
      .ref("LearnApp")
      .on("value", childSnapshot => {
        const imageShowArray = [];
        childSnapshot.forEach(doc => {
          imageShowArray.push({
            name: doc.toJSON().name,
            url: doc.toJSON().url,
            width: doc.toJSON().width,
            height: doc.toJSON().height,
            mime: doc.toJSON().mime
          });
        });
        this.setState({
          imageShowArray: imageShowArray
        });
        //console.log(JSON.stringify(this.state.imageShowArray, null, 4));
      });
  }

  componentDidMount() {
    this.getURLfromDatabse();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.subViewContainer}>
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

        <View style={styles.subViewContainer}>
          <Button
            containerStyle={styles.btnContainer}
            style={styles.text}
            onPress={() => this.uploadImageArray(this.state.imagePickArray)}
          >
            Upload
          </Button>
          <FlatList
            data={this.state.imageShowArray}
            renderItem={({ item, index }) => {
              return (
                <View>
                  <Image style={styles.image} source={{ uri: item.url }} />
                </View>
              );
            }}
            keyExtractor={(item, name) => item.name}
          />
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
    borderWidth: 1,
    borderColor: "red",
    marginTop: "5%",
    marginBottom: "2%"
  },
  btnContainer: {
    margin: "2%",
    padding: "1%",
    backgroundColor: "rgb(120, 10, 260)",
    width: 100
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
