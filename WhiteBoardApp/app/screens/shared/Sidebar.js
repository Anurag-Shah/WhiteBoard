import React from 'react';

import { Text, View, Image, StyleSheet, FlatList, TouchableOpacity, Platform, SafeAreaView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Sidebar extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      routes:[{
        name: "Save",
        screen: "Save"
      }, {
        name: "TextEditor",
        screen: "TextEditorPage"
      },{
        name: "Library",
        screen: "Library"
      }, {
        name: "Team",
        screen: "Team"
      }, {
        name: "Account",
        screen: "Account"
      }],
      name: '',
    }
    this.retrieveData = this.retrieveData.bind(this);
  }

  componentDidMount() {
    this.retrieveData();
  }

  retrieveData = async () => {
    try {
      AsyncStorage.getItem('full_name').then(res => {
        if (res != null) {
          this.setState({name: res});
        } else {
          this.setState({name: ''});
        }
      });
    } catch (error) {
      alert(error);
    }
  };

  render() {
    const userId  = "Yierpan42";
    const loggedIn = 'true';
    
    function Item({ item, navigation }) {
      return (
        <TouchableOpacity style={styles.listItem} onPress={()=> (loggedIn == 'true') ? navigation.navigate(item.screen, { userId: userId }) : {}}>
          
          <Text style={[styles.title , {color:'white', fontWeight:"bold", fontSize:18}]}>{item.name}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <SafeAreaView style={[ styles.container, styles.statusBarMargin]}>
        
        {(this.state.name != null && this.state.name != '') &&
        <Text style={{fontWeight:"bold", fontSize:16, marginTop:10, color:'white'}}>Welcome back, { this.state.name }</Text>
        }
        <FlatList 
            data={this.state.routes}
            renderItem={({ item }) => <Item item={item} navigation={this.props.navigation}/>}
            keyExtractor={item => item.name}
            style = {{ width:'100%',alignSelf:'flex-start' }}
            />
        
        {
          (loggedIn == 'true') && 
          <TouchableOpacity style={styles.button} >
            <AntDesign name='login' size={24} style={{ color: 'white', marginRight: 10 }} />
            <Text style={styles.buttonTitle}>Login</Text>
          </TouchableOpacity>
        }
        {
          (loggedIn == 'false') && 
        
            
            <TouchableOpacity style={styles.button} >
              <AntDesign name='logout' size={24} style={{ color: 'white', marginRight: 10 }}/>
              <Text style={styles.buttonTitle}>Logout</Text>
            </TouchableOpacity>
          
        }
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#a5b498',
    color:'white'
    
  },
  statusBarMargin: {
    marginTop: (Platform.OS === 'ios') ? 0 : 0,
  },
  profileImg:{
    width:80,
    height:80,
    borderRadius:40,
    marginTop:40
  },
  icon: {
    width: 30,
    height: 30
  },
  listItem:{
    height:60,
    alignItems:"center",
    flexDirection:"row",
  },
  title:{
    fontSize:16,
    marginLeft:20,
  },
  button: {
    flexDirection:"row",
    alignSelf: 'stretch',
    borderRadius: 4,
    backgroundColor: '#e36f2c',
    padding: 10,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTitle: {
    color: 'white',
    fontSize: 18,
  }
});
