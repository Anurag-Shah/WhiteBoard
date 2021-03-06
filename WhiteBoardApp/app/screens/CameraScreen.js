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
  Modal,
  TextInput,
} from 'react-native';

import {
  Dropdown
} from 'sharingan-rn-modal-dropdown';

// import Modal from "react-native-modal";
import { StatusBar } from 'expo-status-bar';
import Topbar from './shared/Topbar';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getToken } from '../requests/api';
import Constants from 'expo-constants';

import * as FileSystem from 'expo-file-system';

import * as MediaLibrary from 'expo-media-library';

import storage from '../config/storage';
import { sendPictureApi } from '../requests/api';
import urls from '../requests/urls';
// import { useDispatch } from 'react-redux';
// import { addClipItem, removeClipItem } from './shared/actions';

const { height, width } = Dimensions.get('window');

const serverUrl = urls.base_url;//'http://ec2-3-144-231-142.us-east-2.compute.amazonaws.com:8080'; //urls.base_url; //

export default function CameraScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [returnImg, setReturnImg] = useState(false);
  const [isCamera, setIsCamera] = useState(false);
  const [user, setUser] = useState(null);
  const [showGroups, setShowGroups] = useState(false);
  const [showRenameDlg, setShowRenameDlg] = useState(false);
  const [groupList, setGroupList] = useState(null);
  const [selGroupId, setSelGroupId] = useState(null);
  const [imageName, setImageName] = useState('image');
  const [selLang, setSelLang] = useState('auto');
  const [ocrReturnData, setOcrReturnData] = useState(null);
  const langs = ['auto', 'C', 'C#', 'Java'];
  const langList = langs.map(x => { return { 'label': x, 'value': x } });

  useEffect(() => {
    storage
      .load({
        key: 'login-session',
        autoSync: true,
        syncInBackground: true,
      })
      .then(ret => {
        console.log(ret, '=== Fetch user from localstorage ===')
        setUser(ret);
        console.log(user, '=== Done fetch user from localstorage ===')

      })
      .catch(err => {
        setSelGroupId(null);
        setUser(null);
      });

    (async () => {

      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');

    })();
  }, []);

  /****** group list & rename modal related ***** */

  const modalHeader = (
    <View style={styles.modalHeader}>
      <Text style={styles.title}>Select a Group</Text>
      <View style={styles.divider}></View>
    </View>
  )

  const modalBody = (
    <View style={styles.modalBody}>
      <Dropdown
        // label="Group"
        data={groupList}
        value={selGroupId}
        onChange={(v) => { setSelGroupId(v) }}
      />
      <View style={styles.divider}></View>
      <View style={{ flexDirection: "row-reverse", margin: 10 }}>
        <TouchableOpacity style={{ ...styles.actions, backgroundColor: "#21ba45" }}
          onPress={() => {
            if (selGroupId) {
              // Alert.alert(selGroupId);
              setShowRenameDlg(true);
            }
            else {
              Alert.alert('Please select a group.');
            }
          }}>
          <Text style={styles.actionText}>Select</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ ...styles.actions, backgroundColor: "#db2828" }}
          onPress={() => {
            // Alert.alert('Modal has been closed.');
            // setSelGroupId(null);
            setShowGroups(!showGroups);
          }}>
          <Text style={styles.actionText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
  const modalContainer = (
    <View style={styles.modalContainer}>
      {modalHeader}
      {modalBody}
    </View>
  )
  const modal = (
    <Modal
      transparent={false}
      visible={showGroups}
      onRequestClose={() => {
        // setSelGroupId(null);
        setShowGroups(!showGroups);
      }}>
      <View style={styles.modal}>
        <View>
          {modalContainer}
        </View>
      </View>
    </Modal>
  )

  const renameModal = (
    <Modal
      transparent={false}
      visible={showGroups}
      onRequestClose={() => {
        setImageName(null);
        setShowRenameDlg(false);
      }}>
      <View style={styles.modal}>
        <View>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.title}>Type the Image Name</Text>
              <View style={styles.divider}></View>
            </View>
            <View style={styles.modalBody}>
              <TextInput
                style={{ height: 40 }}
                // placeholder="Type the image name"
                onChangeText={v => setImageName(v)}
                defaultValue={'image'}
                value={imageName}
              />
              <View style={styles.divider}></View>
              <View style={{ flexDirection: "row-reverse", margin: 10 }}>
                <TouchableOpacity style={{ ...styles.actions, backgroundColor: "#21ba45" }}
                  onPress={() => {
                    if (!imageName) {
                      // Alert.alert(imageName);
                      // after renaming, we can send the picture for logged in user.
                      setImageName('image')
                    }
                    sendPicture(photo, false) // for backend save
                    //saveToPhone(returnImg)// for local save

                    // setPhoto(null);
                    // setReturnImg(null);
                    // Alert.alert(
                    //   'Info', 
                    //   'Would you like to save on local?', 
                    //   [{ text: 'OK', onPress: () => saveToPhone(returnImg) }],
                    //   { cancelable: false },
                    //   )// for local save

                  }}>
                  <Text style={styles.actionText}>Ok</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles.actions, backgroundColor: "#db2828" }}
                  onPress={() => {
                    // Alert.alert('Modal has been closed.');
                    setImageName(null);
                    setShowRenameDlg(false);
                  }}>
                  <Text style={styles.actionText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
  /******    ***** */
  // const getUserInfo = () => {

  // };

  const showError = (evt) => {
    //ocrReturnData
    const ocr_return = ocrReturnData ? ocrReturnData.ocr_return : [];
    if (ocr_return.length) {
      Alert.alert('Compile Error', ocr_return, [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false });
    }

    // console.log("Coordinates",`x coord = ${evt.nativeEvent.locationX}`);
    // console.log("Coordinates",`y coord = ${evt.nativeEvent.locationY}`);
  }

  if (hasPermission === null || hasGalleryPermission === false) {
    return <View />;
  }
  if (hasPermission === false || hasGalleryPermission === false) {
    return <>No access to camera or gallery</>;
  }

  const fetchGroups = async (uid) => {
    try {
      console.log(user);
      console.log('fetching groups...')
      console.log(serverUrl + 'User/groups/' + uid)
      const response = await fetch(serverUrl + 'User/groups/' + uid, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': "Token " + user.token,
        },
        redirect: 'follow'
      });
      const result = await response.json();
      // setShowGroups(true);
      // setGroupList(result.all_groups); 
      setSelGroupId(result.default_group.GpID);
      setGroupList(result.all_groups.map(x => {
        return { 'label': x.Gpname, 'value': x.GpID }
      }));


      console.log('Done fetching groups...')

    } catch (error) {
      console.log(error);
      console.log('Connection Error!');
      setGroupList(null);
      Alert.alert('Error', 'Connection Error in fetch groups!');
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
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
    // console.log(user, showGroups, showRenameDlg)
    // if (!user) {
    //   getUserInfo();
    // }
    console.log(user);
    if (user && user.logged_in) {
      if (!showGroups && !showRenameDlg) {
        setShowGroups(true); return;
      }
      // else if(showGroups && !showRenameDlg) {setShowGroups(true); return;} 
      // show groupList
      // show renameDlg
    }

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
    let dFormat = `${d.getTime()}`;
    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      FileSystem.documentDirectory + dFormat + '.jpg',
      {},
      callback
    );
    try {
      const { uri } = await downloadResumable.downloadAsync();
      MediaLibrary.saveToLibraryAsync(uri)
      Alert.alert('', 'Saved to photos successfully');
      // setShowGroups(false);
      // setShowRenameDlg(false);
    } catch (e) {
      Alert.alert('Error', 'Could not save the image')
    }
  };

  const acceptPicture = async (picture) => {
    // check whether user logged in or not
    // if logged in: fetch groups & show groups list
    // else call temp_image
    // fetchGroups();
    console.log(user)
    if (user && user.logged_in && !groupList) fetchGroups(user.userInfo.uid)

    sendPicture(picture, true) // isTempImage
    // if (!user) {
    //   sendPicture(picture);
    // }
    // else if (user && !showGroups) {
    //   fetchGroups().then(() => {
    //     setShowGroups(true);
    //     setShowRenameDlg(false);
    //   });
    // }
    // else if (user && showGroups && !showRenameDlg) {
    //   setShowRenameDlg(true);
    // }
  }

  const sendPicture = async (picture, isTempImage) => {

    // dispatch(removeClipItem());
    // let localUri = picture;
    // console.log(picture);
    let filename = picture.uri.split('/').pop();

    // // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    // if(filename) setImageName(filename.split('.')[0])
    // else setImageName('image')

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
      data.append('Image', photo.base64
      );

      Object.keys(body).forEach((key) => {
        data.append(key, body[key]);
      });
      return data;
    };

    if (!selLang) setSelLang('auto');

    const uploadImageUrl = serverUrl + 'Images/' + selGroupId;
    const tempUploadImgUrl = serverUrl + 'TempImages/';
    const targetUrl = !isTempImage ? uploadImageUrl : tempUploadImgUrl;
    const targetBody = !isTempImage ?
      createFormData(picture, { name: imageName, description: 'picture', language: selLang }) :
      createFormData(picture, { name: 'TempImage', description: 'picture', language: selLang });
    console.log(isTempImage, targetUrl)
    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        body: targetBody,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        redirect: 'follow'
      });

      const result = await response.json();

      console.log(targetUrl, result)
      if (result.status === 'success') {
        if (isTempImage) {
          const ycoord = result['y-coord'];
          console.log(ycoord);
          setOcrReturnData(result);
          const hasError_ = ycoord.length;
          if (hasError_) Alert.alert('Compiling Error', 'Detected Language: ' + result.language_used + ' \n' + 'Please fix the error(s)',
            [{ text: 'OK', onPress: () => setReturnImg(serverUrl + 'media/' + (!isTempImage ? result.image_after_uri : result.CV_return)) }]);
          else
            Alert.alert('Success',
              'Detected Language: ' + result.language_used + '\n ' + result.ocr_return,
              [{
                text: 'OK',
                onPress: () => {
                  setReturnImg(serverUrl + 'media/' + (!isTempImage ? result.image_after_uri : result.CV_return))
                }
              }])
        }
        else {
          Alert.alert('Success', 'Successfully saved the image on Server!', [
            {
              tex: 'OK', onPress: () => {
                setShowGroups(false);
                setShowRenameDlg(false);
              }
            }
          ]);
        }
        console.log('return_image:' + serverUrl + 'media/' + (!isTempImage ? result.image_after_uri : result.CV_return));
      }
      else {
        setOcrReturnData(null);
        setShowGroups(false);
        setShowRenameDlg(false);
        Alert.alert('Error', 'Something is wrong on Server!');
      }



    } catch (error) {

      console.error(error);
      console.log('Connection Error in sending picture!');

      setReturnImg(null);
      setOcrReturnData(null);

      setShowGroups(false);
      setShowRenameDlg(false);

      Alert.alert('Error', 'Something went wrong!');
    }



  };

  return (
    <SafeAreaView style={{ flex: 1, marginTop: (Platform.OS === 'ios' ? 50 : 30) }}>
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
              height: height - ((Platform.OS === 'ios') ? 45 + 80 + 80 : 60 + 80 + 20), //Topbar & footer, status height due to OS
              resizeMode: isCamera ? 'cover' : 'contain',
            }}
          />
          <View style={[styles.modalBottomContainer]}>
            <TouchableOpacity onPress={() => acceptPicture(photo)}>
              {/* onPress={sendPicture} */}
              <View style={styles.modalButton}>
                <Text
                  style={{ fontSize: 24, fontWeight: 'bold', color: 'green', alignSelf: 'flex-start', alignItems: 'center' }}>
                  Accept
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.dropdownLang}>
              <Dropdown
                // label="Language"
                data={langList}
                value={selLang}
                itemTextStyle={{ fontSize: 20, }}
                selectedItemTextStyle={{ fontSize: 20, fontWeight: 'bold' }}
                selectedItemViewStyle={{ fontSize: 20, fontWeight: 'bold', backgroundColor: '#fff' }}
                selectedItemTextStyle={{ fontWeight: 'bold' }}
                disableSelectionTick
                removeLabel
                onChange={(v) => { setSelLang(v) }}
              />
            </View>
            <TouchableOpacity onPress={() => {
              setPhoto(null); setShowGroups(false);
              setShowRenameDlg(false);
            }}>
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
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <View
            style={{ flex: 1, width: width, height: height - ((Platform.OS === 'ios') ? 45 + 80 + 80 : 60 + 80 + 20) }}
          >
            <TouchableOpacity onPress={(evt) => showError(evt)}>
              <Image
                // source={{ uri: returnImg }}
                source={{ uri: `${returnImg}` }}
                style={{
                  width: width, height: height - ((Platform.OS === 'ios') ? 45 + 80 + 80 : 60 + 80 + 20), //Topbar & footer, status height due to OS
                  resizeMode: 'contain'
                }}
              // onLayout={(event) => {
              //   event.target.measure(
              //     (x, y, width, height, pageX, pageY) => {
              //       // doSomethingWithAbsolutePosition({
              //       //   x: x + pageX, 
              //       //   y: y + pageY,
              //       // });
              //       console.log(x,y,width,height,pageX,pageY);
              //     },
              //   );
              // }}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.modalBottomContainer]}>
            <TouchableOpacity onPress={() => saveToPhone(returnImg)}>
              <View style={styles.modalButton}>
                <Text
                  style={{ fontSize: 24, fontWeight: 'bold', color: 'green', alignSelf: 'flex-start', alignItems: 'center' }}>
                  Save
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              navigation.navigate("TextEditorPage", { ocr_text_detected: ocrReturnData ? ocrReturnData.ocr_text_detected : '' })
            }}>
              <View style={styles.modalButton}>
                <Text
                  style={{ fontSize: 24, fontWeight: 'bold', color: 'blue', alignItems: 'center' }}>
                  Edit
                </Text>
              </View>
            </TouchableOpacity>
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
      {
        user && showGroups && !showRenameDlg && modal
      }
      {
        user && showGroups && showRenameDlg && renameModal
      }

    </SafeAreaView>
  );
}
// <StatusBar style="auto" />
const styles = StyleSheet.create({

  modalBottomContainer: {
    width: '100%',
    //flex: 1,
    height: Platform.OS === 'ios' ? 80 : 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 18,
  },
  // modalView: {
  //   backgroundColor: 'white',
  //   width: width*0.8,
  //   height: height*0.65,
  //   alignSelf: 'center',
  //   top: -height*0.04,
  //   borderRadius: height*0.03,
  //   alignItems: 'center'
  // },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 5,
    marginVertical: 8,
    marginHorizontal: 16,
  },

  modal: {
    backgroundColor: "#00000099",
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: "#f9fafb",
    width: "90%",
    borderRadius: 5
  },
  modalHeader: {

  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    padding: 15,
    color: "#000"
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "lightgray"
  },
  modalBody: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 10
  },
  modalFooter: {
  },
  actions: {
    borderRadius: 5,
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  actionText: {
    color: "#fff"
  },
  dropdownLang: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: 150,
  }
});