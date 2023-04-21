/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import {
  TouchableNativeFeedback,
  Image,
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { color, fontFamily, IMAGE } from '../constant';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Circle, Svg, Line } from 'react-native-svg';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Button, pickImage } from '.';
import { APIRequest, ApiUrl, IMAGEURL } from '../utils/api';
import { User } from '../utils/user';
import { useIsFocused } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const StoryList = ({ navigation, headerFontColor }) => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => [1, hp(58)], []);
  const [stories, setStories] = useState([0]);
  const [morestory, setmorestory] = useState(false);
  let userdata = new User().getuserdata();

  const RenderBottomSheet = memo(({ bottomSheetRef, snapPoints, file }) => (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={v => {
        console.log(v);
      }}
      backdropComponent={BottomSheetBackdrop}>
      <View style={{ alignSelf: 'center', paddingVertical: hp(1) }}>
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
        <Image source={IMAGE.camera} style={style.icon} />
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
        <Image source={IMAGE.camera} style={style.icon} />
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
        <Image source={IMAGE.video} style={style.icon} />
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
        <Image source={IMAGE.video_add} style={style.icon} />
        <Text style={style.cardText}>Select Video</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('addTextStory')}
        style={style.cardBlock}>
        <Image source={IMAGE.link} style={style.icon} />
        <Text style={style.cardText}>Add Hyperlink</Text>
      </TouchableOpacity>
      <View>
        <Button
          onPress={() => bottomSheetRef?.current?.close()}
          btnStyle={{
            marginVertical: hp(1),
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

  const isFocus = useIsFocused();
  useEffect(() => {
    if (isFocus) {
      fetchStorys();
    }
  }, [isFocus]);

  const fetchStorys = () => {
    let config = {
      url: ApiUrl.stories,
      method: 'post',
      body: {
        user_id: userdata.id,
      },
    };
    APIRequest(
      config,
      res => {
        console.log('adadadasdsad', res);
        if (res.status) {
          if (res.stories?.length) {
            setStories(res.stories);
            setmorestory(true);
          } else {
            setmorestory(false);

            setStories([1]);
          }
        }
      },
      err => {
        console.log(err);
      },
    );
  };

  const getUserDetail = (data, key) => {
    if (data) {
      if (data.length > 0) {
        return data[0].user?.[key];
      }
    }
  };
  const checkuseradd = () => {
    let index = stories.findIndex(v => v.user_id == userdata?.id);
    return index;
  };
  const gradientColor = ['#FF4252', '#FF7500', '#FFB700', "#00BF15", "#006DDF", "#C02CDD"];
  return (
    <View
      style={{
        // height: hp(10),
        // borderBottomWidth: 0.5,
        // borderColor: color.borderGray,
      }}>
      {stories?.length > 0 && (
        <FlatList
          data={stories}
          keyExtractor={item => String(item.id)}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: 'center', paddingLeft: wp(7) }}
          horizontal={true}
          renderItem={({ item, index }) => {
            if (index == 0) {
              return (
                <>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      item?.user_id == userdata?.id
                        ? navigation.navigate('ShowStory', {
                          list: item.view_stories,
                        })
                        : bottomSheetRef?.current?.present();
                    }}
                    style={style.imgview}>

                    <View>
                      {checkuseradd() != -1 ? (
                        <LinearGradient colors={gradientColor} style={style.storyWrapper}>
                          <Image
                            source={{ uri: `${IMAGEURL}/${userdata.avatar}` }}
                            style={[
                              style.imgBox
                            ]}
                          />
                        </LinearGradient>
                      ) : (
                        <View style={style.storyWrapper}>
                          <Image
                            source={{ uri: `${IMAGEURL}/${userdata.avatar}` }}
                            style={[
                              style.imgBox
                            ]}
                          />
                        </View>

                      )}

                      {checkuseradd() == -1 && (
                        <View style={style.blueDot}>
                          <Icon
                            name={'plus'}
                            style={{ fontSize: 7, color: '#fff' }}
                          />
                        </View>
                      )}
                    </View>

                    <Text style={!headerFontColor ? style.storyText : style.storyTextTheme}>
                      {checkuseradd() != -1 ? 'Your Story' : 'Add Story'}
                    </Text>
                  </TouchableOpacity>
                  {morestory && item?.user_id != userdata?.id && (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('ShowStory', {
                          list: item.view_stories,
                        });
                      }}
                      style={style.imgview}>
                      <LinearGradient colors={gradientColor} style={style.storyWrapper}>
                        <Image
                          source={{
                            uri: `${IMAGEURL}/${getUserDetail(
                              item.view_stories,
                              'avatar',
                            )}`,
                          }}
                          style={[
                            style.imgBox
                          ]}
                        />
                      </LinearGradient>

                      <Text style={!headerFontColor ? style.storyText : style.storyTextTheme} numberOfLines={1}>
                        {(getUserDetail(item.view_stories, 'name').length > 7) ?
                          (((getUserDetail(item.view_stories, 'name')).substring(0, 7)) + '...') : getUserDetail(item.view_stories, 'name')}
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              );
            } else {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('ShowStory', { list: item.view_stories });
                  }}
                  style={style.imgview}>
                  <LinearGradient colors={gradientColor} style={style.storyWrapper}>
                    <Image
                      source={{
                        uri: `${IMAGEURL}/${getUserDetail(
                          item.view_stories,
                          'avatar',
                        )}`,
                      }}
                      style={[
                        style.imgBox,
                        // { borderWidth: 2, borderColor: color.btnBlue },
                      ]}
                    />
                  </LinearGradient>
                  <Text style={!headerFontColor ? style.storyText : style.storyTextTheme}>
                    {(getUserDetail(item.view_stories, 'name').length > 7) ?
                      (((getUserDetail(item.view_stories, 'name')).substring(0, 7)) + '...') : getUserDetail(item.view_stories, 'name')}
                  </Text>
                </TouchableOpacity>
              );
            }
          }}
        />
      )}
      <RenderBottomSheet
        file={file => {
          bottomSheetRef?.current?.close(),
            navigation.navigate('PostStory', { file: file });
        }}
        snapPoints={snapPoints}
        bottomSheetRef={bottomSheetRef}
      />
    </View>
  );
};

