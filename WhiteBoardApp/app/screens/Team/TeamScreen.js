import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, SafeAreaView, Button, Alert, Dimensions } from 'react-native';
import { ListItem, Avatar, SearchBar, List } from 'react-native-elements';
import { FontAwesome, Entypo, AntDesign, Ionicons } from "@expo/vector-icons";
import { getAllGroupsApi, createGroupApi, deleteGroupApi } from "../../requests/api";
import Topbar from '../shared/Topbar';
import Dialog from "react-native-dialog";
import storage from "../../config/storage";


function Prompt(props) {
  const [groupName, setGroupName] = React.useState("");
  const [description, setDescrition] = React.useState("");
  return (
    <Dialog.Container visible={props.visible}>
      {Platform.OS !== "android" ? (
        <Dialog.Title>Create New Team: </Dialog.Title>
      ) : (
        <Dialog.Description>
          Create New Team:
        </Dialog.Description>
      )}
      <Dialog.Input value={groupName} onChangeText={setGroupName} placeholder="Team name" />
      <Dialog.Input
        style={{ height: 100 }}
        value={description}
        onChangeText={setDescrition}
        placeholder="Brief Description"
        multiline={true} />
      <Dialog.Button label="Cancel" onPress={() => props.setVisible()} />
      <Dialog.Button label="Confirm" onPress={() => { props.setVisible(); props.addGroup(groupName, description); }} />
    </Dialog.Container>
  );
}



class TeamScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      visible: false,
      user: {
        "uid": 0,
      },
      value: "",
      default_group: {
        Gpname: 'Jane',
        // avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        leader_uid: 0,
        GpID: 0,
        GpDescription: "Jane's Default Group",
        isDefault: true,
      },
      groups: [],
      data: [
        // {
        //   Gpname: 'Amy Farha',
        //   avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
        //   GpID: 'Vice President',
        //   GpDescription: 'yang1773@purdue.edu'
        // },
        // {
        //   Gpname: 'Chris Jackson',
        //   avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        //   GpID: 'Vice Chairman',
        //   GpDescription: 'kang1773@purdue.edu'
        // }
        {
          Gpname: 'Group 1',
          // avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
          GpID: 1,
          leader_uid: 1,
          GpDescription: 'yang1773@purdue.edu',
          isDefault: false,
        },
        {
          Gpname: 'Group 2',
          // avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
          leader_uid: 0,
          GpID: 2,
          GpDescription: 'kang1773@purdue.edu',
          isDefault: false,
        },
        {
          Gpname: 'Group 3',
          // avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
          GpID: 3,
          leader_uid: 1,
          GpDescription: 'yang1773@purdue.edu',
          isDefault: false,
        },
        {
          Gpname: 'Group 4',
          leader_uid: 0,
          GpID: 4,
          GpDescription: 'kang1773@purdue.edu',
          isDefault: false,
        },
        {
          Gpname: 'Group 5',
          GpID: 5,
          leader_uid: 1,
          GpDescription: 'yang1773@purdue.edu',
          isDefault: false,
        },
        {
          Gpname: 'Group 6',
          leader_uid: 0,
          GpID: 6,
          GpDescription: 'kang1773@purdue.edu',
          isDefault: false,
        },
        {
          Gpname: 'Group 7',
          GpID: 7,
          leader_uid: 1,
          GpDescription: 'yang1773@purdue.edu',
          isDefault: false,
        },
        {
          Gpname: 'Group 8',
          leader_uid: 0,
          GpID: 8,
          GpDescription: 'kang1773@purdue.edu',
          isDefault: false,
        },
        {
          Gpname: 'Group 9',
          GpID: 9,
          leader_uid: 1,
          GpDescription: 'yang1773@purdue.edu',
          isDefault: false,
        },
        {
          Gpname: 'Group 10',
          leader_uid: 0,
          GpID: 10,
          GpDescription: 'kang1773@purdue.edu',
          isDefault: false,
        },
        {
          Gpname: 'Group 11',
          GpID: 11,
          leader_uid: 1,
          GpDescription: 'yang1773@purdue.edu',
          isDefault: false,
        },
        {
          Gpname: 'Group 12',
          leader_uid: 0,
          GpID: 12,
          GpDescription: 'kang1773@purdue.edu',
          isDefault: false,
        },
        {
          Gpname: 'Group 13',
          GpID: 13,
          leader_uid: 1,
          GpDescription: 'yang1773@purdue.edu',
          isDefault: false,
        },
        {
          Gpname: 'Group 14',
          leader_uid: 0,
          GpID: 14,
          GpDescription: 'kang1773@purdue.edu',
          isDefault: false,
        },
      ],
      error: null,
    };

    this.arrayholder = [];
  }

  componentDidMount() {
    console.log("team mount!");
    this.reload();
  }

  reload = () => {
    this.getUserInfo();
    this.makeRemoteRequest();
    var filtered = this.state.data.filter(function (value) {
      return !value.isDefault;
    });
    filtered.unshift(this.state.default_group);
    this.setState({
      data: filtered,
      groups: filtered,
    });
    this.arrayholder = filtered;
  }


  getUserInfo = () => {
    this.setState({ loading: true });
    // Fetch user and login info in local storage
    storage
      .load({
        key: "login-session",
        autoSync: false,
        syncInBackground: true,
      })
      .then((ret) => {
        // console.log(ret)
        this.setState({
          user: ret.userInfo,
          loading: false,
        })
      })
      .catch((err) => {
        console.log(err);
      });
  };

  makeRemoteRequest = () => {
    this.setState({ loading: true });
    getAllGroupsApi().then((res) => {
      console.log(res);
      this.setState({
        //data: res.results,
        data: res.all_groups,
        default_group: res.default_group,
        error: res.msg || null,
        loading: false,
      });
    })
  };

  deleteGroup = (groupId) => {
    deleteGroupApi(groupId).then((res) => {
      if (res && res.code == 0) {
        Alert.alert("", "Team Successfully deleted", [
          { text: "OK", onPress: () => { this.reload() } },
        ]);
      } else {
        Alert.alert("", "Something went wrong. Please try again later!");
      }
    });
  }

  addGroup = (name, description) => {
    console.log("Creating Group!");
    createGroupApi(name, description).then((res) => {
      if (res && res.code == 0) {
        Alert.alert("", "New Team Created!", [
          { text: "OK", onPress: () => { this.reload() } },
        ]);
      } else {
        Alert.alert("", "Something went wrong. Please try again later!");
      }
    })
  };

  setVisible = () => {
    console.log("setVisible Clicked!");
    this.setState({
      visible: !this.state.visible,
    })
  }

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

  searchFilterFunction = (text) => {
    this.setState({
      value: text,
    });
    this.arrayholder = this.state.data;
    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.Gpname.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    if (text == "") {
      this.setState({
        data: this.state.groups,
      })
    } else {
      this.setState({
        data: newData,
      });
    }
  };

  // renderHeader = () => {
  //   return (
  //     // <SearchBar
  //     //   placeholder="Type Here..."
  //     //   lightTheme
  //     //   round
  //     //   onChangeText={text => this.searchFilterFunction(text)}
  //     //   autoCorrect={false}
  //     //   value={this.state.value}
  //     // />
  //     // <View style={{ alignItems: 'flex-end' }}>

  //     //   {/* <Icon
  //     //     name="adduser"
  //     //     type="ant-design"
  //     //     color="#149052"
  //     //     size="35"
  //     //     onPress={() => Alert.alert('adduser Button pressed')}
  //     //   /> */}
  //     // </View>

  //   );
  // };

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
      <SafeAreaView style={{ backgroundColor: "white" }}>
        <Topbar title="My Teams" navigation={this.props.navigation} />
        <SearchBar
          placeholder="Search Here..."
          lightTheme
          round
          onChangeText={text => this.searchFilterFunction(text)}
          autoCorrect={false}
          value={this.state.value}
          style={styles.searchBar}
        />
        <View style={styles.list}>
          <FlatList
            data={this.state.data}
            keyExtractor={item => item.GpID.toString()}
            renderItem={({ item }) => (
              <ListItem onPress={() => this.props.navigation.push("TeamMember", { group: item, user: this.state.user })}>
                {item.isDefault ? <Avatar rounded size='medium' source={{ uri: this.state.user.avatar }} /> : <AntDesign name="team" size={24} color="black" />}
                <ListItem.Content>
                  <ListItem.Title>{item.Gpname} </ListItem.Title>
                  <ListItem.Subtitle>{item.GpDescription}</ListItem.Subtitle>
                </ListItem.Content>
                {item.leader_uid == this.state.user.uid && !item.isDefault ?
                  <AntDesign name="minuscircleo" size={24} color="red" onPress={() => this.deleteGroup(item.GpID)} /> : null}
                {/* <ListItem.Chevron
                onPress={() => Alert.alert('Do you want to remove this user?')} /> */}
              </ListItem>
            )}
            ItemSeparatorComponent={this.renderSeparator}
            ListHeaderComponent={this.renderHeader}
          />
        </View>
        <View style={styles.bottom_bar}>
          <Ionicons name="add-circle-outline" size={50} color="green" style={{ top: 10 }} onPress={() => this.setVisible()} />
          <Text style={{ marginTop: 10, color: "green" }}>New Team</Text>
        </View>
        {this.state.visible ? (
          <Prompt visible={this.state.visible} setVisible={this.setVisible} addGroup={this.addGroup}></Prompt>
        ) : null}
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

  searchBar: {
  },

  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },

  list: {
    height: Dimensions.get('screen').height - 260,
  },

  bottom_bar: {
    justifyContent: "center",
    alignItems: "center",
    bottom: 0,
  },

});

export default TeamScreen;