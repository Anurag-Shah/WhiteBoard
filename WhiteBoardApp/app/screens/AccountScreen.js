import { StatusBar } from 'expo-status-bar';
import React from 'react';
<<<<<<< HEAD
import { StyleSheet, View, Image, Text, Platform, TouchableOpacity } from 'react-native';
import { setAvatarApi } from '../requests/api';
=======
import { TextInput, StyleSheet, View, FlatList, Image, Text, Platform, TouchableOpacity, SafeAreaView, Button, Alert } from 'react-native';
>>>>>>> main

import defAvatar from '../assets/avatar.png';


const onChangeText = () => {
  console.log('here');
}

function Account(props) {
<<<<<<< HEAD
  const userInfo = {
    UserID: "member1",
    Email: "member1@team18.com",
=======

  let userInfo = {
    Avatar: null,
    UserID:   "member1",
    Email:  "member1@team18.com",
>>>>>>> main
    PhoneNum: "123456789",
    TeamID: "18",
    TeamName: "Team 18",
  }

<<<<<<< HEAD
  const setAvatar = () => {
    // Upload the image using the fetch and FormData APIs
    let formData = new FormData();
    // "Image, name" is the name of the form field the server expects
    // GpID ; inserted into url
    // formData.append('Image', localUri);
    formData.append('name', userName);
    formData.append('Description', 'static');
    setAvatarApi(formData).then((response) => {
      // If on success, change the avatar on account page
    })
=======
  const [userID, onChangeUserID] = React.useState(userInfo.UserID);
  const [email, onChangeEmail] = React.useState(userInfo.Email);
  const [phone, onChangePhone] = React.useState(userInfo.PhoneNum);
  const [teamName, onChangeTeamName] = React.useState(userInfo.TeamName);
  const [avatar, onChangeAvatar] = React.useState(userInfo.avatar);

  const discardChange = () => {
    onChangeUserID(userInfo.UserID);
    onChangeEmail(userInfo.Email);
    onChangePhone(userInfo.PhoneNum);
    onChangeTeamName(userInfo.TeamName);
>>>>>>> main
  }

  const { navigate } = props.navigation;
  
  return (
<<<<<<< HEAD
    <View style={styles.container}>
      <TouchableOpacity style={{ alignItems: "left" }}>
        <Text style={{ color: '#888', fontSize: 18 }}>
          Edit
        </Text>
      </TouchableOpacity>
      <Image source={avatar} style={[styles.avatar]} />
      <Text style={{ color: '#888', fontSize: 18 }}>
        {userInfo.UserID}
      </Text>
      <Text style={{ color: '#888', fontSize: 18 }}>
        {userInfo.Email}
      </Text>
      <Text style={{ color: '#888', fontSize: 18 }}>
        {userInfo.PhoneNum}
      </Text>
      <TouchableOpacity onPress={() => navigate("Team")}>
        <Text style={{ color: '#888', fontSize: 18 }}>
          {userInfo.TeamName}
        </Text>
      </TouchableOpacity>

      <Text style={{ color: '#888', fontSize: 18, height: "30%" }}>
        {''}
      </Text>
      <StatusBar style="auto" />
    </View>
=======
    <SafeAreaView style={styles.container}>
      <View style={{flex:1,  justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={avatar?avatar:defAvatar} style={styles.avatar} 
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
        <View style={styles.item}>
          <Text style={styles.title}>Phone</Text>
          <TextInput
              style={styles.input}
              value={phone}
              onChangeText={text => onChangePhone(text)}
              keyboardType="phone-pad"
          />
        </View>
        <View style={styles.item}>
          <Text style={styles.title}>Team</Text>
          <TextInput
              style={styles.input}
              value={teamName}
              onChangeText={text => onChangeTeamName(text)}
          />
        </View>
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
>>>>>>> main
  );
}
// <StatusBar style="auto" />
const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: 350,
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 40,
  },
  avatar: {
    width: 200,
    height: 200,

=======
  },
  item: {
    backgroundColor: 'rgb(248, 245, 249)',
    flexDirection: "row",
    padding:15,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 18,
    flex: 0.25,
  },
  avatar:{
    width:150,
    height:150,
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
>>>>>>> main
  }
});
export default Account;