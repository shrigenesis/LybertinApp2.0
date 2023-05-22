/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect, FC, useContext } from 'react';
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
  Dimensions,
  Platform,
  BackHandler,
  SafeAreaView,
  Alert,
} from 'react-native';
import { IMAGE, color, fontFamily, fontSize } from '../../constant';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { StoryList } from '../../component';
import { APIRequest, ApiUrl, IMAGEURL } from '../../utils/api';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import { User } from '../../utils/user';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LoginContext } from '../../context/LoginContext';
import axios from 'axios';
import NoRecord from './noRecord';
import EventListSkelton from '../../utils/skeltons/eventListSkelton';
import SectionTitleWithBtn from '../../utils/skeltons/sectionTitleWithBtn';
import UserProfileImage from '../../component/userProfileImage';
import { useCallback } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Search from './search';
import FocusAwareStatusBar from '../../utils/FocusAwareStatusBar';

const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;


const EventList = ({ navigation }) => {
  const { setLogin } = useContext(LoginContext);
  const [search, setSearch] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [upcomingEvents, setupcomingEvents] = useState([]);
  const [featuredEvents, setfeaturedEvent] = useState([]);
  const [topSellingEvents, settopSellingEvents] = useState([]);
  const [category, setcategory] = useState([]);
  const [price, setprice] = useState([]);
  const [status, setstatus] = useState('');
  const isFocus = useIsFocused();
  function handleBackButtonClick() {
    setSearch('');
    navigation.goBack();
    return true;
  }

  useEffect(() => {
    if (isFocus) {
      setTimeout(() => {
        getEvents('');
      });
    }
  }, [isFocus])
  
  useEffect(() => {
    getEvents('');
    axios.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        if (error?.response?.status === 401) {
          new User().clearAllUserData();
          setLogin(false);
        }
        else {
          return Promise.reject(error);
        }
      },
    );
  }, [])

  // useEffect(() => {
  //   BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
  //   if (isFocus) {
  //     setSearch('');
  //     getEvents('');
  //     axios.interceptors.response.use(
  //       response => {
  //         return response;
  //       },
  //       error => {
  //         if (error?.response?.status === 401) {
  //           new User().clearAllUserData();
  //           setLogin(false);
  //         }
  //         else {
  //           return Promise.reject(error);
  //         }
  //       },
  //     );
  //   }
  //   return () => {
  //     BackHandler.removeEventListener(
  //       'hardwareBackPress',
  //       handleBackButtonClick,
  //     );
  //   };
  // }, [isFocus]);



  const getEvents = (text) => {
    setisLoading(true);
    let config = {
      url: ApiUrl.eventIndex,
      method: 'post',
      body: {
        search: text ? text : '',
      },
    };
    APIRequest(
      config,

      res => {
        setisLoading(false)
        if (res.status) {
          setupcomingEvents(res.data.upcomming_events);
          setfeaturedEvent(res.data.featured_events);
          settopSellingEvents(res.data.top_selling_events);
          setcategory(res.data.filters.categories);
          setprice(res.data.filters.prices);
          setstatus('true');
          // alert(status);

          // setrequestCount(res.follow_requests);
        } else {
          setstatus('false');
          // alert('--',status);
        }
      },
      err => {
        setisLoading(false);
        console.log(err);
      },
    );
  };

  useEffect(() => {
    return () => {
      setSearch('');
      setisLoading(false);
      setupcomingEvents([]);
      setfeaturedEvent([]);
      settopSellingEvents([]);
      setcategory([]);
      setprice([]);
      setstatus('');
    }
  }, [])

  const renderEventBox = (item, index) => {
    return (
      <View
        style={[
          style.cardContainer,
          { margin: 5, padding: 5, flex: 1 },
        ]}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('eventDetails', { event_id: item.id })
          }>
          <View style={{ flexDirection: 'column' }}>
            <Image
              source={{ uri: `${IMAGEURL}/${item.thumbnail}` }}
              style={{
                height: Dimensions.get('window').width / 3,
                width: '100%',
                alignContent: 'stretch',
                resizeMode: 'stretch',
                alignSelf: 'center',
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            />

            <Text style={style.headingText} numberOfLines={1}>
              {item.title}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                marginTop: 5,
                marginLeft: 5,
              }}>
              <Image
                source={IMAGE.date}
                style={{
                  height: 12,
                  width: 12,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                  tintColor: '#0F1828D9',
                }}
              />
              <Text style={[style.dateText, { marginLeft: 5 }]}>
                {item.start_date} to {item.end_date}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 5,
                marginTop: 5,
              }}>
              <Image
                source={IMAGE.location}
                style={{
                  height: 12,
                  width: 12,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                  tintColor: '#0F1828D9',
                }}
              />
              <Text style={[style.dateText, { marginLeft: 5 }]}>
                {item.city}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                margin: 5,
              }}>
              <Image
                source={IMAGE.time}
                style={{
                  height: 12,
                  width: 12,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                  tintColor: '#0F1828D9',
                }}
              />
              <Text style={[style.dateText, { marginLeft: 5 }]}>
                {item.start_time} - {item.end_time}
              </Text>
            </View>
          </View>
        </TouchableOpacity >
      </View >
    )
  };

  const debounce = func => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 100);
    };
  };

  const handleSearchChange = (text) => {
    getEvents(text);
  }

  const optimizedFn = useCallback(debounce(handleSearchChange), [search]);

  return (
    // <KeyboardAwareScrollView bounces={false} keyboardShouldPersistTaps={true}>
      <SafeAreaView style={{ flex: 1, backgroundColor: color.btnBlue }}>
        <FocusAwareStatusBar
        barStyle={'light-content'} 
        backgroundColor={color.btnBlue}
         />
         
        {/* <View style={style.appBar} />
        <View style={style.content} /> */}
        <View>
          <View style={{ backgroundColor: color.btnBlue }}>
            <View style={{ backgroundColor: color.btnBlue }}>
              {/* {appReady && <Loader type="dots" isLoading={isLoading} />} */}
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: Platform.OS == 'ios' ? '4%' : 10,
                  paddingLeft: wp(7),
                  paddingRight: wp(4),
                  justifyContent: 'space-between',
                }}>
                <Text style={style.heading}>Lybertine</Text>
                <UserProfileImage />
              </View>
            </View>
            <StoryList navigation={navigation} storyBackGroundColor={color.btnBlue} headerFontColor={"themeColor"} />
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>
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
                      <TouchableOpacity onPress={() => getEvents()}>
                        <Image
                          source={IMAGE.search2}
                          style={{ height: 20, width: 20, resizeMode: 'contain' }}
                        />
                      </TouchableOpacity>
                    </View>
                    <TextInput
                      onSubmitEditing={() => getEvents()}
                      style={style.search}
                      onChangeText={text => {
                        setSearch(text);
                        optimizedFn(text);
                      }}
                      value={search}
                      placeholder="Search"
                      placeholderTextColor={'gray'}
                    />
                    {search !== '' && (
                      <TouchableOpacity
                        onPress={() => {
                          setSearch('');
                          getEvents('')
                        }}
                        style={{ position: 'absolute', right: wp(5) }}>
                        <Icon
                          name={'times'}
                          style={{ fontSize: 15, color: color.iconGray }}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('filterScreen', {
                        category: category,
                        price: price,
                      })
                    }
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
              </View>
            </ScrollView>
          </View>

        </View>

        <ScrollView style={{ zIndex: -10, backgroundColor: '#fff', flex:1 }}>
          {isLoading ? (
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 20,
                backgroundColor: color.white
              }}>
              <SectionTitleWithBtn />
              <FlatList
                showsVerticalScrollIndicator={false}
                data={[0, 1, 2, 3, 4, 6]}
                numColumns={2}
                renderItem={() => (
                  <EventListSkelton />
                )}
              />
            </View>
          ) : (
            <>
              {status == 'true' ? (
                <View style={{backgroundColor:color.lightGray}}>
                  {upcomingEvents.length > 0 ?
                    <>
                      <View
                        style={style.listCategoryBox}>
                        <View style={[style.popularContainer, { marginTop: 10 }]}>
                          <Text style={style.popularText}>Upcoming Events</Text>
                        </View>

                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('popularEvent', {
                              filter_type: 'upcomming_events ',
                              title: 'Upcoming Events',
                            })
                          }>
                          <Text style={style.seeAllText}>See all</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{ backgroundColor: color.lightGray, paddingHorizontal: 10 }}>
                        <FlatList
                          data={upcomingEvents}
                          renderItem={({ item, index }) => renderEventBox(item, index)}
                          //Setting the number of column
                          numColumns={2}
                        />
                      </View>
                    </> : null}

                  {featuredEvents.length > 0 ?
                    <>
                      <View
                        style={style.listCategoryBox}>
                        <View style={style.popularContainer}>
                          <Text style={style.popularText}>Featured Events</Text>
                        </View>

                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('popularEvent', {
                              filter_type: 'featured_events ',
                              title: 'Featured Events',
                            })
                          }>
                          <Text style={style.seeAllText}>See all</Text>
                        </TouchableOpacity>
                      </View>

                      <View style={{ backgroundColor: color.lightGray, paddingHorizontal: 10 }}>
                        <FlatList
                          data={featuredEvents}
                          renderItem={({ item, index }) => renderEventBox(item, index)}
                          //Setting the number of column
                          numColumns={2}
                        />
                      </View>
                    </> : null}
                  {topSellingEvents.length > 0 ?
                    <>
                      <View
                        style={style.listCategoryBox}>
                        <View style={style.popularContainer}>
                          <Text style={style.popularText}>Top Selling Events</Text>
                        </View>

                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('popularEvent', {
                              filter_type: 'top_selling_events ',
                              title: 'Top Selling Events',
                            })
                          }>
                          <Text style={style.seeAllText}>See all</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{ backgroundColor: color.lightGray, paddingHorizontal: 10 }}>
                        <FlatList
                          data={topSellingEvents}
                          renderItem={({ item, index }) => renderEventBox(item, index)}
                          //Setting the number of column
                          numColumns={2}
                        />
                      </View>
                    </> : null}

                </View>
              ) : ( 
                <View >
                <NoRecord
                  image={IMAGE.noConversation}
                  title="No Event found"
                  description="You will get Upcoming and poular events here."
                  showButton={false}
                />
                </View>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    // </KeyboardAwareScrollView>
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

  search: {
    // placeholderTextColor: color.borderGray,
    ...Platform.select({
      ios: {

      },
      android: {

      },
    }),
  },
  input: {
    opacity: 1,
    backgroundColor: '#F5F6F8',
    height: 50,
    width: wp(79),
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
    backgroundColor: color.btnBlue,
  },
  popularText: {
    fontSize: fontSize.size19,
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
    // marginHorizontal:"5%"
  },
  filterText: {
    fontSize: 16,
    fontFamily: fontFamily.Regular,
    color: color.iconGray,
  },
  cardContainer: {
    width: '47%',
    maxWidth: '47%',
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  headingText: {
    fontSize: Platform.OS == 'ios' ? 18 : 15,
    fontFamily: fontFamily.Bold,
    color: color.black,
    marginLeft: '4%',
    marginTop: '6%',
  },
  dateText: {
    fontSize: Platform.OS == 'ios' ? 13 : 11,
    fontFamily: fontFamily.Light,
    color: '#0F1828D9',
  },
  filterImage: {
    height: 24,
    height: 15,
    resizeMode: 'contain',
  },
  seeAllText: {
    fontSize: 15,
    fontFamily: fontFamily.Regular,
    color: color.btnBlue,
    marginRight: '4%',
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
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  appBar: {
    backgroundColor: '#79B45D',
    height: APPBAR_HEIGHT,
    marginTop: '-12%',
  },
  content: {
    flex: 1,
    backgroundColor: '#33373B',
  },
  listCategoryBox: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: color.lightGray,
    paddingTop: 10
  }
});
export default EventList;
