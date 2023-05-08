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
  Platform,
  SafeAreaView,
} from 'react-native';
import { IMAGE, color, fontFamily, fontSize } from '../../constant';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { StoryList } from '../../component';
import { APIRequest, ApiUrl, IMAGEURL } from '../../utils/api';
import { useIsFocused } from '@react-navigation/native';
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
import { Rating, AirbnbRating } from 'react-native-ratings';
import EducationListItem from './educationListItem';
import HtmlToText from '../../utils/HtmlToText';

const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;



const EducationList = ({ navigation }) => {
  const { setLogin } = useContext(LoginContext);
  const [search, setSearch] = useState('');
  const [isLoading, setisLoading] = useState(true);
  const [status, setstatus] = useState(false);
  const [Course, setCourse] = useState([])
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
    setSearch('');
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
  }, []);

  // Get Event List
  const getEvents = (text) => {
    let config = {
      url: ApiUrl.educationList,
      method: 'post',
      body: {
        search: text ? text : '',
      },
    };
    APIRequest(
      config,
      res => {
        setCourse(res)
        setstatus(true);
        setisLoading(false);
      },
      err => {
        setisLoading(false);
        console.log(err);
      },
    );
  };

  // Render Education list item component
  const renderEventBox = (item, type) => {
    return (
      <EducationListItem item={item} type={type} />
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
      }, 50);
    };
  };

  const handleSearchChange = (text) => {
    getEvents(text);
  }



  const optimizedFn = useCallback(debounce(handleSearchChange), []);

  return (
    // <KeyboardAwareScrollView bounces={false}  keyboardShouldPersistTaps={true}>
      <SafeAreaView style={style.container}>
      <StatusBar barStyle={'light-content'} backgroundColor={color.btnBlue} />
        <View>
          <View>
            <View>
              <View
                style={style.headerBox}>
                <Text style={style.heading}>Lybertine</Text>
                <UserProfileImage />
              </View>
            </View>
            <StoryList storyBackGroundColor={color.btnBlue} navigation={navigation} headerFontColor={"themeColor"} />
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>
              <View style={{ backgroundColor: color.btnBlue }}>
                <View
                  style={style.searchBox}>
                  <View style={style.input}>
                    <View style={style.searchIconBox}>
                      <TouchableOpacity onPress={() => getEvents()}>
                        <Image
                          source={IMAGE.search2}
                          style={style.searchIcon}
                        />
                      </TouchableOpacity>
                    </View>
                    <TextInput
                      onSubmitEditing={() => getEvents()}
                      style={style.search}
                      onChangeText={text => {
                        setisLoading(true)
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
                        style={style.timeIconBox}>
                        <Icon
                          name={'times'}
                          style={style.timeIcon}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('filterScreenEducation')
                    }
                    style={style.filterImageBox}>
                    <Image source={IMAGE.filterList} style={style.filterImage} />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>

        </View>

        <View style={{ zIndex: -10, backgroundColor: color.background, flex:1 }}>
          {isLoading ? (
            <View
              style={style.listContainer}>
              <SectionTitleWithBtn />
              <FlatList
                // keyExtractor={index => `featuredEvents-${index}`}
                showsVerticalScrollIndicator={false}
                data={[0, 1, 2, 3, 4, 6]}
                numColumns={2}
                renderItem={() => (
                  <EventListSkelton />
                )}
              />
            </View>
          ) : (
            <ScrollView
              // style={{
              //   backgroundColor: color.background,
              //   flex:1
              // }}
            >
              {(status && (Course?.data?.featured.length > 0 || Course?.data?.top_selling.length > 0 || Course?.data?.live_conferences.length > 0)) ? (
                <>
                  {Course?.data?.featured.length > 0 ? <View
                    style={style.listCategoryBox}>
                    <View style={[style.popularContainer, { marginTop: 10 }]}>
                      <Text style={style.popularText}>Featured</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('educationShowAll', {
                          filter_type: 'featured',
                          title: 'Featured',
                        })
                      }>
                      <Text style={style.seeAllText}>See all</Text>
                    </TouchableOpacity>
                  </View> : null}
                  <View style={style.listItem}>
                    <FlatList
                      data={Course?.data?.featured}
                      reload={getEvents}
                      
                      renderItem={({ item, index }) => renderEventBox(item, index)}
                      keyExtractor={item => `upcomingEvents-${item.id}`}
                      //Setting the number of column
                      numColumns={2}
                    />
                  </View>
                  {Course?.data?.top_selling.length > 0 ? <View
                    style={style.listCategoryBox}>
                    <View style={style.popularContainer}>
                      <Text style={style.popularText}>Top selling</Text>
                    </View>

                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('educationShowAll', {
                          filter_type: 'top_selling',
                          title: 'Top selling',
                        })
                      }>
                      <Text style={style.seeAllText}>See all</Text>
                    </TouchableOpacity>
                  </View> : null}
                  <View style={style.listItem}>
                    <FlatList
                      data={Course?.data?.top_selling}
                      
                      renderItem={({ item, index }) => renderEventBox(item, index)}
                      keyExtractor={item => `featuredEventsTop-${item.id}`}
                      //Setting the number of column
                      numColumns={2}
                    />
                  </View>
                  {Course?.data?.live_conferences.length > 0 ? <View
                    style={style.listCategoryBox}>
                    <View style={style.popularContainer}>
                      <Text style={style.popularText}>Live conferences</Text>
                    </View>

                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('educationShowAll', {
                          filter_type: 'live',
                          title: 'Live conferences',
                        })
                      }>
                      <Text style={style.seeAllText}>See all</Text>
                    </TouchableOpacity>    
                  </View> : null}
                  <View style={style.listItem}>
                    <FlatList
                      data={Course?.data?.live_conferences}
                      
                      renderItem={({ item, index }) => renderEventBox(item, index)}
                      // keyExtractor={index => `featuredEventsconferences-${index}`}
                      keyExtractor={item => `featuredEventsconferences-${item.id}`}
                      //Setting the number of column
                      numColumns={2}
                    />
                  </View>
                </>
              ) : (
                <View>
                <NoRecord
                  image={IMAGE.noConversation}
                  title="No Courses found"
                  description="You will get Featured and Live conferences Courses here."
                  showButton={false}
                />
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    // </KeyboardAwareScrollView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.btnBlue
  },
  headerBox: {
    flexDirection: 'row',
    marginTop: Platform.OS == 'ios' ? '4%' : 10,
    paddingLeft: wp(7),
    paddingRight: wp(4),
    justifyContent: 'space-between',
  },
  searchBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: '3%',
    marginBottom: hp(2),
  },
  searchIconBox: {
    position: 'absolute',
    left: wp(3)
  },
  timeIconBox: {
    position: 'absolute',
    right: wp(5)
  },
  timeIcon: {
    fontSize: 15,
    color: color.iconGray
  },
  filterImageBox: {
    height: 50,
    width: 50,
    borderRadius: 5,
    backgroundColor: color.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: color.white,
  },
  listCategoryBox: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: color.lightGray,
    marginTop:10
  },
  listItem: {
    backgroundColor: color.lightGray,
    paddingHorizontal: 10
  },
  searchIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain'
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
  heading: {
    fontSize: 25,
    fontFamily: fontFamily.Bold,
    color: color.white,
  },
  popularText: {
    fontSize: fontSize.size19,
    fontFamily: fontFamily.Bold,
    color: color.black,
    marginLeft: '5%',
    marginBottom: '5%',
    marginTop: '2%',
  },

  popularContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // marginHorizontal:"5%"
  },
  title: {
    fontSize: Platform.OS == 'ios' ? 13 : 13,
    fontFamily: fontFamily.Bold,
    color: color.black,
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
  ratingNumber: {
    color: "#E59819",
    fontSize: Platform.OS == 'ios' ? 15 : 16,
    fontFamily: fontFamily.Bold,
  },
  totleRating: {
    color: "#8E8E93",
    fontSize: Platform.OS == 'ios' ? 13 : 13,
  },
});
export default EducationList;
