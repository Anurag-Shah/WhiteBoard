import React from 'react';
import { SafeAreaView, StyleSheet, Image, TextInput, View, Button } from 'react-native';


function RegistrationPage(props) {
    return (
        <SafeAreaView style={styles.container}>
            <Image
                style={styles.image}
                source={require('../assets/logo.png')}
            />
            <TextInput
                style={styles.input}
                placeholder="username"
            />
            <TextInput
                style={styles.input}
                placeholder="email address"
            />
            <TextInput
                style={styles.input}
                placeholder="password"
            />
            <TextInput
                style={styles.input}
                placeholder="confirm password"
            />
            <View style={styles.button}><Button title="Sign up" color="#fff"/></View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    image: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },

    input: {
        width: 300,
        height: 45,
        margin: 10,
        borderWidth: 1,
        padding: 10,
    },

    button: {
        width: 110,
        height: 40,
        backgroundColor: "green",
        margin: 30,
    }
});

export default RegistrationPage;