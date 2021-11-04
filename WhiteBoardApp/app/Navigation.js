import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "./screens/LoginPage";
import RegistrationPage from "./screens/RegistrationPage";
import CameraScreen from "./screens/CameraScreen";
import CameraPage from "./screens//CameraPage";
import Save from "./screens/SaveScreen";
import Library from "./screens/LibraryScreen";
import Team from "./screens/TeamScreen";
import Account from "./screens/AccountScreen";
import "react-native-gesture-handler";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginPage}
          options={{ title: "WhiteBoard", headerShown: false }}
        />
        <Stack.Screen
          name="RegistrationPage"
          component={RegistrationPage}
          options={{ title: "WhiteBoard", headerShown: false }}
        />
        <Stack.Screen
          name="Camera"
          component={CameraPage}
          options={{ title: "WhiteBoard", headerShown: false }}
        />
        <Stack.Screen name="Save" component={Save}></Stack.Screen>
        <Stack.Screen name="Library" component={Library}></Stack.Screen>
        <Stack.Screen name="Team" component={Team}></Stack.Screen>
        <Stack.Screen name="Account" component={Account}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
