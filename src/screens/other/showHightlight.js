import React, {useState, memo, useEffect, useRef, useMemo} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  PanResponder,
  ImageBackground,
} from 'react-native';
import {color, fontFamily, statusBarHeight} from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Button, Loader, pickImage} from './../../component/';
import IMAGE from '../../constant/image';
import {useIsFocused} from '@react-navigation/native';
import {APIRequest, ApiUrl, IMAGEURL} from './../../utils/api';
import Video from 'react-native-video';
import Animated, {ZoomIn, FadeOut, FadeIn} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-toast-message';
import {StoryContainer, ProgressBar} from 'react-native-stories-view';
import {BottomSheetModal, BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {Overlay} from 'react-native-elements';
import {User} from '../../utils/user';

const Progess = memo(({storyList, activeIndex, setactiveIndex, navigation}) => (
  <ProgressBar
    images={storyList}
    progressIndex={activeIndex}
    onChange={() => {
      if (storyList.length - 1 == activeIndex) {
        navigation.goBack();
      } else {
        setactiveIndex(activeIndex + 1);
      }
    }}
    enableProgress={true}
    duration={150}
    barStyle={{
      barActiveColor: 'rgb(255, 0, 0,0,0)',
      barInActiveColor: 'rgb(255, 0, 0,0,0)',
      barWidth: 100,
      barHeight: 4,
    }}
  />
));

const RenderBottomSheet = memo(({bottomSheetRef, snapPoints, file}) => (
  <BottomSheetModal
    ref={bottomSheetRef}
    index={1}
    snapPoints={snapPoints}
    onChange={v => {
      console.log(v);
    }}
    backdropComponent={BottomSheetBackdrop}>
    <View style={{alignSelf: 'center', paddingVertical: hp(1)}}>
      <Text style={style.heading}>Add Story</Text>
      <Text style={style.subHeading}>Post Photo Video To Your Story</Text>
    </View>
    <TouchableOpacity
      onPress={() =>
        pickImage(
          'camera',
          res => {
            file(res);
          },
          'photo',
        )
      }
      style={style.cardBlock}>
      <Image source={IMAGE.camera} style={style.icon1} />
      <Text style={style.cardText}>Take Photo</Text>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() =>
        pickImage(
          'image',
          res => {
            file(res);
          },
          'photo',
        )
      }
      style={style.cardBlock}>
      <Image source={IMAGE.camera} style={style.icon1} />
      <Text style={style.cardText}>Select Photo</Text>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() =>
        pickImage(
          'camera',
          res => {
            file(res);
          },
          'video',
        )
      }
      style={style.cardBlock}>
      <Image source={IMAGE.video} style={style.icon1} />
      <Text style={style.cardText}>Take Video</Text>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() =>
        pickImage(
          'image',
          res => {
            file(res);
          },
          'video',
        )
      }
      style={style.cardBlock}>
      <Image source={IMAGE.video_add} style={style.icon1} />
      <Text style={style.cardText}>Select Video</Text>
    </TouchableOpacity>
    <View>
      <Button
        onPress={() => bottomSheetRef?.current?.close()}
        btnStyle={{
          marginTop: hp(2),
          alignSelf: 'center',
          backgroundColor: color.red,
          width: wp(90),
          height: hp(6),
        }}
        label={'Cancel'}
      />
    </View>
  </BottomSheetModal>
));

