import React, { Component } from "react";
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
} from "react-native";
import { Icon } from "react-native-elements";
import { StatusBar } from "expo-status-bar";

export default class RegistrationPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleInvalidEmail = this.handleInvalidEmail.bind(this);
    this.state = {
      username: "",
      email: "",
      password: "",
      confirm: "",
      validEmail: true,
      samePassword: true,
    };
  }

  validateEmail = (email) => {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  handleInvalidEmail() {
    if (this.state.email != "" && !this.state.validEmail) {
      return <Text style={styles.errorMessage}>Invalid Email!</Text>;
    } else {
      return null;
    }
  }

  handlePasswordMismatch() {
    if (this.state.confirm != "" && !this.state.samePassword) {
      return <Text style={styles.errorMessage}>Password Mismatch!</Text>;
    } else {
      return null;
    }
  }

  render() {
    return (
      <SafeAreaView>
        <StatusBar style="auto" />
        <Icon
          style={styles.icon}
          name="arrow-undo-outline"
          type="ionicon"
          color="#000"
          onPress={() => console.log("Back to login in page")} //TODO: redirect back to login page
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
                console.log(this.state.password);
                console.log(this.state.confirm);
                if (
                  (this.state.password != "" && this.state.confirm != "") ||
                  this.state.password == this.state.confirm
                ) {
                  console.log("same");
                  this.setState({ samePassword: true });
                } else {
                  console.log("not same");
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
                onPress={() => console.log("Sign up success!")} //TODO: send new user info to backend and redirect to login in page
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
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

  errorMessage: {
    color: "red",
    marginLeft: 200,
  },

  button: {
    width: 110,
    height: 40,
    backgroundColor: "green",
    margin: 30,
  },
});
