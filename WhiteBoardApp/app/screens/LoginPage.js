import React, { useEffect, useRef } from 'react';
import { FontAwesome, Ionicons, Entypo } from '@expo/vector-icons'
import {
  StyleSheet,
  TouchableOpacity,
  CheckBox,
  Text,
  StatusBar,
  Alert,
  View,
  Image,
  SafeAreaView,
  TextInput,
} from 'react-native';
import Dialog from "react-native-dialog";
import AsyncStorage from '@react-native-async-storage/async-storage';


function Prompt(props) {
  const [email, setEmail] = React.useState('');
  const [feedback, setFeedback] = React.useState('');
  const [success, setSuccess] = React.useState(true);
  const handleConfirm = () => {
    // Validate Input first
    if (email.indexOf('@') < 0) {
      setSuccess(false);
      setFeedback("Invalid input! Please enter a valid email...");
    } else {
      // Send Email to backend
      // Recieve success msg
      if (email == "jenna@gmail.com") {
        setSuccess(true);
        setFeedback("");
        Alert.alert('Reset password link sent!', 'A reset password link has been sent to \"' + email + '\"', [
          { text: 'OK' }]);
        props.setVisible(false);
      } else {
        setSuccess(false);
        setFeedback("No account found!");
      }
    }
  };

  return (
    <Dialog.Container visible={props.visible}>
      <Dialog.Description>
        Please enter your email to reset password:
      </Dialog.Description>
      <Dialog.Input value={email} onChangeText={setEmail} />
      <Text style={{ color: success ? "black" : "red", paddingLeft: 10 }}>{feedback}</Text>
      <Dialog.Button label="Cancel" onPress={() => props.setVisible(false)} />
      <Dialog.Button label="Confirm" onPress={() => handleConfirm()} />
    </Dialog.Container>
  )
}


function LoginPage(props) {

  toggleRememberMe = () => {
    setRememberMe(!rememberMe);
    console.log("toggleMePressed");
  };

  useEffect(() => {
    getUserInfo();
  });

  const getUserInfo = async () => {
    try {
      const result = await AsyncStorage.getItem('USER');
      if (result) {
        username = USER.username;
        password = USER.password;
      }
    } catch (error) {
      console.log("error getting User Acoount Info...");
    }
  };

  const forgotPwd = () => {
    console.log("Forgot Password...");
    setClicked(true);
    setVisible(true);
  };

  const login = () => {
    console.log("Login Clicked");
    if (username === "admin" && password === "666") {
      setWrongInfo(false);
    } else {
      setWrongInfo(true);
    }

    if (!wrongInfo) {
      // If Login successfully
      if (rememberMe) {
        const user = { username: username, password: password };
        async () => {
          await AsyncStorage.setItem('USER', user);
        };
      } else {
        async () => {
          try {
            await AsyncStorage.removeItem('USER');
          } catch (error) {
            console.log("Error removing User info...");
          }
        }
      }
      Alert.alert('Logged in Successfully!', 'Going to camera page...');
      // Redirecting to Camera Page
    } else {
      // else 
      // Error Msg
    }
  };

  const signUp = () => {
    console.log("Sign Up clicked");
    // Redirect to Signup page
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
      <Ionicons name="md-return-up-back" size={32} color="black" style={styles.back_icon} />
      <View style={styles.sub_container}>
        <Image
          resizeMode="contain"
          source={require('../assets/logo.png')} style={styles.image} />

        {wrongInfo ? <View style={styles.errorMsg}>
          <Text style={{ color: "#d40824" }}>Incorrect username or password.</Text>
        </View> : null}

        <View style={[styles.input_box, { borderColor: wrongInfo ? "red" : "black", borderWidth: wrongInfo ? 2 : 1 }]}>
          <FontAwesome style={styles.icon} name="user" size={25} color="#929c92" />
          <TextInput
            style={styles.input}
            onChangeText={setUsername}
            value={username}
            placeholder="Username"
            importantForAutofill="yes"
          />
        </View>

        <View style={[styles.input_box, { borderColor: wrongInfo ? "red" : "black", borderWidth: wrongInfo ? 2 : 1 }]}>
          <FontAwesome style={styles.icon} name="key" size={25} color="#929c92" />
          <TextInput
            secureTextEntry={!showPwd}
            style={styles.input}
            onChangeText={setPwd}
            value={password}
            placeholder="Password"
            importantForAutofill="yes"
          />
          <Entypo style={styles.eye_icon} name={showPwd ? "eye" : "eye-with-line"} size={24} color="black" onPress={() => setSecurity(!showPwd)} />
        </View>

        <View style={styles.extra}>
          <View style={styles.checkbox}>
            <CheckBox
              value={rememberMe}
              onValueChange={() => toggleRememberMe()}
            />
            <Text style={{ marginTop: 5 }}>Remember me</Text>
          </View>
          <View>
            <Text onPress={() => forgotPwd()} style={{ marginTop: 5, color: clicked ? "#834299" : "#4a7fd4" }}>Forgot Password</Text>
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
      {visible ? <Prompt visible={visible} setVisible={setVisible}></Prompt> : null}
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
    backgroundColor: "#edc2c8"
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
    top: 11
  },

  icon: {
    height: "100%",
    position: "absolute",
    top: 11,
    left: 10,
  },

  image: {
    marginTop: 100,
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
    width: "90%"
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