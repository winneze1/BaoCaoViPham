import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  FlatList,
  ProgressBarAndroid,
  PermissionsAndroid,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView
} from "react-native";

import firebase from "react-native-firebase";
import Button from "react-native-button";
import ModalDropdown from "react-native-modal-dropdown";
import ImageViewer from 'react-native-image-zoom-viewer';
import Video from "react-native-video"
import HeaderComponent from "./HeaderComponent";
import {
  setItemToAsyncStorage,
  getItemFromAsyncStorage,
  getStatusColor
} from "./Function";

const LearnAppRef = firebase.database().ref("LearnApp/cases");
const { width: HEIGHT } = Dimensions.get("window");
export default class ItemComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      shortEmail: "",
      itemData: {},
      currentItemId: "",
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


  getOneItemFromDatabase() {
    LearnAppRef.orderByChild("id")
      .equalTo(this.state.currentItemId)
      .on("value", childSnapshot => {
        //Get OneItem
        var itemData = {};
        childSnapshot.forEach(doc => {
          itemData = {
            id: doc.toJSON().id,
            uploader: doc.toJSON().uploader,
            description: doc.toJSON().description,
            losttype: doc.toJSON().losttype,
            phoneNumber: doc.toJSON().phoneNumber,
            status: doc.toJSON().status,
            ownerPhoneNumber: doc.toJSON().ownerPhoneNumber,
            ownerName: doc.toJSON().ownerName,
            proofs: doc.toJSON().proofs,
            proofsOwner: doc.toJSON().proofsOwner,
            position: doc.toJSON().position,
            date: doc.toJSON().date
          };
        });
        this.setState({
          itemData: itemData,
        });
        //console.log(`itemData = ${JSON.stringify(this.state.itemData, null, 4)}`);
        //console.log(`proofsArray = ${JSON.stringify(this.state.proofs, null, 4)}`);
      });
  }
  onEnableScroll= (value) => {
    this.setState({
      enableScrollViewScroll: value,
    });
  };

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
    return <Image style={styles.image} source={{uri:uri}} />
  }

  renderAsset(uri, mime) {
    if (mime && mime.toLowerCase().indexOf('video/') !== -1) {
      return this.renderVideo(uri);
    }

    return this.renderImage(uri);
  }


  async _goToUpdate(){
    this.props.navigation.navigate("Update");
  }

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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}
      scrollEnabled={this.state.enableScrollViewScroll}
      >
      <View style={styles.subViewContainer}>
          <TextInput
            style={styles.multilineBox}
            value={this.state.itemData.description}
            multiline={true}
            editable={true}
            maxLength={140}
          />
          <Text
          style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "darkviolet"
                }}
          >Nơi tìm thấy</Text>
          <TextInput
            style={styles.multilineBox}
            value={this.state.itemData.position}
            multiline={true}
            editable={true}
            maxLength={140}
          />
          <View style={{ height: "30%", marginTop: "4%" }}>
            <FlatList
              data={this.state.itemData.proofs}
              renderItem={({ item, index }) => {
                return this.renderAsset(item.url, item.mime);
              }}
              keyExtractor={(item, uri) => item.url}
              initialNumToRender={1}
              onTouchStart={() => {
                 this.onEnableScroll( false );
              }}
              onMomentumScrollEnd={() => {
                 this.onEnableScroll( true );
              }}
            />
          </View>
          <View
            style={{
              alignSelf: "flex-start",
              marginTop: "3%",
              marginLeft: "10%"
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: "blue",
                textAlign: "left"
              }}
            >
              Loại đồ:{" "}
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "darkviolet"
                }}
              >
                {this.state.itemData.losttype}
              </Text>
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: "1%",
                marginBottom: "1%"
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: "blue",
                  textAlign: "left"
                }}
              >
                Trạng Thái:{" "}
              </Text>
              <Text 
              style={{
              fontSize: 18,
              fontWeight: "bold",
              color: `${getStatusColor(this.state.itemData.status)}`
              }}>
              {this.state.itemData.status}
              </Text>
            </View>
            <Text
              style={{
                marginTop: "3%",
                marginBottom: "1%",
                fontSize: 18,
                color: "blue",
                textAlign: "left"
              }}
            >
              Số điện thoại để liên hệ:{" "}
              <Text
                style={{
                  fontSize: 18,
                  color: "#FF00FF"
                }}
              >
                {this.state.itemData.phoneNumber}
              </Text>
            </Text>
            <Text
              style={{
                marginTop: "3%",
                marginBottom: "1%",
                fontSize: 18,
                color: "blue",
                textAlign: "left"
              }}
            >
              Ngày tìm thấy:{" "}
              <Text
                style={{
                  fontSize: 18,
                  color: "#FF00FF"
                }}
              >
                {this.state.itemData.date}
              </Text>
            </Text>
          </View>
          
        </View>
        {this.state.itemData.status === "Chưa có người nhận" ? null : (
          <View style={styles.subViewContainer}>
          <View
            style={{
              alignSelf: "flex-start",
              marginTop: "3%",
              marginLeft: "10%"
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: "blue",
                textAlign: "left"
              }}
            >
              Tên người nhận:{" "}
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "darkviolet"
                }}
              >
                {this.state.itemData.ownerName}
              </Text>
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: "1%",
                marginBottom: "1%"
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: "blue",
                  textAlign: "left"
                }}
              >
                Trạng Thái:{" "}
              </Text>
              <Text 
              style={{
              fontSize: 18,
              fontWeight: "bold",
              color: `${getStatusColor(this.state.itemData.status)}`
              }}>
              {this.state.itemData.status}
              </Text>
            </View>
            <Text
              style={{
                marginTop: "3%",
                marginBottom: "1%",
                fontSize: 18,
                color: "blue",
                textAlign: "left"
              }}
            >
              Số điện thoại người nhận:{" "}
              <Text
                style={{
                  fontSize: 18,
                  color: "#FF00FF"
                }}
              >
                {this.state.itemData.ownerPhoneNumber}
              </Text>
            </Text>
          </View>
          <View style={{ height: "30%", marginTop: "4%" }}>
            <FlatList
              data={this.state.itemData.proofsOwner}
              renderItem={({ item, index }) => {
                return this.renderAsset(item.url, item.mime);
              }}
              keyExtractor={(item, uri) => item.url}
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
        )}
        </ScrollView>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subViewContainer: {
    alignSelf: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: 'dodgerblue',
    width: "99%",
    height: 500
  },
  btnContainer: {
    margin: "2%",
    padding: "1%",
    backgroundColor: "rgb(120, 10, 260)",
    width: 75
  },
  imgBtnContainer: {
    margin: "1%"
  },
  text: {
    color: "white",
    fontSize: 16,
    textAlign: "center"
  },
  image: {
    width: 200,
    height: 200,
    marginTop: "2%",
    resizeMode: "contain"
  },
  progressbar: {
    width: "95%"
  },
  multilineBox: {
    width: "96%",
    marginTop: "1%",
    borderColor: "black",
    borderWidth: 1,
    textAlignVertical: "top",
    color: "black",
    borderRadius: 10,
  }
});