const showHightlight = ({navigation, route}) => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => [1, hp(48)], []);
  const reportBottomSheetRef = useRef(null);
  const reportPoints = useMemo(() => [1, hp(55)], []);
  const [appReady, setAppReady] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [isplay, setisplay] = useState(false);
  const [hideControles, sethideControles] = useState(false);
  const [storyList, setStoryList] = useState([]);
  const [activeIndex, setactiveIndex] = useState(0);
  const isFocus = useIsFocused();
  const [hightLight, sethighLight] = useState(route?.params?.highLightId);
  const [visible, setvisible] = useState(false);
  const userdata = new User().getuserdata();

  useEffect(() => {
    getHighlight();
    if (isFocus) {
      // alert("my id is",userdata.id)

      if (route?.params?.list?.length > 0) {
        // setStoryList(route?.params?.list);
      }

      setTimeout(() => {
        sethideControles(true);
        setAppReady(true);
      }, 1000);
    }
    return;
  }, [isFocus]);

  const getHighlight = () => {
    // this.setState({isLoading: true});
    let config = {
      url: ApiUrl.highlightIndex,
      method: 'post',
      body: {
        highlight_id: hightLight,
      },
    };

    APIRequest(
      config,
      res => {
        setStoryList(res.highlightStories);
      },
      err => {
        // this.setState({isLoading: false});
        console.log(err?.response?.data);
      },
    );
  };

  const _deleteStory = () => {
    let file = storyList[activeIndex];

    setisLoading(true);
    let config = {
      url: ApiUrl.deletehighlight,
      method: 'post',
      body: {
        highlight_id: hightLight,
      },
    };
    APIRequest(
      config,
      res => {
        setisLoading(false);
        navigation.goBack();

        if (res?.alert?.status) {
          Toast.show({
            type: 'success',
            text1: res?.alert?.message
          })
        }
        console.log(res);
      },
      err => {
        setisLoading(false);
        console.log(err?.response);
      },
    );
  };

  const videoRef = useRef();
  const renderStoryItem = () => {
    let file = storyList[activeIndex];

    if (file?.image) {
      return (
        <ImageBackground
          onLoadEnd={() => {
            setisLoading(false);
          }}
          onLoadStart={() => setisLoading(true)}
          source={{uri: `${IMAGEURL}/${file.image}`}}
          style={style.storyImage}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity
              activeOpacity={1}
              style={{
                height: hp(100),
                width: wp(50),
                backgroundColor: 'rgb(255, 0, 0,0,0)',
              }}
              onPress={() => {
                setactiveIndex(activeIndex - 1);
              }}></TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              style={{
                height: hp(100),
                width: wp(50),
                backgroundColor: 'rgb(255, 0, 0,0,0)',
              }}
              onPress={() => {
                setactiveIndex(activeIndex + 1);
              }}></TouchableOpacity>
          </View>
        </ImageBackground>
      );
    } else if (file?.video) {
      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            // setactiveIndex(activeIndex+1)
          }}>
          <Video
            source={{uri: `${IMAGEURL}/${file.video}`}}
            ref={videoRef}
            onBuffer={({isBuffering}) => {
              setisLoading(isBuffering == 1);
            }}
            onError={err => console.log(err)}
            onLoad={() => {
              _hideControles(), setisplay(true), setisLoading(false);
            }}
            onLoadStart={() => {
              setisLoading(true);
            }}
            onEnd={() => {
              sethideControles(false);
              setisplay(false);
            }}
            resizeMode={'cover'}
            style={{height: '94%', marginTop: hp(6), width: wp(100)}}
          />
          {!hideControles && !isLoading && _showIcon()}
          <TouchableOpacity
            onPress={() => {
              bottomSheetRef?.current?.present();
            }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: color.btnBlue,
              height: 60,
              width: 60,
              borderRadius: 120,
              position: 'absolute',
              bottom: 25,
              right: 20,
            }}>
            <Icon name={'plus'} style={{fontSize: 25, color: '#fff'}} />
          </TouchableOpacity>
        </TouchableOpacity>
      );
    } else {
      navigation.goBack();
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
            videoRef?.current?.setNativeProps({paused: true});
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
            videoRef?.current?.setNativeProps({paused: false});
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

  const getUserDetail = (data, key) => {
    // if (data.length > 0) {
    //   return data[0].user?.[key];
    // }
  };

  return (
    <View style={{flex: 1, backgroundColor: color.black}}>
      {appReady && (
        <Animated.View entering={ZoomIn}>
          <View style={style.header}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{marginRight: wp(1), marginRight: wp(5)}}>
                <Image
                  source={{
                    uri: `${IMAGEURL}/${getUserDetail(
                      route?.params?.list,
                      'avatar',
                    )}`,
                  }}
                  style={{
                    height: 40,
                    borderRadius: 120,
                    overflow: 'hidden',
                    width: 40,
                    resizeMode: 'contain',
                  }}
                />
              </View>
              <View>
                <Text style={style.storyText}>
                  {getUserDetail(route?.params?.list, 'name')}
                </Text>
              </View>
            </View>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                marginTop: statusBarHeight,
                marginRight: hp(5),
                marginTop: hp(5),
              }}>
              {userdata.id == route?.params?.user_id ? (
                <TouchableOpacity
                  onPress={() => {
                    setvisible(true);
                    // _deleteStory();
                  }}>
                  <Image
                    source={IMAGE.trash}
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: 'contain',
                      marginRight: 10,
                    }}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    reportBottomSheetRef?.current?.present();
                  }}>
                  <Image
                    source={IMAGE.report}
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: 'contain',
                      marginRight: 10,
                    }}
                  />
                </TouchableOpacity>
              )}
              {/* <TouchableOpacity
                onPress={() => {
                  setvisible(true);

                  // _deleteStory(); 
                }}>
                <Image
                  source={IMAGE.trash}
                  style={{height: 20, width: 20, resizeMode: 'contain', marginRight: hp(2)}}
                />
              </TouchableOpacity> */}

              <TouchableOpacity
                onPress={() => {
                  videoRef?.current?.setNativeProps({paused: true});
                  navigation.goBack();
                }}>
                <Image
                  source={IMAGE.cancel}
                  style={{ 
                    height: 20,
                    width: 20,
                    resizeMode: 'contain',
                    marginLeft: 10,

                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => _hideControles()}
            style={style.storyView}>
            <Progess
              storyList={storyList}
              activeIndex={activeIndex}
              navigation={navigation}
              setactiveIndex={setactiveIndex}
            />
            {renderStoryItem()}
            {isLoading && (
              <View style={{position: 'absolute', top: hp(40), left: wp(40)}}>
                <Loader isLoading={isLoading} />
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      )}
      <RenderBottomSheet
        file={file => {
          bottomSheetRef?.current?.close(),
            navigation.navigate('PostStory', {file: file});
        }}
        snapPoints={snapPoints}
        bottomSheetRef={bottomSheetRef}
      />
      <BottomSheetModal
        ref={reportBottomSheetRef}
        index={1}
        snapPoints={reportPoints}
        onChange={v => {
          console.log(v);
        }}
        backdropComponent={BottomSheetBackdrop}>
        <View style={{alignSelf: 'center', paddingVertical: hp(1)}}>
          <Text style={style.roportHeading}>Report</Text>
          <Text style={style.subHeading}>Why Are You Reporting This Post?</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            [
              settext("It's spam"),
              _reportStory(),
              reportBottomSheetRef?.current?.close(),
              navigation.goBack(),
            ];
          }}
          style={style.cardBlock}>
          <Text style={style.cardText}>It's spam</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            [
              settext('Nudity or sexual activity'),
              _reportStory(),
              reportBottomSheetRef?.current?.close(),
              navigation.goBack(),
            ];
          }}
          style={style.cardBlock}>
          <Text style={style.cardText}>Nudity or sexual activity</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            [
              settext("I just don't like it"),
              _reportStory(),
              reportBottomSheetRef?.current?.close(),
              navigation.goBack(),
            ];
          }}
          style={style.cardBlock}>
          <Text style={style.cardText}>I just don't like it</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            [
              settext('Hate speech or symbols'),
              _reportStory(),
              reportBottomSheetRef?.current?.close(),
              navigation.goBack(),
            ];
          }}
          style={style.cardBlock}>
          <Text style={style.cardText}>Hate speech or symbols</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            [
              settext('Bullying or harassment'),
              _reportStory(),
              reportBottomSheetRef?.current?.close(),
              navigation.goBack(),
            ];
          }}
          style={style.cardBlock}>
          <Text style={style.cardText}>Bullying or harassment</Text>
        </TouchableOpacity>
        <View>
          <Button
            onPress={() => reportBottomSheetRef?.current?.close()}
            btnStyle={{
              marginTop: hp(2),
              alignSelf: 'center',
              backgroundColor: color.red,
              width: wp(90),
              height: hp(6),
            }}
            label={'Cancel'}
          />
        </View>
      </BottomSheetModal>
      <Overlay
        visible={visible}
        transparent={true}
        width="auto"
        height=" "
        overlayStyle={{
          width: 300,

          alignSelf: 'center',
          borderRadius: 10,
          // backgroundColor:"#3C444C"
          backgroundColor: '#DEDEDE',
        }}>
        <View>
          <Text
            style={{
              fontFamily: fontFamily.Medium,
              fontSize: 21,
              color: color.black,
              textAlign: 'center',
            }}>
            Delete Warning
          </Text>
          <Text
            style={{
              fontFamily: fontFamily.Light,
              fontSize: 15,
              color: color.black,
              textAlign: 'center',
            }}>
            Are you sure want to delete this highlight?
          </Text>
          <View
            style={{
              height: 1,
              with: '100%',
              backgroundColor: color.iconGray,
              marginHorizontal: '-3.4%',
              marginVertical: '5%',
            }}></View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity
              onPress={() => setvisible(false)}
              style={{
                height: 40,
                width: '50%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: fontFamily.Medium,
                  fontSize: 13,
                  color: color.black,
                }}>
                No
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => [_deleteStory(), setvisible(false)]}
              style={{
                height: 40,
                width: '50%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: fontFamily.Medium,
                  fontSize: 13,
                  color: color.black,
                }}>
                Yes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Overlay>
    </View>
  );
};

const style = StyleSheet.create({
  icon1: {
    resizeMode: 'contain',
    height: 22,
    width: 22,
  },
  heading: {
    fontSize: 17,
    lineHeight: hp(2.5),
    fontFamily: fontFamily.Bold,
    color: color.btnBlue,
    textAlign: 'center',
  },
  subHeading: {
    fontSize: 10,
    fontFamily: fontFamily.Regular,
    color: color.textGray2,
    textAlign: 'center',
  },
  roportHeading: {
    fontSize: 17,
    lineHeight: hp(2.5),
    fontFamily: fontFamily.Bold,
    color: color.btnBlue,
    textAlign: 'center',
  },
  cardText: {
    paddingLeft: wp(5),
    fontSize: Platform.OS === 'ios' ? 15 : 13,
    fontFamily: fontFamily.Regular,
    color: color.black,
  },
  cardBlock: {
    marginLeft: wp(10),
    paddingRight: wp(7),
    paddingVertical: hp(2),
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: color.borderGray,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 999,
    width: '100%',
    paddingBottom: hp(1),
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
export default showHightlight;
