/**
 * RegistrationPage.js
 *
 * Authors: Michelle He
 *
 * This is the registration page that allows users to create an account
 */

import React from "react";
import {
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Image,
  TextInput,
  Text,
  View,
  Button,
  Alert,
} from "react-native";
import { Icon } from "react-native-elements";
import { StatusBar } from "expo-status-bar";

// const serverURL = "https://ec2-18-218-227-246.us-east-2.compute.amazonaws.com:8000/";
// const serverURL = "http://127.0.0.1:8000/";
const serverURL = "http://ec2-3-138-112-15.us-east-2.compute.amazonaws.com:8000/";

const BOTHINUSE = -1;
const USERNAMEINUSE = -2;
const EMAILINUSE = -3;

export default class RegistrationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      confirm: "",
      validEmail: true,
      samePassword: true,
      noEmpty: false,
    };
  }

  validateEmail = (email) => {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  handleInvalidEmail() {
    if (this.state.email != "" && !this.state.validEmail) {
      return <Text style={styles.invalidEmail}>Invalid Email!</Text>;
    } else {
      return null;
    }
  }

  handlePasswordMismatch() {
    if (this.state.confirm != "" && !this.state.samePassword) {
      return <Text style={styles.passwordMismatch}>Password Mismatch!</Text>;
    } else {
      return null;
    }
  }

  noEmptyField() {
    if (
      this.state.username != "" &&
      this.state.email != "" &&
      this.state.password != "" &&
      this.state.confirm != ""
    ) {
      this.state.noEmpty = true;
    } else {
      return Alert.alert(
        "Empty field still exists!",
        "Please make sure that all fields are filled.",
        [{ text: "OK" }]
      );
    }
  }

  async sendUserInfo() {
    const userinfo = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
    };

    try {
      console.log("I am here!");
      const res = await fetch(serverURL + "Register/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userinfo),
      });
      const response = await res.json();

      code = Object.values(response)[0];
      if (code == BOTHINUSE) {
        return Alert.alert(
          "Username and email address already in use",
          "Please login or choose another username and email address.",
          [{ text: "OK" }]
        );
      } else if (code == USERNAMEINUSE) {
        return Alert.alert(
          "Username already in use",
          "Please choose another username.",
          [{ text: "OK" }]
        );
      } else if (code == EMAILINUSE) {
        return Alert.alert(
          "Email address already in use",
          "Please try to login or choose another email address.",
          [{ text: "OK" }]
        );
      } else {
        return Alert.alert(
          "Success",
          "Your account has been successfully created!",
          [
            { text: "OK", onPress: () => this.props.navigation.push("Login") }, //TODO: redirect to login page
          ]
        );
      }
    } catch (error) {
      console.log("Fetch error: " + error);
    }

    // fetch(serverURL + "Register/", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(userinfo),
    // })
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }

  render() {
    return (
      <SafeAreaView style={styles.safearea}>
        <StatusBar style="auto" />
        <Icon
          style={styles.icon}
          name="arrow-undo-outline"
          type="ionicon"
          color="#000"
          onPress={() => this.props.navigation.push("Login")} //TODO: redirect back to login page
        />

        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            <Image
              style={styles.image}
              source={require("../assets/logo.png")}
            />

            <TextInput
              style={styles.input}
              placeholder="username"
              onChangeText={(username) => this.setState({ username })}
            />

            <TextInput
              style={styles.input}
              placeholder="email address"
              keyboardType="email-address"
              onChangeText={(email) => this.setState({ email })}
              onChange={() => {
                this.setState({ validEmail: true });
              }}
              onEndEditing={() => {
                if (this.validateEmail(this.state.email)) {
                  this.setState({ validEmail: true });
                } else {
                  this.setState({ validEmail: false });
                }
              }}
            />
            <View>{this.handleInvalidEmail()}</View>

            <TextInput
              style={styles.input}
              placeholder="password"
              contextMenuHidden={true}
              secureTextEntry={true}
              onChangeText={(password) => this.setState({ password })}
              onChange={() => {
                this.setState({ samePassword: true });
              }}
              onEndEditing={() => {
                if (
                  this.state.confirm == "" ||
                  this.state.password == this.state.confirm
                ) {
                  this.setState({ samePassword: true });
                } else {
                  this.setState({ samePassword: false });
                }
              }}
            />

            <TextInput
              style={styles.input}
              placeholder="confirm password"
              contextMenuHidden={true}
              secureTextEntry={true}
              onChangeText={(confirm) => this.setState({ confirm })}
              onChange={() => {
                this.setState({ samePassword: true });
              }}
              onEndEditing={() => {
                if (this.state.password == this.state.confirm) {
                  this.setState({ samePassword: true });
                } else {
                  this.setState({ samePassword: false });
                }
              }}
            />
            <View>{this.handlePasswordMismatch()}</View>

            <View style={styles.button}>
              <Button
                title="Sign up"
                color="#fff"
                onPress={() => {
                  this.noEmptyField();
                  if (this.state.noEmpty) {
                    if (this.state.validEmail && this.state.samePassword) {
                      this.sendUserInfo();
                    } else {
                      Alert.alert(
                        "Input error",
                        "Please correctly input your information.",
                        [{ text: "OK" }]
                      );
                    }
                  }
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  icon: {
    marginTop: 5,
    marginLeft: 30,
    alignItems: "flex-start",
  },

  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: 150,
    height: 150,
    marginTop: 50,
    marginBottom: 30,
  },

  input: {
    width: 300,
    height: 45,
    margin: 10,
    borderWidth: 1,
    padding: 10,
  },

  invalidEmail: {
    color: "red",
    marginLeft: 200,
  },

  passwordMismatch: {
    color: "red",
    marginLeft: 150,
  },

  button: {
    width: 110,
    height: 40,
    backgroundColor: "green",
    margin: 30,
  },
});