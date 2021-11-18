import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';


import userReducer from './shared/reducer/UserReducer';
import CameraScreen from './CameraScreen';
import Sidebar from './shared/Sidebar';
import Save from './SaveScreen';
import Library from './LibraryScreen';
import Team from './Team/TeamScreen';
import Account from './AccountScreen';
import storage from '../config/storage';

const store = createStore(userReducer);
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: "#e36f2c",
  },
  headerTintColor: "white",
  headerBackTitle: "Back",
};

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Camera">
      <Stack.Screen name="Camera" component={CameraScreen} options={{ title: 'WhiteBoard', headerShown: false }} />
      <Stack.Screen name="Save" component={Save}></Stack.Screen>
      <Stack.Screen name="Library" component={Library}></Stack.Screen>
      <Stack.Screen name="Team" component={Team}></Stack.Screen>
      <Stack.Screen name="Account" component={Account}></Stack.Screen>

    </Stack.Navigator>
  );
}

function MyDrawer() {
  useEffect(() => {
    console.log("MyDrawer Use effect");
    getUserInfo();
  }, []);
  const getUserInfo = () => {
    // Fetch user and login info in local storage
    storage
      .load({
        key: "login-session",
        // autoSync (default: true) means if data is not found or has expired,
        // then invoke the corresponding sync method
        autoSync: false,
        syncInBackground: true,
      })
      .then((ret) => {
        // found data go to then()
        setUser(ret.userInfo);
      })
      .catch((err) => {
        // any exception including data not found
        // goes to catch()
        console.log("User not found!");
      });
  };
  const [user, setUser] = React.useState(null);
  return (
    <Drawer.Navigator
      initialRouteName="Stack"
      headerMode="none"
      drawerContent={(props) => <Sidebar {...props} user={user} />}
      drawerPosition="left"
      drawerStyle={{ width: '35%' }}
      edgeWidth={200}
    >
      <Drawer.Screen
        name="Stack"
        component={HomeStackNavigator}
      ></Drawer.Screen>

    </Drawer.Navigator>
  );
};

function MainScreen() {


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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: 20
  },

  drawerButton: {
    padding: 20
  }
});

export default MainScreen;
