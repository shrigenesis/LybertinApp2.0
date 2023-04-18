import React, {
  useState,
  useEffect,
  memo,
  useRef,
  useMemo,
  useContext,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Share,
  Platform,
} from 'react-native';
import { IMAGE, color, fontFamily, fontSize } from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RippleTouchable, Header, Button } from '../../component/';
import Loader from '../../component/loader';
import { useIsFocused } from '@react-navigation/native';
import { APIRequest, ApiUrl, IMAGEURL, Toast } from './../../utils/api';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { User } from '../../utils/user';
import { LoginContext } from './../../context/LoginContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native';
import { Card } from 'react-native-elements';
import SvgUri from 'react-native-svg-uri';

const RenderBottomSheet = memo(({ bottomSheetRef, snapPoints }) => (
  <BottomSheet
    ref={bottomSheetRef}
    snapPoints={snapPoints}
    onChange={v => {
      console.log(v);
    }}
    backdropComponent={BottomSheetBackdrop}>
    <View style={{ alignSelf: 'center', paddingVertical: hp(1) }}>
      <Text style={style.heading}>Add Story</Text>
      <Text style={style.subHeading}>Choose cover image</Text>
    </View>
    <View style={style.cardBlock2}>
      <Image
        source={IMAGE.camera}
        style={[style.icon, { tintColor: color.btnBlue }]}
      />
      <Text style={style.cardText}>Take Photo</Text>
    </View>
    <View style={style.cardBlock2}>
      <Image
        source={IMAGE.camera}
        style={[style.icon, { tintColor: color.btnBlue }]}
      />
      <Text style={style.cardText}>Select Photo</Text>
    </View>
    <View style={style.cardBlock2}>
      <Image
        source={IMAGE.video}
        style={[style.icon, { tintColor: color.btnBlue }]}
      />
      <Text style={style.cardText}>Take Video</Text>
    </View>
    <View style={style.cardBlock2}>
      <Image
        source={IMAGE.video_add}
        style={[style.icon, { tintColor: color.btnBlue }]}
      />
      <Text style={style.cardText}>Select Video</Text>
    </View>
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
  </BottomSheet>
));

