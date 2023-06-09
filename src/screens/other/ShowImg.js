import React, { useState, memo, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { color, fontFamily } from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Header, Loader } from './../../component/';
import IMAGE from '../../constant/image';
import { useIsFocused } from '@react-navigation/native';
import { APIRequestWithFile, ApiUrl, IMAGEURL } from './../../utils/api';
import Video from 'react-native-video';
import Animated, { ZoomIn, FadeOut, FadeIn, SlideInDown } from 'react-native-reanimated';
import { Download } from './../../utils/download';
import Pdf from 'react-native-pdf';

const ShowImg = ({ navigation, route }) => {
  const [appReady, setAppReady] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [isplay, setisplay] = useState(false);
  const [hideControles, sethideControles] = useState(false);
  const [paused, setPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const isFocus = useIsFocused();
  const [DownloadProgress, setDownloadProgress] = useState(false);

  useEffect(() => {
    if (isFocus) {
      setTimeout(() => {
        sethideControles(true);
        setAppReady(true);
      }, 1000);
    }
    return;
  }, [isFocus]);

  const videoRef = useRef();
  const renderStoryItem = () => {
    let file = route?.params?.file;
    let fileType = route?.params?.fileType;
    let baseUrlIncluded = route?.params?.baseUrlIncluded ? true : false;


    if (fileType == 'photo') {
      return (
        <Image
          onLoadEnd={() => {
            setisLoading(false);
          }}
          onLoadStart={() => setisLoading(true)}
          source={{ uri: baseUrlIncluded ? file : `${IMAGEURL}/${file}` }}
          style={style.storyImage}
        />
      );
    } else if (fileType == 'video') {
      return (
        <View>
          {/*<Video*/}
          {/* source={{uri: `${IMAGEURL}/${file}`}}*/}
          {/*  ref={videoRef}*/}
          {/*  paused={paused}*/}
          {/*  onBuffer={({isBuffering}) => {*/}
          {/*    setisLoading(isBuffering == 1);*/}
          {/*  }}*/}
          {/*  // onError={err => console.log(err)}*/}
          {/*  onLoad={() => {*/}
          {/*    _hideControles(),*/}
          {/*      videoRef?.current?.seek(3);*/}
          {/*      setisplay(true), setisLoading(false);*/}
          {/*  }}*/}

          {/*  onLoadStart={() => {*/}
          {/*    setisLoading(true);*/}
          {/*  }}*/}
          {/*  onEnd={() => {*/}
          {/*    sethideControles(false);*/}
          {/*    setisplay(false);*/}
          {/*  }}*/}
          {/*  resizeMode={'cover'}*/}
          {/*  style={{height: '100%', width: wp(100)}}*/}

          {/*/>*/}
          <Video
            // poster={item.thumbnailUrl}
            // posterResizeMode={this.state.resizeMode}
            // onLoadStart={this.onLoadStart}
            // onProgress={this.onProgress}
            // onVideoLoadStart={this.onVideoLoadStart}
            // onVideoEnd={this.onVideoEnd}
            // onEnd={this.onEnd}
            // onBuffer={this.onBuffer}
            bufferConfig={{
              minBufferMs: 5000,
              maxBufferMs: 20000,
              bufferForPlaybackMs: 2500,
              bufferForPlaybackAfterRebufferMs: 5000,
            }}
            // onError={this.onVideoError}
            onAudioBecomingNoisy={() => setPaused(true)}
            onAudioFocusChanged={event => {
              setPaused(!event.hasAudioFocus);
            }}
            // onAudioFocusChanged={this.onAudioFocusChanged}
            repeat={false}
            source={{ uri: `${IMAGEURL}/${file}` }}
            ref={videoRef}
            paused={paused}
            onBuffer={({ isBuffering }) => {
              setisLoading(isBuffering == 1);
            }}
            // onError={err => console.log(err)}
            onLoad={() => {
              _hideControles(),
                // videoRef?.current?.seek(3);
                setPaused(false);
              setisplay(true), setisLoading(false);
            }}
            onLoadStart={() => {
              setisLoading(true);
            }}
            onEnd={() => {
              // videoRef?.current?.seek(0);
              sethideControles(false);
              setisplay(false);
            }}
            resizeMode={'contain'}
            style={{ height: '100%', width: wp(100) }}
          />
          {!hideControles && !isLoading && _showIcon()}
        </View>
      );
    } else if (fileType == 'pdf') {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginTop: 25,
          }}>
          <Pdf
            // ref={(pdf) => { this.pdf = pdf; }}
            // trustAllCerts={false}
            source={{
              uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf',
            }}
            style={{
              flex: 1,
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
            }}
          />
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

  const Action = () => {
    let file = route?.params?.file;
    let fileType = route?.params?.fileType;
    let url = `${IMAGEURL}/${file}`;
    let ext = url.split('.').pop();
    setDownloadProgress(true);
    Download(url, ext, setDownloadProgress);
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
  let file = route?.params?.file;
  let fileType = route?.params?.fileType;
  let hideDownloadButton = route?.params?.hideDownloadButton ? true : false;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.black,
        paddingTop: hideDownloadButton ? StatusBar.currentHeight : 0
      }}>
      <StatusBar barStyle={'light-content'} backgroundColor={color.black} />
      <Loader
        isLoading={DownloadProgress}
        type="progress"
        pageCircleText="Downloading..."
      />

      {appReady && route?.params?.file && (
        <Animated.View entering={SlideInDown} exiting={SlideInDown}>

          <View
            style={style.header}>
            <View
              style={{
                width: wp(100),
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                flexDirection: 'row',
                paddingVertical: 15,
                backgroundColor: 'rgba(52, 52, 52, 0.4)',
              }}>
              <TouchableOpacity
                onPress={() => {
                  videoRef?.current?.setNativeProps({ paused: true });
                  videoRef?.current?.seek(0);
                  // setIsPlaying(true)
                  setisplay(false);
                  setPaused(true);
                  sethideControles(false);
                  navigation.goBack();
                }}>
                <Image
                  source={IMAGE.close}
                  style={{
                    height: 30,
                    width: 30,
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
              {!hideDownloadButton && (
                <TouchableOpacity onPress={() => Action()}>
                  <Image
                    source={IMAGE.download}
                    style={{
                      height: 30,
                      width: 30,
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
          {fileType != 'pdf' ? (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => _hideControles()}
              style={style.storyView}>
              {renderStoryItem()}
              {isLoading && (
                <View style={{ position: 'absolute', top: hp(40), left: wp(40) }}>
                  <Loader isLoading={isLoading} />
                </View>
              )}
            </TouchableOpacity>
          ) : (
            <View
              style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginTop: 25,
              }}>
              <Pdf
                trustAllCerts={false}
                source={{
                  uri: `${IMAGEURL}/${file}`,
                  cache: true,
                }}
                style={{
                  width: Dimensions.get('window').width,
                  height: Dimensions.get('window').height,
                }}
              />
            </View>
          )}
        </Animated.View>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: color.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    zIndex: 999,
    width: wp(100),
    top: Platform.OS === 'ios' ? hp(6) : 0,
  },
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
    width: wp(80),
    height: hp(6),
    backgroundColor: 'rgba(122, 122, 122, 0.79)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(2),
  },
  storyText: {
    fontSize: 15,
    fontFamily: fontFamily.Bold,
    color: color.white,
  },
  storyText2: {
    marginTop: -hp(1),
    fontSize: 12,
    fontFamily: fontFamily.Regular,
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
    height: hp(100),
    width: wp(100),
    resizeMode: 'contain',
  },
});
export default ShowImg;
