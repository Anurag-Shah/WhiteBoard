import React from 'react';
import { SafeAreaView, StyleSheet, Image, TextInput, View, Button } from 'react-native';
import { Icon } from 'react-native-elements'


function RegistrationPage(props) {
    validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    return (
        <SafeAreaView>
            <Icon
                style={styles.icon}
                name='arrow-undo-outline'
                type='ionicon'
                color='#000'
                alignItems='left'
                //onPress
            />
            <View style={styles.container}>
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
                    contextMenuHidden={true}
                />
                <TextInput
                    style={styles.input}
                    placeholder="confirm password"
                    contextMenuHidden={true}
                />
                <View style={styles.button}>
                    <Button 
                        title="Sign up" 
                        color="#fff"
                        //onPress
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    icon: {
        marginLeft: 30,
    },
    
    container: {
        //flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    image: {
        width: 150,
        height: 150,
        marginTop: 50,
        marginBottom: 30,
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