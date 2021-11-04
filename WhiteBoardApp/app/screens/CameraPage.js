import React, { useEffect, useState } from 'react'
import { Button, SafeAreaView, StyleSheet, Text, Alert } from 'react-native'
import storage from '../config/storage';
import { logoutApi, getToken } from '../requests/api';

export default function CameraPage({ navigation }) {
    useEffect(() => {
        getUserInfo();
    }, [login]);

    const getUserInfo = () => {
        storage
            .load({
                key: 'login-session',
                // autoSync (default: true) means if data is not found or has expired,
                // then invoke the corresponding sync method
                autoSync: true,
                syncInBackground: true,
            })
            .then(ret => {
                // found data go to then()
                setUser(ret);
                console.log(ret);
                if (ret.logged_in) {
                    setLoginState(true);
                } else {
                    setLoginState(false);
                }
            })
            .catch(err => {
                // any exception including data not found
                // goes to catch()
                setUser(undefined);
                setLoginState(false)
                console.log("User info Not found");
            });
    };

    const login = () => {
        if (!loginState) {
            navigation.push('Login');
        } else {
            Alert.alert("You already logged in!", "Enjoy your unlimited access to all features!");
        }
        // navigation.push('Login');
    };

    const logout = () => {
        console.log("logout clicked!\n");
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
                    Alert.alert("Logged out!", "See you soon!");
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
    const [loginState, setLoginState] = useState(false);
    const [user, setUser] = useState();
    return (
        <SafeAreaView>
            <Text>CameraPage</Text>
            <Button title="Login" onPress={() => login()}></Button>
            <Button title="Log Out" onPress={() => logout()}></Button>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
});


