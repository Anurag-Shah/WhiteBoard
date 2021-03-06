import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

function Save(_props) {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} />
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
  },
});
export default Save;