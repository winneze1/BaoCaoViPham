import React, { Component } from "react";
import { Text, View, Image, TouchableHighlight, Alert } from "react-native";
import Button from "react-native-button";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-community/async-storage";
import firebase from 'react-native-firebase';


export default class App extends Component {
    
    async componentDidMount() {
        const notificationOpen: NotificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            const action = notificationOpen.action;
            const notification: Notification = notificationOpen.notification;
            var seen = [];
            alert(JSON.stringify(notification.data, function(key, val) {
                if (val != null && typeof val == "object") {
                    if (seen.indexOf(val) >= 0) {
                        return;
                    }
                    seen.push(val);
                }
                return val;
            }));
        } 
        const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
                .setDescription('My apps test channel');
// Create the channel
        firebase.notifications().android.createChannel(channel);
        this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
            // Process your notification as required
            // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
        });
        this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
            // Process your notification as required
            notification
                .android.setChannelId('test-channel')
                .android.setSmallIcon('ic_launcher')
                .android.setColor('pink');
            firebase.notifications()
                .displayNotification(notification);
            
        });
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
            // Get the action triggered by the notification being opened
            const action = notificationOpen.action;
            // Get information about the notification that was opened
            const notification: Notification = notificationOpen.notification;
            var seen = [];
            alert(JSON.stringify(notification.data, function(key, val) {
                if (val != null && typeof val == "object") {
                    if (seen.indexOf(val) >= 0) {
                        return;
                    }
                    seen.push(val);
                }
                return val;
            }));
            firebase.notifications().removeDeliveredNotification(notification.notificationId);
            
        });
    }

    
    componentWillUnmount() {
        this.notificationDisplayedListener();
        this.notificationListener();
        this.notificationOpenedListener();
    }
  render() {
    return (
      <View style={{flex: 1}}>
        <Text>Welcome to React Native!</Text>
      </View>
    );
  }
}