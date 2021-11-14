import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import TeamScreen from "./app/screens/Team/TeamScreen";
import TeamMemeber from "./app/screens/Team/TeamMember";
import RegistrationPage from "./app/screens/RegistrationPage";
import CameraScreen from "./app/screens/CameraScreen";
import LoginPage from "./app/screens/LoginPage";


export default function App() {
  // return <WelcomeScreen />;
  return <TeamMemeber />;
}
