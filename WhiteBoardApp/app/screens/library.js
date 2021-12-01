import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, SafeAreaView, Button, Alert, Modal, Image, LogBox } from 'react-native';
import { ListItem, Avatar, SearchBar, List } from 'react-native-elements';
import { Icon } from "react-native-elements";

//import {SafeAreaView} from 'react-navigation';
//console.log("hi");
LogBox.ignoreAllLogs();//Ignore all log notifications
//const url = ;

class library extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      show: false,
      //data: [],
      data: [{
        name: 'testing1',
        //Image: require("../image/code_snip.jpg"),
        Image: 'http://ec2-3-138-112-15.us-east-2.compute.amazonaws.com:8080/media/images/733066527636717661_2gQnYt1.png',
        GpID: '8/11/2021',
        pk: '0',
        Code: 'hello world 1'
      },
      {
        name: 'testing2',
        //Image: require("../image/code_snip.jpg"),
        Image: 'http://ec2-3-138-112-15.us-east-2.compute.amazonaws.com:8080/media/images/733066527636717661.png',
        GpID: '8/29/2021',
        pk: '1',
        Code: 'hello world 2'
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
    /*server test*/
    //const url = 'http://ec2-3-138-112-15.us-east-2.compute.amazonaws.com:8080/Users/';
    /*local test*/
    //const url = 'http://ec2-3-138-112-15.us-east-2.compute.amazonaws.com:8080/Images/0';
    console.log(this.props.route.params.url);
    const url = "http://ec2-3-138-112-15.us-east-2.compute.amazonaws.com/Images/" + this.props.route.params.url;

    this.setState({ loading: true });

    fetch(url)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        //console.log("http://ec2-3-138-112-15.us-east-2.compute.amazonaws.com:8080" + res[1].Image);

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
        this.arrayholder = this.state.data;
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
    //<Avatar source={item.avatar_url} />
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={this.state.data}
          //keyExtractor={item => item.name.toString()}
          renderItem={({ item }) => (
            <ListItem bottomDivider onPress={() => {
              this.image_url = "http://ec2-3-138-112-15.us-east-2.compute.amazonaws.com" + item.Image;
              this.image_title = item.name;
              this.image_code = item.Code;
              console.log(this.image_url);
              this.setState({ show: true });
            }}>
              <Avatar source={{ uri: "http://ec2-3-138-112-15.us-east-2.compute.amazonaws.com" + item.Image }} />
              <ListItem.Content>
                <ListItem.Title>{item.name}</ListItem.Title>
                <ListItem.Subtitle>{item.GpID}</ListItem.Subtitle>

              </ListItem.Content>
              <AntDesign name="minuscircleo" size={24} color="red" onPress={() => {
                Alert.alert(
                  //title
                  'File Delete',
                  //body
                  'Do you want to delete this file?',
                  [
                    {
                      text: 'Yes',
                      onPress: () => {
                        console.log(item.pk)
                        console.log('Yes Pressed')
                        fetch("http://ec2-3-138-112-15.us-east-2.compute.amazonaws.com:8080/ImageDeleteByID/" + item.pk, { method: 'DELETE' });
                        this.props.navigation.replace("library", { url: this.props.route.params.url })
                        //this.render();
                      }
                    },
                    {
                      text: 'No',
                      onPress: () => console.log('No Pressed')
                    },
                  ],
                  { cancelable: true },
                );
              }} />
              <Modal
                transparent={true}
                visible={this.state.show}
              >
                <SafeAreaView style={{ backgroundColor: "#CED0CE", flex: 1 }}>
                  <Text>{this.image_title}</Text>
                  <Image
                    style={{
                      width: 500,
                      height: 500
                    }}
                    resizeMode="contain"
                    source={{ uri: this.image_url }} />
                  <Text>{this.image_code}</Text>
                  <Button
                    title="close"
                    onPress={() => this.setState({ show: false })}
                  />
                </SafeAreaView>
              </Modal>
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

export default library;