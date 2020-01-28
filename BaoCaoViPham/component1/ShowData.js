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
import Icon from "react-native-vector-icons/Ionicons";
import { statusArr, typeArray, propertyArr, allArr } from "./Array";
import Video from "react-native-video"
import DatePicker from 'react-native-datepicker';
import HeaderComponent from "./HeaderComponent";
import {
  setItemToAsyncStorage,
  getStatusColor,
  replaceHalfString,
  getItemFromAsyncStorage,
  returnType
} from "./Function";
import ModalDropdown from "react-native-modal-dropdown";
import { TouchableOpacity } from "react-native-gesture-handler";
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
      dateFrom:"",
      dateTo: ""
    };
  }

  returnValueOptionProps = str => {
    if (str === "Loại Đồ") return typeArray;
    else if (str === "Trạng Thái") return statusArr;
    else if (str === "Tất Cả") return allArr;
  };

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

  filterData(property, value) {
    LearnAppRef.orderByChild(property)
      .equalTo(value)
      .on("value", childSnapshot => {
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

  async filterDataByDate(from, to) {
    LearnAppRef.orderByChild("date")
      .startAt(from).endAt(to)
      .on("value", childSnapshot => {
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

  getDataFromDB() {
    LearnAppRef.on("value", childSnapshot => {
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
    this.props.navigation.navigate("Item");
  }

  async componentDidMount() {
    this.getDataFromDB();
  }

  scrollToItem = () => {
    this.flatListRef.scrollToIndex({animated: true,index:0});
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
        <View
          style={{
            backgroundColor: "orange",
            width: "100%",
            height: "10%",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center"
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: "dodgerblue",
              textAlign: "center"
            }}
          >
            Tìm kiếm{" "}
          </Text>
          <ModalDropdown
            options={propertyArr}
            defaultValue="Mô tả"
            textStyle={{
              fontSize: 18,
              fontWeight: "bold",
              textAlignVertical:"center",
              color: "darkviolet"
            }}
            dropdownTextStyle={{
              fontSize: 16,
              fontWeight: "bold",
              color: "black"
            }}
            dropdownTextHighlightStyle={{ backgroundColor: "orange" }}
            onSelect={(index, value) => {
              this.setState(
                {
                  searchProps: value
                },
                () => {
                  this.filterData(returnType(this.state.searchProps), allArr);
                }
              );
            }}
          />
          <Text
            style={{
              fontSize: 18,
              color: "dodgerblue",
              textAlign: "center"
            }}
          >
            {" "}
            theo{" "}
          </Text>
          <ModalDropdown
            options={this.returnValueOptionProps(this.state.searchProps)}
            defaultValue="Mô Tả"
            textStyle={{
              fontSize: 18,
              fontWeight: "bold",
              color: "darkviolet"
            }}
            dropdownTextStyle={{
              fontSize: 16,
              fontWeight: "bold",
              color: "black"
            }}
            disabled={this.state.searchProps === "Tất Cả"}
            dropdownTextHighlightStyle={{ backgroundColor: "orange" }}
            onSelect={(index, value) => {
              this.filterData(returnType(this.state.searchProps), value);
            }}
          />
        </View>
        <View  style={{
            backgroundColor: "darkviolet",
            width: "100%",
            height: "10%",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center"
          }}>
          <DatePicker
          style={{width: 200}}
          date={this.state.dateFrom} //initial date from state
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
          onDateChange={(dateFrom) => {
            this.setState({dateFrom: dateFrom},
            () => {
                this.filterDataByDate(this.state.dateFrom,this.state.dateTo);
            })
            }}
        />
        <DatePicker
          style={{width: 200}}
          date={this.state.dateTo} //initial date from state
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
          onDateChange={(dateTo) => {
            this.setState({dateTo: dateTo},
            () => {
                this.filterDataByDate(this.state.dateFrom,this.state.dateTo);
                console.log(this.state.dateTo)
            })
            }}
        />

        </View>
        <View style={{ paddingBottom: 200 }}>
          <FlatList
            ref={(ref) => { this.flatListRef = ref; }}
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
                          {item.description.length > 15
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
          <View style={{
                position: "absolute",
                top: 400,
                right: 5,
                }}>
                <TouchableOpacity onPress={() => this.scrollToItem()}> 
                <Image
                source={require("../icons/totop.png")}
                style={{ width: 50, height: 50 }}
                />
                </TouchableOpacity>    
        </View>
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
    backgroundColor: "rgba(255,255,255,0.7)",
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
