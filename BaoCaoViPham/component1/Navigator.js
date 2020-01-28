import React from "react";
import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator,
  createBottomTabNavigator
} from "react-navigation";
import { Platform, Dimensions } from "react-native";
import SignInScreen from "./SignIn";
import HomeScreen from "./Home";
import AuthLoadingScreen from "./AuthLoading";
import OtherScreen from "./OtherScreen";
import UploadScreen from "./Upload";
import ShowScreen from "./ShowData";
import RealTimeDB from "./RealTime";
import MenuDraw from "./MenuDraw";
import TabIcon from "./TabIcon";
import ItemComponent from "./ItemComponent";
import UpdateCase from "./UpdateCase"
import MyCases from "./MyCases"
import MyCasesIcon from "./MyCasesIcon"
import MyCasesComponent from "./MyCasesComponent"
import UploadIcon from "./UploadIcon";
// Implementation of HomeScreen, OtherScreen, SignInScreen, AuthLoadingScreen
// goes here.

const WIDTH = Dimensions.get("window").width;
const DrawerConfig = {
  drawerWidth: WIDTH * 0.75,
  contentComponent: ({ navigation }) => {
    return <MenuDraw navigation={navigation} />;
  }
};

const stack4 = createStackNavigator({
  Cases: {
    screen: MyCasesComponent,
    navigationOptions: {
      header: null
    }
  },
  Update: UpdateCase
})

const Stack3 = createStackNavigator({
  MyCases: {
    screen: MyCases,
    navigationOptions: {
      header: null
    }
  },
  Cases: stack4
})

const Stack2 = createStackNavigator({
  Show: {
    screen: ShowScreen,
    navigationOptions: {
      header: null
    }
  },
  Item: {
    screen: ItemComponent,
  }
});



const TabStack = createBottomTabNavigator({
  Home: HomeScreen,
  Upload: UploadScreen,
  Show: {
    screen: Stack2,
    navigationOptions: {
      tabBarLabel: "Xử lí",
      tabBarIcon: <TabIcon />
    }
  },
  MyCases: {
    screen: Stack3,
    navigationOptions: {
      tabBarLabel: "My Cases",
      tabBarIcon: <MyCasesIcon />
    }
  }
});

const Stack1 = createStackNavigator({
  Tab: {
    screen: TabStack,
    navigationOptions: {
      header: null
    }
  }
});

const AppStack = createDrawerNavigator(
  {
    DashBoard: {
      screen: Stack1
    }
  },
  DrawerConfig
);

const AuthStack = createStackNavigator({
  SignIn: {
    screen: SignInScreen
  }
});

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack
    },
    {
      initialRouteName: "AuthLoading"
    }
  )
);
