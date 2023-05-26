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
  ActivityIndicator,
} from 'react-native';
import { IMAGE, color, fontFamily } from '../../constant';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RippleTouchable, StoryList } from '../../component';
import SwipeableView from 'react-native-swipeable-view';
import Loader from '../../component/loader';
import { APIRequest, ApiUrl, IMAGEURL } from '../../utils/api';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import { User } from '../../utils/user';
import { SafeAreaView } from 'react-native-safe-area-context';
import NoRecord from './noRecord';

const DATA = [
  {
    id: '1',
    image: 'mvkfdjnv',
    heading: 'Forbidden Night Male...',
    date: '07 May to 10 Jun 2022',
    location: 'London',
    time: '19:30 - 22:30',
  },

  {
    id: '2',
    image: 'mvkfdjnv',
    heading: 'Forbidden Night Male...',
    date: '07 May to 10 Jun 2022',
    location: 'London',
    time: '19:30 - 22:30',
  },
  {
    id: '3',
    image: 'mvkfdjnv',
    heading: 'Forbidden Night Male...',
    date: '07 May to 10 Jun 2022',
    location: 'London',
    time: '19:30 - 22:30',
  },
  {
    id: '4',
    image: 'mvkfdjnv',
    heading: 'Forbidden Night Male...',
    date: '07 May to 10 Jun 2022',
    location: 'London',
    time: '19:30 - 22:30',
  },
  {
    id: '5',
    image: 'mvkfdjnv',
    heading: 'Forbidden Night Male...',
    date: '07 May to 10 Jun 2022',
    location: 'London',
    time: '19:30 - 22:30',
  },
  {
    id: '6',
    image: 'mvkfdjnv',
    heading: 'Forbidden Night Male...',
    date: '07 May to 10 Jun 2022',
    location: 'London',
    time: '19:30 - 22:30',
  },
  {
    id: '7',
    image: 'mvkfdjnv',
    heading: 'Forbidden Night Male...',
    date: '07 May to 10 Jun 2022',
    location: 'London',
    time: '19:30 - 22:30',
  },
];

const getTime = time => {
  if (time) {
    return moment(time).format('hh:mm');
  }
};

