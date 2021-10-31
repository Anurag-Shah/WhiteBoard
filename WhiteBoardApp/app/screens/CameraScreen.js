import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, Platform, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Topbar from './shared/Topbar';
import { Modal } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

const Server_url = 'http://localhost:8000';

function CameraConnect(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [cameraRef, setCameraRef] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted')
    })();
  }, []);

  if (hasPermission === null || hasGalleryPermission === false) {
    return <View />;
  }
  if (hasPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Image,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      props.setImage(result);
      props.showModal(true);
    }
  };

  return (
    <View style={styles.cameraContainer}>
      <Camera style={styles.camera} type={type} ratio={'1:1'} ref={(ref) => {
        setCameraRef(ref);
      }}>
      </Camera>
      <View style={[styles.bContainer, styles.bStatusBarMargin, { paddingBottom: 24 }]} >
        <Text style={{ width: 50 }}></Text>
        <TouchableOpacity style={{ alignSelf: 'center' }} onPress={async () => {
          if (cameraRef) {
            let photo = await cameraRef.takePictureAsync(null);
            console.log(photo)
            props.setImage(photo);
            props.showModal(true);
          }
        }}>
          <Ionicons name="radio-button-on" size={72} style={{ color: '#222' }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => pickImage()}>
          <Ionicons name="image-outline" size={40} style={{ color: 'black' }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default class CameraScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visibleModal: false,
      cameraRef: null,
      image: null
    };
  }

  setImage = (img) => {
    this.setState({ image: img });
  }

  showModal = (isVisible) => {
    this.setState({ visibleModal: isVisible });
  }

  takePicture = async () => {

    let localUri = this.state.image.uri;
    let filename = localUri.split('/').pop();

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    // Upload the image using the fetch and FormData APIs
    let formData = new FormData();
    // Assume "photo" is the name of the form field the server expects
    formData.append('photo', { uri: localUri, name: filename, type });

    const { navigate } = this.props.navigation;
    this.showModal(false);
    navigate("Account");

    return;
    try {
      //TODO: enabling loading mark
      let ret = await fetch(Server_url + '/scan', {
        method: 'POST',
        body: formData,
        headers: {
          'content-type': 'multipart/form-data',
        },
      })
      // analyse ret
      // result
      // TODO: if success, redirect, else error display and stay


    } catch (error) {
      console.log(error);
    }
    //Todo: disable loading mark

  }
  _renderButton = () => (
    <View style={[styles.modalBottomContainer, styles.modalBottomStatusBarMargin]}>
      <TouchableOpacity onPress={this.takePicture}>
        <View style={styles.modalButton}>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: 'green' }}>Accept</Text>
        </View>
      </TouchableOpacity>
      <Text style={{ width: 30 }}></Text>
      <TouchableOpacity onPress={() => this.setState({ visibleModal: false })}>
        <View style={styles.modalButton}>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: 'red' }}>Retake</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  _renderModalContent = () => (
    <View style={styles.modalContent}>
      <View>
        <Image
          style={{ width: 200, height: 400 }}
          source={{ uri: this.state.image.uri }}
          resizeMode="center"
        />
      </View>
      {this._renderButton()}

    </View>
  );



  render() {

    return (
      <SafeAreaView style={styles.cameraContainer}>
        <Topbar title="Camera" navigation={this.props.navigation} />
        {this.state.visibleModal &&
          <View style={styles.container}>
            <Modal isVisible={this.state.visibleModal === true}>
              {this._renderModalContent()}
            </Modal>
          </View>}
        {!this.state.visibleModal &&
          <CameraConnect showModal={this.showModal} setImage={this.setImage} />
        }
      </SafeAreaView>
    );
  }
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
    width: "100%",
    height: (Platform.OS === 'ios') ? 60 : 80,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: 'white'
  },
  bStatusBarMargin: {
    paddingTop: (Platform.OS === 'ios') ? 0 : 24
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  camerabuttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  camerabutton: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  cameratext: {
    fontSize: 18,
    color: 'white',
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
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalBottomContainer: {
    width: "100%",
    height: (Platform.OS === 'ios') ? 60 : 80,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: 'white'
  },
  modalBottomStatusBarMargin: {
    paddingTop: (Platform.OS === 'ios') ? 0 : 24
  },
});

