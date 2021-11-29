import React, { useState, useEffect } from "react";
import { useIsDrawerOpen } from "@react-navigation/drawer";
import {
  Text,
  View,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import storage from "../../config/storage";
import { logoutApi } from "../../requests/api";

function Sidebar({ navigation }) {
  const route_anonymous = [
    {
      // name: "Log In",
      // screen: "Login"
      name: "",
    },
  ];

  const routes_logged_in = [
    //   {
    //   name: "Save",
    //   screen: "Save"
    // },
    {
      name: "Library",
      screen: "Library",
    },
    {
      name: "Team",
      screen: "Team",
    },
    {
      name: "Account",
      screen: "Account",
    },
  ];

  const drawerOpen = useIsDrawerOpen();
  useEffect(() => {
    retrieveData();
  }, [drawerOpen]);

  const retrieveData = async () => {
    // console.log("Side bar retrieving data");
    try {
      let data = await storage.load({
        key: "login-session",
        // autoSync (default: true) means if data is not found or has expired,
        // then invoke the corresponding sync method
        autoSync: true,
        syncInBackground: true,
      });
      let user = data;
      if (user && user.logged_in) {
        setUser(user);
      }
    } catch (err) {
      console.log(err);
      console.warn(err.message);
      switch (err.name) {
        case "NotFoundError":
          console.log("User not found!");
          break;
        case "ExpiredError":
          console.log("Login Session Expired!");
          Alert.alert("Login Session Expired!", "Please login again", [
            { text: "Cancel" },
            { text: "Login", onPress: () => navigation.navigate("Login") },
          ]);
          break;
      }
    }
  };

  const logout = () => {
    if (user.logged_in) {
      logoutApi().then((response) => {
        if (response && response.code == 0) {
          // Logout successfully
          user.logged_in = false;
          storage.save({
            key: "login-session",
            data: user,
          });
          Alert.alert("Logged out!", "See you soon!", [
            {
              text: "OK",
              onPress: () => this.props.navigation.navigate("Camera"),
            },
          ]);
        } else if (response.code == -1) {
          Alert.alert("Already Logged out!");
          user.logged_in = false;
          storage.save({
            key: "login-session",
            data: user,
          });
          Alert.alert("Logged out!", "See you soon!", [
            { text: "OK", onPress: () => navigation.navigate("Camera") },
          ]);
        } else {
          user.logged_in = false;
          storage.save({
            key: "login-session",
            data: user,
          });
        }
      });
    } else {
      Alert.alert("Already Logged out!");
    }
  };

  const login = () => {
    navigation.navigate("Login");
  };

  function Item({ item, navigation }) {
    return (
      <TouchableOpacity
        style={styles.listItem}
        onPress={() => {
          navigation.navigate(item.screen);
        }}
      >
        <Text
          style={[
            styles.title,
            { color: "white", fontWeight: "bold", fontSize: 18 },
          ]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  }

  const [user, setUser] = React.useState(null);

  return (
    <SafeAreaView style={[styles.container, styles.statusBarMargin]}>
      {user != null && user.logged_in && (
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 16,
            marginTop: 10,
            color: "white",
            marginRight: 22,
          }}
        >
          Hello, {user.username}
        </Text>
      )}
      <FlatList
        data={
          user != null && user.logged_in ? routes_logged_in : route_anonymous
        }
        renderItem={({ item }) => <Item item={item} navigation={navigation} />}
        keyExtractor={(item) => item.name}
        style={{ width: "100%", alignSelf: "flex-start" }}
      />

      {user != null && user.logged_in && (
        <TouchableOpacity style={styles.button} onPress={logout}>
          <AntDesign
            name="login"
            size={24}
            style={{ color: "white", marginRight: 10 }}
          />
          <Text style={styles.buttonTitle}>Logout</Text>
        </TouchableOpacity>
      )}
      {(user == null || !user.logged_in) && (
        <TouchableOpacity style={styles.button} onPress={login}>
          <AntDesign
            name="logout"
            size={24}
            style={{ color: "white", marginRight: 10 }}
          />
          <Text style={styles.buttonTitle}>Login</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#a5b498",
    color: "white",
  },
  statusBarMargin: {
    marginTop: Platform.OS === "ios" ? 0 : 24,
  },
  profileImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: 40,
  },
  icon: {
    width: 30,
    height: 30,
  },
  listItem: {
    height: 60,
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    fontSize: 16,
    marginLeft: 20,
  },
  button: {
    flexDirection: "row",
    alignSelf: "stretch",
    borderRadius: 4,
    backgroundColor: "#e36f2c",
    padding: 10,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTitle: {
    color: "white",
    fontSize: 18,
  },
});

export default Sidebar;
