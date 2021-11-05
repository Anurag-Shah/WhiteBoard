import React, { useEffect, useRef } from "react";
import storage from "../config/storage";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import {
  StyleSheet,
  Switch,
  TouchableOpacity,
  CheckBox,
  Text,
  StatusBar,
  Alert,
  View,
  Image,
  SafeAreaView,
  TextInput,
  Platform,
} from "react-native";
import Dialog from "react-native-dialog";
import { loginApi, resetPwdApi, helloApi } from "../requests/api";

function Prompt(props) {
  const [email, setEmail] = React.useState("");
  const [feedback, setFeedback] = React.useState("");
  const [success, setSuccess] = React.useState(true);
  const handleConfirm = () => {
    // Validate Input first
    if (email.indexOf("@") < 0) {
      setSuccess(false);
      setFeedback("Please enter a valid email...");
    } else {

      // Send Email to backend
      resetPwdApi(email).then((response) => {
        console.log(response);
        if (response.code == 0) {
          // Send successfully
          setSuccess(true);
          setFeedback("");
          Alert.alert(
            "Reset password link sent!",
            'A reset password link has been sent to "' + email + '"',
            [{ text: "OK", onPress: () => { props.setVisible(false); } }]
          );
        } else if (response.code == -1) {
          // Email has not been registered
          setSuccess(false);
          setFeedback("No account found!");
        } else if (response.code == -2) {
          // Error sending pwd reset email
        }
      });
    }
  };

  return (
    <Dialog.Container visible={props.visible}>
      {Platform.OS !== "android" ? (
        <Dialog.Title>Please enter your email to reset password:</Dialog.Title>
      ) : (
        <Dialog.Description>
          Please enter your email to reset password:
        </Dialog.Description>
      )}
      <Dialog.Input value={email} onChangeText={setEmail} />
      <Text
        style={{
          color: success ? "black" : "red",
          paddingLeft: 20,
          paddingBottom: 15,
        }}
      >
        {feedback}
      </Text>
      <Dialog.Button label="Cancel" onPress={() => props.setVisible(false)} />
      <Dialog.Button label="Confirm" onPress={() => handleConfirm()} />
    </Dialog.Container>
  );
}

