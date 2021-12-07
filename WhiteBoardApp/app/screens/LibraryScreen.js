import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, SafeAreaView, Button, Alert, Modal, Image, LogBox } from 'react-native';
import { ListItem, Avatar, SearchBar, List } from 'react-native-elements';
import { Icon } from "react-native-elements";
import { getAllGroupsApi, getAvatarApi } from "../requests/api";
import urls from '../requests/urls';
import Topbar from './shared/Topbar';
import { FontAwesome, Entypo, AntDesign, Ionicons } from "@expo/vector-icons";
import defAvatar from '../assets/avatar.png';


//import {SafeAreaView} from 'react-navigation';
//console.log("hi");
LogBox.ignoreAllLogs();//Ignore all log notifications
const image_url = "";

class LibraryScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      avatar: null,
      loading: false,
      show: false,
      //data: [],
      user: {
        "uid": 3,
      },
      data: [{
        name: 'group 1',
        //Image: require("../image/code_snip.jpg"),
        Image: 'http://ec2-3-144-231-142.us-east-2.compute.amazonaws.com:8080/media/images/733066527636717661_2gQnYt1.png',
        GpID: '1',
      },
      {
        name: 'group 2',
        //Image: require("../image/code_snip.jpg"),
        Image: 'http://ec2-3-144-231-142.us-east-2.compute.amazonaws.com:8080/media/images/733066527636717661.png',
        GpID: '2',
      }],
      error: null,
    };

    this.arrayholder = [];
  }

  componentDidMount() {
    //this.getData();
    this.makeRemoteRequest();
  }



  makeRemoteRequest = () => {
    this.setState({ loading: true });
    // console.log(this.state.user);
    getAllGroupsApi(this.state.user.uid).then((res) => {
      //console.log(res);
      this.setState({
        //data: res.results,
        data: res.all_groups,
        default_group: res.default_group,
        error: res.msg || null,
        loading: false,
      });
    })
    getAvatarApi().then((res) => {
      let avatar = urls.base_url.slice(0, -1) + res.avatar.image;
      console.log("avatar", urls.base_url.slice(0, -1) + res.avatar.image);
      this.setState({
        avatar: avatar
      })
    });
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          //width: '86%',
          backgroundColor: '#CED0CE',
          //marginLeft: '14%',
        }}
      />
    );
  };

  searchFilterFunction = text => {
    this.setState({
      value: text,
    });

    const newData = this.arrayholder.filter(item => {
      //const itemData = `${item.name.title.toUpperCase()} ${item.name.first.toUpperCase()} ${item.name.last.toUpperCase()}`;
      const itemData = `${item.name.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      data: newData,
    });
  };

  renderHeader = () => {
    return (
      <SearchBar
        placeholder="Type Here..."
        lightTheme
        round
        onChangeText={text => this.searchFilterFunction(text)}
        autoCorrect={false}
        value={this.state.value}
      />

    );
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    }
    //console.log(this.state.data);
    //<Avatar source={item.avatar_url} />
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <Topbar title="Team Library" navigation={this.props.navigation} />
        <FlatList
          data={this.state.data}
          keyExtractor={item => item.GpID.toString()}
          renderItem={({ item }) => (
            <ListItem onPress={() => this.props.navigation.push("library", { url: item.GpID })}>
              {item.isDefault ? <Avatar rounded size='medium' source={this.state.avatar != null ? { uri: this.state.avatar } : defAvatar} /> : <AntDesign name="team" size={24} color="black" />}
              <ListItem.Content>
                <ListItem.Title>{item.Gpname}</ListItem.Title>
                <ListItem.Subtitle>{"Group ID: " + item.GpID}</ListItem.Subtitle>
                <ListItem.Subtitle>{item.GpDescription}</ListItem.Subtitle>

              </ListItem.Content>
            </ListItem>
            //<Avatar rounded source={{uri: item.picture.thumbnail}} />
            //<ListItem //style={{ height: 50 }}
            //leftAvatar={{ source: { uri: item.picture.thumbnail } }}
            //title={`${item.name.first} ${item.name.last}`}
            //subtitle={item.email}
            ///>
            //<Text style={{fontSize: 30}}>{item.name.first}</Text>
          )}
          //data={ this.state.FlatListItems }
          //renderItem={({item}) => <Text style={styles.item} > {item.key} </Text>}
          //keyExtractor={item => item.email}

          ItemSeparatorComponent={this.renderSeparator}
        //ListHeaderComponent={this.renderHeader}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({

  MainContainer: {

    // Setting up View inside content in Vertically center.
    justifyContent: 'center',
    flex: 1,
    margin: 10

  },

  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },

});

export default LibraryScreen;