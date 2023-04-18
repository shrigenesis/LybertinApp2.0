import React, {useState, useEffect, FC} from 'react';
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
  SafeAreaView,
} from 'react-native';
import {IMAGE, color, fontFamily, fontSize} from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RippleTouchable, Header} from '../../component/';
import Loader from '../../component/loader';
import {useIsFocused} from '@react-navigation/native';
import {APIRequest, ApiUrl, IMAGEURL} from './../../utils/api';
import {Overlay} from 'react-native-elements';
import  Toast  from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';

const UserProfile = ({navigation, route}) => {
  const data = [];
  const [userData, setUserData] = useState({});
  const [userId, setuserId] = useState({});
  const [isLoading, setisLoading] = useState(false);
  const [visible, setvisible] = useState(false);
  const [visible1, setvisible1] = useState(false);
  const [reportVisible, setreportVisible] = useState(false);
  const [hightLight, sethighLight] = useState([]);
  const [userID, setuserID] = useState('');

  const isFocus = useIsFocused();
  useEffect(() => {
    if (isFocus && route?.params?.data) {
      let id = route?.params?.data?.user_id
        ? route?.params?.data?.user_id
        : route?.params?.data?.id;
      getHighlight(id);
      setuserId(id);
      getuserInfo(id);
    }
  }, [isFocus]);

  const sendRequest = () => {
    setisLoading(true);
    let config = {
      url: ApiUrl.sendReq,
      method: 'post',
      body: {
        user_id: userId,
      },
    };
    APIRequest(
      config,
      res => {
        if (res.status) {
          getuserInfo(userId);
          console.log('send request API ', res, '////');
        }
        setisLoading(false);
      },
      err => {
        setisLoading(false);
        console.log(err);
      },
    );
  };

  const rejectRequest = () => {
    alert('fff')
    setisLoading(true);
    let config = {
      url: ApiUrl.withdrawReq,
      method: 'post',
      body: {
        user_id: userId,
      },
    };

    APIRequest(
      config,
      res => {
        getuserInfo(userId);
        if (res.status) {
        }
        setisLoading(false);
      },
      err => {
        setisLoading(false);
        console.log(err);
      },
    );
  };

  const getuserInfo = id => {
    setisLoading(true);
    let config = {
      url: ApiUrl.userinfo + id,
      method: 'get',
    };
    APIRequest(
      config,
      res => {
        // alert(res.user.id);
        setUserData(res);
        setuserID(res.user.id);
        console.log('====', res);

        if (res.status) {
        }
        setisLoading(false);
      },
      err => {
        setisLoading(false);
        console.log(err);
      },
    );
  };

  const blockUser = () => {
    setisLoading(true);
    let config = {
      url: ApiUrl.blockedUser,
      method: 'post',
      body: {
        blocked_to: userData?.user?.id,
      },
    };
    APIRequest(
      config,
      res => {
        if (res?.alert?.message) {
          getuserInfo(userData?.user?.id);
          Toast.show({
            type: 'info',
            message: res?.alert?.message
          });
        }
        setisLoading(false);
      },
      err => {
        setisLoading(false);
        console.log(err);
      },
    );
  };

  const unfriendUser = () => {
    setisLoading(true);
    let config = {
      url: ApiUrl.unfollow,
      method: 'post',
      body: {
        user_id: userData?.user?.id,
      },
    };
    APIRequest(
      config,
      res => {
        if (res?.message) {
          getuserInfo(userData?.user?.id);
          Toast.show({
            type: 'info',
            message: res?.message
          });
        }
        setisLoading(false);
      },
      err => {
        setisLoading(false);
        console.log(err);
      },
    );
  };

  const reportUser = () => {
    setisLoading(true);
    let config = {
      url: ApiUrl.reportUser,
      method: 'post',
      body: {
        reported_to: userData?.user?.id,
        notes: 'Bad'
      },
    };
    APIRequest(
      config,
      res => {
        if (res?.message) {
          getuserInfo(userData?.user?.id);
          Toast.show({
            type: 'info',
            message: res?.message
          });
        }
        setisLoading(false);
      },
      err => {
        setisLoading(false);
        console.log(err);
      },
    );
  };

  const getHighlight = id => {
    // this.setState({isLoading: true});
    let config = {
      url: ApiUrl.highlights,
      method: 'post',
      body: {
        user_id: id,
      },
    };

    APIRequest(
      config,
      res => {
        console.log('Api response=== highlights', res.highlightsGroup);
        sethighLight(res.highlightsGroup);
      },
      err => {},
    );
  };

  const _renderHighlightes = (item, index) => {
    return (
      <RippleTouchable
        onPress={() =>
          navigation.navigate('showHightlight', {
            highLightId: item?.id,
            user_id: userID,
          })
        }>
        <View style={style.imgview}>
          <Image
            source={{uri: `${IMAGEURL}/${item.cover}`}}
            style={style.imgBox}
          />
          <Text style={style.highLightsText}>
            {item?.title?.length > 10
              ? item.title.substring(0, 7) + '...'
              : item.title}
          </Text>
        </View>
      </RippleTouchable>
    );
  };

  const _renderRequestList = (item, index) => {
    return (
      <View style={{marginRight: wp(4)}}>
        <View style={style.imgview}>
          <Image source={IMAGE.chatgirl} style={style.imgBox} />
        </View>
        <Text style={style.highLightsText}>Highlights</Text>
      </View>
    );
  };

  const renderIsFriend = () => (
    <View style={{marginVertical: 25}}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        keyExtractor={index => index}
        horizontal={true}
        data={hightLight}
        contentContainerStyle={{paddingLeft: wp(7)}}
        renderItem={({item, index}) => _renderHighlightes(item, index)}
      />
      <RippleTouchable
        onPress={() => {
          navigation.navigate('Media', {
            id: userData?.user?.id,
            from: 'oneToOne',
          });
        }}
        style={style.cardBlock}>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={IMAGE.media}
            style={[style.icon, {tintColor: color.btnBlue}]}
          />
          <Text style={style.cardText}>Media, Docs</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={style.counter}>{userData.media_count}</Text>
          <Image
            source={IMAGE.arrow}
            style={[style.icon, {height: 15, marginLeft: wp(3), width: 15}]}
          />
        </View>
      </RippleTouchable>

      <RippleTouchable
        onPress={() => {
          navigation.navigate('Chat', {
            userName: userData?.user?.name,
            avatar: userData?.user?.avatar,
            user_id: userData?.user?.id,
          });
        }}
        backgroundColor={color.iconGray}
        viewStyle={{borderRadius: 20}}
        style={style.btn}>
        <Text style={style.btnText}>Message</Text>
      </RippleTouchable>
      {userData.isFriend == true ? (
        <View>
          <RippleTouchable
            onPress={() => {
              setvisible(true);
              // blockUser();
            }}
            style={[
              style.menuList,
              {marginTop: hp(3), justifyContent: 'flex-start'},
            ]}>
            <Image source={IMAGE.block} style={style.icon} />
            <Text style={[style.cardText, {color: color.red}]}>
              {userData?.isBlocked ? 'UnBlock' : 'Block'} {userData?.user?.name}
            </Text>
          </RippleTouchable>
          <RippleTouchable
            onPress={() => {
              setvisible1(true);
              // unfriendUser();
            }}
            style={[style.menuList, {justifyContent: 'flex-start'}]}>
            <Image source={IMAGE.unfriend} style={style.icon} />
            <Text style={[style.cardText, {color: color.red}]}>
              Unfriend {userData?.user?.name}
            </Text>
          </RippleTouchable>
          <RippleTouchable
            onPress={() => setreportVisible(true)}
            style={[style.menuList, {justifyContent: 'flex-start'}]}>
            <Image source={IMAGE.report} style={style.icon} />
            <Text style={[style.cardText, {color: color.red}]}>
              Report {userData?.user?.name}
            </Text>
          </RippleTouchable>
        </View>
      ) : (
        <View></View>
      )}
    </View>
  );
  const requestAction = (id, type) => {
    setisLoading(true);
    let config = {
      url: type == 'accept' ? ApiUrl.accpetRequest : ApiUrl.rejectReq,
      method: 'post',
      body: {user_id: id},
    };

    APIRequest(
      config,
      res => {
        if (res.status) {
          let id = route?.params?.data?.user_id
            ? route?.params?.data?.user_id
            : route?.params?.data?.id;
          getuserInfo(id);
        }
        setisLoading(false);
      },
      err => {
        setisLoading(false);
        console.log(err);
      },
    );
  };
  const renderIsNotFriend = () => (
    <View>
      {userData.send_request == true ? (
        <RippleTouchable
          onPress={sendRequest}
          backgroundColor={color.iconGray}
          viewStyle={{borderRadius: 20}}
          style={style.btn}>
          <Text style={style.btnText}>Send Request</Text>
        </RippleTouchable>
      ) : userData.isFriend == true ? (
        <View></View>
      ) : userData.rejectRequest == true ? (
        <View
          style={{
            marginHorizontal: 10,
            marginTop: hp(1),
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <RippleTouchable
            onPress={() => {
              requestAction(userData?.user?.id, 'reject');
            }}
            backgroundColor={color.white}
            borderRadius={5}
            style={{...style.btn, backgroundColor: '#92969B'}}>
            <Text style={style.btnText}>Reject</Text>
          </RippleTouchable>
          <RippleTouchable
            onPress={() => {
              requestAction(userData?.user?.id, 'accept');
            }}
            backgroundColor={color.iconGray}
            borderRadius={5}
            style={style.btn}>
            <Text style={style.btnText}>Accept</Text>
          </RippleTouchable>
        </View>
      ) : (
        <RippleTouchable
          onPress={rejectRequest}
          backgroundColor={color.iconGray}
          viewStyle={{borderRadius: 20}}
          style={{...style.btn, backgroundColor: '#E8505B'}}>
          <Text style={style.btnText}>Withdraw Request</Text>
        </RippleTouchable>
      )}
    </View>
  );

  return (
    <SafeAreaView style={style.safeArea}>
      <ScrollView>
        <View style={{flex: 1, backgroundColor: color.white}}>
          <StatusBar barStyle={'dark-content'} backgroundColor={color.white} />
          <View>
            <Header title={userData?.user?.name} />
            <Loader isLoading={isLoading} type={'dots'} />
            {userData?.user?.cover ? (
              <Image
                source={{uri: `${IMAGEURL}/${userData?.user?.cover}`}}
                style={{width: wp(100), height: hp(20)}}
              />
            ) : (
              <Image
                source={IMAGE.profile_view}
                style={{width: wp(100), height: hp(20)}}
              />
            )}

            <View style={{alignSelf: 'center', top: -hp(6)}}>
              {userData?.user?.avatar ? (
                <Image
                  source={{uri: `${IMAGEURL}/${userData?.user?.avatar}`}}
                  style={style.profileImg}
                />
              ) : (
                <Image source={IMAGE.boy} style={style.profileImg} />
              )}
            </View>
            <View style={{alignSelf: 'center', top: -hp(5)}}>
              <Text style={style.name}>{userData?.user?.name}</Text>
              {/* <Text style={style.desc}>Think Different</Text> */}
            </View>
            <View style={style.bodySection}>
              <FlatList
                showsHorizontalScrollIndicator={false}
                keyExtractor={index => index}
                horizontal={true}
                data={data}
                contentContainerStyle={{paddingLeft: wp(7)}}
                renderItem={({item, index}) => _renderRequestList(item, index)}
              />
              {renderIsNotFriend()}
              {renderIsFriend()}
            </View>
          </View>
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
                Block Warning
              </Text>
              <Text
                style={{
                  fontFamily: fontFamily.Light,
                  fontSize: 15,
                  color: color.black,
                  textAlign: 'center',
                }}>
                Are you sure want to Block this user?
              </Text>
              <View
                style={{
                  height: 1,
                  with: '100%',
                  backgroundColor: color.iconGray,
                  marginHorizontal: '-3.4%',
                  marginVertical: '5%',
                }}></View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
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
                  onPress={() => [blockUser(), setvisible(false)]}
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
          <Overlay
            visible={visible1}
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
                Unfriend Warning
              </Text>
              <Text
                style={{
                  fontFamily: fontFamily.Light,
                  fontSize: 15,
                  color: color.black,
                  textAlign: 'center',
                }}>
                Are you sure want to Unfriend this user?
              </Text>
              <View
                style={{
                  height: 1,
                  with: '100%',
                  backgroundColor: color.iconGray,
                  marginHorizontal: '-3.4%',
                  marginVertical: '5%',
                }}></View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity
                  onPress={() => setvisible1(false)}
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
                  onPress={() => [unfriendUser(), setvisible1(false)]}
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
          <Overlay
            visible={reportVisible}
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
                Report Warning
              </Text>
              <Text
                style={{
                  fontFamily: fontFamily.Light,
                  fontSize: 15,
                  color: color.black,
                  textAlign: 'center',
                }}>
                Are you sure want to Report this user?
              </Text>
              <View
                style={{
                  height: 1,
                  with: '100%',
                  backgroundColor: color.iconGray,
                  marginHorizontal: '-3.4%',
                  marginVertical: '5%',
                }}></View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity
                  onPress={() => setreportVisible(false)}
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
                  onPress={() => [setreportVisible(false), reportUser()]}
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
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: color.white,
  },
  counter: {
    fontSize: 13,
    fontFamily: fontFamily.Regular,
    color: color.textGray2,
  },
  icon: {
    resizeMode: 'contain',
    height: 22,
    width: 22,
  },
  cardText: {
    paddingLeft: wp(5),
    fontSize: fontSize.size16,
    fontFamily: fontFamily.Regular,
    color: color.black,
  },
  cardBlock: {
    paddingLeft: wp(10),
    paddingRight: wp(7),
    paddingVertical: hp(1),
    marginTop: 25,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuList: {
    paddingLeft: wp(10),
    paddingRight: wp(7),
    paddingVertical: hp(1),
    marginTop: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  imgBox: {
    borderRadius: 120,
    height: 65,
    width: 65,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: color.white,
    borderWidth: 2,
    borderColor: color.btnBlue,
  },

  bodySection: {
    top: -hp(3),
  },
});
export default UserProfile;
