import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Startup from './pages/startup';
import FlatListDemo from './pages/FlatListDemo';

const Stack = createStackNavigator();

export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Startup" >
          <Stack.Screen name="Startup" component={Startup} options={{headerShown: false}}/>
          <Stack.Screen name="FlatListDemo" component={FlatListDemo} options={{headerShown: false}}/>
         </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
