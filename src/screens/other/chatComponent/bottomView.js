/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  TextInput,
  Text,
  Dimensions,
  Keyboard,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { IMAGE, color, fontFamily, fontSize } from '../../../constant';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import { EmojiKeyboard } from '../../../component';
import { SlideInDown } from 'react-native-reanimated';
import { SlideInUp } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { AudioContext } from '../../../context/AudioContext';
import { IMAGEURL } from '../../../utils/api';
import { requestPermission } from '../../../component/documentpicker';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import moment from 'moment';
import Slider from 'react-native-slider';
import SoundPlayer from '../../../component/soundPlayer';
import LottieView from 'lottie-react-native';
import Video from 'react-native-video';
import Pdf from 'react-native-pdf';
import DeviceInfo from 'react-native-device-info';

const audioRecorderPlayer = new AudioRecorderPlayer();

export const BottomView = memo(props => {
  const [showEmojiKeyboard, setshowEmojiKeyboard] = useState(false);
  const [isRecordingStart, setRecordingStart] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingFile, setRecordingFile] = useState('');
  const [playImmediate, setPlayImmediate] = useState(false);
  const [replyBoxheight, setReplyBoxheight] = useState('');
  const [videoHeight, setVideoHeight] = useState(1);
  const [videoWidth, setVideoWidth] = useState(1);
  const [height, setheight] = useState(0);
  const [disable, setdisable] = useState(false);

  const {
    audioFile = () => { },
    addPress = () => { },
    file,
    pickCamera = 1,
    message,
    deleteFile,
    inputFocus = () => { },
    sendMessage = () => { },
    textChange = () => { },
    media_privacy = 1,
    group_type = 1,
    isConnected = 1,
    emojiSelect,
    replyOn,
    removeReplyBox = () => { },
  } = props;
  const audio = useContext(AudioContext);
  const searchInput = useRef(null);

  const keyboardDidHideCallback = () => {
    if (Platform.OS === 'android') searchInput?.current?.blur?.();
  };

  useEffect(() => {
    const keyboardDidHideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      keyboardDidHideCallback,
    );
    return () => {
      keyboardDidHideSubscription?.remove();
    };
  }, []);

  useEffect(() => {
    return () => {
      setRecordingFile('');
      onStopRecord();
    };
  }, []);

  const onStartRecord = async () => {
    setPlayImmediate(false);
    if (await requestPermission('audio')) {
      setRecordingTime(0);
      setRecordingStart(true);
      const result = await audioRecorderPlayer.startRecorder();
      audioRecorderPlayer.addRecordBackListener(e => {
        let time = Math.floor(e.currentPosition / 1000);
        if (time != recordingTime) {
          audio?.setisdisabled(true);
          setRecordingTime(time);
        }
        return;
      });
      setRecordingFile(result);
      audioFile(result);
    }
  };

  const onStopRecord = async () => {
    audio?.setisdisabled(false);
    setRecordingStart(false);
    const AudioRecorderlayer = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
  };

  const getIconAndMessageOnReplyBox = item => {
    if (item?.message_type == '0') {
      return (
        <>
          <Text numberOfLines={1} style={styles.messageTypeText}>
            {item?.message.length < 30
              ? `${item?.message}`
              : `${item?.message.substring(0, 30)}...`}
          </Text>
        </>
      );
    }
    if (item?.message_type == '1') {
      return (
        <>
          <Image source={IMAGE.camera} style={styles.messageTypeImage} />
          <Text style={styles.replyBoxImgText}>Image</Text>
        </>
      );
    }
    if (item?.message_type == '4') {
      return (
        <>
          <Image source={IMAGE.micIconPurple} style={styles.messageTypeImage} />
          <Text style={styles.messageTypeText}>Voice Message</Text>
        </>
      );
    }
    if (item?.message_type == '5') {
      return (
        <>
          <Image
            source={IMAGE.videoIconPurple}
            style={styles.messageTypeImage}
          />
          <Text style={styles.messageTypeText}>Video</Text>
        </>
      );
    } else {
      return (
        <>
          <Image
            source={IMAGE.documentIconPurple}
            style={styles.messageTypeImage}
          />
          <Text style={styles.messageTypeText}>Document</Text>
        </>
      );
    }
  };
  const onLayout = event => {
    const { height } = event.nativeEvent.layout;
    setReplyBoxheight(parseInt(height) + hp(3));
  };

  const onVideoWrapperLayout = event => {
    const { height, width } = event.nativeEvent.layout;
    setVideoHeight(parseInt(height));
    setVideoWidth(parseInt(width));
  };

  const StopMultiplePress = () => {
    setdisable(true);
    // setTimeout(() => {
    setdisable(false);
    // }, 500);
  };

  const playAudio = play => {
    audio?.setaudio(recordingFile);
    if (play) {
      setPlayImmediate(true);
    }
  };

  const showDisconectedToast = type => {
    let text = 'Please connect to internet.';
    switch (type) {
      case 'FILE':
        text = 'Please connect to internet to send any file.';
        break;
      case 'RECORD':
        text = 'Please connect to internet to record audio.';
        break;
      case 'NO_PERMISSION':
        text = 'You do not have access to send media in this group.';
        break;

      default:
        text = 'Please connect to internet to capture image.';
        break; //CAMERA
    }

    Toast.show({
      type: 'error',
      text1: text,
    });
  };

  useEffect(() => {
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
  }, [recordingFile]);

  const Audio = () => {
    if (recordingFile === audio?.audio) {
      return (
        <SoundPlayer
          playImmediate={playImmediate}
          close={() => {
            audioFile('');
            setRecordingFile('');
            onStopRecord();
          }}
          Send={() => {
            audio?.setaudio('');
            onStopRecord();
            setRecordingFile('');
            sendMessage();
          }}
          recordingFile={recordingFile}
        />
      );
    } else {
      return (
        <View style={styles.row}>
          <TouchableOpacity activeOpacity={1} onPress={() => playAudio(true)}>
            <View style={styles.playpause}>
              <Image source={IMAGE.playFill} style={{ width: 40, height: 40 }} />
            </View>
          </TouchableOpacity>
          <Slider
            style={styles.slider}
            trackStyle={styles.track}
            thumbStyle={styles.thumb}
            minimumTrackTintColor="red"
            // thumbTouchSize={{width: 50, height: 40}}
            minimumValue={0}
            value={0}
            disabled={true}
            maximumValue={10}
          />
          <TouchableOpacity
            style={[styles.col_small]}
            onPress={() => {
              setRecordingFile('');
              audioFile('');
              onStopRecord();
            }}>
            <Image
              source={IMAGE.delete}
              style={{
                resizeMode: 'contain',
                height: 24,
                width: 24,
                tintColor: color.red,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.col_small, styles.sendIconBox]}
            onPress={() => {
              audio?.setaudio('');
              sendMessage();
              setRecordingFile('');
              onStopRecord();
            }}>
            <Image
              source={IMAGE.send}
              style={{
                resizeMode: 'contain',
                height: 20,
                width: 20,
                tintColor: color.white,
              }}
            />
          </TouchableOpacity>
        </View>
      );
    }
  };

  useEffect(() => {

  }, [height]);

  return (
    <>
      {file && (
        <View style={styles.fileView}>
          <View
            onLayout={onVideoWrapperLayout}
            style={styles.filePreviewWrapper}>
            {file?.fileType == 'pdf' ? (
              <Pdf
                trustAllCerts={false}
                source={{
                  uri: `${file?.uri}`,
                  cache: true,
                }}
                style={{
                  width: Dimensions.get('window').width,
                  height: hp(80),
                }}
              />
            ) : null}
            {file?.fileType == 'photo' || file?.fileType == 'image'
              ?
              (
                <Image
                  source={{ uri: file.uri }}
                  style={{
                    resizeMode: 'contain',
                    width: wp(100),
                    height: hp(100),
                  }}
                />
              )
              : null}
            {file?.fileType == 'video' || file?.fileType === 'video/mp4' ? (
              <Video
                source={{ uri: file?.uri }}
                muted={true}
                paused={true}
                controls={true}
                resizeMode="cover"
                style={{
                  // height: Dimensions.get('window').width / (16 / 9),
                  height: videoHeight - 50,
                  width: videoWidth,
                }}
              />
            ) : null}
          </View>

          <TouchableOpacity style={styles.removeFile} onPress={deleteFile}>
            <Image source={IMAGE.close} style={styles.removeFIleImage} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sendFile}
            onPress={() => {
              audio?.setaudio('');
              sendMessage();
            }}>
            <View style={[styles.col_small, styles.sendIconBoxLg]}>
              <Image
                source={IMAGE.send}
                style={{
                  color: color.white,
                  height: 25,
                  width: 25,
                  tintColor: color.white,
                  resizeMode: 'contain',
                }}
              />
            </View>
          </TouchableOpacity>
        </View>
      )}
      <KeyboardAvoidingView
        keyboardVerticalOffset={'90'}
        contentInsetAdjustmentBehavior="automatic"
        behavior={Platform.OS == 'ios' ? 'padding' : ''}>
        {!isRecordingStart && recordingFile && (
          <View style={styles.recordedAudioContainer}>{Audio()}</View>
        )}

        <View
          style={[
            styles.container,
            {
              ...Platform.select({
                ios: {
                  minHeight: replyOn
                    ? DeviceInfo.hasNotch()
                      ? 186
                      : 150
                    : DeviceInfo.hasNotch()
                      ? 112
                      : 60,
                },
                android: {
                  minHeight: 50,
                },
              }),
            },
          ]}>
          {isRecordingStart && (
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
            // style={styles.recordingTimer}
            >
              <View
                style={[
                  styles.row,
                  {
                    ...Platform.select({
                      ios: {
                        maxHeight: height + 1 > 0 ? 70 : 150,
                      },
                      android: {
                        maxHeight: height + 1 > 0 ? 100 : 200,
                      },
                    }),
                  },
                ]}>
                <View style={[styles.recordingContainer]}>
                  <View style={[styles.col_small, styles.sendIconBox]}>
                    {/* <Image
                    source={IMAGE.mic}
                    style={{
                      resizeMode: 'contain',
                      height: 20,
                      width: 20,
                      tintColor: color.white,
                    }}
                  /> */}
                    <LottieView
                      speed={1}
                      style={{ height: 50 }}
                      source={require('../../../animation/SoundBarWhite.json')}
                      autoPlay
                      loop={true}
                    />
                  </View>

                  <View style={styles.recordingTextWrap}>
                    <View style={styles.recordingTimerTextWrap}>
                      <Text style={styles.recordingTimerText}>
                        {moment.utc(recordingTime * 1000).format('mm:ss')}
                      </Text>
                    </View>
                    <Text style={styles.recordingText}>Recording ...</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      pickCamera == 1
                        ? isRecordingStart
                          ? (onStopRecord(), audio?.setaudio(recordingFile))
                          : onStartRecord()
                        : console.log('kkkkkk');
                    }}>
                    <View style={[styles.col_small, styles.recordIconBox]}>
                      <Image
                        source={IMAGE.stop}
                        style={{
                          resizeMode: 'contain',
                          height: 16,
                          width: 16,
                          tintColor: color.white,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          )}
          {replyOn && (
            <View style={styles.replyBoxContainer}>
              <View style={styles.replyBoxRow}>
                <View onLayout={onLayout} style={{ flex: 0.9 }}>
                  <Text style={styles.remplySenderName}>
                    {replyOn?.sender?.name}
                  </Text>
                  <View style={styles.replyBoxleftIcons}>
                    {getIconAndMessageOnReplyBox(replyOn)}
                  </View>
                </View>
                <View style={styles.replyBoxRemoveIcon}>
                  {replyOn?.message_type == '1' && (
                    <Image
                      source={{ uri: `${IMAGEURL}/${replyOn?.file_name}` }}
                      style={styles.replyBoxImage}
                    />
                  )}
                  <TouchableOpacity onPress={removeReplyBox}>
                    <Image
                      source={IMAGE.closeCircle}
                      style={{
                        resizeMode: 'contain',
                        height: 24,
                        width: 24,
                        tintColor: color.btnBlue,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          {!isRecordingStart && !recordingFile && (
            <View
              style={[
                styles.row,
                {
                  ...Platform.select({
                    ios: {
                      maxHeight: height + 1 > 0 ? 100 : 150,
                    },
                    android: {
                      maxHeight: height + 1 > 0 ? 100 : 200,
                    },
                  }),
                },
              ]}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  isConnected
                    ? (searchInput?.current?.blur(),
                      addPress(),
                      audio?.setaudio(''))
                    : showDisconectedToast('FILE');
                }}>
                <View style={styles.col_small}>
                  <Image
                    source={IMAGE.add}
                    style={{
                      resizeMode: 'contain',
                      height: 25,
                      width: 25,
                      tintColor: color.btnBlue,
                    }}
                  />
                </View>
              </TouchableOpacity>

              {/* // middle section */}
              <View style={styles.col}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    setshowEmojiKeyboard(!showEmojiKeyboard);
                    Keyboard.dismiss();
                  }}>
                  <View style={styles.col_small}>
                    <Image
                      source={IMAGE.smile}
                      style={{
                        resizeMode: 'contain',
                        height: 20,
                        width: 20,
                        tintColor: color.btnBlue,
                      }}
                    />
                  </View>
                </TouchableOpacity>
                <TextInput
                  placeholder={'Message...'}
                  placeholderTextColor={color.lightBlack}
                  multiline={true}
                  editable={group_type == 1}
                  value={message}
                  onChangeText={textChange}
                  textAlignVertical={'center'}
                  autoFocus={true}
                  ref={ref => {
                    searchInput && (searchInput.current = ref);
                  }}
                  onFocus={() => {
                    setshowEmojiKeyboard(false);
                    inputFocus();
                  }}
                  style={[
                    styles.messageBox,
                    {
                      ...Platform.select({
                        ios: {
                          maxHeight: height + 1 > 0 ? 100 : 150,
                        },
                        android: {
                          maxHeight: height + 1 > 0 ? 100 : 200,
                        },
                      }),
                    },
                  ]}
                  onContentSizeChange={event => {
                    setheight(
                      Math.round(event.nativeEvent.contentSize.height - 20),
                    );
                  }}
                />
                {/* <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                alert('hello');
              }}>
              <View style={styles.col_small}>
                <Image
                  source={IMAGE.add}
                  style={{
                    resizeMode: 'contain',
                    height: 25,
                    width: 25,
                    tintColor: color.btnBlue,
                  }}
                />
              </View>
            </TouchableOpacity> */}
              </View>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  message
                    ? (StopMultiplePress(),
                      !isRecordingStart && sendMessage(),
                      setRecordingFile(''),
                      audio?.setaudio(''))
                    : isConnected
                      ? pickCamera == 1
                        ? isRecordingStart
                          ? console.log('onStopRecord()')
                          : (onStartRecord(), textChange(''), removeReplyBox())
                        : showDisconectedToast('NO_PERMISSION')
                      : showDisconectedToast('RECORD');
                }}>
                <View style={[styles.col_small, styles.sendIconBox]}>
                  {message && (
                    <Animated.View entering={ZoomIn} exiting={ZoomOut}>
                      <Image source={IMAGE.send} style={styles.sendIconStyle} />
                    </Animated.View>
                  )}
                  {!message && (
                    <Animated.View entering={ZoomIn} exiting={ZoomOut}>
                      <Image source={IMAGE.mic} style={styles.sendIconStyle} />
                    </Animated.View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          )}
          {showEmojiKeyboard && (
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              style={{ height: hp(35) }}>
              <EmojiKeyboard onSelectEmoji={emojiSelect} />
            </Animated.View>
          )}
        </View>
      </KeyboardAvoidingView>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    // position: 'absolute',
    // bottom: 0,
    // flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: color.lightGray,
    minHeight: Platform.OS === 'ios' && DeviceInfo.hasNotch() ? 90 : 50,
    paddingVertical: 5,
    width: wp(100),
    paddingTop: Platform.OS === 'ios' ? 10 : 0,
    paddingBottom: Platform.OS === 'ios' ? 0 : 0,
    zIndex: 1,
  },
  recordedAudioContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 20 : 0,
    // flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: color.lightGray,
    minHeight: Platform.OS === 'ios' && DeviceInfo.hasNotch() ? 70 : 50,
    paddingVertical: 5,
    width: wp(100),
    paddingTop: Platform.OS === 'ios' ? 0 : 0,
    paddingBottom: Platform.OS === 'ios' ? 0 : 0,
    zIndex: 2,
  },
  row: {
    // position: 'relative',
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between',
    gap: 5,
    paddingHorizontal: 10,
  },
  col_small: {
    // backgroundColor: color.green,
    minHeight: 40,
    width: 40,
    minWidth: 40,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    // flex: 1
  },
  sendIconStyle: {
    resizeMode: 'contain',
    height: 20,
    width: 20,
    tintColor: color.white,
  },
  col: {
    backgroundColor: color.green,
    minWidth: 40,
    // MinHeight: 45,
    width: 40,
    flex: 1,
    gap: 5,
    backgroundColor: color.white,
    borderColor: color.textGray2,
    borderWidth: 1,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // alignContent: 'center',
    alignItems: 'center',
  },
  messageBox: {
    flex: 1,
    fontFamily: fontFamily.Medium,
    fontSize: fontSize.size15,
    color: color.lightBlack,
    textAlign: 'left',
    paddingRight: 10,
    textAlignVertical: 'center',
  },
  sendIconBox: {
    height: 40,
    minHeight: 40,
    minWidth: 40,
    width: 40,
    backgroundColor: color.btnBlue,
    borderRadius: 60,
    padding: 10,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    transition: 'opacity 0.5s ease-in',
  },
  sendIconBoxLg: {
    height: 50,
    minHeight: 50,
    minWidth: 50,
    width: 50,
    backgroundColor: color.btnBlue,
    borderRadius: 60,
    padding: 10,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    transition: 'opacity 0.5s ease-in',
  },
  recordIconBox: {
    height: 40,
    minHeight: 40,
    minWidth: 40,
    width: 40,
    backgroundColor: color.red,
    borderRadius: 60,
    padding: 10,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    transition: 'opacity 0.5s ease-in',
  },
  replyBoxContainer: {
    // flexDirection: 'row',
    // flex: 1,
    alignItems: 'center',
    marginBottom: 5,
  },
  replyBoxRow: {
    flexDirection: 'row',
    alignContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 15,
    paddingHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: `rgba(${color.btnBluergb},0.1)`,
    borderRadius: 10,
    borderColor: color.btnBlue,
    borderLeftWidth: 5,
  },
  remplySenderName: {
    fontFamily: fontFamily.Medium,
    fontSize: fontSize.size12,
    color: color.btnBlue,
    marginBottom: 5,
  },
  replyBoxRemoveIcon: {
    flexDirection: 'row',
    alignContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginRight: 10,
  },
  replyBoxImage: {
    resizeMode: 'cover',
    height: 40,
    width: 40,
    borderRadius: 5,
  },
  replyBoxleftIcons: {
    flexDirection: 'row',
    alignContent: 'space-between',
    alignItems: 'center',
  },
  messageTypeText: {
    fontFamily: fontFamily.Regular,
    fontSize: fontSize.size15,
  },
  messageTypeImage: {
    resizeMode: 'contain',
    height: 16,
    width: 16,
    marginRight: 5,
  },
  recordingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between',
    gap: 5,
  },
  recordingTextWrap: {
    flex: 1,
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingTimerTextWrap: {
    minWidth: 100,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
  recordingText: {
    textAlign: 'center',
    fontFamily: fontFamily.Medium,
    fontSize: fontSize.size13,
  },
  recordingTimerText: {
    textAlign: 'left',
    fontFamily: fontFamily.Bold,
    fontSize: fontSize.size13,
    color: color.btnBlue,
    marginRight: 20,
  },
  slider: {
    flex: 1,
    marginLeft: 10,
  },
  track: {
    height: 3,
    backgroundColor: '#Fff',
  },
  thumb: {
    width: 10,
    height: 10,
    backgroundColor: color.btnBlue,
    borderRadius: 10,
    shadowColor: color.btnBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    shadowOpacity: 1,
  },
  fileView: {
    position: 'absolute',
    width: wp(100),
    height: Dimensions.get('window').height - 50,
    zIndex: 2,
    backgroundColor: color.black,
  },
  filePreviewWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  removeFile: {
    position: 'absolute',
    right: 20,
    top: 20,
    shadowColor: color.iconGray,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    shadowOpacity: 1,
  },
  removeFIleImage: {
    tintColor: color.white,
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
  sendFile: {
    position: 'absolute',
    right: 20,
    bottom: Platform.OS === 'ios' ? 100 : 80,
  },
});
