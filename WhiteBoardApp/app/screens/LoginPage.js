import React from 'react';
import { StyleSheet, ImageBackground, Button, View, Image } from 'react-native';

function LoginPage(props) {
    return (
        <ImageBackground
            style={styles.backgroud}
            source={require("../assets/IMG_1198.jpg")}
        >
            <Image
                resizeMode="contain"
                adeDuration={1000}
                source={require('../assets/jerry.jpg')} style={styles.image}
            />
            <View style={[styles.button, styles.loginButton]}><Button title="Login"></Button></View>

            <View style={[styles.button, styles.registerButton]}><Button title="Register"></Button></View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroud: {
        flex: 1,
        alignItems: "center",
        //justifyContent: "flex-end",
        //justifyContent: "center"
    },

    button: {
        backgroundColor: '#2196F3',
        position: "absolute",
        width: "80%",
        //height: 50,
        borderRadius: 6,
        justifyContent: "center"
    },

    loginButton: {
        bottom: 350
    },

    registerButton: {
        bottom: 300,
    },
    image: {
        marginTop: 100,
        width: 300,
        height: 200,
        borderRadius: 800,
    },
});



export default LoginPage;