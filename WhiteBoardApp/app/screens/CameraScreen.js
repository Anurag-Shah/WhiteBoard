import React, { useState, useEffect} from 'react';
import { Text, View, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import TopBar from './shared/TopBar';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function CameraScreen({navigation}) {
    const [hasPermission, setHasPermission] = useState(null);
    const [cameraRef, setCameraRef] = useState(null)
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    let photo = {};
    useEffect(() => {
      (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      const  galleryStatus  = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted')
      })();
      }, []);
    
      if (hasPermission === null || hasGalleryPermission === false) {
        return <View />;
      }
      if (hasPermission === false || hasGalleryPermission === false) {
          return <Text>No access to camera or gallery</Text>;
      }

      const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
    
        if (!result.cancelled) {
          navigation.navigate('Image',{'photo':result,camera:false});
        }
      };

    return (
    <View style={{ flex: 1 }}>
      <TopBar title="Camera" navigation={navigation}/>
      <Camera style={{ flex: 1 }} type={type} ref={ref => {
       setCameraRef(ref);
       }} autoFocus='on'>
        {/* <View
          style={{
          flex: 1,
          backgroundColor: 'transparent',
          justifyContent: 'flex-end'
          }}>
          <TouchableOpacity
            style={{
            flex: 0.1,
            alignSelf: 'flex-end'
            }}
            onPress={() => {
            setType(
            type === Camera.Constants.Type.back
            ? Camera.Constants.Type.front
            : Camera.Constants.Type.back
            );
          }}>
            <Text style= {{fontSize:18,marginBottom:10,color:'white'}}>Flip</Text>
          </TouchableOpacity>
          
        </View> */}
      </Camera>
      <View style={{
        flexDirection:"row",
        justifyContent:"center",
        justifyContent:"space-between",
        alignItems:"center",
        paddingHorizontal: 10,
        padding: 10
      }}>
        <Text style={{ width:50 }}></Text>
        <TouchableOpacity style={{
          justifyContent:"space-between",
          alignItems:"center",
        }} onPress={async() => {
          if(cameraRef){
          photo = await cameraRef.takePictureAsync('photo');
          console.log('photo', photo);
          navigation.navigate('Image',{ photo:photo, camera:true });
          }
          }}>
          <View style={{ 
            borderWidth: 2,
            borderRadius:'50%',
            borderColor: 'black',
            height: 50,
            width:50,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'}}
          >
          <View style={{
            borderWidth: 2,
            borderRadius:'50%',
            borderColor: 'black',
            height: 40,
            width:40,
            backgroundColor: 'black'}} >
          </View>
        </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="image-outline" size={40} onPress={() => pickImage()} style={{ color: 'black' }} />
        </TouchableOpacity>
      </View>    
    </View>
    );
   }

