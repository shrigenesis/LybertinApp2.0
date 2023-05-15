/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { memo, useEffect, useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  Keyboard,
  Text,
  Dimensions
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import { IMAGE, color, fontFamily, fontSize } from '../../../constant/';
import SoundPlayer from './../../../component/soundPlayer';
import Animated, {
  SlideOutRight,
  SlideInUp,
  FadeInLeft,
  SlideOutDown,
  SlideInLeft,
  FadeOut,
  SlideInDown,
} from 'react-native-reanimated';
import Slider from 'react-native-slider'
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { EmojiKeyboard } from './../../../component/';
import { requestPermission } from './../../../component/documentpicker';
import { pickImage } from './../../../component/';
import { IMAGEURL } from '../../../utils/api';
import VideoPlayer from '../VideoPlayer';
import Video from 'react-native-video';
import Pdf from 'react-native-pdf';
import { AudioContext } from '../../../context/AudioContext';
import moment from 'moment';

const audioRecorderPlayer = new AudioRecorderPlayer();

export const BottomView = memo(props => {
  const [showEmojiKeyboard, setshowEmojiKeyboard] = useState(false);
  const {
    audioFile = () => { },
    addPress = () => { },
    file,
    pickCamera = 1,
    message,
    setFile = () => { },
    deleteFile,
    inputFocus = () => { },
    sendMessage = () => { },
    textChange = () => { },
    media_privacy = 1,
    group_type = 1,
    emojiSelect,
    replyOn,
    removeReplyBox = () => { },
  } = props;
  const audio = useContext(AudioContext);

  useEffect(() => {
    return () => {
      setRecordingFile('');
      onStopRecord();
    };
  }, []);

  const [isRecordingStart, setRecordingStart] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingFile, setRecordingFile] = useState('');
  const [replyBoxheight, setReplyBoxheight] = useState('');
  const [height, setheight] = useState(0);
  const [disable, setdisable] = useState(false)

 

  var backTimer;

  const onStartRecord = async () => {
    if (await requestPermission('audio')) {
      setRecordingTime(0);
      setRecordingStart(true);
      const result = await audioRecorderPlayer.startRecorder();
      audioRecorderPlayer.addRecordBackListener(e => {
        let time = Math.floor(e.currentPosition / 1000);
        if (time != recordingTime) {
          audio?.setisdisabled(true)
          setRecordingTime(time);
        }
        return;
      });
      setRecordingFile(result);
      audioFile(result);
    }
  };

  const onStopRecord = async () => {
    audio?.setisdisabled(false)
    setRecordingStart(false);
    const AudioRecorderlayer = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
  };

  const getIconAndMessageOnReplyBox = (item) => {
    if (item?.message_type == '0') {
      return (
        <>
          <Text style={{ fontFamily: fontFamily.Regular, fontSize: fontSize.size15 }} > {item?.message} </Text>
        </>
      )
    }
    if (item?.message_type == '1') {
      return (
        <>
          <Image
            source={IMAGE.camera}
            style={styles.replyBoxImgIcon}
          />
          <Text style={styles.replyBoxImgText} > Image </Text>
        </>
      )
    }
    if (item?.message_type == '4') {
      return (
        <>
          <Image
            source={IMAGE.micIconPurple}
            style={{ resizeMode: 'contain', height: 14, width: 14 }}
          />
          <Text style={{ fontFamily: fontFamily.Regular, fontSize: fontSize.size15 }} > Voice Message  </Text>
        </>
      )
    }
    if (item?.message_type == '5') {
      return (
        <>
          <Image
            source={IMAGE.videoIconPurple}
            style={{ resizeMode: 'contain', height: 14, width: 14 }}
          />
          <Text style={{ fontFamily: fontFamily.Regular, fontSize: fontSize.size15 }} > Video </Text>
        </>
      )
    }

    else {
      return (
        <>
          <Image
            source={IMAGE.documentIconPurple}
            style={{ resizeMode: 'contain', height: 14, width: 14 }}
          />
          <Text style={{ fontFamily: fontFamily.Regular, fontSize: fontSize.size15 }} > Document </Text>
        </>
      )
    }

  }
  const onLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setReplyBoxheight((parseInt(height) + hp(3)));
  }

  const StopMultiplePress = () => {
    setdisable(true)
    setTimeout(() => {
      setdisable(false)
    }, 2000)
  }


  useEffect(() => {
    console.log('file log', file, file?.fileType);
    // if (file?.fileType == 'pdf') {
    //   console.log('pdf');
    //   sendMessage()
    // }else if(file?.fileType == 'video' || file?.fileType === "video/mp4"){
    //   console.log('Videos');
    //   sendMessage()
    // }else{
    //   if(file?.fileType == 'photo' || file?.fileType == 'image'){
    //     console.log('camera');
    //     sendMessage()
    //   } else{
    //     console.log('gallery');
    //   }
    // }
  }, [file])

  const Audio = () => {
    if (recordingFile === audio?.audio) {
      console.log('if');
      return (
        <SoundPlayer
          close={() => {
            setRecordingFile('');
            onStopRecord();
          }}
          Send={() => {
            sendMessage();
            setRecordingFile('');
            onStopRecord();
          }}
          recordingFile={recordingFile}
        />
      )
    } else {
      console.log('else');
      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => audio?.setaudio(recordingFile)}>
          <View
            style={{
              alignItems: 'center',
              height: hp(10),
              flexDirection: 'row',
              paddingHorizontal: wp(2),
            }}>
            <View style={styles.playpause} >
              <Image source={IMAGE.playFill} style={{ width: 40, height: 40 }} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Slider
                style={{ width: wp(55), marginLeft: wp(5) }}
                trackStyle={styles.track}
                thumbStyle={styles.thumb}
                minimumTrackTintColor='#681F84'
                thumbTouchSize={{ width: 50, height: 40 }}
                minimumValue={0}
                value={0}
                maximumValue={10}
              />
              <TouchableOpacity onPress={() => {
                setRecordingFile('');
                onStopRecord();
              }} style={{ paddingLeft: wp(5) }}>
                <Icon name='times' style={{ fontSize: 20, color: '#000' }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                sendMessage();
                setRecordingFile('');
                onStopRecord();
              }} style={{ paddingLeft: wp(5) }}>
                <Icon name='send' style={{ fontSize: 20, color: '#681F84' }} />
              </TouchableOpacity>
            </View>
          </View>
          {/* <Text>Click</Text> */}
        </TouchableOpacity>
      )
    }
  }

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={'90'}
      contentInsetAdjustmentBehavior="automatic"
      behavior={Platform.OS == 'ios' ? 'padding' : ''}>
      {(!isRecordingStart && recordingFile) && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            zIndex: 99,
            backgroundColor: '#F6F6F6',
            width: wp(100)
          }}
        >
          {Audio()}
        </View>
      )}
      <View
        style={{
          // flex:1,
          // flexDirection:'column',
          minHeight: hp(9),
          marginTop: replyOn ? (replyBoxheight == '' ? hp(8) : replyBoxheight) : hp(1),
          paddingTop: showEmojiKeyboard ? hp(6.5) : 0,
          marginBottom: Platform.OS == 'ios' ? hp(2) : 0,
          backgroundColor: '#F6F6F6',
        }}>
        {file && (
          <Animated.View
            entering={SlideInLeft}
            exiting={SlideOutDown}
            style={styles.fileView}>
            <View style={{
              width: wp(100),
              height: 50,
              position: 'absolute',
              top: 0,
              zIndex: 999,
              backgroundColor: 'rgba(52, 52, 52, 0.4)'
            }}>
              <TouchableOpacity
                onPress={deleteFile}
                style={{
                  position: 'absolute', left: 15, top: 10, zIndex: 999
                }}>
                <Image
                  source={IMAGE.close}
                  style={{
                    color: color.red,
                    height: 30,
                    width: 30,
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => sendMessage()}
                style={{
                  position: 'absolute', right: 10, top: 10, zIndex: 999
                }}>
                <Image
                  source={IMAGE.right}
                  style={{
                    color: color.red,
                    height: 30,
                    width: 30,
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: 'center' }}>
              {file?.fileType == 'pdf' ? (
                <View
                  style={{
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}>
                  <Pdf
                    trustAllCerts={false}
                    source={{
                      uri: `${file?.uri}`,
                      cache: true
                    }}
                    // source={{uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf', cache: true}}
                    style={{
                      width: Dimensions.get('window').width,
                      height: Dimensions.get('window').height,
                    }}
                  />
                </View>
              ) : null}
              {file?.fileType == 'photo' || file?.fileType == 'image' ? (
                <Image
                  source={{ uri: file.uri }}
                  style={{ resizeMode: 'contain', height: Platform.OS === 'ios' ? hp(85) : hp(100), width: wp(100) }}
                />
              ) : null}
              {file?.fileType == 'video' || file?.fileType === "video/mp4" ? (
                < Video
                  source={{ uri: file?.uri }}
                  resizeMode={'contain'}
                  style={{ height: '100%', width: wp(100) }}
                />
              ) : null}
            </View>
          </Animated.View>
        )}
        <View
          style={[
            styles.msgSendViewWrapper,
            showEmojiKeyboard && { marginBottom: hp(35) },
          ]}>
          {replyOn && <View style={styles.replyBox}>
            <View onLayout={onLayout} style={{ flex: 0.9 }}>
              <Text style={{ color: color.btnBlue }} > {replyOn?.sender?.name}</Text>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                {getIconAndMessageOnReplyBox(replyOn)}
              </View>

            </View>
            <View style={{
              flex: 0.1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              {replyOn?.message_type == '1' && (
                <Image
                  source={{ uri: `${IMAGEURL}/${replyOn?.file_name}` }}
                  style={{ resizeMode: 'cover', height: 50, width: 50 }}
                />
              )}
              <TouchableOpacity onPress={removeReplyBox}>
                <Image
                  source={IMAGE.closeCircle}
                  style={{ resizeMode: 'contain', height: 20, width: 20, tintColor: color.btnBlue, marginLeft: 10 }}
                />
              </TouchableOpacity>

            </View>
          </View>}
          <View style={styles.msgSendView}>
            {!isRecordingStart && (
              <TouchableOpacity disabled={media_privacy == 2} onPress={addPress}>
                <Image
                  source={IMAGE.add}
                  style={{ resizeMode: 'contain', height: 25, width: 25, tintColor: color.btnBlue }}
                />
              </TouchableOpacity>
            )}
            <View style={{ flexDirection: 'row' }}>
              {!isRecordingStart &&
                <>
                  <TouchableOpacity
                    disabled={group_type == 2}
                    onPress={() => {
                      !isRecordingStart && setshowEmojiKeyboard(!showEmojiKeyboard);
                      Keyboard.dismiss();
                    }}
                    style={{
                      position: 'absolute',
                      zIndex: 99,
                      left: wp(5),
                      top: Platform.OS === 'ios' ? 9 : hp(1.5),
                    }}>
                    <Image
                      source={IMAGE.smile}
                      style={{ resizeMode: 'contain', height: 18, width: 18, tintColor: color.btnBlue }}
                    />
                  </TouchableOpacity>
                  <TextInput
                    editable={group_type == 1}
                    // multiline={true}
                    value={message}
                    onFocus={() => {
                      setshowEmojiKeyboard(false);
                      inputFocus();
                    }}
                    onContentSizeChange={event => {
                      setheight(event.nativeEvent.contentSize.height);
                    }}
                    onChangeText={textChange}
                    placeholder={'Write a reply....'}
                    textAlignVertical={'center'}
                    paddingHorizontal={40}
                    placeholderTextColor={color.textGray2}
                    style={[styles.msgSendBox, { height: Math.max(35, height) }]}
                  />
                  <TouchableOpacity
                    disabled={disable}
                    onPress={() => {
                      StopMultiplePress()
                      !isRecordingStart && sendMessage(), setRecordingFile('');
                    }}
                    style={styles.sendbtn}>
                    {!isRecordingStart && (
                      <Image
                        source={IMAGE.send}
                        style={{ resizeMode: 'contain', height: 18, width: 18, tintColor: color.btnBlue }}
                      />
                    )}
                  </TouchableOpacity>
                </>}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: wp(23),
                paddingHorizontal: wp(3),
              }}>
              <TouchableOpacity
                onPress={() => {
                  pickCamera == 1
                    ? isRecordingStart
                      ? console.log('onStopRecord()')
                      : onStartRecord()
                    : console.log('kkkkkk');
                }}>
                <Image
                  source={IMAGE.mic}
                  style={{
                    tintColor: isRecordingStart ? color.red : color.btnBlue,
                    resizeMode: 'contain',
                    height: 25,
                    width: 25,
                    tintColor: color.btnBlue
                  }}
                />
              </TouchableOpacity>
              {isRecordingStart && (
                <View
                  style={{
                    position: 'absolute',
                    left: wp(15),
                    width: wp(75),
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                  }}
                >
                  <Animated.Text
                    entering={FadeInLeft}
                    exiting={SlideOutRight}
                  // style={styles.recordingTimer}
                  >
                    {moment.utc(recordingTime * 1000).format('mm:ss')}
                  </Animated.Text>
                  <Text >Recording ...</Text>
                  <TouchableOpacity
                    onPress={() => {
                      pickCamera == 1
                        ? isRecordingStart
                          ? onStopRecord()
                          : onStartRecord()
                        : console.log('kkkkkk');
                    }}>
                    <Image
                      source={IMAGE.stop}
                      style={{
                        resizeMode: 'contain',
                        height: 25,
                        width: 25,
                        // tintColor: color.btnBlue,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              )}
              {!isRecordingStart && (
                <TouchableOpacity
                  onPress={() => {
                    pickCamera == 1
                      ? pickImage(
                        'camera',
                        res => {
                          setFile(res);
                        },
                        'image',
                      )
                      : console.log('kkkkkk');
                  }}>
                  <Image
                    source={IMAGE.camera}
                    style={{ resizeMode: 'contain', height: 25, width: 25, tintColor: color.btnBlue }}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        {showEmojiKeyboard && (
          <Animated.View
            entering={SlideInDown}
            exiting={FadeOut}
            style={{ height: hp(35), zIndex: 999 }}>
            <EmojiKeyboard onSelectEmoji={emojiSelect} />
          </Animated.View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
});

const styles = StyleSheet.create({
  sendbtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(4),
    top: Platform.OS === 'ios' ? 2 : hp(1),
    width: wp(10),
    position: 'absolute',
    zIndex: 99,
    right: 5,
  },
  fileView: {
    width: wp(100),
    height: Platform.OS === 'ios' ? hp(100) : hp(110),
    // marginBottom: hp(7),
    marginTop: -10,
    // left: wp(4),
    backgroundColor: '#000'
  },
  recordingTimer: {
    fontFamily: fontFamily.Thin,
    color: '#000',
    fontSize: fontSize.size11,
    position: 'absolute',
    left: 40,
    bottom: 5,
    width: 100
  },

  msgSendViewWrapper: {
    backgroundColor: '#F6F6F6',
    position: 'absolute',
    bottom: 0,
    width: wp(100),
    paddingHorizontal: wp(4),
    marginBottom: hp(1),
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  msgSendView: {
    backgroundColor: '#F6F6F6',
    bottom: 0,
    width: wp(100),
    paddingHorizontal: wp(4),
    marginBottom: hp(1),
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  replyBox: {
    width: wp(100),
    marginBottom: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: color.borderGray,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderLeftWidth: 4,
    borderLeftColor: color.btnBlue,
  },
  msgSendBox: {
    height: hp(4.5),
    maxHeight: 50,
    paddingLeft: wp(10),
    borderRadius: 20,
    backgroundColor: '#f8fcfc',
    borderWidth: 1,
    borderColor: color.borderGray,
    fontSize: 12,
    color: color.textGray2,
    fontFamily: fontFamily.Regular,
    width: wp(63),
    marginLeft: wp(3),
  },
  replyBoxImgIcon: {
    resizeMode: 'contain',
    height: 12,
    width: 12,
    tintColor: color.iconGray
  },
  replyBoxImgText: {
    marginTop: 2,
    fontFamily: fontFamily.Regular,
    fontSize: fontSize.size12
  },
  playpause: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(10),
    height: hp(4)
  },
  track: {
    height: 3,
    backgroundColor: '#Fff',
  },
  thumb: {
    width: 10,
    height: 10,
    backgroundColor: '#681F84',
    borderRadius: 10,
    shadowColor: '#31a4db',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    shadowOpacity: 1,
  },
});
