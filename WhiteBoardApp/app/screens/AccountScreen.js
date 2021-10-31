import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, Image, Text, Platform, TouchableOpacity } from 'react-native';

import avatar from '../assets/avatar.png';



function Account(props) {
  const userInfo = {
    UserID:   "member1",
    Email:  "member1@team18.com",
    PhoneNum: "123456789",
    TeamID: "18",
    TeamName: "Team 18",
  }
  const { navigate } = props.navigation;
  return (
    <View style={styles.container}>
      <TouchableOpacity style={{alignItems:"left"}}>
        <Text style={{color: '#888', fontSize: 18}}> 
        Edit
        </Text>
      </TouchableOpacity>
      <Image source={avatar} style={[styles.avatar ]} /> 
      <Text style={{color: '#888', fontSize: 18}}> 
        {userInfo.UserID}
      </Text>
      <Text style={{color: '#888', fontSize: 18}}> 
      {userInfo.Email}
      </Text>  
      <Text style={{color: '#888', fontSize: 18}}> 
      {userInfo.PhoneNum}
      </Text> 
      <TouchableOpacity onPress = {()=>navigate("Team")}>
        <Text style={{color: '#888', fontSize: 18}}> 
        {userInfo.TeamName}
        </Text>
      </TouchableOpacity>
      
      <Text style={{color: '#888', fontSize: 18, height:"30%"}}> 
        {''}
      </Text> 
      <StatusBar style="auto" />
    </View>
  );
}
//22
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: 350,
    flexDirection:"column",
    justifyContent:"space-between",
    padding: 40,
  },
  avatar:{
    width:200,
    height:200,

  }
});
export default Account;