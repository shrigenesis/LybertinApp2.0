import React, { useState, useEffect } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View } from 'react-native';
import { color, fontFamily, fontSize } from '../../../constant';

const ConfirmationModal = () => {
  const [modalVisible, setModalVisible] = useState(true);

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.headingBox}>
              <Text style={styles.heading}>Confirm your participation</Text>
            </View>
            <Text style={styles.modalText}>
              We will post a message on your Twitter account to market this
              event. In the next screen you will see the message which will be
              posted on your twitter account.
            </Text>
            <View style={styles.btnBox}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Yes I'm Interested</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '80%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    overflow:'hidden',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  btnBox:{
    width:'100%',
    backgroundColor: color.btnBlue
  },
  button: {
    // borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: color.btnBlue,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    margin: 32,
    textAlign: 'center',
  },
  headingBox: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: color.borderColor,
    padding: 10,
  },
  heading: {
    fontSize: fontSize.size15,
    fontFamily: fontFamily.Bold,
    color: color.blueMagenta,
    textAlign: 'center',
    paddingTop: 10,
  },
});

export default ConfirmationModal;