const style = StyleSheet.create({
  icon: {
    resizeMode: 'contain',
    height: 22,
    width: 22,
    tintColor: color.btnBlue,
  },
  heading: {
    fontSize: 17,
    lineHeight: 20,
    fontFamily: fontFamily.Bold,
    color: color.btnBlue,
    textAlign: 'center',
  },
  subHeading: {
    fontSize: 12,
    fontFamily: fontFamily.Regular,
    color: color.textGray2,
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
  blueDot: {
    borderWidth: 1,
    borderColor: color.white,
    position: 'absolute',
    zIndex: 99,
    right: 3,
    bottom: 3,
    height: 14,
    width: 14,
    borderRadius: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.btnBlue,
  },
  dottedBorder: {
    borderRadius: 120,
    borderWidth: 3,
    borderColor: 'red',
    borderStyle: 'dashed',
  },
  imgview: {
    alignItems: 'center',
    marginRight: wp(3),
    paddingVertical: hp(1),
    overflow: 'hidden',
    borderColor: color.black,
    marginLeft: wp(-2),
  },
  storyWrapper:
  {
    height: 55,
    width: 55,
    borderRadius: 55,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",

  },
  imgBox: {
    height: 50,
    width: 50,
    borderRadius: 120,
    resizeMode: 'cover',
  },
  storyText: {
    textAlign: 'center',
    fontSize: 13,
    marginTop: 10,
    fontFamily: fontFamily.Regular,
    color: color.btnBlue,
    width: 70,
  },
  storyTextTheme: {
    textAlign: 'center',
    fontSize: 13,
    marginTop: 10,
    fontFamily: fontFamily.Regular,
    color: color.white,
    width: 70,
  },
});
export default StoryList;
