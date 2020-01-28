import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ProgressBarAndroid,
  PermissionsAndroid,
  TextInput,
  Picker,
  ScrollView
} from "react-native";

import firebase from "react-native-firebase";
import Button from "react-native-button";
import ModalDropdown from "react-native-modal-dropdown";
import ImagePicker from "react-native-image-crop-picker";
import uuid from "uuid/v4"; // Import UUID to generate UUID
import AsyncStorage from "@react-native-community/async-storage";
import HeaderCompnent from "./HeaderComponent";
import Icon from "react-native-vector-icons/Ionicons";
import Video from "react-native-video"
import HeaderComponent from "./HeaderComponent";
import {
  setItemToAsyncStorage,
  getItemFromAsyncStorage,
  getStatusColor
} from "./Function";

const LearnAppRef = firebase.database().ref("LearnApp/cases");

export default class UpdateCase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imagePickArrayRef: [],
      imagePickArray: [],
      image: null,
      email: "",
      shortEmail: "",
      itemData: {},
      currentItemId: "",
      proofsOwner: [],
      ownerPhoneNumber: "",
      ownerName: "",
      enableScrollViewScroll: true,
      /* uploader: '',
			description: '',
			violation: '',
			status: '',
			reason: '',
			updater: '',
			proofs: [] */
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

  setProofs(url, width, height, mime, filename) {
    const proof = {
      filename: filename,
      url: url,
      width: width,
      height: height,
      mime: mime
    };
    this.setState({
      itemData: {
        ...this.state.itemData,
        proofsOwner: [...this.state.proofsOwner, proof]
      }
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
          .ref(`LearnApp/OwnerImages`)
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



  getOneItemFromDatabase() {
		LearnAppRef.orderByChild('id')
			.equalTo(this.state.currentItemId)
			.on('value', (childSnapshot) => {
				//Get OneItem
				var itemData = {};
				childSnapshot.forEach((doc) => {
					itemData = {
						id: doc.toJSON().id,
						uploader: doc.toJSON().uploader,
						description: doc.toJSON().description,
						status: doc.toJSON().status,
						updater: doc.toJSON().updater,
						proofs: doc.toJSON().proofs
					};
				});
				this.setState({
					itemData: itemData
					/* proofsArray: itemData.proofs,
					uploader: itemData.uploader,
					description: itemData.description,
					violation: itemData.violation,
					status: itemData.status,
					reason: itemData.reason,
					updater: itemData.updater,
					proofs: itemData.proofs */
				});
				//console.log(`itemData = ${JSON.stringify(this.state.itemData, null, 4)}`);
				//console.log(`proofsArray = ${JSON.stringify(this.state.proofs, null, 4)}`);
			});
	}

async update() {
    if (this.state.itemData.status === "Chưa có người nhận") {
      alert("Chưa có người nhận");
      return;
    } else if (
      this.state.itemData.status === "Đã có người nhận"
    ) {
      try {
        await this.uploadImageArray(this.state.imagePickArray);
        await LearnAppRef.orderByChild("id")
          .equalTo(this.state.currentItemId)
          .on("child_added", data => {
            data.key;
            LearnAppRef.child(data.key).update({
              status: this.state.itemData.status,
              ownerPhoneNumber: this.state.itemData.ownerPhoneNumber,
              ownerName: this.state.itemData.ownerName,
              proofsOwner: this.state.itemData.proofsOwner
            });
          });
          this.setState({
            proofsOwner: []
          });
        alert("Submit successfully !");
      } catch (error) {
        alert(error);
      }
    } 
  }

  onChanged (text) {
    this.setState({ 
      itemData: {
        ...this.state.itemData,
      ownerPhoneNumber: text.replace(/[^0-9]/g, '')
      }  
    });
  }

  onEnableScroll= (value) => {
    this.setState({
      enableScrollViewScroll: value,
    });
  };

  async componentDidMount() {
    const currentItemId = await getItemFromAsyncStorage("currentItemId");
    //console.log(`get currentItemId = ${currentItemId}`);
    const email = await getItemFromAsyncStorage("email");
    const shortEmail = email.split("@").shift();
    this.setState({
      currentItemId: currentItemId,
      email: email,
      shortEmail: shortEmail
    });
    //console.log(`this.state.currentItemId = ${currentItemId}`);
    this.getOneItemFromDatabase();
  }

  render() {
      return (
        <View style={styles.container}>
        <ScrollView 
      contentContainerStyle={{ flexGrow: 1, }}
      scrollEnabled={this.state.enableScrollViewScroll}
      >
        <View>
      <View style={styles.subViewContainer}>
          <View>
            <Text>Tên người nhận</Text>
          </View>
          <View>
            <TextInput
              style={{
                height: 50,
                width: 200,
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
                    itemData: {
                      ...this.state.itemData,
                    ownerName: text
                    } 
                  };
                });
              }}
            />
          </View>
          <View>
          <Text>Số điện thoại người nhận đồ</Text>
          </View>
          <View>
          <TextInput 
                keyboardType='numeric'
                onChangeText={(text)=> this.onChanged(text)}
                value={this.state.phoneNumber}
                borderTopColor="dodgerblue"
                borderTopWidth={3}
                borderBottomColor="dodgerblue"
                borderBottomWidth={3}
                borderLeftColor="dodgerblue"
                borderLeftWidth={3}
                borderRightColor="dodgerblue"
                borderRightWidth={3}
                maxLength={10}  //setting limit of input
              />
          </View>
          <View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								marginTop: '3%',
								marginBottom: '1%'
							}}>
							<Text
								style={{
									fontSize: 18,
									color: 'blue',
									textAlign: 'left'
								}}>
								Trạng thái:{' '}
							</Text>
          <ModalDropdown
            options={["Đã có người nhận", "Chưa có người nhận"]}
            defaultValue={this.state.itemData.status}
            textStyle={{
              fontSize: 18,
              fontWeight: "bold",
              color: `${getStatusColor(this.state.itemData.status)}`
            }}
            dropdownTextStyle={{
              fontSize: 16,
              fontWeight: "bold",
              color: "black"
            }}
            disabled={
              this.state.email === "Guest" &&
              this.state.email === "admin@gmail.com" &&
              this.state.email !== this.state.shortEmail 
            }
            dropdownTextHighlightStyle={{ backgroundColor: "orange" }}
            onSelect={(index, value) => {
              this.setState({
                itemData: {
                  ...this.state.itemData,
                  status: value
                }
              });
            }}
            />
          </View>
          
          <View>
            <Text>Mặt người nhận và thẻ căn cước</Text>
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
              containerStyle={styles.btnContainer}
              style={styles.text}
              onPress={() => this.update()}
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
    backgroundColor: "#1E90FF",
    width: 200
  },
  text: {
    color: "white",
    fontSize: 20,
    textAlign: "center"
  },
  image: {
    width: 350 ,
    height: 350,
    resizeMode: "contain"
  }
});

