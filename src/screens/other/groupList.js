/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect, FC } from 'react';
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
  Platform,
} from 'react-native';
import { IMAGE, color, fontFamily } from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RippleTouchable, StoryList } from '../../component/';
import SwipeableView from 'react-native-swipeable-view';
import Toast from 'react-native-toast-message';
import { APIRequest, ApiUrl, IMAGEURL } from './../../utils/api';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import { User } from '../../utils/user';
import NoRecord from './noRecord';
import ChatListSkelton from '../../utils/skeltons/chatListSkelton';
import UserProfileImage from '../../component/userProfileImage';
import FocusAwareStatusBar from '../../utils/FocusAwareStatusBar';

const getTime = time => {
  if (time) {
    return moment(time).fromNow();
  }
};

const _renderGroupList = React.memo(({ item, navigation, setisLoading, reload, pinnedChatCount }) => {
  const userdata = new User().getuserdata();
  let receiverId = userdata?.id == item.from_id ? item.from_id : userdata?.id;

  const pinUnpinChatList = item => {

    if (pinnedChatCount >= 3 && item?.is_pinned == '0') {
      Toast.show({
        type: 'info',
        text1: 'You can pin upto 3 conversations',
      });
      return false;
    }
    setisLoading(true);
    let config = {
      url: ApiUrl.pinUnpinChatList,
      method: 'post',
      body: {
        to_id: item?.group_id,
        is_group: 1
      }
    };
    APIRequest(
      config,
      res => {
        if (res.status) {
          reload()
        }
        setisLoading(false);
      },
      err => {
        setisLoading(false);
      },
    );
  };
  return (

    <SwipeableView autoClose={false} btnsArray={[{
      component: (
        <TouchableOpacity
          onPress={() => { pinUnpinChatList(item) }}
          style={{
            backgroundColor: color.textGray2,
            flex: 1,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          {item?.is_pinned == '1' ? (
            <>
              <Image
                source={IMAGE.unPin}
                style={{ height: 16, width: 16, resizeMode: 'contain' }}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fontFamily.Semibold,
                  color: color.white,
                  marginLeft: 5,
                }} >Unpin</Text>

            </>
          ) : (
            <>
              <Image
                source={IMAGE.pin}
                style={{ height: 16, width: 16, resizeMode: 'contain' }}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fontFamily.Semibold,
                  color: color.white,
                  marginLeft: 5,
                }} >Pin</Text>
            </>

          )}


        </TouchableOpacity>
      ),
    }]}>
      <RippleTouchable
        onPress={() =>
          navigation.navigate('GroupChat', {
            group_id: item?.group?.id,
            user_id: receiverId,
            groupType: item.group.group_type,
            mediaPrivacy: item.group.media_privacy,
            privacy: item.group.privacy,
            isAdmin: item.is_admin,
          })
        }>
        <View style={style.card}>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              paddingLeft: wp(5),
            }}>
            <View style={style.imgview}>
              {/* <View style={style.onlineDot} /> */}
              <Image
                source={{ uri: `${IMAGEURL}/${item?.group?.photo_url}` }}
                style={style.imgBox}
              />
            </View>
            <View style={style.chatView}>
              <View>
                <Text style={style.chatname}>{item?.group?.name}</Text>
                <Text style={style.msg} numberOfLines={1}>
                  {item?.message}
                </Text>
              </View>
              <View style={{ paddingRight: wp(3) }}>
                <Text style={style.time}>{item.created_time_ago}</Text>
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}
                >
                  {/* {item.unread_count > 0 && (
                    <View
                      style={{
                        // flexDirection: 'row',
                        // alignItems: 'center',
                        marginTop: hp(1),
                      }}>
                      <View style={style.badge}>
                        <Text style={style.badgeText}>

                          {parseInt(item.unread_count) > 99
                            ? '99+'
                            : parseInt(item.unread_count)}
                        </Text>
                      </View>
                    </View>
                  )} */}
                  {parseInt(item?.is_pinned) > 0 && <Image
                    source={IMAGE.grayPin}
                    style={{ height: 16, width: 16, marginTop: hp(1), resizeMode: 'contain' }}
                  />}
                </View>
              </View>
            </View>
          </View>
        </View>
      </RippleTouchable>
    </SwipeableView>
  );
});

