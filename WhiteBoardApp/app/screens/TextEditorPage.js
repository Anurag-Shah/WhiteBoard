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
  ScrollView,
  Text,
  Button,
} from "react-native";
import { Icon } from "react-native-elements";
import Topbar from "./shared/Topbar";

import urls from "../requests/urls";

// const serverURL = "ec2-18-218-227-246.us-east-2.compute.amazonaws.com";
const serverURL = "http://172.16.50.73:8000/";

export default class TextEditorPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typenCode: "",
      responseReceived: false,
      returnValue: 1,
      returnMessage: "",
    };
  }

  async sendCode() {
    try {
      // const res = await fetch(serverURL + "Text/process", {
      //   method: "POST",
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ typenCode: this.state.typenCode }),
      // });
      const res = await fetch(
        "http://ec2-3-138-112-15.us-east-2.compute.amazonaws.com/TextUpload/",
        {
          method: "GET", // TODO: need to be "POST" since need to send the code, group num, and file name
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          //body: JSON.stringify({ typenCode: this.state.typenCode }),
        }
      );
      const response = await res.json();
      Alert.alert("Code Sent", "Your code has been successfully sent!", [
        {
          text: "OK",
          onPress: () => {
            this.setState({ responseReceived: true });

            //console.log(response);
            const terminalOutput = response.terminal_output; // might need to change the name of the key, depending on backend implementation
            if (terminalOutput == null) {
              this.setState({ returnValue: -1 });
              Alert.alert(
                "Error",
                "There are some error occurred. The stack trace will be displayed.",
                [{ text: "OK" }]
              );
            }
            // else if (code == RUNTIMEERROR) {
            //   return Alert.alert(
            //     "Runtime Error",
            //     "There are some runtime error occurred. The stack trace will be displayed.",
            //     [{ text: "OK" }]
            //   );
            // }
            else {
              this.setState({ returnValue: 0 });
              Alert.alert(
                "Success",
                "Your code runs successfully! The output of your code will be displayed.",
                [{ text: "OK" }]
              );
            }

            const compileResult = response.compile_result;
            this.setState({
              returnMessage: compileResult,
            });
          },
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  }

  displayConsoleLog() {
    if (this.state.responseReceived) {
      if (this.state.returnValue == 0) {
        return (
          <View style={styles.consolelog}>
            <ScrollView style={styles.scroll}>
              <Text>{this.state.returnMessage}</Text>
            </ScrollView>
          </View>
        );
      } else if (this.state.returnValue == -1) {
        return (
          <View style={styles.consolelog}>
            <ScrollView style={styles.scroll}>
              <Text style={styles.errorMessage}>
                {this.state.returnMessage}
              </Text>
            </ScrollView>
          </View>
        );
      }
    }
  }

  saveOrDiscard() {
    if (this.state.responseReceived) {
      return (
        <View style={styles.saveDiscard}>
          <View style={styles.button}>
            <Button
              title="Save"
              onPress={() => {
                // TODO: popup window to choose a group and name the code file
              }}
            />
          </View>
          <View style={styles.button}>
            <Button
              title="Discard"
              color="red"
              onPress={() => {
                Alert.alert(
                  "Are you sure to discard?",
                  "Discarding will not save the code just compiled. You will not be able to see the code anymore after discarding.",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Discard",
                      style: "destructive",
                      onPress: () => {
                        this.setState({ responseReceived: false });
                      },
                    },
                  ]
                );
              }}
            />
          </View>
        </View>
      );
    }
  }

  render() {
    return (
      <SafeAreaView
        style={{ flex: 1, paddingTop: Platform.OS === "ios" ? 0 : 20 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View>
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
                },
              ])
            }
          />
        </View>

        <View>{this.displayConsoleLog()}</View>

        <View>{this.saveOrDiscard()}</View>

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

  consolelog: {
    height: 200,
  },

  scroll: {
    marginLeft: 20,
    marginRight: 20,
  },

  errorMessage: {
    color: "red",
  },

  saveDiscard: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 15,
  },

  button: {
    marginLeft: 45,
    marginRight: 30,
  },
});
