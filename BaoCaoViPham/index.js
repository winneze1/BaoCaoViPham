/**
 * @format
 */

import { AppRegistry } from "react-native";
//import App from "./App";
import { name as appName } from "./app.json";
//import swipeOut from "./test";
//import ToDoComponent from "./components/ToDoComponent";
//import login from "./components/login";
//import DataComponent from "./components/DataComponent";
// CustomizedImagePicker from "./components/upload";
import AuthStack from "./component1/Navigator";
 console.disableYellowBox = true;
//import App from './test'
import App from './App'

import bgMessaging from './bgMessaging' 

 AppRegistry.registerComponent(appName, () => AuthStack);
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging); 