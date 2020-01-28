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
  PermissionsAndroid,
  ScrollView,
  Modal,
  Alert
} from "react-native";

import ImagePicker from "react-native-image-crop-picker";
import firebase from "react-native-firebase";
import Button from "react-native-button";
import uuid from "uuid/v4"; // Import UUID to generate UUID
import AsyncStorage from "@react-native-community/async-storage";
import Video from "react-native-video"
import HeaderComponent from "./HeaderComponent";
import Icon from "react-native-vector-icons/Ionicons";
import { getItemFromAsyncStorage } from "./Function";
import Geolocation from "@react-native-community/geolocation";
import DatePicker from 'react-native-datepicker';
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
      typeLost: "Bóp",
      email: "",
      shortEmail: "",
      phoneNumber:"",
      proofs: [],
      currentLongitude: null,
      currentLatitude: null,
      position: '',
      date: '',
      enableScrollViewScroll: true,
      isUploading: false,
    };
  }

  async requestPermission() {
    try {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
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
  
  pickVideo(){
    ImagePicker.openCamera({
      mediaType: 'video',
    }) .then(image => {
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
  
  renderVideo(uri) {
    console.log('rendering video');
    return (<View style={styles.image}>
      <Video source={{uri: uri}}
         style={{position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
          }}
         rate={1}
         paused={false}
         volume={1}
         muted={false}
         resizeMode={'cover'}
         onError={e => console.log(e)}
         onLoad={load => console.log(load)}
         repeat={true} />
     </View>);
  }

  renderImage(uri) {
    return <Image style={{width: 300, height: 300, resizeMode: 'contain'}} source={{uri:uri}} />
  }

  renderAsset(uri, mime) {
    if (mime && mime.toLowerCase().indexOf('video/') !== -1) {
      return this.renderVideo(uri);
    }

    return this.renderImage(uri);
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

  getAdress = async (latitude,longitude) =>{
    try {
      let url = 'https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox='+latitude+'%2C'+longitude+'%2C250&mode=retrieveAddresses&maxresults=1&&app_id=%20btOS5AcBp0OwjBMn2UOx&app_code=w92YbotHL5sujIJVHOR80w';
      let response = await fetch(url);
      let responseJson = await response.json();
      let str = responseJson.Response.View[0].Result[0].Location.Address.Label;
      this.setState({
        position: str,
        });
    } catch (error) {
      console.error(error);
    }
  }
  
  findCoordinates = async () => {
    Geolocation.getCurrentPosition(
      position => {
        const currentLongitude = JSON.stringify(position.coords.longitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);
        this.getAdress(currentLatitude,currentLongitude);
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: false, timeout: 20000}
    )
  };

  getDate = async() =>{
    var that = this;
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    that.setState({
      //Setting the value of the date time
      date:
        date + '/' + month + '/' + year,
    });
  }
  async componentDidMount() {
    await this.requestPermission();
    const email = await getItemFromAsyncStorage("email");
    const shortEmail = email.split("@").shift();
    this.setState({
      email: email,
      shortEmail: shortEmail
    });
    await this.findCoordinates();
    await this.getDate();
  }


  
  // Link from storage to Realtime Database
  async submit() {
    if (
      this.state.typeDescription.trim() === "" ||
      this.state.typeLost.trim() === "" ||
      this.state.phoneNumber.trim() ===""
    ) {
      alert("Mô tả và Vi phạm không được bỏ trống");
      return;
    }
    if (this.state.imagePickArray.length === 0) 
    {
			alert('Vui lòng cung cấp hình ảnh hoặc video');
			return;
		}
    try {
      await this.setState({
        isUploading: true,
      });
      await this.uploadImageArray(this.state.imagePickArray);
      const truongHop = {
        id: require("random-string")({ length: 10 }),
        uploader: this.state.email,
        description: this.state.typeDescription,
        losttype: this.state.typeLost,
        status: "Chưa có người nhận",
        phoneNumber: this.state.phoneNumber,
        proofs: this.state.proofs,
        position: this.state.position,
        date: this.state.date
      };
      LearnAppRef.push(truongHop);
      await this.setState({
        isUploading: false,
        proofs: []
      });
      alert("Gửi tin thành công tự động chuyển sang trang showdata !");
      this.props.navigation.navigate("Show");
    } catch (error) {
      alert(error);
    }
  }



   onChanged (text) {
    this.setState({
      phoneNumber: text.replace(/[^0-9]/g, ''),
    });
  }

  onEnableScroll= (value) => {
    this.setState({
      enableScrollViewScroll: value,
    });
  };

  
  render() {
    return (
      <View  style={styles.container}>
      <View style={{ backgroundColor: "#1E90FF" }}>
          <HeaderComponent navigation={this.props.navigation} />
        </View>
      <ScrollView 
      contentContainerStyle={{ flexGrow: 1, }}
      scrollEnabled={this.state.enableScrollViewScroll}
      >
        <View>
        <View style={styles.subViewContainer}>
          <View>
            <Text>Vui lòng nhập chi tiết bạn nhặt được đồ vật này </Text>
            <Text>như thế nào, ở đâu</Text>
          </View>
          <View>
          <Text>Nơi tìm thấy</Text>
          <TextInput
                onChangeText={text => {
                this.setState(() => {
                  return {
                    position: text
                  };
                });
              }}
              editable={true}
                value={this.state.position}
                style={styles.TextInputStyle}
              />
          </View>
          <View>
          <Text>
              Ngày tìm thấy đồ vật:{" "}
              </Text>
              <DatePicker
              style={{width: 200}}
              date={this.state.date} //initial date from state
              mode="date" //The enum of date, datetime and time
              placeholder="select date"
              format="DD-MM-YYYY"
              minDate="01-01-2019"
              maxDate="01-01-2020"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  marginLeft: 36
                }
              }}
              onDateChange={(date) => {
                this.setState({date: date})
                }}
            />
            
          </View>
          <View style={{margin:10}}>
          <Text style={{textAlign:"center"}}>
            Mô tả
          </Text>
            <TextInput
              style={{
                height: 100,
                width: 300,
                padding: 10,
                borderColor: "dodgerblue",
                borderWidth: 1,
                borderRadius: 10,
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
           <Text>Số điện thoại để liên hệ</Text>
          <TextInput 
                keyboardType='numeric'
                onChangeText={(text)=> this.onChanged(text)}
                value={this.state.phoneNumber}
                style={styles.TextInputStyle}
                maxLength={10}  //setting limit of input
              />
          </View> 
          <View>
            <Text>Chọn loại đồ vật</Text>
            <Picker
              selectedValue={this.state.typeLost}
              style={{ height: 50, width: 200 }}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ typeLost: itemValue })
              }
            >
              <Picker.Item
                label="Bóp"
                value="Bóp"
              />
              <Picker.Item label="Ba lô" value="Ba lô" />
            </Picker>
          </View>
          <View>
          <Text>Chọn ảnh hoặc chụp ảnh đồ vật</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{padding: 10}}>
            <Icon
              name="md-folder"
              size={50}
              onPress={() => this.pickMultiple()}
            />
            </View>
            <View style={{padding: 10}}>
            <Icon
              name="md-camera"
              size={50}
              onPress={() => this.pickSingleWithCamera()}
            />
            </View>
            <View>
            <Icon
              name="md-videocam"
              size={50}
              onPress={() => this.pickVideo()}
            />
            </View>
           
          </View>
          <View style={styles.image}>
            <FlatList
              data={this.state.imagePickArray}
              renderItem={({ item, index }) => {
                return (
                  this.renderAsset(item.uri, item.mime)
                );
              }}
              keyExtractor={(item, uri) => item.uri}
              initialNumToRender={1}
              onTouchStart={() => {
                 this.onEnableScroll( false );
              }}
              onMomentumScrollEnd={() => {
                 this.onEnableScroll( true );
              }}
            />
          </View>
        </View>
      </View>
      </ScrollView>
      <View style={{alignItems: "center"}}>
            <Button
              containerStyle={[styles.btnContainer, { backgroundColor: this.state.isUploading === true ? "gray" :"#1E90FF"}]}
              style={styles.text}
              onPress={() => {
              this.submit();
             }}
             disabled={this.state.isUploading}
            >
              Gửi thông tin
            </Button>
          </View>
      </View>
      
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: 200
  },
  text: {
    color: "white",
    fontSize: 20,
    textAlign: "center"
  },
  TextInputStyle: {
    textAlign: 'center',
    height: 40,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1E90FF',
    marginBottom: 10
  },
  image: {
    width: 350,
    height: 350,
    resizeMode: "contain"
  }
});
