import React from 'react';

import { Text, View, Image, StyleSheet, FlatList, TouchableOpacity, Platform, SafeAreaView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '../../config/storage';
import { logoutApi } from '../../requests/api';

export default class Sidebar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      route_anonymous: [
        {
          // name: "Log In",
          // screen: "Login"
          name: '',
        }
      ],
      routes_logged_in: [
        //   {
        //   name: "Save",
        //   screen: "Save"
        // },
        {
          name: "Library",
          screen: "Library"
        }, {
          name: "Team",
          screen: "Team"
        }, {
          name: "Account",
          screen: "Account"
        }],
      user: null,
    }
    this.retrieveData = this.retrieveData.bind(this);
  }

  componentDidMount() {
    this.retrieveData();
  }
  logout = () => {
    let new_user = user;
    if (loginState) {
      logoutApi().then((response) => {
        if (response.code == 0) {
          // Logout successfully
          setLoginState(false);
          new_user.logged_in = false;
          setUser(new_user);
          storage.save({
            key: "login-session",
            data: user,
          });
          Alert.alert("Logged out!", "See you soon!", [{ text: 'OK', onPress: () => this.props.navigation.navigate('Camera') }]);
        } else if (response.code == -1) {
          Alert.alert("Already Logged out!");
        } else {
          console.log(response.status);
        }

      });
    } else {
      Alert.alert("Already Logged out!");
    }
  }
  retrieveData = async () => {
    try {
      let data = await storage.load({
        key: 'login-session',
        // autoSync (default: true) means if data is not found or has expired,
        // then invoke the corresponding sync method
        autoSync: true,
        syncInBackground: true,
      });
      let user = data;
      if (user && user.logged_in) {
        this.setState({
          user: user,
        });
      }
    } catch (error) {
      console.log(error);
      // let user = {logged_in: true, name: 'Yierpan', token:'Token: 123'};
      // this.setState({
      //   user: user,
      // });
      return null;
    }
  };


  render() {
    const userId = "Yierpan42";
    const loggedIn = 'true';

    function Item({ item, navigation }) {
      return (
        <TouchableOpacity style={styles.listItem} onPress={() => (loggedIn == 'true') ? navigation.navigate(item.screen, { userId: userId }) : {}}>

          <Text style={[styles.title, { color: 'white', fontWeight: "bold", fontSize: 18 }]}>{item.name}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <SafeAreaView style={[styles.container, styles.statusBarMargin]}>

        {(this.state.user != null && this.state.user.logged_in) &&
          <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 10, color: 'white' }}>Welcome back, {this.state.name}</Text>
        }
        <FlatList
          data={this.state.user != null && this.state.user.logged_in ? this.state.routes_logged_in : this.state.route_anonymous}
          renderItem={({ item }) => <Item item={item} navigation={this.props.navigation} />}
          keyExtractor={item => item.name}
          style={{ width: '100%', alignSelf: 'flex-start' }}
        />

        {
          (this.state.user != null && this.state.user.logged_in) &&
          <TouchableOpacity style={styles.button} onPress={() => this.logout()} >
            <AntDesign name='login' size={24} style={{ color: 'white', marginRight: 10 }} />
            <Text style={styles.buttonTitle}>Logout</Text>
          </TouchableOpacity>
        }
        {
          (this.state.user == null || !this.state.user.logged_in) &&
          <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Login')}>
            <AntDesign name='logout' size={24} style={{ color: 'white', marginRight: 10 }} />
            <Text style={styles.buttonTitle}>Login</Text>
          </TouchableOpacity>

        }
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#a5b498',
    color: 'white'

  },
  statusBarMargin: {
    marginTop: (Platform.OS === 'ios') ? 0 : 24,
  },
  profileImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: 40
  },
  icon: {
    width: 30,
    height: 30
  },
  listItem: {
    height: 60,
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    fontSize: 16,
    marginLeft: 20,
  },
  button: {
    flexDirection: "row",
    alignSelf: 'stretch',
    borderRadius: 4,
    backgroundColor: '#e36f2c',
    padding: 10,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTitle: {
    color: 'white',
    fontSize: 18,
  }
});
