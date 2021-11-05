import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Image, Text, Button, TextInput, Platform, TouchableOpacity } from 'react-native';
import { setAvatarApi, getAvatarApi } from '../requests/api';

import defAvatar from '../assets/avatar.png';


const onChangeText = () => {
  console.log('here');
}
function Account(props) {

  let userInfo = {
    Avatar: null,
    UserID: "member1",
    Email: "member1@team18.com",
    PhoneNum: "123456789",
    TeamID: "18",
    TeamName: "Team 18",
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = () => {
    // Store user account info in local storage
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
        setUser(ret)
        console.log("Account Page found data!")

      })
      .catch(err => {
        // any exception including data not found
        // goes to catch()
        console.log("User not found!")
        setUsername('');
        setPwd('');
        setRememberMe(false);
      });
  };

  const [user, setUser] = React.useState();
  const [userID, onChangeUserID] = React.useState(user.UserID);
  const [email, onChangeEmail] = React.useState(user.Email);
  const [phone, onChangePhone] = React.useState(user.PhoneNum);
  const [teamName, onChangeTeamName] = React.useState(userInfo);
  const [avatar, onChangeAvatar] = React.useState(user.avatar);

  const discardChange = () => {
    onChangeUserID(user.user_info.uid);
    onChangeEmail(user.user_info.email);
    onChangePhone(userInfo.PhoneNum);
    onChangeTeamName(userInfo.TeamName);
  }

  const { navigate } = props.navigation;

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={avatar ? avatar : defAvatar} style={styles.avatar}
        />
        <Button
          title="Change"
          onPress={() => Alert.alert('Avatar Change pressed')}
        />
      </View>
      <View>
        <View style={styles.item}>
          <Text style={styles.title}>UserID</Text>
          <TextInput
            style={styles.input}
            value={userID}
            onChangeText={(text) => onChangeUserID(text)}
          />
        </View>
        <View style={styles.item}>
          <Text style={styles.title}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={text => onChangeEmail(text)}
            keyboardType="email-address"
          />
        </View>
        {/*         
        <View style={styles.item}>
          <Text style={styles.title}>Team</Text>
          <TextInput
              style={styles.input}
              value={teamName}
              onChangeText={text => onChangeTeamName(text)}
          />
        </View> */}
      </View>
      <View style={styles.fixToText}>
        <Button
          title="Update"
          onPress={() => Alert.alert('Update button pressed')}
        />
        <Button
          title="Discard"
          color="red"
          onPress={() => discardChange()}
        />
      </View>
    </SafeAreaView>
  );
}
// <StatusBar style="auto" />
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: 'rgb(248, 245, 249)',
    flexDirection: "row",
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 18,
    flex: 0.25,
  },
  avatar: {
    width: 150,
    height: 150,
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
  }
});
export default Account;