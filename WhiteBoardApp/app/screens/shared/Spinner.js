import React, { useEffect, useState } from "react";
import { Modal, View, StyleSheet, ActivityIndicator, Text } from "react-native";



function Spinner(props) {
  const [msg, setMsg] = useState("Sennding Picture...");
  const [loading, setLoading] = useState(true);
  return (
    <Modal
      transparent={true}
      visible={loading}
      presentationStyle="overFullScreen"
    >
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator animating={loading} color="white" size="large" />
          <View style={{ flexDirection: 'row', }}>
            <Text style={{ color: "#c5c7c6", fontSize: 18 }}>{msg}</Text>
          </View>
        </View>
      </View>
    </Modal >
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
    zIndex: 1000
  },
  activityIndicatorWrapper: {
    flex: 1,
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
});


export default Spinner;
