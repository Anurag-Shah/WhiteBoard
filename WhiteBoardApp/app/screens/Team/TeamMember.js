import React, { useState, useEffect, Component } from "react";
import { SafeAreaView, Text, Button, StyleSheet, Dimensions, FlatList, View, ActivityIndicator, Alert } from "react-native";
import { ListItem, Avatar, SearchBar, List, Icon, Badge } from 'react-native-elements';
import { FontAwesome, Entypo, AntDesign, Ionicons } from "@expo/vector-icons";
import { getAllTeamMemebersApi, addMemberApi, removeMemberApi } from "../../requests/api";
import Topbar from '../shared/Topbar';
import Dialog from "react-native-dialog";

function Prompt(props) {
    const addMember = (email) => {
        let code = -1;
        if (email.indexOf("@") < 0) {
            setSuccess(false);
            setFeedback("Please enter a valid email...");
        } else {
            if (code == 0) {
                //props.setVisible();
                Alert.alert(
                    "User successfully added to the team!", "",
                    [{ text: "OK", onPress: () => { props.setVisible(); props.reload() } }]
                );
            } else if (code == -1) {
                Alert.alert(
                    "User does not exist!", ""
                );
            } else if (code == -2) {
                Alert.alert(
                    "User Already in the Team", "",
                );
            }

            // addMemberApi(email).then((res) => {
            //     if (ret && ret.code == 0) {
            //         Alert.alert(
            //             "User successfully added to the team!", "",
            //             [{ text: "OK", onPress: () => { props.setVisible(); props.reload() } }]
            //         );
            //     } else if (ret && ret.code == -1) {
            //         // User does not exist
            //         Alert.alert(
            //             "User does not exist!", "",
            //             [{ text: "OK", onPress: () => { props.setVisible(); } }]
            //         );
            //     } else if (ret && ret.code == -2) {
            //         // User already in the team
            //         Alert.alert(
            //             "User Already in the Team", "",
            //             [{ text: "OK", onPress: () => { props.setVisible(); } }]
            //         );
            //     }
            // });

        }
    }
    const [email, setEmail] = React.useState("");
    const [feedback, setFeedback] = React.useState("");
    const [success, setSuccess] = React.useState(true);
    return (
        <Dialog.Container visible={props.visible}>
            {Platform.OS !== "android" ? (
                <Dialog.Title>Add new Member: </Dialog.Title>
            ) : (
                <Dialog.Description>
                    Add New Member:
                </Dialog.Description>
            )}
            <Dialog.Input value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />
            <Text
                style={{
                    color: success ? "black" : "red",
                    paddingLeft: 20,
                    paddingBottom: 15,
                }}
            >
                {feedback}
            </Text>
            <Dialog.Button label="Cancel" onPress={() => props.setVisible()} />
            <Dialog.Button label="Confirm" onPress={() => { addMember(email); }} />
        </Dialog.Container>
    );
}

