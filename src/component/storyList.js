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
  Alert,
  Platform,

} from 'react-native';
import { color, fontFamily, fontSize, IMAGE } from '../constant';
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
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import BottomSheetWebview from './BottomSheetWebview';
import Stories from './Story';
import BottomSheetUploadFile from './BottomSheetUploadFile';
import BottomSheetMarketplace from './BottomSheetMarketplace';

const StoryList = ({ navigation, headerFontColor, storyBackGroundColor }) => {
  const [text, settext] = useState([]);
  const [reportId, setReportId] = useState(0);
  const [isShowBottomSheet, setisShowBottomSheet] = useState(false);
  const [isShowBottomSheet1, setisShowBottomSheet1] = useState(false);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => [1, hp(58)], []);
  const [stories, setStories] = useState([]);
  const [morestory, setmorestory] = useState(false);
  let userdata = new User().getuserdata();
  const reportPoints = useMemo(() => [1, hp(55)], []);


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

  const _deleteStory = (storyId) => {

    Alert.alert(
      'Alert',
      'Are you sure you want to delete?',
      [
        {
          text: 'NO',
          onPress: () => null,
          style: 'Cancel',
        },
        {
          text: 'YES',
          onPress: () => [doDeleteAction(storyId)],
        },
      ],
    );

  };

  const doDeleteAction = (storyId) => {

    let config = {
      url: ApiUrl.deletestory,
      method: 'post',
      body: {
        story_id: storyId,
      },
    };
    APIRequest(
      config,
      res => {
        if (res?.alert?.status) {
          Toast.show({
            type: 'success',
            text1: res?.alert?.message
          })
          fetchStorys();
        }
      },
      err => {

      },
    );
  }

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
        if (res.status) {
          if (res.stories?.length) {
            setStories(res.stories);
            setmorestory(true);
          } else {
            setmorestory(false);
          }
        }
      },
      err => {
        console.log(err);
      },
    );
  };

  const _reportStory = () => {
    let config = {
      url: ApiUrl.reportstory,
      method: 'post',
      body: {
        reported_to: reportId,
        text: text,
      },
    };
    APIRequest(
      config,
      res => {
        console.log("-------------------------------------------RESPONSE", res);
        setisShowBottomSheet(false);
        if (res?.success) {
          Toast.show({
            type: 'success',
            text1: res?.message
          });
          fetchStorys();
        }
      },
      err => {
        setisShowBottomSheet(false);
        console.log(err?.response);
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
  const defaultGradientColor = ['#808080', '#808080'];


  // Post Story
  const PostStory=(file)=>{
    setisShowBottomSheet1(false)
    navigation.navigate('PostStory', { file: file });
  }

  return (
    <View
      style={{
        height: hp(13),
        // borderBottomWidth: 0.5,
        // borderColor: color.borderGray,


      }}>
      <View style={{
        flex: 1,
        flexDirection: 'row',
        backgroundColor: storyBackGroundColor,
        marginLeft: wp(1.5),

      }}>

        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            // bottomSheetRef?.current?.present();
            setisShowBottomSheet1(true)
          }}
          style={style.imgview}>

          <View>
            <LinearGradient colors={defaultGradientColor} style={style.storyWrapper}>
              {userdata.avatar != 'lybertineApp/default/default.png' ? (
                <Image
                  source={{ uri: `${IMAGEURL}/${userdata.avatar}` }}
                  style={style.imgBox}
                />
              ) : (
                <Image source={IMAGE?.defaultAvatar} style={style.imgBox} />
              )}
            </LinearGradient>
            <View style={style.blueDot}>
              <Icon
                name={'plus'}
                style={{ fontSize: 7, color: '#fff' }}
              />
            </View>

          </View>

          <Text style={!headerFontColor ? style.storyText : style.storyTextTheme}>
            Add Story
          </Text>
        </TouchableOpacity>
        {stories.length > 0 ? <Stories
          deleteOnPress={(id) => { _deleteStory(id) }}
          reportOnPress={(id) => { setReportId(id); setisShowBottomSheet(true); }}
          data={stories} titleStyle={
            !headerFontColor ? style.storyText : style.storyTextTheme
          } /> : null}

      </View>
      {/* {stories?.length > 0 && (
        // <FlatList
        //   data={stories}
        //   keyExtractor={item => String(item.id)}
        //   showsHorizontalScrollIndicator={false}
        //   contentContainerStyle={{ alignItems: 'center', paddingLeft: wp(7) }}
        //   horizontal={true}
        //   renderItem={({ item, index }) => {
        //     if (index == 0) {
        //       return (
        //         <>
        //           <TouchableOpacity
        //             activeOpacity={0.5}
        //             onPress={() => {
        //               item?.user_id == userdata?.id
        //                 ? navigation.navigate('ShowStory', {
        //                   list: item.view_stories,
        //                 })
        //                 : bottomSheetRef?.current?.present();
        //             }}
        //             style={style.imgview}>

        //             <View>
        //               {checkuseradd() != -1 ? (
        //                 <LinearGradient colors={gradientColor} style={style.storyWrapper}>
        //                   {userdata.avatar != 'lybertineApp/default/default.png' ? (
        //                     <Image
        //                       source={{ uri: `${IMAGEURL}/${userdata.avatar}` }}
        //                       style={style.imgBox}
        //                     />
        //                   ) : (
        //                     <Image source={IMAGE?.defaultAvatar} style={style.imgBox} />
        //                   )}
        //                 </LinearGradient>
        //               ) : (
        //                 <LinearGradient colors={defaultGradientColor} style={style.storyWrapper}>
        //                   {userdata.avatar != 'lybertineApp/default/default.png' ? (
        //                     <Image
        //                       source={{ uri: `${IMAGEURL}/${userdata.avatar}` }}
        //                       style={style.imgBox}
        //                     />
        //                   ) : (
        //                     <Image source={IMAGE?.defaultAvatar} style={style.imgBox} />
        //                   )}
        //                 </LinearGradient>

        //               )}

        //               {checkuseradd() == -1 && (
        //                 <View style={style.blueDot}>
        //                   <Icon
        //                     name={'plus'}
        //                     style={{ fontSize: 7, color: '#fff' }}
        //                   />
        //                 </View>
        //               )}
        //             </View>

        //             <Text style={!headerFontColor ? style.storyText : style.storyTextTheme}>
        //               {checkuseradd() != -1 ? 'Your Story' : 'Add Story'}
        //             </Text>
        //           </TouchableOpacity>
        //           {morestory && item?.user_id != userdata?.id && (
        //             <TouchableOpacity
        //               onPress={() => {
        //                 navigation.navigate('ShowStory', {
        //                   list: item.view_stories,
        //                 });
        //               }}
        //               style={style.imgview}>
        //               <LinearGradient colors={gradientColor} style={style.storyWrapper}>
        //                 <Image
        //                   source={{
        //                     uri: `${IMAGEURL}/${getUserDetail(
        //                       item.view_stories,
        //                       'avatar',
        //                     )}`,
        //                   }}
        //                   style={[
        //                     style.imgBox
        //                   ]}
        //                 />
        //               </LinearGradient>

        //               <Text style={!headerFontColor ? style.storyText : style.storyTextTheme} numberOfLines={1}>
        //                 {(getUserDetail(item.view_stories, 'name').length > 7) ?
        //                   (((getUserDetail(item.view_stories, 'name')).substring(0, 7)) + '...') : getUserDetail(item.view_stories, 'name')}
        //               </Text>
        //             </TouchableOpacity>
        //           )}
        //         </>
        //       );
        //     } else {
        //       return (
        //         <TouchableOpacity
        //           onPress={() => {
        //             navigation.navigate('ShowStory', { list: item.view_stories });
        //           }}
        //           style={style.imgview}>
        //           <LinearGradient colors={gradientColor} style={style.storyWrapper}>
        //             <Image
        //               source={{
        //                 uri: `${IMAGEURL}/${getUserDetail(
        //                   item.view_stories,
        //                   'avatar',
        //                 )}`,
        //               }}
        //               style={[
        //                 style.imgBox,
        //                 // { borderWidth: 2, borderColor: color.btnBlue },
        //               ]}
        //             />
        //           </LinearGradient>
        //           <Text style={!headerFontColor ? style.storyText : style.storyTextTheme}>
        //             {(getUserDetail(item.view_stories, 'name').length > 7) ?
        //               (((getUserDetail(item.view_stories, 'name')).substring(0, 7)) + '...') : getUserDetail(item.view_stories, 'name')}
        //           </Text>
        //         </TouchableOpacity>
        //       );
        //     }
        //   }}
        // />
      )} */}
      <BottomSheetUploadFile
        cancelBtn={{
          color: color.lightGray,
          title: 'Cancel',
          textColor: color.btnBlue,
        }}
        isShowBottomSheet={isShowBottomSheet1}
        setisShowBottomSheet={setisShowBottomSheet1}>

        <View>
          <View style={{ alignContent: 'center', paddingVertical: hp(1), marginBottom: 10 }}>
            <Text style={style.roportHeading}>Add Story</Text>
            <Text style={style.subHeading}>Post Photo Video To Your Story</Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={() =>
                pickImage(
                  'camera',
                  res => {
                    // file(res);
                    PostStory(res)
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
                    PostStory(res)
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
                    PostStory(res)
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
                    PostStory(res)
                  },
                  'video',
                )
              }
              style={style.cardBlock}>
              <Image source={IMAGE.video_add} style={style.icon} />
              <Text style={style.cardText}>Select Video</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setisShowBottomSheet1(false)
                navigation.navigate('addTextStory')
              }}
              style={style.cardBlock}>
              <Image source={IMAGE.link} style={style.icon} />
              <Text style={style.cardText}>Add Hyperlink</Text>
            </TouchableOpacity>
          </View>

        </View>

      </BottomSheetUploadFile>


      <BottomSheetWebview
        cancelBtn={{
          color: color.lightGray,
          title: 'Cancel',
          textColor: color.btnBlue,
        }}
        isShowBottomSheet={isShowBottomSheet}
        setisShowBottomSheet={setisShowBottomSheet}>

        <View>
          <View style={{ alignContent: 'center', paddingVertical: hp(1), marginBottom: 10 }}>
            <Text style={style.roportHeading}>Report</Text>
            <Text style={style.subHeading}>Why are you reporting this story?</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              [
                settext("It's spam"),
                _reportStory()
              ];
            }}
            style={style.cardBlock}>
            <Text style={style.cardText}>It's spam</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              [
                settext('Nudity or sexual activity'),
                _reportStory()
              ];
            }}
            style={style.cardBlock}>
            <Text style={style.cardText}>Nudity or sexual activity</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              [
                settext("I just don't like it"),
                _reportStory()
              ];
            }}
            style={style.cardBlock}>
            <Text style={style.cardText}>I just don't like it</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              [
                settext('Hate speech or symbols'),
                _reportStory()

              ];
            }}
            style={style.cardBlock}>
            <Text style={style.cardText}>Hate speech or symbols</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              [
                settext('Bullying or harassment'),
                _reportStory()

              ];
            }}
            style={{
              paddingRight: wp(7),
              paddingTop: hp(2),
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <Text style={style.cardText}>Bullying or harassment</Text>
          </TouchableOpacity>
        </View>

      </BottomSheetWebview>

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
    // marginLeft: wp(10),
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
    marginRight: wp(1),
    marginLeft: wp(4),
    paddingVertical: hp(1),
    overflow: 'hidden',
    borderColor: color.black,
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
    marginTop: wp(1),
    fontFamily: fontFamily.Regular,
    color: color.btnBlue,
    width: 70,
  },
  storyTextTheme: {
    textAlign: 'center',
    fontSize: 13,
    marginTop: wp(1),
    fontFamily: fontFamily.Regular,
    color: color.white,
    width: 70,
  },
  roportHeading: {
    fontSize: fontSize.size15,
    fontFamily: fontFamily.Bold,
    textAlign: 'center',
    marginBottom: 10,
  }

});
export default StoryList;
