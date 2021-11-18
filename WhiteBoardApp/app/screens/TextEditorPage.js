/**
 * TextEditorPage.js
 *
 * Authors: Michelle He
 *
 * This is the text editor page that allows users to type code and run it
 */

import React from "react";
import {
  SafeAreaView,
  Alert,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  Platform,
  View,
} from "react-native";
import { Header, Icon } from "react-native-elements";
import Topbar from "./shared/Topbar";

// const serverURL = "ec2-18-218-227-246.us-east-2.compute.amazonaws.com";
// const serverURL = "http://127.0.0.1:8000/";
const serverURL = "http://172.16.50.73:8000/";

export default class TextEditorPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typenCode: "",
    };
  }

  async sendCode() {
    Alert.alert("Success", "Your code has been successfully sent!", [
      { text: "OK" },
    ]);

    // TODO: get groupID from local storage
    try {
      // TODO: request URL
      const res = await fetch(serverURL + "TypenCodes/" + groupID, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ typenCode: this.state.typenCode }),
      });
      const response = await res.json();

      // TODO: response handling
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <SafeAreaView
        style={{ backgroundColor: "white", flex: 1, paddingTop: Platform.OS === "ios" ? 0 : 20 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1 }}>
            <Topbar title="Text Editor" navigation={this.props.navigation} />
          </View>
        </TouchableWithoutFeedback>
        {/* <SafeAreaProvider> */}

        <TextInput
          style={styles.input}
          placeholder="Start typying your code here..."
          multiline={true}
          onChangeText={(typenCode) => this.setState({ typenCode })}
        />

        <View style={styles.view}>
          <Icon
            name="play"
            type="ionicon"
            color="#000"
            size={40}
            style={styles.play}
            onPress={() =>
              Alert.alert("Attention", "Are you sure of running the code?", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Submit",
                  style: "destructive",
                  onPress: () => this.sendCode(),
                  // console.log(this.state.typenCode),
                }, //TODO: send code to backend for compilation
              ])
            }
          />
        </View>
        {/* </SafeAreaProvider> */}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  menu: {
    marginLeft: 10,
  },

  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
  },

  camera: {
    marginRight: 10,
  },

  input: {
    backgroundColor: "#d3dae6",
    flex: 11,
    fontSize: 16,
    padding: 10,
  },

  view: {
    flex: 1,
  },

  play: {
    marginTop: 5,
    marginRight: 15,
    alignItems: "flex-end",
  },
});
