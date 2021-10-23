import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './screens/LoginPage';
import CameraPage from './screens/CameraPage';


const Stack = createNativeStackNavigator();

export default function Navigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="CameraPage">
                <Stack.Screen name="Camera" component={CameraPage} />
                <Stack.Screen name="Login" component={LoginPage} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}