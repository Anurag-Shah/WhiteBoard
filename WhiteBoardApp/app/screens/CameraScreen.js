import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  Image,
  Alert,
  StyleSheet,
  Platform,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Topbar from './shared/Topbar';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

import * as FileSystem from 'expo-file-system';

import * as MediaLibrary from 'expo-media-library';

import storage from '../config/storage';
import { sendPictureApi } from '../requests/api';
import urls from '../requests/urls';
// import { useDispatch } from 'react-redux';
// import { addClipItem, removeClipItem } from './shared/actions';

const { height, width } = Dimensions.get('window');

//const serverUrl = 'http://ec2-3-144-142-207.us-east-2.compute.amazonaws.com:8080/';
const serverUrl = urls.base_url;//'http://ec2-3-138-112-15.us-east-2.compute.amazonaws.com:8080/';

const groupId = 1;

export default function CameraScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [returnImg, setReturnImg] = useState(false);
  const [isCamera, setIsCamera] = useState(false);
  const [userName, setUserName] = useState('Yierpan42');

  useEffect(() => {
    //getUserInfo();  
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');
    })();
  }, []);

  if (hasPermission === null || hasGalleryPermission === false) {
    return <View />;
  }
  if (hasPermission === false || hasGalleryPermission === false) {
    return <>No access to camera or gallery</>;
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      noData: true,
      aspect: [3, 4],
      quality: 1,
      base64: true
    });

    if (!result.cancelled) {
      setIsCamera(false);
      setPhoto(result);
      // Alert.alert('PickImage')
    }
  };

  const getPermissionAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }
      Alert.alert(
        'Save remote Image',
        'Grant Me Permission to save Image',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false },
      );
    } catch (err) {
      Alert.alert(
        'Save remote Image',
        'Failed to save Image: ' + err.message,
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false },
      );
    }
  };

  const saveToPhone = async (url) => {
    if (Platform.OS === 'android') {
      const granted = await getPermissionAndroid();
      if (!granted) {
        return;
      }
    }

    const callback = downloadProgress => {
      const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
      console.log('downloadProgress:' + progress)
    };

    let d = new Date();
    let dformat = `${d.getTime()}`;
    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      FileSystem.documentDirectory + dformat + '.jpg',
      {},
      callback
    );
    try {
      const { uri } = await downloadResumable.downloadAsync();
      MediaLibrary.saveToLibraryAsync(uri)
      Alert.alert('', 'Saved to photos successfully')
    } catch (e) {
      Alert.alert('Error', 'Could not save the image')
    }
  };

  const sendPicture = async (picture) => {
    // dispatch(removeClipItem());
    // let localUri = picture;
    let filename = picture.uri.split('/').pop();

    // // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    // Upload the image using the fetch and FormData APIs
    //let formData = new FormData();
    // "Image, name" is the name of the form field the server expects
    //formData.append('name', 'VeryDum');
    //formData.append('Image', localUri);    
    //formData.append('Description', 'static');
    //.append('Image', {uri: localUri,name: filename, filename :filename ,type:type});
    //formData.append('Content-Type', type);

    const createFormData = (photo, body = {}) => {
      const data = new FormData();
      //console.log(photo.uri);
      data.append('Image', photo.base64
        // isCamera ? photo.uri : photo.base64

        // {
        //   name: filename,
        //   type: type,
        //   uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
        //   data: photo.base64
        // }
      );

      Object.keys(body).forEach((key) => {
        data.append(key, body[key]);
      });
      //console.log(data);
      return data;
    };

    try {
      const response = await fetch(serverUrl + 'Images/' + groupId, {
        method: 'POST',
        body: createFormData(picture, { name: 'TestImage', description: 'picture' }),
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        redirect: 'follow'
      });
      //console.log((response));
      const result = await response.json();
      if (result.status === 'success') {
        Alert.alert('Success', 'The photo was successfully sent!');
        setReturnImg(serverUrl + 'media/' + result.image_uri);
        console.log(serverUrl + 'media/' + result.image_uri);
      }
      else {
        Alert.alert('Error', 'Could not save image!');
      }
      // console.log(zipPhoto);
      // setReturnImg(zipPhoto);
      //  Alert.alert('Success', 'The photo was successfully sent!');
    } catch (error) {
      console.log(error);
      console.log('Connection Error!');
      setReturnImg(null);
      Alert.alert('Error', 'Something went wrong!');
    }
  };
  function decode_base64(s) {
    var b = l = 0,
      m = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    return decodeURIComponent(s.replace(/./g, function (v) {
      b = (b << 6) + m.indexOf(v); l += 6;
      return l < 8 ? '' : '%' + (0x100 + ((b >>> (l -= 8)) & 0xff)).toString(16).slice(-2);
    }));
  }
  return (
    <SafeAreaView style={{ flex: 1, paddingTop: (Platform.OS === 'ios') ? 0 : 20 }}>
      <Topbar title="Camera" navigation={navigation} />
      {!returnImg && !photo && (
        <View style={{ flex: 1 }}>
          <Camera
            style={{ flex: 1 }}
            type={type}
            ref={(ref) => {
              setCameraRef(ref);
            }}
            autoFocus="on"></Camera>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 15,
              padding: 15,
            }}>
            <Text style={{ alignSelf: 'flex-end', width: 30 }}>{''}</Text>
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                alignItems: 'center',
              }}
              onPress={async () => {
                if (cameraRef) {
                  let result = await cameraRef.takePictureAsync({ base64: true });
                  setIsCamera(true);
                  setPhoto(result);
                  // Alert.alert("","TakePicture");
                }
              }}>
              <View
                style={{
                  borderWidth: 2,
                  borderRadius: 25,
                  borderColor: 'black',
                  height: 50,
                  width: 50,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    borderWidth: 2,
                    borderRadius: 20,
                    borderColor: 'black',
                    height: 40,
                    width: 40,
                    backgroundColor: 'black',
                  }}></View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons
                name="image-outline"
                size={40}
                onPress={() => pickImage()}
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  color: 'black'
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
      {!returnImg && photo && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Image
            source={{ uri: photo.uri }}
            style={{
              width: width,
              height: height - ((Platform.OS === 'ios') ? 45 + 80 : 60 + 80 + 20), //Topbar & footer, status height due to OS
              resizeMode: isCamera ? 'cover' : 'contain',
            }}
          />
          <View style={[styles.modalBottomContainer]}>
            <TouchableOpacity onPress={() => sendPicture(photo)}>
              {/* onPress={sendPicture} */}
              <View style={styles.modalButton}>
                <Text
                  style={{ fontSize: 24, fontWeight: 'bold', color: 'green', alignSelf: 'flex-start', alignItems: 'center' }}>
                  Accept
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPhoto(null)}>
              <View style={styles.modalButton}>
                <Text
                  style={{ fontSize: 24, fontWeight: 'bold', color: 'red', alignSelf: 'flex-end', alignItems: 'center' }}>
                  Retake
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {returnImg && (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

          <Image
            // source={{ uri: returnImg }}
            source={{ uri: `${returnImg}` }}
            style={{
              width: width, height: height - ((Platform.OS === 'ios') ? 45 + 80 : 60 + 80 + 20),
              resizeMode: 'contain'
            }}
          />
          <View style={[styles.modalBottomContainer]}>
            <TouchableOpacity onPress={() => saveToPhone(returnImg)}>
              <View style={styles.modalButton}>
                <Text
                  style={{ fontSize: 24, fontWeight: 'bold', color: 'green', alignSelf: 'flex-start', alignItems: 'center' }}>
                  Save
                </Text>
              </View>
            </TouchableOpacity>
            {/* <Text style={{ width: 30 }}></Text> */}
            <TouchableOpacity
              onPress={() => {
                setPhoto(null);
                setReturnImg(null);
                // Alert.alert('Close')
              }}>
              <View style={styles.modalButton}>
                <Text
                  style={{ fontSize: 24, fontWeight: 'bold', color: 'red', alignSelf: 'flex-end', alignItems: 'center' }}>
                  Close
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}

    </SafeAreaView>
  );
}
// <StatusBar style="auto" />
const styles = StyleSheet.create({
  modalBottomContainer: {
    width: '100%',
    //flex: 1,
    height: Platform.OS === 'ios' ? 60 : 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
});
