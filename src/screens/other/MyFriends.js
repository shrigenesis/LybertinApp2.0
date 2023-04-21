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
  Alert,
  SafeAreaView,
} from 'react-native';
import { IMAGE, color, fontFamily } from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Toast from 'react-native-toast-message';
import { RippleTouchable, Header, Button } from '../../component/';
import Loader from '../../component/loader';
import { useIsFocused } from '@react-navigation/native';
import { APIRequest, ApiUrl, IMAGEURL } from './../../utils/api';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { User } from '../../utils/user';
import { LoginContext } from './../../context/LoginContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import NoRecord from './noRecord';

const MyFriends = ({ navigation, route }) => {
  const menu = [
    {
      label: 'Personal',
      subMenu: [
        { label: 'Profile', navigation: 'EditProfile', icon: IMAGE.profile },
        { label: 'Blocklist', icon: IMAGE.unfriend, navigation: 'Blocklist' },
        { label: 'My Friends', icon: IMAGE.myFriend, navigation: '' },
      ],
    },
    {
      label: 'General',
      subMenu: [
        { label: 'Help', icon: IMAGE.help },
        { label: 'About', icon: IMAGE.about },
        { label: 'Tell a Friend', icon: IMAGE.tall_friends },
        { label: 'Logout', icon: IMAGE.block },
      ],
    },
  ];
  const [isLoading, setisLoading] = useState(true);
  const userdata = new User().getuserdata();
  const isFocus = useIsFocused();
  const [friends, setfriends] = useState([]);
  useEffect(() => {
    getfriends();
  }, []);

  const unfreind = item => {
    // this.setState({isLoading: true});
    setisLoading(true);
    let config = {
      url: ApiUrl.unfollow,
      method: 'post',
      body: {
        user_id: item.id,
      },
    };

    APIRequest(
      config,
      res => {
        setisLoading(false);
        getfriends();
        Toast.show({
          type: 'success',
          text1: res.message
        });
        console.log('Api response unfriend===', res);
      },
      err => {
        setisLoading(false);

        // this.setState({isLoading: false});
        console.log(err?.response?.data);
      },
    );
  };

  const getfriends = () => {
    setisLoading(true);

    // alert("getfriend called")
    // this.setState({isLoading: true});
    let config = {
      url: ApiUrl.friendList,
      method: 'get',
    };

    APIRequest(
      config,
      res => {
        setisLoading(false);

        setfriends(res?.friends);
      },
      err => {
        setisLoading(false);

        // this.setState({isLoading: false});
        console.log(err?.response?.data);
      },
    );
  };

  return (
    <SafeAreaView style={style.safeArea}>
      <View style={{ flex: 1, backgroundColor: color.white }}>
        <StatusBar barStyle={'dark-content'} backgroundColor={color.lightGray} />
        <Header
          title={'My Friends'}
          headStyle={{backgroundColor: color.lightGray}} 
        />

        <ScrollView style={{paddingTop:30}}>
          <Loader isLoading={isLoading} type={'dots'} />

          {friends.length > 0 ? (
            <>
              {friends?.map(item => (
                <RippleTouchable
                  onPress={() =>
                    navigation.navigate('UserProfile', { data: item })
                  }
                  style={style.cardBlock}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                      source={{ uri: `${IMAGEURL}/${item.avatar}` }}
                      style={style.icon}
                    />
                    <Text style={style.cardText}>{item.name}</Text>
                  </View>
                  <Text
                    style={{ color: 'red' }}
                    onPress={() => {
                      Alert.alert(
                        'Alert',
                        'Are you sure you want to unfriend?',
                        [
                          {
                            text: 'NO',
                            onPress: () => null,
                            style: 'Cancel',
                          },
                          {
                            text: 'YES',
                            onPress: () => [unfreind(item)],
                          },
                        ],
                      );
                    }}

                  // unfreind(item)
                  >
                    Unfriend
                  </Text>
                </RippleTouchable>
              ))}
            </>

          ) : (
            <>
              {!isLoading && (
                <NoRecord
                  image={IMAGE.noFriends}
                  title="No friends"
                  description="You have not added anyone to the list. Get started by adding friends."
                  showButton={false}
                />
              )}
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  safeArea: {
      flex: 1,
      backgroundColor: color.white
  },
  // icon: {
  //   resizeMode: 'contain',
  //   height: 30,
  //   width: 30,
  // },
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
    fontSize: 16,
    fontFamily: fontFamily.Medium,
    color: color.black,
  },
  icon: {
    // tintColor: color.whi,
    resizeMode: 'contain',
    height: 40,
    width: 40,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: color.borderGray,
  },
  icon1: {
    // tintColor:color.black,
    resizeMode: 'contain',
    height: 22,
    width: 22,
  },
  cardText: {
    paddingLeft: wp(3),
    fontSize: 15,
    fontFamily: fontFamily.Regular,
    color: color.black,
  },
  cardBlock2: {
    marginLeft: wp(10),
    paddingRight: wp(7),
    paddingVertical: hp(3),
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: color.borderGray,
  },
  cardBlock: {
    marginBottom: 2,
    backgroundColor: color.white,
    paddingLeft: wp(6),
    paddingRight: wp(6),
    paddingVertical: hp(2),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: color.lightGray,
    borderBottomWidth:1,
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
    fontSize: 10,
    fontFamily: fontFamily.Light,
    color: color.textGray2,
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
    top: hp(1),
  },
});
export default MyFriends;
