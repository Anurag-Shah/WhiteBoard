import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, LogBox, Button } from "react-native";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator, DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";

import userReducer from "./shared/reducer/UserReducer";
import CameraScreen from "./CameraScreen";
import Sidebar from "./shared/Sidebar";
import Save from "./SaveScreen";
import Library from "./LibraryScreen";
import Team from './Team/TeamScreen';
import TeamMember from './Team/TeamMember';
import Account from "./AccountScreen";
import LoginPage from "./LoginPage";
import RegistrationPage from "./RegistrationPage";
import TextEditorPage from "./TextEditorPage";
import storage from "../config/storage";


const store = createStore(userReducer);
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

LogBox.ignoreAllLogs();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: "green",
  },
  headerTintColor: "white",
  headerBackTitle: "Back",
  headerShown: false,
};


const HomeStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Camera"
      screenOptions={screenOptionStyle}
    >
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ title: "WhiteBoard", headerShown: false }}
      />
      <Stack.Screen name="Drawer" component={MyDrawer} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="SideBar" component={Sidebar} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="Save" component={Save}></Stack.Screen>
      <Stack.Screen name="Library" component={Library}></Stack.Screen>
      <Stack.Screen name="Team" component={Team}></Stack.Screen>
      <Stack.Screen name="TeamMember" component={TeamMember}></Stack.Screen>
      <Stack.Screen name="Account" component={Account}></Stack.Screen>
      <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="Register" component={RegistrationPage} options={{ headerShown: false }} />
      <Stack.Screen
        name="TextEditorPage"
        component={TextEditorPage}
        options={{ title: "WhiteBoard", headerShown: false }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
};



function MyDrawer() {
  useEffect(() => {
    console.log("drawer updated!");
  }, []);
  return (
    <Drawer.Navigator
      initialRouteName="Stack"
      headerMode="none"
      drawerContent={(props) => <Sidebar {...props} />}
      drawerPosition="left"
      drawerStyle={{ width: "35%" }}
      edgeWidth={200}
    >
      <Drawer.Screen
        name="Stack"
        component={HomeStackNavigator}
      ></Drawer.Screen>
    </Drawer.Navigator>
  );
}


function WelcomeScreen() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <MyDrawer />
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  profileImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: 20,
  },

  drawerButton: {
    padding: 20,
  },
});

export default WelcomeScreen;