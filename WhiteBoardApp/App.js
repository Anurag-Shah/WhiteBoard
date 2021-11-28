import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import TeamScreen from "./app/screens/Team/TeamScreen";
import TeamMemeber from "./app/screens/Team/TeamMember";
import Account from "./app/screens/AccountScreen";
import CameraScreen from "./app/screens/CameraScreen";
export default function App() {
  // return <WelcomeScreen />;
  return <TeamScreen />;
}