const GroupList = ({ navigation }) => {
  const [groupList, setGroupList] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [appReady, setappReady] = useState(false);
  const [pinnedChatCount, setPinnedChatCount] = useState(0);
  const { avatar } = new User().getuserdata();

  const isFocus = useIsFocused();
  useEffect(() => {
    if (isFocus) {
      setappReady(true);
      setTimeout(() => {
        fetchGroupList();
      });
    }
  }, [isFocus]);

  const fetchGroupList = () => {
    // alert("api callled")
    setisLoading(true);

    let config = {
      url: ApiUrl.groupList,
      method: 'post',
    };

    APIRequest(
      config,
      res => {
        const totalPinnedChat = res?.conversations.reduce(
          (acc, curr) => (parseInt(acc) + parseInt(curr?.is_pinned == '1' ? 1 : 0)),
          0,
        )
        setPinnedChatCount(totalPinnedChat);
        if (res.conversations == []) {
          setGroupList([]);
        } else {
          setGroupList(res.conversations);
        }

        setisLoading(false);
      },
      err => {
        setisLoading(false);
        console.log(err);
      },
    );
  };

  useEffect(() => {
    return () => {
      setGroupList([]);
      setSearch('');
      setisLoading(false);
      setappReady(false);
      setPinnedChatCount(0);
    }
  }, [])


  return (
    <View style={{ flex: 1, backgroundColor: color.white }}>
      <FocusAwareStatusBar barStyle={'dark-content'} backgroundColor={color.white} />

      {/* {appReady && <Loader type="dots" isLoading={isLoading} />} */}

      <View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: Platform.OS == 'ios' ? '15%' : 10,

            paddingLeft: wp(7),
            paddingRight: wp(4),
            // paddingVertical: hp(1),
            justifyContent: 'space-between',
          }}>
          <Text style={style.heading}>Lybertine</Text>
          <UserProfileImage />
        </View>
        <StoryList storyBackGroundColor={color.white} />
        <View>
          <View
            style={{
              borderBottomWidth: 0.5,
              borderColor: color.borderGray,
            }}></View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                navigation.navigate('Search', { isGroupSearch: true });
              }}>
              <View style={style.input}>
                <View style={{ position: 'absolute', left: wp(3) }}>

                  <Image
                    source={IMAGE.search2}
                    style={{ height: 20, width: 20, resizeMode: 'contain' }}
                  />
                </View>
                <Text style={{ color: color.iconGray }}>Search using group name</Text>

              </View>
            </TouchableOpacity>
            {isLoading ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={[0, 1, 2, 3, 4]}
                renderItem={() => <ChatListSkelton />}
              />
            ) : (
              <>
                {groupList?.length > 0 ? (
                  <View style={style.bodySection}>
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      keyExtractor={index => String(index.id)}
                      data={groupList}
                      contentContainerStyle={{ marginBottom: hp(20) }}
                      renderItem={({ item, index }) => (
                        <_renderGroupList
                          navigation={navigation}
                          item={item}
                          setisLoading={(val) => setisLoading(val)}
                          pinnedChatCount={pinnedChatCount}
                          reload={fetchGroupList} />
                      )}
                    />
                  </View>
                ) : (
                  <NoRecord
                    image={IMAGE.noGroup}
                    title="No group chat"
                    description="Get in touch with your friends by creating a group."
                    buttonText="Create a group"
                    navigation={navigation}
                    navigateTo={'AddGroup'}
                    navigateParams={{
                      EditGroup: 'New group',
                    }}
                    showButton={true}
                  />
                )}
              </>
            )}
            {/* <View style={{alignItems:'center',flexDirection:'row',paddingLeft:wp(10),paddingTop:hp(2),justifyContent:'space-between'}}>
                        <View style={{paddingBottom:hp(1)}}>
                            <Image source={IMAGE.request} style={{height:20,width:20,resizeMode:'contain'}} />
                        </View>
                        <TouchableOpacity onPress={()=>{navigation.navigate('Request')}} style={style.requestCounterView}>
                            <Text style={style.request}>Requests</Text>
                            <Text style={style.requestCounter}>0</Text>
                        </TouchableOpacity>
                    </View> */}
          </ScrollView>
        </View>
      </View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('AddGroup', {
            EditGroup: 'New group',
          })
        }
        style={style.groupAdd}>
        {/* <Imgage name={'pencil'} style={{ fontSize: 25, color: '#fff' }} /> */}
        <Image
          source={IMAGE.plus}
          style={{ height: 25, width: 25, tintColor: color.white, resizeMode: 'contain' }}
        />
      </TouchableOpacity>
    </View>
  );
};