const _renderChatList = React.memo(({ item, userId, navigation }) => {
  let receiverId = userId == item.from_id ? item.to_id : item.from_id;
  return (
    <SwipeableView
      autoClose={true}
      btnsArray={[
        {
          component: (
            <TouchableOpacity
              style={{
                backgroundColor: color.red,
                flex: 1,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Image
                source={IMAGE.delete}
                style={{ height: 15, width: 15, resizeMode: 'contain' }}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fontFamily.Semibold,
                  color: color.white,
                  marginLeft: 5,
                }}>
                Delete
              </Text>
            </TouchableOpacity>
          ),
        },
      ]}>
      <RippleTouchable
        onPress={() =>
          navigation.navigate('Chat', {
            avatar: item?.user?.avatar,
            userName: item.user?.name,
            user_id: receiverId,
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
                  <Text style={style.msg}>{item.message}</Text>
                ) : (
                  <Text style={style.msg}>Send a file</Text>
                )}
              </View>
              <View style={{ paddingRight: wp(3) }}>
                <Text style={style.time}>{getTime(item?.created_at)}</Text>
                {item.unread_count > 0 && (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={style.badge}>
                      <Text style={style.badgeText}>{item.unread_count}</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </RippleTouchable>
    </SwipeableView>
  );
});

const EventListOrganiser = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [requestCount, setrequestCount] = useState(0);
  const [chatData, setchatData] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [appReady, setappReady] = useState(false);
  const { avatar, id } = new User().getuserdata();
  const [upcomingEvents, setupcomingEvents] = useState([]);
  const [featuredEvents, setfeaturedEvent] = useState([]);
  const [topSellingEvents, settopSellingEvents] = useState([]);
  const [data, setData] = useState([]);

  const isFocus = useIsFocused();
  useEffect(() => {
    setData(DATA);

    if (isFocus) {
      setappReady(true);
      getEvents();
      setTimeout(() => {
        fetchChatList();
      }, 300);
    }
  }, [isFocus]);

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
          setrequestCount(res.follow_requests);
        }
        setisLoading(false);
      },
      err => {
        setisLoading(false);
        console.log(err);
      },
    );
  };

  const getEvents = () => {
    setisLoading(true);

    let config = {
      url: ApiUrl.organizerEvents,
      method: 'post',
    };

    APIRequest(
      config,

      res => {
        if (res.status) {
          setupcomingEvents(res.events);

          // setrequestCount(res.follow_requests);
        }
        setisLoading(false);
      },
      err => {
        setisLoading(false);
        console.log(err);
      },
    );
  };

  const getSearchEvents = () => {
    setisLoading(true);

    let config = {
      url: ApiUrl.organizerEvents,
      method: 'post',
      body: {
        search: search,
      },
    };

    APIRequest(
      config,

      res => {
        if (res.status) {
          setupcomingEvents(res.events);
        }
        setisLoading(false);
      },
      err => {
        setisLoading(false);
        console.log(err);
      },
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.btnBlue }}>
      <StatusBar barStyle={'light-content'} backgroundColor={color.btnBlue} />
      <View>
        <View style={{ backgroundColor: color.btnBlue }}>
          <View style={{ backgroundColor: color.btnBlue }}>
            {appReady && <Loader type="dots" isLoading={isLoading} />}
            <View
              style={{
                flexDirection: 'row',
                marginTop: Platform.OS == 'ios' ? 0 : 10,
                paddingLeft: wp(7),
                paddingRight: wp(4),
                justifyContent: 'space-between',
              }}>
              <Text style={style.heading}>Lybertine </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('MyProfile')}>
                {avatar ? (
                  <Image
                    source={{ uri: `${IMAGEURL}/${avatar}` }}
                    style={style.userProfile}
                  />
                ) : (
                  <Image source={IMAGE.chatgirl} style={style.userProfile} />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <StoryList navigation={navigation} storyBackGroundColor={color.btnBlue} headerFontColor={"themeColor"} />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ backgroundColor: color.btnBlue }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginHorizontal: '3%',
                  marginBottom: hp(2),
                }}>
                <View style={style.input}>
                  <View style={{ position: 'absolute', left: wp(3) }}>
                    <TouchableOpacity onPress={() => getSearchEvents()}>
                      <Image
                        source={IMAGE.search2}
                        style={{ height: 20, width: 20, resizeMode: 'contain' }}
                      />
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    onSubmitEditing={() => getSearchEvents()}
                    style={{ paddingVertical: 0, color: color.textGray2 }}
                    onChangeText={setSearch}
                    placeholder="Search"
                    placeholderTextColor={'gray'}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('filterScreen')}
                  style={{
                    height: 50,
                    width: 50,
                    borderRadius: 5,
                    backgroundColor: color.lightGray,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image source={IMAGE.filterList} style={style.filterImage} />
                </TouchableOpacity>
              </View>

              {/* <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: '3%',
                marginTop: '8%',
                marginBottom: '3%',
                alignItems: 'center',
              }}>
              <View style={style.popularContainer}>
                <Text style={style.popularText}>Featured Events</Text>
                <Image
                  source={IMAGE.fire}
                  style={{height: 27, width: 27, resizeMode: 'contain'}}
                />
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate('featuredEvent')}>
                <Text style={style.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View> */}
            </View>
          </ScrollView>
        </View>
        {/* <View
        style={{
          backgroundColor: '#191926',
          height: 70,
          width: '100%',
          marginBottom: '-14%',
        }}></View> */}
      </View>
      <ScrollView style={{ backgroundColor: color.white }}>

      {upcomingEvents.length > 0 ?<View
          style={{
            paddingHorizontal: 10,
            height: 100,
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: color.white,
          }}>
          <View style={style.popularContainer}>
            <Text style={[style.popularText, { color: color.black }]}>My Events</Text>
            {/* <Image
              source={IMAGE.fire}
              style={{height: 27, width: 27, resizeMode: 'contain',marginTop:"2%"}}
            /> */}
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('seeAllEventOrg', {
                category: '',
                date: '',
                price: '',
                country: '',
                city: '',
                input: '',
              })
            }>
            <Text style={style.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>:null}

        <View
          style={{
            backgroundColor: color.white,
            paddingHorizontal: 10,
            marginTop: -50,
          }}>
          {upcomingEvents.length > 0 ? <FlatList
            data={upcomingEvents}
            renderItem={({ item: d }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('eventDetailsOrg', { event_id: d.id })
                }
                style={style.cardContainer}>
                <Image
                  source={{ uri: `${IMAGEURL}/${d.thumbnail}` }}
                  style={{
                    width: '98%',
                    height: "98%",
                    resizeMode: 'contain',
                    alignSelf: 'center',
                    borderRadius: 10,

                  }}
                />
                <View style={{ position: 'absolute', left: 10, bottom: 20 }}>
                  <Text
                    style={[
                      style.headingText,
                      { color: '#fff', fontWeight: 'bold' },
                    ]}
                    numberOfLines={1}>
                    {d.title}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('eventDetailsOrg', { event_id: d.id })
                    }
                    style={{
                      marginTop: 10,
                      backgroundColor: color.btnBlue,
                      borderRadius: 20,
                      width: 70,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{ color: '#fff', fontSize: 14, paddingVertical: 4 }}>
                      Details
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          //Setting the number of column
          /> :
            <NoRecord
              image={IMAGE.noConversation}
              title="No Event found"
              description="You will get Upcoming and poular events here."
              showButton={false}
            />
          }
        </View>
      </ScrollView>

    </SafeAreaView>
  );
};

const style = StyleSheet.create({
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
    opacity: 1,
    backgroundColor: '#F5F6F8',
    height: 50,
    width: wp(80),
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
    fontSize: 14,
    fontFamily: fontFamily.Regular

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
    paddingHorizontal: 8,
    paddingVertical: 1,
    backgroundColor: color.btnBlue,
    borderRadius: 60,
    marginRight: wp(1),
    overflow: 'hidden',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontFamily: fontFamily.Regular,
    color: color.white,
  },
  time: {
    fontSize: 8,
    fontFamily: fontFamily.Semibold,
    color: color.black,
  },
  chatname: {
    fontSize: 14,
    fontFamily: fontFamily.Bold,
    color: color.black,
  },
  msg: {
    fontSize: 12,
    fontFamily: fontFamily.Thin,
    color: color.textGray2,
  },

  heading: {
    fontSize: 25,
    fontFamily: fontFamily.Bold,
    color: color.white,
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
    overflow: 'hidden',
    borderColor: color.lightSlaty,
  },
  imgBox: {
    borderRadius: 120,
    height: 52,
    width: 50.5,
    resizeMode: 'cover',
  },
  dots: {
    height: 12,
    width: 12,
    resizeMode: 'contain',
  },
  card: {},

  bodySection: {},
  chatView: {
    paddingRight: wp(5),
    paddingVertical: hp(1.5),
    flex: 1,
    marginLeft: wp(3),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomWidth: 0.4,
    borderColor: color.textGray2,
  },
  backContainer: {
    backgroundColor: '#191926',
  },
  popularText: {
    fontSize: 18,
    fontFamily: fontFamily.Bold,
    color: color.black,
    marginLeft: '5%',
    marginBottom: '5%',
    marginTop: '2%',
  },
  popularText1: {
    fontSize: 22,
    fontFamily: fontFamily.Bold,
    color: color.iconGray,
    marginRight: '2%',
  },
  popularContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: '4%',
    // marginHorizontal:"5%"
  },
  filterText: {
    fontSize: 16,
    fontFamily: fontFamily.Regular,
    color: color.iconGray,
  },
  cardContainer: {
    width: '95%',
    height: 160,
    borderRadius: 10,
    margin: '1.5%',
    backgroundColor: '#fff',
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  headingText: {
    fontSize: 16,
    fontFamily: fontFamily.Bold,
    color: color.black,
  },
  dateText: {
    fontSize: 11,
    fontFamily: fontFamily.Light,
    color: '#8E8E93',
  },
  filterImage: {
    height: 24,
    height: 15,
    resizeMode: 'contain',
  },
  seeAllText: {
    fontSize: 15,
    fontFamily: fontFamily.Medium,
    color: color.chatRight,
    marginRight: '4%',
    marginTop: '24%',
    color: color.btnBlue,
  },
  buttonText: {
    fontSize: 13,
    fontFamily: fontFamily.Medium,
    color: color.white,
  },
  bookButton: {
    height: 40,
    width: 100,
    borderRadius: 20,
    backgroundColor: color.chatRight,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: '5%',
  },
});
export default EventListOrganiser;
