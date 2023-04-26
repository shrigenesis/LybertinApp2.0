import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, Text, Pressable, View, Image, TextInput } from 'react-native';
import { IMAGE, color, fontFamily, fontSize } from '../../../constant';
import LottieView from 'lottie-react-native';

const TwitterSuccessMessage = (props) => {
    const [isEdit, setisEdit] = useState(false);
    const [Message, setMessage] = useState(props.twitterMassage)

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={props.twitterConfirmMessage}
            >
                <View style={styles.centeredView}>
                    <Pressable
                        onPress={() => props.settwitterSuccessMessage()}
                        style={styles.closeBtn}>
                        <Image style={styles.closeBtnImage} source={IMAGE.close} />
                    </Pressable>
                    <View style={styles.modalView}>
                        {props?.confetti ? <LottieView
                            speed={1}
                            style={{ height: 300, position: 'absolute', marginStart: 30 }}
                            source={require('./../../../animation/Confetti.json')}
                            autoPlay
                            loop={false}
                        /> : null}
                        <Text style={styles.modalText}>
                            Thank you for joining our marketing event, your post has been successfully posted on Twitter
                        </Text>
                        <Pressable
                            onPress={() => props.settwitterSuccessMessage()}
                        >
                            <Text style={styles.modalBtn}>
                                View Now
                            </Text>
                        </Pressable>

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
        paddingVertical: 30
    },
    modalText: {
        margin: 20,
        fontSize: fontSize.size22,
        textAlign: 'center',
        color: color.blueMagenta,
        fontFamily: fontFamily.Medium
    },
    modalBtn: {
        margin: 10,
        fontSize: fontSize.size11,
        textAlign: 'center',
        color: color.twitterColor,
        fontFamily: fontFamily.Medium
    },
    closeBtn: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        left: 140,
        top: 7
    },
    closeBtnImage: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
});

export default TwitterSuccessMessage;
