import React, { useEffect, useState } from 'react'
import { Button, SafeAreaView, StyleSheet, Text, Alert } from 'react-native'
import storage from '../config/storage';

export default function CameraPage({ navigation }) {
    useEffect(() => {
        console.log("I am useEffect!");
        getUserInfo();
    }, [login]);

    const getUserInfo = () => {
        storage
            .load({
                key: 'Login-info',

                // autoSync (default: true) means if data is not found or has expired,
                // then invoke the corresponding sync method
                autoSync: true,
                syncInBackground: true,
            })
            .then(ret => {
                // found data go to then()
                setLoginState(true);
            })
            .catch(err => {
                // any exception including data not found
                // goes to catch()
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
        setLoginState(false);
        Alert.alert("Logged out!", "See you soon!");
    }
    const [loginState, setLoginState] = useState(false);
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


