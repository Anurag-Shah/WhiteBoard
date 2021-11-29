import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default class Topbar extends React.Component {
  render() {
    return (
      <View style={[styles.container, styles.statusBarMargin]} >
        <TouchableOpacity onPress={() => { this.props.navigation.dispatch(DrawerActions.openDrawer()) }}>
          <Ionicons name="ios-list" size={32} style={{ color: 'black' }} />
        </TouchableOpacity>

        <Text style={styles.title}>{this.props.title}</Text>
        {this.props.title === 'Camera' ? (
          <TouchableOpacity onPress={() => this.props.navigation.navigate('TextEditorPage')}>
            <Ionicons name="clipboard-outline" size={32} style={{ color: 'black' }} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Camera')}>
            <Ionicons name="camera-outline" size={32} style={{ color: 'black' }} />
          </TouchableOpacity>
        )

        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: (Platform.OS === 'ios') ? 44 : 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: 'white'
  },
  statusBarMargin: {
    marginTop: (Platform.OS === 'ios') ? 0 : 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#336600'
  },
});