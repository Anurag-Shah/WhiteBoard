import * as React from 'react';
import { StyleSheet, Text, View ,Image, TouchableOpacity, Dimensions, Platform, Alert} from'react-native';

const {height, width} = Dimensions.get('window');

const serverUrl = 'http://ec2-18-217-232-152.us-east-2.compute.amazonaws.com:8000';
const name='Yierpan42';
const group_id = 1;

export default function notification({ route, navigation }) {
 const { photo, camera } = route.params;
 const sendPicture = async () => {

    let localUri = photo.uri;
    let filename = localUri.split('/').pop();

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    // Upload the image using the fetch and FormData APIs
    let formData = new FormData();
    // "Image, name" is the name of the form field the server expects
    // GpID ; inserted into url
    formData.append('Image', localUri);
    formData.append('name', name); 
    Alert.alert("Success", "The photo was successfully sent!");   
    try {
        //TODO: enabling loading mark
        const response = await fetch( serverUrl+'/Images/'+group_id, {
          method: 'POST',
          body: formData,
          headers: {
            'content-type': 'multipart/form-data',
          },
        })
        const json = await response.json();
        console.log(json);
        Alert.alert("Success", "The photo was successfully sent!");
      } catch (error) {
        Alert.alert("Error", "Something went wrong!");
        // console.log(error);
      }
     
 }
 return (
 <View style={{ flex: 1, alignItems:'center',justifyContent:'row' }}>
    <Image source={{ uri: photo.uri }} style={{width:width,height:height-60-72, resizeMode: camera?'cover':'contain'}}/>
    <View style={[styles.modalBottomContainer, styles.modalBottomStatusBarMargin]}>
      <TouchableOpacity onPress={sendPicture}>
        <View style={styles.modalButton}>
          <Text style = {{fontSize:24, fontWeight:"bold", color:'green'}}>Accept</Text>
        </View>
      </TouchableOpacity>
      <Text style={{ width:30 }}></Text>
      <TouchableOpacity onPress={()=>navigation.navigate('Camera')}>
        <View style={styles.modalButton}>
          <Text style={{fontSize:24, fontWeight:"bold",color:'red'}}>Retake</Text>
        </View>
      </TouchableOpacity>
    </View>
</View>
 );
}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#e1dede',
    },
    main: {
      flex: 1,
      width: '100%',
      backgroundColor: '#e1dede',
      alignItems: 'stretch',
    },
    list: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-around',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    bContainer: {
      width:"100%",
      height: (Platform.OS === 'ios') ? 60 : 80,
      flexDirection:"row",
      justifyContent:"space-between",
      alignItems:"center",
      paddingHorizontal: 20,
      backgroundColor: 'white'
    },
    bStatusBarMargin: {
      paddingTop: (Platform.OS === 'ios') ? 0 : 0
    },
    modalButton: {
      backgroundColor: 'white',      
      justifyContent: 'center',
      alignItems: 'center',
  
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 22,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: 'rgba(0, 0, 0, 0.1)',
      width:"100%"
    },
    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    modalBottomContainer: {
      width:"100%",
      height: (Platform.OS === 'ios') ? 60 : 60,
      flexDirection:"row",
      justifyContent:"space-between",
      alignItems:"center",
      backgroundColor: 'white'
    },
    modalBottomStatusBarMargin: {
      paddingTop: (Platform.OS === 'ios') ? 0 : 0
    },
  });