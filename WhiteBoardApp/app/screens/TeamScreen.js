import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, SafeAreaView, Button, Alert } from 'react-native';
import { ListItem, Avatar, SearchBar, List } from 'react-native-elements';
import { Icon } from "react-native-elements";

//import {SafeAreaView} from 'react-navigation';
//console.log("hi");

class TeamScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      //data: [],
      data: [{
        name: 'Amy Farha',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
        subtitle: 'Vice President',
        email: 'yang1773@purdue.edu'
      },
      {
        name: 'Chris Jackson',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        subtitle: 'Vice Chairman',
        email: 'kang1773@purdue.edu'
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
    //const url = `https://randomuser.me/api/?&results=20`;
    const url = 'http://ec2-3-138-112-15.us-east-2.compute.amazonaws.com:8080/Users/';

    this.setState({ loading: true });

    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          //data: res.results,
          data: res,
          error: res.error || null,
          loading: false,
        });
        //this.arrayholder = res.results;
        this.arrayholder = res;
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '86%',
          backgroundColor: '#CED0CE',
          marginLeft: '14%',
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
      /*<SearchBar
        placeholder="Type Here..."
        lightTheme
        round
        onChangeText={text => this.searchFilterFunction(text)}
        autoCorrect={false}
        value={this.state.value}
      />*/
      <View style={{ alignItems: 'flex-end' }}>

        <Icon
          name="adduser"
          type="ant-design"
          color="#149052"
          size="35"
          onPress={() => Alert.alert('adduser Button pressed')}
        />
      </View>

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
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={this.state.data}
          keyExtractor={item => item.email.toString()}
          renderItem={({ item }) => (
            <ListItem bottomDivider>
              <ListItem.Content>
                <ListItem.Title>{item.name}</ListItem.Title>
                <ListItem.Subtitle>{item.email}</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron
                onPress={() => Alert.alert('Do you want to remove this user?')} />
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
          ListHeaderComponent={this.renderHeader}
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

export default TeamScreen;