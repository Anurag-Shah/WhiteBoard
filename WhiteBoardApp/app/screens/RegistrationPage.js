import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Image,
  TextInput,
  Text,
  View,
  Button,
} from "react-native";
import { Icon } from "react-native-elements";

function RegistrationPage(props) {
  const [username, onChangeUsername] = React.useState(null);
  const [email, onChangeEmail] = React.useState(null);
  const [password, onChangePassword] = React.useState(null);
  const [confirm, onChangeConfirm] = React.useState(null);

  return (
    <SafeAreaView>
      <Icon
        style={styles.icon}
        name="arrow-undo-outline"
        type="ionicon"
        color="#000"
        alignItems="left"
        //onPress
      />
      <View style={styles.container}>
        <Image style={styles.image} source={require("../assets/logo.png")} />
        <TextInput
          style={styles.input}
          onChangeText={onChangeUsername}
          value={username}
          placeholder="username"
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangeEmail}
          value={email}
          placeholder="email address"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangePassword}
          value={password}
          placeholder="password"
          contextMenuHidden={true}
          secureTextEntry={true}
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangeConfirm}
          value={confirm}
          placeholder="confirm password"
          contextMenuHidden={true}
          secureTextEntry={true}
          onEndEditing={() => {
            if (password == confirm) {
              console.log("same");
            } else {
              console.log("not same");
            }
          }}
        />
        <View style={styles.button}>
          <Button
            title="Sign up"
            color="#fff"
            onPress={() => console.log("Sign up success!")} //TODO
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginLeft: 30,
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

  button: {
    width: 110,
    height: 40,
    backgroundColor: "green",
    margin: 30,
  },
});

export default RegistrationPage;
