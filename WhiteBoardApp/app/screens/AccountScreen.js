import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  View,
  Button,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { setAvatarApi, updateAccountApi } from '../requests/api';
import * as ImagePicker from 'expo-image-picker';
import storage from "../config/storage";
import defAvatar from '../assets/avatar.png';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import urls from '../requests/urls';
import Topbar from './shared/Topbar';

const onChangeText = () => {
  console.log('here');
}

function Account({ navigation }) {

  useEffect(() => {
    getUserInfo();
  }, [])

  const getUserInfo = () => {
    // Get user account info in local storage
    storage
      .load({
        key: 'login-session',
        // autoSync (default: true) means if data is not found or has expired,
        // then invoke the corresponding sync method
        autoSync: false,
        syncInBackground: true,
      })
      .then(ret => {
        // found data go to then()
        // console.log(ret);
        setUser(ret);
        setUsername(ret.userInfo.name);
        setEmail(ret.userInfo.email);
        setUid(ret.userInfo.uid + "");
        setUri(ret.userInfo.avatar);
        // console.log(avatarUri);
        console.log("Account Page found data!");
      })
      .catch(err => {
        // any exception including data not found
        // goes to catch()
        console.log(err);
      });
  };

  const discardChange = () => {
    setUsername(user.userInfo.name);
    setEmail(user.userInfo.name);
    SetEdit(false);
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      noData: true,
      aspect: [3, 4],
      quality: 1,
      base64: true
    });
    // console.log(result);
    if (!result.cancelled) {
      // setAvatar(result);
      sendPicture(result);
      setUploading(true);
    }
  };


  const sendPicture = (picture) => {
    let filename = picture.uri.split('/').pop();
    // // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    //formData.append('Content-Type', type);

    const createFormData = (photo, body = {}) => {
      const data = new FormData();
      var uri = Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri;
      data.append('Image', photo.base64);

      Object.keys(body).forEach((key) => {
        data.append(key, body[key]);
      });
      // console.log('I am in formdata', data._parts[0])
      return data;
    };

    let data = createFormData(picture, { name: 'TestImage', description: 'picture' });
    setAvatarApi(data).then((res) => {
      if (res && res.code == 0) {
        let new_avatar = urls.base_url.slice(0, -1) + res.user.avatar;
        res.user.avatar = new_avatar;
        // \console.log(res);
        update_user(res);
        setUri(null);
        setAvatar(picture);
        setUploading(false);
        Alert.alert('Success', 'The avatar was successfully changed!');
      } else {
        console.log('Connection Error!');
        Alert.alert('Error', 'Something went wrong!');
        setUploading(false);
      }
    });
  };

  const update = () => {
    console.log(username);
    updateAccountApi(username, email).then((res) => {
      //console.log(res);
      if (res) {
        if (res.code == 0) {
          setNameDup(false);
          setEmailDup(false);
          let new_avatar = urls.base_url.slice(0, -1) + res.user.avatar;
          res.user.avatar = new_avatar;
          update_user(res);
          Alert.alert("UserInfo successfully updated!");
          SetEdit(false);
        } else if (res.code == -1) {
          setNameDup(true);
          setEmailDup(false);
        } else if (res.code == -2) {
          setNameDup(false);
          setEmailDup(true);
        } else {
          setNameDup(true);
          setEmailDup(true);
        }
      }
    });
  }

  const update_user = (res) => {
    let new_user = user;
    new_user.userInfo = res.user;
    storage.save({
      key: "login-session",
      data: new_user,
    });
    setUser(new_user);
    // console.log(new_user);
  }

  const userInfo = {
    name: "jack",
    avatar: null,
    uid: 1,
    email: "member1@team18.com",
  };

  const [user, setUser] = useState(userInfo);
  const [uid, setUid] = useState(user.uid + "");
  const [username, setUsername] = useState(user.name);
  const [nameDup, setNameDup] = useState(false);
  const [email, setEmail] = useState(user.email);
  const [emailDup, setEmailDup] = useState(false);
  const [avatar, setAvatar] = useState(defAvatar);
  const [avatarUri, setUri] = useState(null);
  const [isUploading, setUploading] = useState(false);
  // const [phoneNum, setPhoneNum] = useState("12345678");
  const [edit, SetEdit] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Topbar title="My Account" navigation={navigation} />

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Avatar
          resizeMode="contain"
          rounded
          size="xlarge"
          source={avatarUri ? { uri: avatarUri } : avatar}
        />
        {isUploading ? <ActivityIndicator /> : null}
        <Button
          title="Change"
          onPress={() => pickImage()}
        />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.item}>
            <Text style={styles.title}>Username</Text>
            <TextInput
              style={[styles.input, {
                borderWidth: edit ? 1 : 0,
                borderColor: nameDup ? "red" : "black"
              }]}
              title="username"
              value={username}
              onChangeText={setUsername}
              editable={edit}
            />
          </View>
          <View style={styles.item}>
            <Text style={styles.title}>UserID</Text>
            <TextInput
              style={[styles.input, {
                borderColor: "#b8c3d4", borderWidth: edit ? 1 : 0,
              }]}
              value={uid}
              onChangeText={setUid}
              editable={false}
            />
          </View>
          <View style={styles.item}>
            <Text style={styles.title}>Email</Text>
            <TextInput
              style={[styles.input, {
                borderWidth: edit ? 1 : 0,
                borderColor: emailDup ? "red" : "black"
              }]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={edit}
            />
          </View>
          {/* <View style={styles.item}>
          <Text style={styles.title}>Team</Text>
          <TextInput
            style={styles.input}
            value={teamName}
            onChangeText={text => onChangeTeamName(text)}
          />
        </View> */}
        </View>
      </KeyboardAvoidingView>
      {edit ? <View style={{ bottom: 80 }}>
        <Button
          title="Update"
          onPress={() => Alert.alert("Update?", '\n', [
            { text: "Cancel" }, { text: "OK", onPress: () => update() }
          ])}
        />
        <Button
          title="Discard"
          color="red"
          onPress={() => Alert.alert("Discard Change?", '\n', [
            { text: "Cancel" }, { text: "OK", onPress: () => discardChange() }
          ])}
        />
      </View> : <View style={{ bottom: 100 }}>
        <Button
          title="Edit"
          onPress={() => SetEdit(!edit)}
        />
      </View>}
    </SafeAreaView>
  );
}
// <StatusBar style="auto" />
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  item: {
    backgroundColor: 'white',
    flexDirection: "row",
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 20,
    paddingLeft: 10,
    alignItems: "baseline",
  },
  title: {
    fontSize: 18,
    flex: 0.3,
    fontWeight: 'bold',
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 15,
    fontSize: 24,
  },
  input: {
    flex: 0.7,
    fontSize: 18,
    borderWidth: 1,
    borderBottomWidth: 1,
    marginLeft: 9,
    paddingLeft: 4,
  }
});
export default Account;