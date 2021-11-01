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
// import { useDispatch } from 'react-redux';
// import { addClipItem, removeClipItem } from './shared/actions';

const { height, width } = Dimensions.get('window');

const serverUrl = 'http://ec2-3-15-170-72.us-east-2.compute.amazonaws.com:8080/';

const groupId = 0;

export default function CameraScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [returnImg, setReturnImg] = useState(false);
  const [isCamera, setIsCamera] = useState(false);
  const [userName, setUserName] = useState('Yierpan42');
  useEffect(() => {
    getUserInfo();
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');
    })();
  }, []);

  const getUserInfo = () => {
    // Store user account info in local storage
    storage
      .load({
        key: 'login-session',
        // autoSync (default: true) means if data is not found or has expired,
        // then invoke the corresponding sync method
        autoSync: false,
        syncInBackground: true,
      })
      .then(ret => {
        // found data go to then()
        console.log("Login Page found data!")
        setUserName(ret.username);

      })
      .catch(err => {
        // any exception including data not found
        // goes to catch()
        navigation.push('LoginPage');
      });
  };

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
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      setIsCamera(false);
      setPhoto(result.uri);
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
    let localUri = picture;
    let filename = localUri.split('/').pop();

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    // Upload the image using the fetch and FormData APIs
    let formData = new FormData();
    // "Image, name" is the name of the form field the server expects
    // GpID ; inserted into url
    formData.append('Image', localUri);
    formData.append('name', userName);
    formData.append('Description', 'static');
    try {
      const response = await fetch(serverUrl + 'Images/' + groupId, {
        method: 'POST',
        body: formData,
        headers: {
          'content-type': 'multipart/form-data',
        },
        redirect: 'follow'
      });
      const zipPhoto = await response.text();
      console.log(zipPhoto);
      setReturnImg(zipPhoto);
      Alert.alert('Success', 'The photo was successfully sent!');
    } catch (error) {
      console.log(error);
      console.log('Connection Error!');
      setReturnImg(null);
      Alert.alert('Error', 'Something went wrong!');
    }
  };
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
                  let result = await cameraRef.takePictureAsync();
                  setIsCamera(true);
                  setPhoto(result.uri);
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
            source={{ uri: photo }}
            style={{
              width: width,
              height: height - ((Platform.OS === 'ios') ? 45 + 60 : 60 + 80 + 20), //Topbar & footer, status height due to OS
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
          <View
            style={{
              width: '80%',
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: 'red',
              borderWidth: 2,
            }}>
            <Image
              source={{ uri: returnImg }}
              style={{ width: 200, height: 250, resizeMode: 'contain' }}
            />
            <View style={[styles.modalBottomContainer]}>
              <TouchableOpacity onPress={() => saveToPhone(returnImg)}>
                <View style={styles.modalButton}>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: 'bold',
                      color: 'green',
                    }}>
                    Save
                  </Text>
                </View>
              </TouchableOpacity>
              <Text style={{ width: 30 }}></Text>
              <TouchableOpacity
                onPress={() => {
                  setPhoto(null);
                  setReturnImg(null);
                  // Alert.alert('Close')
                }}>
                <View style={styles.modalButton}>
                  <Text
                    style={{ fontSize: 24, fontWeight: 'bold', color: 'red' }}>
                    Close
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
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
    height: Platform.OS === 'ios' ? 60 : 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
});