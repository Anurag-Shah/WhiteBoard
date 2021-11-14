import React, { useState, useEffect, Component } from "react";
import { SafeAreaView, Text, Button, StyleSheet, Dimensions, FlatList, View, ActivityIndicator, Alert } from "react-native";
import { ListItem, Avatar, SearchBar, List, Icon } from 'react-native-elements';
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
            <Dialog.Input value={email} onChangeText={setEmail} placeholder="Email" />
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
            group: {},
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
                    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                },
                {
                    name: 'Chris Jackson',
                    uid: 2,
                    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
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
        this.state.members = this.state.data;
        this.arrayholder = this.state.data;
        // getAllTeamMemebersApi(groupId).then((res) => {
        //     console.log(res);
        //     if (res && res.code == 0) {
        //         this.state.group = this.props.route.params.group;
        //         this.state.members = res.members;
        //         this.state.data = res.members;
        //         this.state.user = this.props.route.params.user;
        //         this.setState({ loading: false });
        //         this.arrayholder = res.members;
        //         if (this.state.group.leader_uid == this.state.user.uid) {
        //             this.state.isLeader = true;
        //         }
        //     }
        // });

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

    renderItem = ({ item }) => (
        <ListItem bottomDivider >
            <Avatar source={{ uri: item.avatar }} />
            <ListItem.Content>
                <ListItem.Title>{item.name} </ListItem.Title>
                <ListItem.Subtitle>{item.email}</ListItem.Subtitle>
            </ListItem.Content>
            {this.state.isLeader ? <AntDesign name="minuscircleo" size={24} color="red" onPress={() => this.deleteGroup(item.GpID)} /> : null}
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
                    <Ionicons name="person-add" size={50} color="green" style={{ top: 10 }} onPress={() => this.setVisible()} />
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