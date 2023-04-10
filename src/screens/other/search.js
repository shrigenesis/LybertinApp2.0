/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useState, useEffect, useCallback, FC} from 'react';
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
import {IMAGE, color, fontFamily} from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RippleTouchable, Header} from '../../component/';
import Icon from 'react-native-vector-icons/FontAwesome';
import {APIRequest, ApiUrl, IMAGEURL, Toast} from './../../utils/api';
import {useIsFocused} from '@react-navigation/native';
import {User} from '../../utils/user';
import moment from 'moment';
import NoRecord from './noRecord';

const Search = ({navigation, route}) => {
  const [searchList, setsearchList] = useState([]);
  const [search, setSearch] = useState('');

  const focus = useIsFocused();
  useEffect(() => {
    if (focus && route?.params?.search) {
      setSearch(route?.params?.search);
      searchfilter(route?.params?.search);
    }
  }, [focus]);

  const searchfilter = text => {
    if (typeof text === undefined || text == null || text == '' ) {
      return setsearchList([]);
    }
    let config = {
      url: route?.params?.isGroupSearch ? ApiUrl.groupList : ApiUrl?.search,
      method: 'post',
      body: {
        search: text,
      },
    };

    APIRequest(
      config,

      res => {
        if (res.status) {
          route?.params?.isGroupSearch
            ? setsearchList(res.conversations)
            : setsearchList(res.users);
        } else {
          setsearchList([]);
        }
      },
      err => {
        console.log(err);
      },
    );
  };

  const _renderGroupList = (item, navigation) => {
    const userdata = new User().getuserdata();
    let receiverId =
      userdata?.id == item?.from_id ? item?.from_id : userdata?.id;
    return (
      <RippleTouchable
        onPress={() =>
          navigation.navigate('GroupChat', {
            group_id: item?.group?.id,
            user_id: receiverId,
            groupType: item?.group.group_type,
            mediaPrivacy: item?.group?.media_privacy,
            privacy: item?.group.privacy,
            isAdmin: item?.is_admin,
          })
        }>
        <View>
          <View style={style.listWrapper}>
            <View style={style.imgview}>
              <Image
                source={{uri: `${IMAGEURL}/${item?.group?.photo_url}`}}
                style={style.imgBox}
              />
            </View>
            <View style={style.search}>
              <Text style={style.name}>{item?.group?.name}</Text>
            </View>
          </View>
        </View>
      </RippleTouchable>
    );
  };

  const _renderRequestList = (item, index) => {
    return (
      <RippleTouchable
        onPress={() => {
          navigation.navigate('UserProfile', {data: item});
        }}>
        <View>
          <View style={style.listWrapper}>
            <View style={style.imgview}>
              <Image
                source={{uri: `${IMAGEURL}/${item.avatar}`}}
                style={style.imgBox}
              />
            </View>
            <View style={style.search}>
              <Text style={style.name}>{item.name}</Text>
            </View>
          </View>
        </View>
      </RippleTouchable>
    );
  };

  const debounce = func => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 800);
    };
  };
  const handleChange = text => {
    searchfilter(text);
  };
  const optimizedFn = useCallback(debounce(handleChange), []);


  return (
    <View style={{flex: 1, backgroundColor: color.white}}>
      <StatusBar barStyle={'dark-content'} backgroundColor={color.white} />
      <View style={{flex: 1}}>
        <View style={style.searchView}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name={'angle-left'}
              style={{fontSize: 30, color: color.black}}
            />
          </TouchableOpacity>
          <View style={style.input}>
            <View style={{position: 'absolute', left: wp(3)}}>
              <Image
                source={IMAGE.search}
                style={{height: 15, width: 15, resizeMode: 'contain'}}
              />
            </View>
            <TextInput
              autoFocus
              onChangeText={text => {
                setSearch(text);
                optimizedFn(text);
              }}
              value={search}
              style={{padding: 0, paddingLeft: 5, color: color.textGray2}}
              onSubmitEditing={() => {
                search && searchfilter(search);
              }}
              placeholder="Username, Name or Email"
              placeholderTextColor={'lightgray'}
            />
            {/* </View> */}
            {search == '' ? (
              <Text style={{marginTop: '-5%'}}></Text>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setSearch('');
                  searchfilter();
                }}
                style={{position: 'absolute', right: wp(5)}}>
                <Icon
                  name={'times'}
                  style={{fontSize: 15, color: color.iconGray}}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {searchList?.length > 0 ? (
          <View style={style.bodySection}>
            <FlatList
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item?.id}
              data={searchList}
              contentContainerStyle={{marginBottom: hp(25)}}
              renderItem={({item, index}) =>
                route?.params?.isGroupSearch === true
                  ? _renderGroupList(item, navigation)
                  : _renderRequestList(item, index)
              }
            />
          </View>
        ) : (
          <>
          {search?.length > 0 && (

            <NoRecord
              image={
                route?.params?.isGroupSearch ? IMAGE?.noGroup : IMAGE?.noFriends
              }
              title={`${route?.params?.isGroupSearch  ? 'No group found' : 'No user found'} `}
              description=""
              buttonText="Create a group"
              navigation={navigation}
              navigateTo={'GroupChat'}
              showButton={false}
            />
          )}
          </>
        )}
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  searchView: {
    marginTop: Platform.OS == 'ios' ? hp(6) : 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(6),
    alignItems: 'center',
  },
  input: {
    opacity: 1,
    backgroundColor: '#F5F6F8',
    height: hp(4.5),
    width: wp(80),
    alignSelf: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: '#92A0B1',
    paddingLeft: wp(8),
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(4),
    width: wp(35),
    borderRadius: 2,
    backgroundColor: color.btnBlue,
  },
  name: {
    fontSize: 14,
    fontFamily: fontFamily.Bold,
    color: color.black,
  },
  btnText: {
    fontSize: 13,
    fontFamily: fontFamily.Regular,
    color: color.white,
  },
  imgview: {
    overflow: 'hidden',
    borderColor: color.lightSlaty,
    marginTop: 10,
  },
  listWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 5,
    // justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: color.borderGray,
  },
  imgBox: {
    borderRadius: 120,
    height: 50,
    width: 50,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: color.borderGray,
  },

  bodySection: {
    // marginTop:10,
  },
  search: {
    paddingRight: wp(5),
    flex: 1,
    marginLeft: wp(3),
    borderBottomWidth: 0.4,
    borderColor: color.lightSlaty,
  },
  imgview1: {
    // overflow: 'hidden',
    borderColor: color.borderGray,
    borderWidth: 2,
    borderRadius: 120,
    position: 'relative',
    marginRight: wp(2),
  },
});
export default Search;
