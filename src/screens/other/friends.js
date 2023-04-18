/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect, FC } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Platform,
} from 'react-native';
import { IMAGE, color, fontFamily } from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RippleTouchable, StoryList } from '../../component/';
import SwipeableView from 'react-native-swipeable-view';
import Loader from './../../component/loader';
import { APIRequest, ApiUrl, IMAGEURL } from './../../utils/api';
import { useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { User } from '../../utils/user';
import NoRecord from './noRecord';
import ChatListSkelton from '../../utils/skeltons/chatListSkelton';
import UserProfileImage from '../../component/userProfileImage';
import Icon from 'react-native-vector-icons/Ionicons';



const _renderChatList = React.memo(({ item, userId, navigation, reload, setisLoading, pinnedChatCount }) => {

  const pinUnpinChatList = item => {

    if (pinnedChatCount >= 3 && item?.is_pinned == '0') {
      Toast.show({
        type: 'info',
        text1: 'You can pin upto 3 conversations'
      })
      return false;
    }
    setisLoading(true);
    let config = {
      url: ApiUrl.pinUnpinChatList,
      method: 'post',
      body: {
        to_id: item?.user_id
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

  const deleteChat = () => {
    let config = {
      url: ApiUrl.deleteConversation,
      method: 'post',
      body: {
        id: item.id,
        is_group: 0,
      },
    };

    APIRequest(
      config,
      res => {
        Toast.show({
          type: 'success',
          text1: res.message
        })
        // fetchChatList()
      },
      err => { },
    );
  };
  return (
    <SwipeableView
      autoClose={true}
      btnsArray={
        [
          // {
          //   component: (
          //     <TouchableOpacity
          //       onPress={() => {
          //         Alert.alert(
          //           'Alert',
          //           'Are you sure you want to delete converation?',
          //           [
          //             {
          //               text: 'NO',
          //               onPress: () => null,
          //               style: 'Cancel',
          //             },
          //             {
          //               text: 'YES',
          //               onPress: () => [
          //                 deleteChat(),
          //                 // this.props.navigation.navigate('ChatList'),
          //                 // this.props.navigation.navigate('Friends'),
          //               ],
          //             },
          //           ],
          //         );
          //       }}
          //       style={{
          //         backgroundColor: color.red,
          //         flex: 1,
          //         alignItems: 'center',
          //         flexDirection: 'row',
          //         justifyContent: 'center',
          //       }}>
          //       <Image
          //         source={IMAGE.delete}
          //         style={{ height: 15, width: 15, resizeMode: 'contain' }}
          //       />
          //       <Text
          //         style={{
          //           fontSize: 12,
          //           fontFamily: fontFamily.Semibold,
          //           color: color.white,
          //           marginLeft: 5,
          //         }}>
          //         Delete
          //       </Text>
          //     </TouchableOpacity>
          //   ),
          // },
          {
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

                <Image
                  source={item?.is_pinned == '1' ? IMAGE.unPin : IMAGE.pin}
                  style={{ height: 16, width: 16, resizeMode: 'contain' }}
                />
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: fontFamily.Semibold,
                    color: color.white,
                    marginLeft: 5,
                  }} >{item?.is_pinned == '1' ? 'Unpin' : 'Pin'}</Text>


              </TouchableOpacity>
            ),
          },
        ]
      }>
      <RippleTouchable
        onPress={() =>
          navigation.navigate('Chat', {
            avatar: item?.user?.avatar,
            userName: item.user?.name,
            user_id: userId,
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
              {item?.user?.avatar ? (
                <Image
                  source={{ uri: `${IMAGEURL}/${item?.user?.avatar}` }}
                  style={style.imgBox}
                />
              ) : (
                <Image source={IMAGE.boy} style={style.imgBox} />
              )}

              {item?.user?.is_online == 1 && <View style={style.onlineDot} />}
            </View>
            <View style={style.chatView}>
              <View>
                <Text style={style.chatname}>{item.user?.name}</Text>
                {item.message_type == 0 ? (
                  <Text style={style.msg} numberOfLines={1}>
                    {item.message}
                  </Text>
                ) : (
                  <Text style={style.msg}>Sent a file</Text>
                )}
              </View>
              <View style={{ paddingRight: wp(3) }}>
                <Text style={style.time}>{item?.created_time_ago}</Text>
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}
                >

                  {item.unread_count > 0 && (
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
                  )}
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

const ChatList = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [requestCount, setrequestCount] = useState(0);
  const [chatData, setchatData] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [pinnedChatCount, setPinnedChatCount] = useState(0);
  const [appReady, setappReady] = useState(false);
  const { avatar, id } = new User().getuserdata();

  const isFocus = useIsFocused();
  useEffect(() => {
    if (isFocus) {
      setappReady(true);
      setTimeout(() => {
        fetchChatList();
      });
    }
  }, [isFocus]);

  useEffect(() => {
    return () => {
      setSearch('');
      setrequestCount(0);
      setchatData([]);
      setisLoading(false);
      setPinnedChatCount(0);
      setappReady(false);
    }
  }, [])




  const fetchChatList = () => {
    setisLoading(true);

    let config = {
      url: ApiUrl.conversationsList,
      method: 'post',
    };

    APIRequest(
      config,
      res => {
        if (res.status) {
          setchatData(res.conversations);

          const totalPinnedChat = res?.conversations.reduce(
            (acc, curr) => (parseInt(acc) + parseInt(curr?.is_pinned == '1' ? 1 : 0)),
            0,
          )
          setPinnedChatCount(totalPinnedChat);
          setrequestCount(res.follow_requests);
        }
        setisLoading(false);
      },
      err => {
        setisLoading(false);
      },
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: color.white }}>
      <StatusBar barStyle={'dark-content'} backgroundColor={color.white} />
      <View>
        {/* {appReady && <Loader type="dots" isLoading={isLoading} />} */}
        <View
          style={{
            flexDirection: 'row',
            marginTop: Platform.OS == 'ios' ? '15%' : 10,

            paddingLeft: wp(7),
            paddingRight: wp(4),
            // paddingBottom: hp(1),
            // paddingTop:hp(3),
            justifyContent: 'space-between',
          }}>
          <Text style={style.heading}>Lybertine</Text>
          <UserProfileImage />
        </View>
        <StoryList navigation={navigation} />
        <View
          style={{
            borderBottomWidth: 0.5,
            borderColor: color.borderGray,
          }}></View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={style.SearchWrapper}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                navigation.navigate('Search');
              }}>
              <View style={style.input}>
                <View style={{ position: 'absolute', left: wp(3) }}>
                  <Image
                    source={IMAGE.search2}
                    style={{ height: 20, width: 20, resizeMode: 'contain' }}
                  />
                </View>
                <Text style={{ color: color.iconGray }}>Search</Text>
                {/* <TextInput
                onFocus={() => {navigation.navigate('Search')}}
                style={{ paddingVertical: 0, color: color.textGray2 }}
                onChangeText={setSearch}
                placeholder="Search"
                placeholderTextColor={'lightgray'}
              /> */}
              </View>
            </TouchableOpacity>
            <View
              style={{
                alignItems: 'center',
                marginTop: hp(2),
                marginLeft: hp(1),
                opacity: 1,
                backgroundColor: color.white,
                borderRadius: 3,
                height: hp(6),
                width: wp(15),
                borderWidth: 0.5,
                borderRadius: 5,
                borderColor: color.borderGray,
                color: '#000',
                elevation: 3,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 5,
              }}>
              <View style={style.ProfileCount}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Request');
                  }}>
                  <View style={{ paddingBottom: hp(0) }}>
                    <Image
                      source={IMAGE.friend_request}
                      style={{
                        height: 20,
                        width: 20,
                        resizeMode: 'contain',
                        tintColor: color.btnBlue,
                      }}
                    />
                  </View>

                  {/* <Text style={style.request}>Requests</Text> */}
                  {requestCount > 0 && (
                    <>
                      <View style={style.requestCounterView}>
                        <Text style={style.requestCounter}>{requestCount}</Text>
                      </View>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {isLoading ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={[0, 1, 2, 3, 4]}
              renderItem={() => <ChatListSkelton />}
            />
          ) : (
            <>
              {chatData.length > 0 ? (
                <View style={style.bodySection}>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    keyExtractor={index => String(index.id)}
                    data={chatData}
                    contentContainerStyle={{ marginBottom: hp(20) }}
                    renderItem={({ item, index }) => (
                      <_renderChatList
                        userId={item?.user_id}
                        reload={fetchChatList}
                        navigation={navigation}
                        pinnedChatCount={pinnedChatCount}
                        setisLoading={(val) => setisLoading(val)}
                        item={item}
                      />
                    )}
                  />
                </View>
              ) : (
                <NoRecord
                  image={IMAGE.noConversation}
                  title="No conversation"
                  description="Start conversing to see your messages here."
                  buttonText="Find friends"
                  navigation={navigation}
                  navigateTo={'Search'}
                  showButton={true}
                />
              )}
            </>
          )}
        </ScrollView>
      </View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('MyFriends', {
            EditGroup: 'New group',
          })
        }
        style={style.groupAdd}>
        <Image
          source={IMAGE.myFriends}
          style={{
            height: 25,
            width: 25,
            resizeMode: 'contain',
          }}
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
  },
  requestCounterView: {
    position: 'absolute',
    top: -20,
    right: -18,
    width: 19,
    height: 19,
    borderRadius: 15,
    backgroundColor: color.btnBlue,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginTop: hp(2),
    opacity: 1,
    backgroundColor: color.white,
    height: hp(6),
    width: wp(75),
    alignSelf: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: color.borderGray,
    color: '#000',
    paddingLeft: wp(13),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  SearchWrapper: {
    marginBottom: hp(2),
    paddingHorizontal: wp(5),
    flex: 1,
    flexDirection: 'row',
    // justifyContent:"center",
    alignItems: 'center',
  },
  onlineDot: {
    borderWidth: 1,
    borderColor: color.white,
    position: 'absolute',
    zIndex: 1,
    right: 0,
    bottom: 0,
    height: 13,
    width: 13,
    borderRadius: 120,
    backgroundColor: color.green,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: color.btnBlue,
    borderRadius: 120,
    height: 25,
    minWidth: 25,
    maxWidth: 40,
    alignItems: 'center',
    marginRight: wp(1),
    overflow: 'hidden',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontFamily: fontFamily.Semibold,
    color: color.white,
  },
  time: {
    fontSize: Platform.OS == 'ios' ? 12 : 12,
    fontFamily: fontFamily.Semibold,
    color: color.textGray2,
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
    marginTop: '1%',
    width: 200,
  },

  heading: {
    fontSize: 25,
    fontFamily: fontFamily.Bold,
    color: color.black,
  },
  request: {
    fontSize: Platform.OS == 'ios' ? 15 : 13,

    fontFamily: fontFamily.Bold,
    color: color.black,
  },
  requestCounter: {
    fontSize: Platform.OS == 'ios' ? 12 : 10,
    fontFamily: fontFamily.Bold,
    color: color.white,
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
    borderRadius: 60,
    height: Platform.OS == 'ios' ? 52 : 52,
    width: Platform.OS == 'ios' ? 52 : 52,
    resizeMode: 'cover',
  },
  dots: {
    height: 12,
    width: 12,
    resizeMode: 'contain',
  },
  card: {},

  bodySection: {
    paddingBottom: hp(8),
  },
  chatView: {
    paddingRight: wp(5),
    paddingVertical: hp(1.5),
    flex: 1,
    marginLeft: wp(3),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomWidth: 0.6,
    borderColor: color.extralightSlaty,
  },
  ProfileCount: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
  },
});
export default ChatList;
