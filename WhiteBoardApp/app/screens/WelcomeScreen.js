import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: "#e36f2c",
  },
  headerTintColor: "white",
  headerBackTitle: "Back",
};


function WelcomeScreen({ navigation }) {
  useEffect(() => {
    setTimeout(() => {
      navigation.push('Camera');
    }, 3000);
  });
  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
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

export default WelcomeScreen;
