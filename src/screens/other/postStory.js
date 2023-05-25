import React, { useState, memo, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  PanResponder,
  ImageBackground,
} from 'react-native';
import {
  Button,
  Textinput,
  PressableText,
  RippleTouchable,
} from './../../component/';
import { color, fontFamily } from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Toast from 'react-native-toast-message';
import { Header, Loader } from './../../component/';
import IMAGE from '../../constant/image';
import { useIsFocused } from '@react-navigation/native';
import { APIRequestWithFile, ApiUrl, IMAGEURL } from './../../utils/api';
import Video from 'react-native-video';
import Animated, { ZoomIn, FadeOut, FadeIn } from 'react-native-reanimated';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ImageBase } from 'react-native';






const PostStory = ({ navigation, route }) => {
  const [appReady, setAppReady] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [isplay, setisplay] = useState(false);
  const [hideControles, sethideControles] = useState(false);
  const [message, setmessage] = useState('');

  const isFocus = useIsFocused();

  // useEffect(() => {
  //   if (isFocus) {
  //     setTimeout(() => {
  //       setAppReady(true);
  //     }, 1000);
  //   }
  //   return;
  // }, [isFocus]);

  const postStory = () => {
    if (route.params?.file?.fileSize > 17) {
      Toast.show({
        type: 'error',
        text1: 'Size should be less than 14 MB',
      });
      return;
    }
    console.log('message', message);
    if (route.params?.file?.duration > 30) {
      Toast.show({
        type: 'info',
        text1: 'Duration must be less than to 30 sec'
      });
      return;
    }
    setisLoading(true);
    let formdata = new FormData();
    let type = route.params?.file?.fileType == 'photo' ? 'image' : 'video';
    if (route.params?.file?.fileType === 'video') {
      let typevip = route.params?.file.type.split("/")
      formdata.append(type, {
        ...route.params?.file,
        name: `videos${new Date()}.${typevip[1]}`
      });
    } else {
      formdata.append(type, route.params.file);
    }
    formdata.append('caption', message);
    formdata.append('story_type', 'MEDIA');


    let config = {
      url: ApiUrl.storyCreate,
      method: 'post',
      body: formdata,
    };

    console.log("config", config);
    APIRequestWithFile(
      config,
      res => {
        if (res.status) {
          Toast.show({
            type: 'success',
            text1: res?.alert?.message
          });
          navigation.navigate("Friends");
        }
        setisLoading(false);
      },
      err => {
        if (err.response.status === 422) {
          let errorMsg = ''
          if (err?.response?.data?.error?.video) {
            errorMsg = err?.response?.data?.error?.video[0]
          }
          if (err?.response?.data?.error?.image) {
            errorMsg = err?.response?.data?.error?.image[0]
          }
          if (err?.response?.data?.error?.story_type) {
            errorMsg = err?.response?.data?.error?.story_type[0]
          }
          Toast.show({
            type: 'error',
            text1: errorMsg
          });
        } else {
          Toast.show({
            type: 'error',
            text1: err?.message
          });
        }
        setisLoading(false);
        console.log(err);
      },
    );
  };




  const videoRef = useRef();
  const renderStoryItem = () => {
    let file = route?.params?.file;

    if (file.fileType == 'photo') {
      // return <ImageBackground source={{ uri: file?.uri }} style={style.storyImage} ></ImageBackground>;
      return <Image source={{ uri: file?.uri }} style={style.storyImage} ></Image>;
    } else if (file.fileType == 'video') {
      return (
        <View>
          <Video
            source={{ uri: file?.uri }}
            ref={videoRef}
            onBuffer={b => {
              console.log(b);
            }}
            onError={err => console.log(err)}
            onLoad={() => {
              //  setisplay(true);
            }}
            onEnd={() => {
              sethideControles(false);
              setisplay(false);
            }}
            resizeMode={'contain'}
            style={{ height: '100%', width: wp(100) }}
          />
          {!hideControles && _showIcon()}
        </View>
      );
    }
  };

  const _hideControles = () => {
    if (hideControles) {
      sethideControles(false);
      setTimeout(() => {
        sethideControles(true);
      }, 4000);
    } else {
      sethideControles(true);
    }
  };

  const _showIcon = () => {
    if (isplay) {
      return (
        <TouchableOpacity
          onPress={() => {
            sethideControles(false);
            videoRef?.current?.setNativeProps({ paused: true });
            setisplay(false);
          }}
          style={{
            position: 'absolute',
            top: hp(40),
            left: wp(40),
            zIndex: 999,
          }}>
          <Animated.Image
            exiting={FadeOut}
            entering={FadeIn}
            source={IMAGE.pause}
            style={style.icon}
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => {
            _hideControles();
            videoRef?.current?.setNativeProps({ paused: false });
            setisplay(true);
          }}
          style={{
            position: 'absolute',
            top: hp(40),
            left: wp(40),
            zIndex: 999,
          }}>
          <Animated.Image
            exiting={FadeOut}
            entering={FadeIn}
            source={IMAGE.play}
            style={style.icon}
          />
        </TouchableOpacity>
      );
    }
  };

  return (
    <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: color.black }}>
      <View>
        <View style={style.headerContainer}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Image
              source={IMAGE.back}
              style={{
                height: 20,
                width: 20,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>

          <Text style={style.headerText}>Post Story</Text>
          <Text style={{ color: '#f5f5f5' }}></Text>
        </View>
        <Loader type="dots" isLoading={isLoading} />
        {route?.params?.file && (
          <View>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => _hideControles()}
              style={style.storyView}>
              {renderStoryItem()}
              <View style={style.storyBtnView}>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: '#fff',
                    height: hp(6),
                    borderRadius: 40,
                    marginBottom: '5%',
                  }}>

                  <Textinput
                    value={message}
                    style={style.inputStyle}
                    changeText={value => {
                      setmessage(value);
                    }}
                    placeholder={'Add a caption'}
                  />
                  <TouchableOpacity
                    onPress={postStory}
                    style={{
                      backgroundColor: 'white',
                      justifyContent: 'center',
                      borderTopRightRadius: 40,
                      borderBottomRightRadius: 40,
                      width: 40,
                      alignItems: 'center',
                    }}>
                    <Image
                      source={IMAGE.send}
                      style={{
                        height: 24,
                        width: 24,
                        tintColor: color.btnBlue,
                        resizeMode: 'contain',
                        marginRight: 4,
                      }}
                    />
                  </TouchableOpacity>
                </View>

                {/* <TouchableOpacity onPress={postStory} style={style.blurbtn}>
                    <Text style={style.storyBtnText}>Post Story</Text>
                  </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => {
                    videoRef?.current?.setNativeProps({ paused: true }),
                      navigation.goBack();
                  }}
                  style={style.blurbtn}>
                  <Text style={style.storyBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAwareScrollView>

  );
};

const style = StyleSheet.create({
  icon: {
    tintColor: 'rgba(255, 255, 255, 0.4)',
    height: 80,
    width: 80,
    resizeMode: 'contain',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  blurbtn: {
    width: wp(90),
    height: hp(6),
    backgroundColor: 'rgba(122, 122, 122, 0.79)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(2),
  },
  storyBtnText: {
    fontSize: 15,
    fontFamily: fontFamily.Bold,
    color: color.white,
  },
  storyBtnView: {
    position: 'absolute',
    bottom: hp(5),
    alignSelf: 'center',
  },
  storyView: {
    width: wp(100),
    height: hp(95),
  },
  storyImage: {
    height: hp(72),
    width: wp(100),
    resizeMode: 'contain',
  },
  inputStyle: {
    height: hp(6),
    borderWidth: 0,
    marginTop: hp(3),
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Platform.OS == 'ios' ? hp(7) : 3,
    marginHorizontal: '5%',
  },
  headerText: {
    fontSize: 15,
    fontFamily: fontFamily.Bold,
    color: '#0F0F0F',
  },
});
export default PostStory;
