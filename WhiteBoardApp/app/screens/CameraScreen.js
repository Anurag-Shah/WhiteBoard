import React  , { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet,Text, View, Image,AsyncStorage,Platform,TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Topbar from './shared/Topbar';
import Modal from 'react-native-modal';
import { Camera } from 'expo-camera';
function CameraConnect() 
{
  const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);

    useEffect(() => {
      (async () => {
        const { status } = await Camera.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }, []);

    if (hasPermission === null) {
      return <View />;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (<View style={styles.cameracontainer}>
      <Camera style={styles.camera} type={type}>
        
      </Camera>
    </View>);
}
export default class CameraScreen extends React.Component {
  state = {
    visibleModal: null,
  };

  
  constructor (props) {
    super (props);
    
   
  }

  _renderButton = () => (
    <View style={[styles.modalbottomcontainer, styles.modalbottomstatusBarMargin]}>
      <TouchableOpacity onPress={() => this.setState({ visibleModal: null })}>
        <View style={styles.modalButton}>
          <Text style = {{fontSize:24, fontWeight:"bold", color:'green'}}>Accept</Text>
        </View>
      </TouchableOpacity>
      <Text style={{ width:30 }}></Text>
      <TouchableOpacity onPress={() => this.setState({ visibleModal: null })}>
        <View style={styles.modalButton}>
          <Text style={{fontSize:24, fontWeight:"bold",color:'red'}}>Retake</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  _renderModalContent = () => (
    <View style={styles.modalContent}>
      <View>
        <Image
                  style={{ width: 200, height: 400 }}
                  source={{ uri: "1.jpg" }}
                  resizeMode="center"
                />
      </View>
      {this._renderButton()}
     
    </View>
  );



  render() {
    
    

    return (
      <SafeAreaView style={ styles.cameracontainer }>
        <Topbar title="Camera" navigation={this.props.navigation}/>
        <View style={styles.container}>
        <Modal isVisible={this.state.visibleModal === 1}>
          {this._renderModalContent()}
        </Modal>
        </View>
        <CameraConnect/>
        <View style={[styles.bcontainer, styles.bstatusBarMargin,{paddingBottom:24}]} >
        
          <Text style={{ width:50 }}></Text>
          
          <TouchableOpacity style = {{ alignSelf:'center' }} onPress = {() => this.setState({ visibleModal: 1 })}>
            <Ionicons name="radio-button-on" size={72} style={{ color: '#222' }} />
          </TouchableOpacity>
          <TouchableOpacity >
            <Ionicons name="image-outline" size={40} style={{ color: 'black' }} />
            
          </TouchableOpacity>
        </View>
        {/* <BottomBar/> */}
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
  bcontainer: {
    width:"100%",
    height: (Platform.OS === 'ios') ? 60 : 80,
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    paddingHorizontal: 20,
    backgroundColor: 'white'
  },
  bstatusBarMargin: {
    paddingTop: (Platform.OS === 'ios') ? 0 : 24
  },
  cameracontainer: {
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
  modalbottomcontainer: {
    width:"100%",
    height: (Platform.OS === 'ios') ? 60 : 80,
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    backgroundColor: 'white'
  },
  modalbottomstatusBarMargin: {
    paddingTop: (Platform.OS === 'ios') ? 0 : 24
  },
});