const MyProfile = ({ navigation, route }) => {
  const { setLogin } = useContext(LoginContext);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => [1, hp(48)], []);
  const [appReady, setAppReady] = useState(false);
  const [hightLight, sethighLight] = useState([]);
  const userdata = new User().getuserdata();
  const data = [1, 1, 1, 1, 1, 1];

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'https://play.google.com/store/apps/details?id=com.lybertineapp',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const ShortcutsMenu = {
    label: 'Shortcuts',
    subMenu: [
      { label: 'Edit Profile', navigation: 'EditProfile', icon: IMAGE.edit_profile },
      { label: 'My Bookings', icon: IMAGE.my_booking, navigation: 'ticketsScreen' },
      {
        label: 'My Friends',
        icon: IMAGE.my_friends,
        navigation: 'MyFriends',
      },
      {
        label: 'Wallet',
        icon: IMAGE.wallet_color,
        navigation: 'wallet',
      },
      {
        label: 'Join Marketplace',
        icon: IMAGE.join_marketing,
        navigation: 'marketplace',
      },
      {
        label: 'Blocked User',
        icon: IMAGE.blocked,
        navigation: 'Blocklist',
      },
    ],
  }
  const GeneralMenu = {
    label: 'General',
    subMenu: [
      { label: 'Change Password', navigation: 'ChangePassword', icon: IMAGE.password },
      { label: 'Privacy Policy', icon: IMAGE.help, navigation: 'webPage' },
      { label: 'About', icon: IMAGE.about, navigation: 'aboutUs' },
      { label: 'Invite a Friend', icon: IMAGE.Invitefrined },
      { label: 'Logout', icon: IMAGE.Logout },
    ],
  }

  const menu = [
    userdata?.role_id == 3
      ? {
        label: 'Personal',

        subMenu: [
          { label: 'Profile', navigation: 'EditProfile', icon: IMAGE.profile },
          { label: 'Blocklist', icon: IMAGE.unfriend, navigation: 'Blocklist' },
          {
            label: 'My Friends',
            icon: IMAGE.myFriend,
            navigation: 'MyFriends',
          },
          {
            label: 'My Earnings',
            icon: IMAGE.earning,
            navigation: 'myEarning',
          },
        ],
      }
      : {
        label: 'Personal',

        subMenu: [
          { label: 'Profile', navigation: 'EditProfile', icon: IMAGE.profile },
          { label: 'Change Password', navigation: 'ChangePassword', icon: IMAGE.password },
          { label: 'Blocklist', icon: IMAGE.unfriend, navigation: 'Blocklist' },
          {
            label: 'My Friends',
            icon: IMAGE.myFriend,
            navigation: 'MyFriends',
          },
          {
            label: 'Join Marketplace',
            icon: IMAGE.myFriend,
            navigation: 'marketplace',
          },
          {
            label: 'Wallet',
            icon: IMAGE.myFriend,
            navigation: 'wallet',
          },
        ],
      },
    {
      label: 'General',
      subMenu: [
        { label: 'Privacy Policy', icon: IMAGE.help, navigation: 'webPage' },
        { label: 'About', icon: IMAGE.about, navigation: 'aboutUs' },
        { label: 'Invite a Friend', icon: IMAGE.Invitefrined },
        { label: 'Logout', icon: IMAGE.Logout },
      ],
    },
  ];
  const [isLoading, setisLoading] = useState(false);
  const isFocus = useIsFocused();

  useEffect(() => {
    // alert("",userdata.id)
    if (isFocus) {
      getHighlight();
      setAppReady(true);
    }
  }, [isFocus]);

  const getHighlight = () => {
    // this.setState({isLoading: true});
    let config = {
      url: ApiUrl.highlights,
      method: 'post',
      body: {
        user_id: userdata.id,
      },
    };

    APIRequest(
      config,
      res => {
        console.log('Api response===', res.highlightsGroup);
        sethighLight(res.highlightsGroup);
      },
      err => {
        // this.setState({isLoading: false});
        console.log(err?.response?.data);
      },
    );
  };

  const _renderHighlightes = (item, index) => {
    if (index == 0) {
      return (
        <></>
        // <TouchableOpacity
        //   // onPress={()=>bottomSheetRef?.current?.expand()}
        //   onPress={() => navigation.navigate('highlights')}
        //   style={{
        //     marginRight: wp(4),
        //     justifyContent: 'center',
        //     marginTop: hp(0.5),
        //   }}>
        //   <View
        //     style={[
        //       style.imgview,
        //       { paddingHorizontal: 20, paddingVertical: 20 },
        //     ]}>
        //     <Image
        //       source={IMAGE.plus}
        //       style={{ height: 20, width: 20, resizeMode: 'contain',tintColor: color.btnBlue }}
        //     />
        //   </View>
        //   <Text style={style.highLightsText}>New</Text>
        // </TouchableOpacity>
      );
    } else {
      return (
        <></>
        // <RippleTouchable
        //   onPress={() =>
        //     navigation.navigate('showHightlight', {
        //       highLightId: item?.id,
        //       user_id: userdata.id,
        //     })
        //   }
        //   style={{ marginRight: wp(4) }}>
        //   <View style={style.imgview}>
        //     <Image
        //       source={{ uri: `${IMAGEURL}/${item.cover}` }}
        //       style={style.imgBox}
        //     />
        //   </View>
        //   <Text style={style.highLightsText}>{((item.title).length > 10) ?
        //     (((item.title).substring(0, 7)) + '...') :
        //     item.title}</Text>
        // </RippleTouchable>
      );
    }
  };

  const logout = () => {
    setisLoading(true);
    let config = {
      url: ApiUrl.logout,
      method: 'get',
    };
    APIRequest(
      config,
      res => {
        setisLoading(false);
        if (res.status) {
          new User().clearAllUserData();
          setLogin(false);
        }
        new User().clearAllUserData();
        setLogin(false);
      },
      err => {
        setisLoading(false);
        new User().clearAllUserData();
        setLogin(false);
        console.log(err?.response?.data);
      },
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.white }}>
      <View style={{ flex: 1, backgroundColor: color.background2 }}>
        <Header title={'My Profile'} />
        <StatusBar barStyle={'dark-content'} backgroundColor={color.white} />
        {appReady && (
          <>  
            <ScrollView showsVerticalScrollIndicator={false}>
              <View> 
                <Loader isLoading={isLoading} type={'dots'} />
                {userdata.cover ? (
                  <Image
                    source={{ uri: `${IMAGEURL}/${userdata.cover}` }}
                    style={{ width: wp(100), height: hp(20) }}
                  />
                ) : (
                  <Image
                    source={IMAGE.profile_view}
                    style={{ width: wp(100), height: hp(20) }}
                  />
                )}
                <View style={{ alignSelf: 'center', top: -hp(6) }}>
                  {userdata.avatar ? (
                    <Image
                      source={{ uri: `${IMAGEURL}/${userdata.avatar}` }}
                      style={style.profileImg}
                    />
                  ) : (
                    <Image source={IMAGE.boy} style={style.profileImg} />
                  )}
                </View>
                <View style={{ alignSelf: 'center', top: -hp(5) }}>
                  <Text style={style.name}>{userdata.name}</Text>
                  <Text style={style.desc}>{userdata.about}</Text>
                </View>
                <View style={style.bodySection}>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={index => index}
                    horizontal={true}
                    data={hightLight}
                    contentContainerStyle={{ paddingLeft: wp(7) }}
                    renderItem={({ item, index }) =>
                      _renderHighlightes(item, index)
                    }
                  />
                  <View style={{ 
                    // padding: wp(4), 
                    marginBottom: 30 
                    }}>
                    <Text style={{...style.menuText, marginStart:wp(4)}}>{ShortcutsMenu.label}</Text>
                    <FlatList
                      data={ShortcutsMenu.subMenu}
                      numColumns={2}
                      renderItem={({ item, index }) => (
                        <TouchableOpacity 
                          activeOpacity={0.7}
                          onPress={() => navigation.navigate(item.navigation)}>
                          <View style={ index % 2 === 0 ?{
                            paddingRight:wp(2),
                            paddingHorizontal:wp(4),
                            paddingVertical:wp(0.2),
                          }:{
                            paddingLeft: wp(2),
                            paddingHorizontal:wp(4),
                            paddingVertical:wp(0.2), 
                        }}>
                            <View style={style.cardList}>
                              <Image style={style.cardListImage} source={item.icon} />
                              <Text>
                                {item.label}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      )}
                      ItemSeparatorComponent={() => <View style={{ width: 15, height: 15 }} />}

                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    {/* {menu.map(value => (
                      <View key={value.label}> */}
                    <View style={style.menuView}>
                      <Text style={style.menuText}>{GeneralMenu.label}</Text>
                    </View>
                    {GeneralMenu?.subMenu?.map((item, index) => (
                      <RippleTouchable
                        key={`submenu-${index}`}
                        onPress={() => {
                          if (item.label == 'Logout') {
                            logout();
                          } else if (item.label == 'Invite a Friend') {
                            onShare();
                          } else {
                            item.navigation &&
                              navigation.navigate(item.navigation);
                          }
                        }}
                        style={style.cardBlock}>
                        <View style={{ flexDirection: 'row' }}>
                          <Image source={item.icon} style={style.icon} />
                          <Text style={style.cardText}>{item.label}</Text>
                        </View>
                        <Image
                          source={IMAGE.ArrowForward}
                          style={[style.icon1, { height: 10, width: 10 }]}
                        />
                      </RippleTouchable>
                    ))}
                    {/* </View>
                    ))} */}
                  </View>
                </View>
              </View>
            </ScrollView>
            <RenderBottomSheet
              snapPoints={snapPoints}
              bottomSheetRef={bottomSheetRef}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  icon: {
    resizeMode: 'contain',
    height: 18,
    width: 18,
    tintColor: color.black,
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
  menuView: {
    paddingVertical: hp(1),
    backgroundColor: '#F5F6F8',
    paddingLeft: wp(5),
  },
  menuText: {
    fontSize: fontSize.size18,
    fontFamily: fontFamily.Medium,
    color: color.blackRussian,
    marginBottom: 15,
  },

  icon1: {
    // tintColor:color.black,
    resizeMode: 'contain',
    height: 22,
    width: 22,
  },
  cardText: {
    paddingLeft: wp(5),
    fontSize: Platform.OS === "ios" ? 15 : 14,
    fontFamily: fontFamily.Regular,
    color: color.black,
    lineHeight:20,
  },
  cardBlock2: {
    marginLeft: wp(10),
    paddingRight: wp(7),
    paddingVertical: hp(2),
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: color.borderGray,
  },
  cardBlock: {
    marginHorizontal: 15,
    marginVertical: 7,
    backgroundColor: color.white,
    paddingLeft: wp(7),
    paddingRight: wp(7),
    paddingVertical: hp(2.3),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 7,
  },
  profileImg: {
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 20,
    width: 110,
    height: 110,
    resizeMode: 'cover',
  },
  btn: {
    alignSelf: 'center',
    marginTop: hp(4),
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(4.5),
    width: wp(45),
    borderRadius: 20,
    backgroundColor: color.btnBlue,
  },
  name: {
    textAlign: 'center',
    fontSize: 22,
    fontFamily: fontFamily.Bold,
    color: color.black,
  },
  desc: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: fontFamily.Light,
    color: color.textGray2,
  },
  highLightsText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: fontFamily.Regular,
    color: color.black,
    marginTop: 10,
  },
  btnText: {
    fontSize: 13,
    fontFamily: fontFamily.Regular,
    color: color.white,
  },
  imgview: {
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: color.btnBlue,
    borderRadius: 120,
  },
  imgBox: {
    borderRadius: 120,
    height: 65,
    width: 65,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: color.white,
  },

  bodySection: {
    top: -hp(3),
  },
  cardList: {
    width: wp(44),
    backgroundColor: color.white,
    padding: 12,
    borderRadius: 7,
    elevation: 2,
    shadowColor: color.lightGray,
    shadowOpacity: 0.9,
  },
  cardListImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginBottom: 7
  }
});
export default MyProfile;
