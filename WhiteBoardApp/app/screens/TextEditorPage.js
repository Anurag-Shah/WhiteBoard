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

import Topbar from './shared/Topbar';

function TextEditorPage({navigation}) {
  const [code, onChangeCode] = React.useState(null);

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: (Platform.OS === 'ios')? 0 : 20 }}>
      <Topbar title="Text Editor" navigation={navigation} />
      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View>
          <Header
            barStyle="dark-content"
            backgroundColor="#fff"
            leftComponent={{
              icon: "menu",
              color: "#000",
              style: styles.menu,
              onPress: () => console.log("Sidebar"), //TODO: sidebar
            }}
            centerComponent={{ text: "Text Editor", style: styles.text }}
            rightComponent={
              <Icon
                name="camera-outline"
                type="ionicon"
                color="#000"
                style={styles.camera}
                onPress={() => console.log("To camera page")} //TODO: redirect to camera page
              />
            }
          />
        </View>
      </TouchableWithoutFeedback> */}

      <TextInput
        style={styles.input}
        onChangeText={onChangeCode}
        value={code}
        multiline={true}
        placeholder="Start typying your code here..."
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
                onPress: () => console.log(code),
              }, //TODO: send code to backend for compilation
            ])
          }
        />
      </View>
    </SafeAreaView>
  );
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
    flex: 1,
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

export default TextEditorPage;