function LoginPage({ navigation }) {
  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
    console.log("toggleMePressed");
  };

  useEffect(() => {
    console.log("I am useEffect!");
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
        console.log("Login Page found data!");
        if (ret.rememberMe) {
          setUsername(ret.username);
          setPwd(ret.password);
          setRememberMe(true);
        } else {
          setUsername("");
          setPwd("");
          setRememberMe(false);
        }
      })
      .catch((err) => {
        // any exception including data not found
        // goes to catch()
        console.log("User not found!");
        setUsername("");
        setPwd("");
        setRememberMe(false);
      });
  };

  const forgotPwd = () => {
    console.log("Forgot Password...");
    setClicked(true);
    setVisible(true);
    // if (Platform.OS !== "android") {
    //   Alert.prompt("Please enter your email to reset password:", '', text => handleConfirm);
    // }
  };

  const login = () => {
    console.log("Login Clicked");
    // login Api communicates with the backend
    let user = {
      username: username,
      password: password,
      token: "",
      rememberMe: true,
      logged_in: false,
    };
    loginApi(username, password).then((response) => {
      if (response && response.code == 0) {
        // If Login successfully
        user.logged_in = true;
        user.token = response.token;
        user.user_info = response.user;
        setWrongInfo(false);
        if (rememberMe) {
          console.log("Remember me true");
          user.rememberMe = true;
        } else {
          user.rememberMe = false;
          setTimeout(() => {
            setUsername("");
            setPwd("");
          }, 3000);
        }
        storage.save({
          key: "login-session",
          data: user,
        });
        // Redirecting to Camera Page
        Alert.alert("", "Logged in Successfully!", [
          { text: "OK", onPress: () => { navigation.push("Camera"); navigation.push("Drawer"); } },
        ]);
      } else {
        setWrongInfo(true);
        console.log(response.msg);
      }
    });

    // For frontend testing
    // const test_username = "admin";
    // const test_password = "666";
    // var response;
    // if (username === test_username && password === test_password) { // replace your testing username and password
    //   response = { code: 0, msg: "Success" };
    // } else if (username == test_username && password !== test_password) {
    //   response = { code: -1, msg: "wrong password" };
    // } else {
    //   response = { code: -2, msg: "user does not exist" }
    // }
    // if (response.code == 0) {
    //   // If Login successfully
    //   setWrongInfo(false);
    //   if (rememberMe) {
    //     console.log("Remember me true");
    //     let user = { username: username, password: password };
    //     console.log(user);
    //     storage.save({
    //       key: "login-session",
    //       data: user,
    //     });
    //   } else {
    //     console.log("Removing user info....");
    //     storage.remove({
    //       key: "login-session",
    //     });
    //   }
    //   // Redirecting to Camera Page
    //   Alert.alert('', 'Logged in Successfully!', [{ text: 'OK', onPress: () => navigation.navigate('Camera') }]);
    // } else {
    //   setWrongInfo(true);
    //   console.log(response.msg);
    // }
  };

  const signUp = () => {
    console.log("Sign Up clicked");
    navigation.push("Register");
  };

  const [username, setUsername] = React.useState("");
  const [password, setPwd] = React.useState("");
  const [showPwd, setSecurity] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [clicked, setClicked] = React.useState(false);
  const [wrongInfo, setWrongInfo] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* <Ionicons name="md-return-up-back" size={32} color="black" style={styles.back_icon} /> */}
      <View style={styles.sub_container}>
        <Image
          resizeMode="contain"
          source={require("../assets/logo.png")}
          style={styles.image}
        />

        {wrongInfo ? (
          <View style={styles.errorMsg}>
            <Text style={{ color: "#d40824" }}>
              Incorrect username or password.
            </Text>
          </View>
        ) : null}

        <View
          style={[
            styles.input_box,
            {
              borderColor: wrongInfo ? "red" : "black",
              borderWidth: wrongInfo ? 2 : 1,
            },
          ]}
        >
          <FontAwesome
            style={styles.icon}
            name="user"
            size={25}
            color="#929c92"
          />
          <TextInput
            style={styles.input}
            onChangeText={setUsername}
            value={username}
            placeholder="Username"
            importantForAutofill="yes"
          />
        </View>

        <View
          style={[
            styles.input_box,
            {
              borderColor: wrongInfo ? "red" : "black",
              borderWidth: wrongInfo ? 2 : 1,
            },
          ]}
        >
          <FontAwesome
            style={styles.icon}
            name="key"
            size={25}
            color="#929c92"
          />
          <TextInput
            secureTextEntry={!showPwd}
            style={styles.input}
            onChangeText={setPwd}
            value={password}
            placeholder="Password"
            importantForAutofill="yes"
          />
          <Entypo
            style={styles.eye_icon}
            name={showPwd ? "eye" : "eye-with-line"}
            size={24}
            color="black"
            onPress={() => setSecurity(!showPwd)}
          />
        </View>

        <View style={styles.extra}>
          <View style={styles.checkbox}>
            {Platform.OS === "android" ? (
              <CheckBox
                value={rememberMe}
                onValueChange={() => toggleRememberMe()}
              />
            ) : (
              <Switch
                value={rememberMe}
                onValueChange={() => toggleRememberMe()}
                style={{ marginRight: 5 }}
              />
            )}
            <Text style={{ marginTop: 5 }}>Remember me</Text>
          </View>
          <View>
            <Text
              onPress={() => forgotPwd()}
              style={{ marginTop: 5, color: clicked ? "#834299" : "#4a7fd4" }}
            >
              Forgot Password
            </Text>
          </View>
        </View>

        <View style={styles.buttons}>
          {/* <View style={styles.button_view}><Button title="Login" style={{height: "100%"}}/></View> */}
          <TouchableOpacity style={styles.button} onPress={login}>
            <Text style={styles.button_text}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => signUp()}>
            <Text style={styles.button_text}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
      {visible ? (
        <Prompt visible={visible} setVisible={setVisible}></Prompt>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  back_icon: {
    position: "absolute",
    left: 20,
    top: 50,
  },

  button: {
    width: 160,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3f993f",
  },

  buttons: {
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 55,
    width: "90%",
  },

  button_text: {
    color: "white",
    fontFamily: Platform.OS === "android" ? "monospace" : "Al Nile",
  },

  checkbox: {
    flexDirection: "row",
  },

  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "white",
    height: "100%",
    //flex:1,
  },

  errorMsg: {
    borderWidth: 1,
    borderColor: "red",
    height: 50,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: "#edc2c8",
  },

  extra: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 50,
    width: "90%",
  },

  eye_icon: {
    position: "absolute",
    right: 10,
    top: 11,
  },

  icon: {
    height: "100%",
    position: "absolute",
    top: 11,
    left: 10,
  },

  image: {
    //marginTop: 100,
    width: 250,
    height: 180,
    //borderRadius: 800,
  },

  input: {
    height: "100%",
    position: "absolute",
    left: 50,
    //top: 5,
    width: "80%",
    //margin: 12,
    //paddingLeft: 30,
  },

  input_box: {
    borderWidth: 1,
    margin: 10,
    height: 50,
    width: "90%",
    //flex:1,
    //justifyContent: "center",
  },

  sub_container: {
    alignItems: "center",
    //justifyContent: "flex-end",
    //justifyContent: "center",
  },
});

export default LoginPage;
