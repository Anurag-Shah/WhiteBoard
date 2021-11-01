import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export default class Startup extends React.Component {
    render() {
        setTimeout(() => this.props.navigation.replace('library'),2000)
        return (
        <View style={styles.container}>
            <Image style={styles.image} source={require('../image/logo.png')}></Image>
            <StatusBar style="auto" />
        </View>)
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignSelf: 'center',
    backgroundColor: '#fff'
  },
  image: {
    resizeMode: 'center'
  }
});
