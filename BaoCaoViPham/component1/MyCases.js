import React, { Component } from "react";
import {
  FlatList,
  Text,
  View,
  Image,
  Platform,
  TextInput,
  StyleSheet,
  Picker
} from "react-native";
import firebase from "react-native-firebase";
import Button from "react-native-button";
import { statusArr, typeArray, propertyArr, allArr } from "./Array";
import HeaderComponent from "./HeaderComponent";
import {
  setItemToAsyncStorage,
  getStatusColor,
  replaceHalfString,
  getItemFromAsyncStorage,
  returnType
} from "./Function";
import ModalDropdown from "react-native-modal-dropdown";
const LearnAppRef = firebase.database().ref("LearnApp/cases");
export default class ListComponent extends Component {
  static navigationOptions = ({ navigation }) => {
    let tabBarLabel = "Đồ vật";
    let tabBarIcon = () => (
      <Image
        source={require("../icons/show.png")}
        style={{ width: 26, height: 26, tintColor: "dodgerblue" }}
      />
    );
    return { tabBarLabel, tabBarIcon };
  };
  constructor(props) {
    super(props);
    this.state = {
      //deletedRowKey: null,
      dataArray: [],
      searchProps: "",
      email: "",
      shortEmail: "",
    };
  }

  renderVideo() {
    return (<View>
      <Image style={styles.itemImage} source={require('../icons/video.png')}/>
     </View>);
  }

  renderImage(uri) {
    return <Image style={styles.itemImage} source={{uri:uri}} />
  }

  renderAsset(uri, mime) {
    if (mime && mime.toLowerCase().indexOf('video/') !== -1) {
      return this.renderVideo(uri);
    }

    return this.renderImage(uri);
  }

  getDataFromDB() {
    LearnAppRef.orderByChild("uploader")
    .equalTo(this.state.email).on("value", childSnapshot => {
      const dataArray = [];
      childSnapshot.forEach(doc => {
        dataArray.push({
          id: doc.toJSON().id,
          uploader: doc.toJSON().url,
          description: doc.toJSON().description,
          losttype: doc.toJSON().losttype,
          phoneNumber: doc.toJSON().phoneNumber,
          status: doc.toJSON().status,
          proofs: doc.toJSON().proofs,
          reason: doc.toJSON().reason,
          position: doc.toJSON().position,
          date: doc.toJSON().date
        });
      });
      this.setState({
        dataArray: dataArray
      });
      //console.log(JSON.stringify(this.state.dataArray, null, 4));
    });
  }

  async setItemId(currentItemId) {
    await setItemToAsyncStorage("currentItemId", currentItemId);
    console.log(`set currentItemId = ${currentItemId}`);
    this.props.navigation.navigate("Cases");
  }

  async componentDidMount() {
    const email = await getItemFromAsyncStorage("email");
    const shortEmail = email.split("@").shift();
    this.setState({
      email: email,
      shortEmail: shortEmail
    });
    this.getDataFromDB();
  }

  render() {
    return (
      <View
        style={{
          height: "99%",
          //flex: 1,
          marginTop: Platform.OS == "ios" ? 34 : 0
        }}
      >
        <View style={{ backgroundColor: "#1E90FF" }}>
          <HeaderComponent navigation={this.props.navigation} />
        </View>
        <View style={{ paddingBottom: 55 }}>
          <FlatList
            ref={"flatList"}
            ListEmptyComponent={<EmptyComponent title="Danh sách rỗng.." />}
            data={this.state.dataArray}
            renderItem={({ item, id }) => {
              return (
                <Button
                  onPress={() => {
                    this.setItemId(item.id);
                  }}
                >
                  <View style={styles.listContainer}>
                    <View style={styles.itemView}>
                    {this.renderAsset(item.proofs[0].url,
                     item.proofs[0].mime)}
                      <View style={styles.itemTextView}>
                        <Text
                          style={[
                            styles.itemText,
                            { color: "black", fontSize: 14 }
                          ]}
                        >
                          {item.description.length > 75
                            ? replaceHalfString(item.description)
                            : item.description}
                        </Text>
                        <Text
                          style={[styles.itemText, { color: "darkviolet" }]}
                        >
                        <Text>Ngày tìm thấy: </Text>
                          {item.date}
                        </Text>
                        <Text
                          style={[styles.itemText, { color: "dodgerblue" }]}
                        >
                        <Text>Sđt: </Text>
                          {item.phoneNumber}
                        </Text>
                        <Text
                          style={[
                            styles.itemText,
                            {
                              color: `${getStatusColor(item.status)}`,
                              fontStyle: "italic",
                              fontWeight: "bold"
                            }
                          ]}
                        >
                          {item.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Button>
              );
            }}
            keyExtractor={(item, id) => item.id}
          />
        </View>
        <View style={{ height: 1, backgroundColor: "black" }} />
      </View>
    );
  }
}

const EmptyComponent = ({ title }) => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  listContainer: {
    width: "94%",
    backgroundColor: "white",
    alignSelf: "center",
    marginTop: "1%"
  },
  itemView: {
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: "black",
    height: 135,
    justifyContent: "center",
    alignItems: "center"
  },
  itemImage: {
    width: 125,
    height: 125,
    margin: "2%"
  },
  itemTextView: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "center"
  },
  itemText: {
    padding: "1%",
    fontSize: 16,
    textAlign: "center"
  },
  emptyContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  emptyText: {
    fontSize: 30
  }
});
