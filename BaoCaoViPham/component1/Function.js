import AsyncStorage from "@react-native-community/async-storage";
import firebase from "react-native-firebase";

export const setItemToAsyncStorage = async (item, value) => {
  const currentScreen = await AsyncStorage.setItem(item, value);
};

export const getItemFromAsyncStorage = async item => {
  var temp, realItem;
  try {
    temp = await AsyncStorage.getItem(item).then(temp => {
      realItem = temp;
    });
  } catch (error) {
    alert(error);
  }
  return realItem;
};

export const getStatusColor = status => {
  if (status === "Chưa có người nhận") return "orange";
  else if (status === "Đã có người nhận") return "#4CC417";
  else return "red";
};

export const replaceHalfString = str => {
  const position = Math.floor(str.length / 2);
  return str.slice(0, position) + "...";
};

export const returnType = str => {
  if (str === "Loại Đồ") return "losttype";
  else if (str === "Trạng Thái") return "status";
  else if (str === "Tất Cả") return "losttype";
};


