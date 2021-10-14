import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet,SafeAreaView } from 'react-native';
import { ListItem, Avatar, SearchBar, List } from 'react-native-elements';
//import {SafeAreaView} from 'react-navigation';
//console.log("hi");

class FlatListDemo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      error: null,

      FlatListItems: [
        {key: 'One'},
        {key: 'Two'},
        {key: 'Three'},
        {key: 'Four'},
        {key: 'Five'},
        {key: 'Six'},
        {key: 'Seven'},
        {key: 'Eight'},
        {key: 'Nine'},
        {key: 'Ten'},
        {key: 'Eleven'},
        {key: 'Twelve'}
      ]
    };

    this.arrayholder = [];
  }

  componentDidMount() {
    //this.getData();
    this.makeRemoteRequest();
  }

  getData = () => {
    fetch('http://ec2-18-217-232-152.us-east-2.compute.amazonaws.com:8000/Users/')
    .then(response => {
      return response.json(); 
    })
    .then(responseData => {
      //console.log(responseData);
    })
  }

  makeRemoteRequest = () => {
    //const url = `https://randomuser.me/api/?&results=20`;
    const url = 'http://ec2-18-217-232-152.us-east-2.compute.amazonaws.com:8000/Users/';
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
    return (
      <SafeAreaView style={{flex: 1}}>
        <FlatList
          data={this.state.data}
          keyExtractor={item => item.email.toString()}
          renderItem={({ item }) => (
            <ListItem bottomDivider>
              <ListItem.Content>
              <ListItem.Title>{item.name}</ListItem.Title>
              <ListItem.Subtitle>{item.email}</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
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
 
  MainContainer :{
   
  // Setting up View inside content in Vertically center.
  justifyContent: 'center',
  flex:1,
  margin: 10
   
  },
   
  item: {
      padding: 10,
      fontSize: 18,
      height: 44,
    },
   
  });

export default FlatListDemo;
