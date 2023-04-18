import React, { useState, useEffect } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View, TouchableOpacity, Image } from 'react-native';
import { IMAGE, color, fontFamily, fontSize } from '../../../constant';

const TwitterAuthorization = (props) => {
  // const [modalVisible, setModalVisible] = useState(true);

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.twitterAuthorization}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          props.TwittwrShare(false)
        }}
      >
        <View style={styles.centeredView}>
          <Pressable
            onPress={() => props.TwittwrShare(false)}
            style={styles.closeBtn}>
            <Image style={styles.closeBtnImage} source={IMAGE.close} />
          </Pressable>
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
                onPress={() => props.TwittwrShare(true)}>
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
    backgroundColor: color.extralightBlack
  },
  modalView: {
    width: 280,
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
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
  btnBox: {
    width: '100%',
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
  closeBtn:{
    width: 20,
    height: 20,
    resizeMode: 'contain',
    left: 140,
    top: 7
  },
  closeBtnImage:{
    width: 20,
    height: 20,
    resizeMode: 'contain',
  }
});

export default TwitterAuthorization;