const style = StyleSheet.create({
  groupAdd: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    bottom: Platform.OS == 'ios' ? 25 : 25,
    backgroundColor: color.btnBlue,
    height: 50,
    width: 50,
    borderRadius: 120,
    zIndex: 999999,
  },
  btnText: {
    fontSize: 13,
    fontFamily: fontFamily.Regular,
    color: color.white,
  },
  btn: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(4.5),
    width: wp(45),
    borderRadius: 20,
    backgroundColor: color.btnBlue,
  },
  findFriendImg: {
    height: 150,
    width: 150,
    resizeMode: 'contain',
  },
  trashBtn: {
    height: hp(4),
    width: wp(10),
    backgroundColor: color.red,
  },
  userProfile: {
    borderRadius: 120,
    height: 40,
    width: 40,
    resizeMode: 'cover',

    // borderColor: color.btnBlue,
  },
  requestCounterView: {
    width: wp(80),
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: wp(10),
    borderBottomWidth: 0.3,
    paddingBottom: hp(1),
    borderColor: '#DEDEDE',
  },
  input: {
    marginVertical: hp(2),
    opacity: 1,
    backgroundColor: '#fff',
    height: hp(6),
    width: wp(88),
    alignSelf: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderRadius: 5,
    color: '#000',
    paddingLeft: wp(13),

    borderColor: color.borderGray,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  onlineDot: {
    borderWidth: 1,
    borderColor: color.white,
    position: 'absolute',
    zIndex: 99,
    right: 0,
    bottom: 0,
    height: 13,
    width: 13,
    borderRadius: 120,
    backgroundColor: color.green,
  },
  badge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    backgroundColor: color.btnBlue,
    borderRadius: 120,
    height: 28,
    width: 28,
    marginRight: wp(1),
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems:'center'
  },
  badgeText: {
    fontSize: 10,
    fontFamily: fontFamily.Regular,
    color: color.white,
  },
  time: {
    fontSize: Platform.OS == 'ios' ? 12 : 12,
    fontFamily: fontFamily.Semibold,
    color: color.iconGray,
  },
  chatname: {
    fontSize: Platform.OS == 'ios' ? 16 : 15,
    fontFamily: fontFamily.Bold,
    color: color.black,
    marginBottom: '1%',
  },
  msg: {
    fontSize: Platform.OS == 'ios' ? 15 : 13,
    fontFamily: fontFamily.Regular,
    color: color.textGray2,
    width: 200,
  },

  heading: {
    fontSize: 25,
    fontFamily: fontFamily.Bold,
    color: color.black,
  },
  request: {
    fontSize: 13,
    fontFamily: fontFamily.Bold,
    color: color.black,
  },
  requestCounter: {
    fontSize: 12,
    fontFamily: fontFamily.Medium,
    color: color.btnBlue,
  },
  imgview: {
    // overflow: 'hidden',
    borderColor: color.borderGray,
    borderWidth: 2,
    borderRadius: 120,
    position: 'relative',
    marginRight: wp(2),
  },
  imgBox: {
    borderRadius: 120,
    height: 52,
    width: 52,
    resizeMode: 'cover',
  },
  dots: {
    height: 12,
    width: 12,
    resizeMode: 'contain',
  },
  card: {},

  bodySection: {
    paddingBottom: hp(35),
    // backgroundColor:"red"
  },
  chatView: {
    paddingRight: wp(5),
    paddingVertical: hp(1.5),
    flex: 1,
    marginLeft: wp(3),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomWidth: 0.4,
    borderColor: color.extralightSlaty,
  },
});
export default GroupList;
