import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, Text, Pressable, View, Image, TextInput } from 'react-native';
import { IMAGE, color, fontFamily, fontSize } from '../../../constant';

const TwitterConfirmMessage = (props) => {
    const [isEdit, setisEdit] = useState(false);
    const [Message, setMessage] = useState(props.twitterMassage)

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={props.twitterConfirmMessage}
                onRequestClose={() => {
                    props.PostTwitter(false, Message)
                }}
            >
                <View style={styles.centeredView}>
                    <Pressable
                        onPress={() => props.PostTwitter(false, Message)}
                        style={styles.closeBtn}>
                        <Image style={styles.closeBtnImage} source={IMAGE.close} />
                    </Pressable>
                    <View style={styles.modalView}>
                        <View style={styles.headingBox}>
                            <Text style={styles.heading}>Confirm message</Text>
                        </View>
                        <Text style={styles.modalText}>
                            Below message will be posted on your twitter profile.
                        </Text>

                        <TextInput
                            value={Message}
                            onChangeText={(e) => setMessage(e)}
                            maxLength={280}
                            style={styles.input}
                            multiline={true}
                            numberOfLines={4}
                            textAlign={'center'}
                            editable={isEdit}
                        />
                        {!isEdit?<Pressable
                            onPress={() => setisEdit(true)}
                            style={styles.editBtn}>
                            <Image style={styles.editBtnImage} source={IMAGE.editIcon} />
                        </Pressable>:null}
                        <View style={styles.btnBox}>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => props.PostTwitter(true, Message)}>
                                <Text style={styles.textStyle}>Go Ahead</Text>
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
        margin: 20,
        textAlign: 'center',
        color: color.blueMagenta
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
    input: {
        borderColor: color.liteMagenta,
        borderWidth: 1,
        height: 100,
        borderRadius: 10,
        textAlignVertical: 'top',
        margin: 20,
        padding: 10,
        borderStyle: 'dashed',
        color: color.violet,
    },
    editBtn: {
        width: 20,
        height: 20,
        left: 110,
        bottom: 40
    },
    editBtnImage: {
        width: 20,
        height: 20,
    }
});

export default TwitterConfirmMessage;