class TeamMemeber extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            visible: false,
            group: {
                Gpname: 'Group 1',
                // avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
                GpID: 1,
                leader_uid: 1,
                GpDescription: 'yang1773@purdue.edu',
                isDefault: false,
            },
            user: {},
            members: [
                {
                    name: 'Amy Farha',
                    uid: 1,
                    email: 'yang1773@purdue.edu',
                    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                },
            ],
            isLeader: false,
            data: [
                {
                    name: 'Amy Farha',
                    uid: 1,
                    email: 'yang1773@purdue.edu',
                    avatar: 'https://randomuser.me/api/portraits/women/40.jpg',
                },
                {
                    name: 'Chris Jackson',
                    uid: 2,
                    avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
                    email: 'yang1773@purdue.edu'
                },
            ],
            value: "",
        }
        this.arrayholder = [];
    }

    componentDidMount() {
        this.reload();
    };

    reload = () => {
        //this.state.group = this.props.route.params.group;
        // getAllTeamMemebersApi(groupId).then((res) => {
        //     console.log(res);
        //     if (res && res.code == 0) {
        //         this.state.group = this.props.route.params.group;
        //         this.state.members = res.members;
        //         this.state.data = res.members;
        //         this.state.user = this.props.route.params.user;
        //         if (this.state.group.leader_uid == this.state.user.uid) {
        //             this.state.isLeader = true;
        //         }
        //         var filtered = this.state.data.filter(function (value) {
        //             return value.uid != this.state.group.leader_uid;
        //         });
        //         var leader = this.state.data.find(e => e.uid == this.state.group.leader_uid)
        //         filtered.unshift(leader);
        //         this.setState({
        //             data: filtered,
        //             members: filtered,
        //         });
        //     } else if (!res) {
        //         // Somehing went wrong
        //     }
        // });
        let leader_id = this.state.group.leader_uid;
        function my_filter(value, index, array) {
            return value.uid != leader_id;
        }
        var filtered = this.state.data.filter(my_filter);
        var leader = this.state.data.find(e => e.uid == this.state.group.leader_uid)
        console.log("I am here");
        filtered.unshift(leader);
        this.setState({
            data: filtered,
            members: filtered,
        });
        this.arrayholder = this.state.data;
        this.setState({ loading: false });
        console.log("Page reloaded!");
    }

    setVisible = () => {
        console.log("setVisible Clicked!");
        this.setState({
            visible: !this.state.visible,
        })
    }


    searchFilterFunction = (text) => {
        this.setState({
            value: text,
        });
        this.arrayholder = this.state.data;
        const newData = this.arrayholder.filter(item => {
            const itemData = `${item.name.toUpperCase()}`;
            const textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1;
        });
        console.log(newData);
        if (text == "") {
            this.setState({
                data: this.state.members,
            })
        } else {
            this.setState({
                data: newData,
            });
        }
        console.log(this.state.data);
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

    renderItem = ({ item, index }) => (
        <ListItem bottomDivider >
            <Avatar
                rounded
                size={58}
                title={item.name[0]}
                source={{ uri: item.avatar }}
                containerStyle={{ borderColor: index == 0 ? "red" : "white", borderWidth: 0 }}>
            </Avatar>
            {item.uid == this.state.group.leader_uid ? <Badge
                status="primary"
                value="  Leader "
                containerStyle={{ position: 'absolute', top: 10, left: 50 }}
            /> : null}
            <ListItem.Content>
                <ListItem.Title>{item.name} </ListItem.Title>
                <ListItem.Subtitle>{item.email}</ListItem.Subtitle>
            </ListItem.Content>
            <AntDesign name="minuscircleo" size={24}
                color={this.state.isLeader ? "red" : "grey"}
                onPress={() => { this.state.isLeader ? this.deleteGroup(item.GpID) : Alert.alert("Only the group leader can remove members from the team!") }} />
        </ListItem>
    )

    render() {
        if (this.state.loading) {
            console.log("loading...")
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator />
                </View>
            );
        }
        return (
            <SafeAreaView>
                <Topbar title={this.state.group.Gpname} navigation={this.props.navigation} />
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
                        keyExtractor={item => item.uid.toString()}
                        renderItem={this.renderItem}
                        ItemSeparatorComponent={this.renderSeparator}
                    // ListHeaderComponent={this.renderHeader}
                    />
                </View>
                <View style={styles.bottom_bar}>
                    <Ionicons name="person-add" size={50}
                        color={this.state.isLeader ? "green" : "grey"}
                        style={{ top: 10 }}
                        onPress={() => { this.state.isLeader ? this.setVisible() : Alert.alert("Only group leader can add people to the team!") }} />
                    {/* <Text style={{ marginTop: 10, color: "green" }}>Add</Text> */}
                </View>
                {this.state.visible ? (
                    <Prompt visible={this.state.visible} setVisible={this.setVisible} reload={this.reload}></Prompt>
                ) : null}
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({

    MainContainer: {
        justifyContent: 'center',
        alignItems: "center",
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
        // position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        bottom: 0,
    },

});

export default TeamMemeber;