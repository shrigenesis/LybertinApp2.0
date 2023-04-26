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
  SafeAreaView,
} from 'react-native';
import {IMAGE, color, fontFamily} from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RippleTouchable, Header, Radio, Button, Loader} from '../../component/';
// import Loader from '../../component/loader';
import {useIsFocused} from '@react-navigation/native';
import {
  APIRequest,
  ApiUrl,
  APIRequestWithFile,
  IMAGEURL,
} from './../../utils/api';
import Toast from 'react-native-toast-message';
import {pickImage} from '../../component/';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/FontAwesome';


export const RenderBottomSheet = memo(
  ({setCover, setProfile, type, bottomSheetRef, snapPoints, file}) => {
    return (
      <BottomSheet
        ref={bottomSheetRef}
        animateOnMount={false}
        snapPoints={snapPoints}
        onChange={v => {
          console.log(v);
        }}
        style={{elevation: 10, shadowColor: '#000'}}
        backgroundStyle={{borderRadius: 20}}
        backdropComponent={BottomSheetBackdrop}>
        <TouchableOpacity
          onPress={() =>
            pickImage('camera', res => {
              type == 'profile' ? setProfile(res) : setCover(res);
            })
          }
          style={style.cardBlock}>
          <Image source={IMAGE.camera} style={style.icon} />
          <Text style={style.cardText}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            pickImage(
              'image',
              res => {
                type == 'profile' ? setProfile(res) : setCover(res);
              },
              'photo',
            )
          }
          style={style.cardBlock}>
          <Image source={IMAGE.media} style={style.icon} />
          <Text style={style.cardText}>Mobile Library</Text>
        </TouchableOpacity>
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
    );
  },
);

const EditGroup = ({navigation, route}) => {
  const [isLoading, setisLoading] = useState(false);
  const [contactList, setcontactList] = useState([]);
  const [selectUserList, setselectUserList] = useState([]);
  const [groupType, setgroupType] = useState(route?.params?.groupType ? route?.params?.groupType : 1);
  const [groupPrivacy, setgroupPrivacy] = useState(route?.params?.groupPrivacy ? route?.params?.groupPrivacy : 2);
  const [MediaPrivacy, setMediaPrivacy] = useState(route?.params?.mediaPrivacy ? route?.params?.route?.params?.mediaPrivacy : 1);
  const [groupName, setgroupName] = useState(route?.params?.groupName ? route?.params?.groupName : "");
  const [groupDesc, setgroupDesc] = useState(route?.params?.groupDes ? route?.params?.groupDes : "");
  const [cover, setcover] = useState();
  const [profile, setprofile] = useState();
  const [oldCover, setoldCover] = useState(route?.params?.coverImage);
  const [oldProfile, setoldProfile] = useState(route?.params?.image);
  const [group, setgroup] = useState(route?.params?.EditGroup);
  const [welcomeMessage, setWelcomeMessage] = useState(route?.params?.welcome_message ? route?.params?.welcome_message : '');


  const [imgtype, setimgtype] = useState('cover');

  const isFocus = useIsFocused();
  useEffect(() => {
    if (isFocus) {
      fetchContactList();
      if (route?.params?.group_id) {
        fetchGroupDetail(route?.params?.group_id);
      }
    }
  }, [isFocus]);

  const bottomSheetRef = React.useRef();
  const snapPoints = [1, hp(26)];

  const selectUser = id => {
    let index = selectUserList.indexOf(id);
    let data = [...selectUserList];
    if (index == -1) {
      data.push(id);
    } else {
      data.splice(index, 1);
    }
    setselectUserList(data);
  };

  const fetchGroupDetail = id => {
    setisLoading(true);
    let config = {
      url: `${ApiUrl.groupDetail}${id}`,
      method: 'get',
    };
    APIRequest(
      config,
      res => {
        setisLoading(false);
        let data = res.data;
        if (res?.status) {
          setoldCover(data.cover);
          setoldProfile(data.photo_url);
          setgroupDesc(data.description);
          setgroupName(data.name);
          setMediaPrivacy(data.media_privacy);
          setgroupPrivacy(data.privacy);
          setgroupType(data.group_type);
          setWelcomeMessage(data?.welcome_message);
          var datas = [];
          for (let i = 0; i < data?.group_members?.length; i++) {
            datas.push(data?.group_members[i].id);
          }
          setselectUserList(datas);
        }

        if (res.status) {
          // setcontactList(res.users)
        }
      },
      err => {
        setisLoading(false);
        console.log(err?.response?.data);
      },
    );
  };

  const fetchContactList = () => {
    let config = {
      url: ApiUrl.my_contacts,
      method: 'get',
    };

    APIRequest(
      config,
      res => {
        if (res.status) {
          setcontactList(res.users);
        }
      },
      err => {
        console.log(err?.response?.data);
      },
    );
  };

  const createGroup = () => {
    if (validation()) {
      let body = new FormData();
      body.append('name', groupName);
      body.append('description', groupDesc);
      body.append('group_type', groupType);
      body.append('privacy', groupPrivacy);
      body.append('media_privacy', MediaPrivacy);
      body.append('users', selectUserList.join(','));
      body.append('welcome_message', welcomeMessage);
      
      if (profile) {
        body.append('photo', profile);
      }
      if (cover) {
        body.append('cover_photo', cover);
      }
      
      let group_id = route?.params?.group_id;
      let url = group_id
        ? `${ApiUrl.groupUpdate}${group_id}`
        : ApiUrl.groupCreate;

      setisLoading(true);
      let config = {
        url: url,
        method: 'post',
        body: body,
      };

      APIRequestWithFile(
        config,
        res => {
          setisLoading(false);
          if (res.status) {
            Toast.show({
              type: 'success',
              text1: res.message
            })
            navigation.goBack();
          }
        },
        err => {
          setisLoading(false);
          console.log(err);
        },
      );
    }
  };

  const validation = () => {
    if (groupName == '') {
      Toast.show({
        type: 'info',
        text1: 'Please Enter Group Name'
      })
      return false;
    } else if (groupDesc == '') {
      Toast.show({
        type: 'info',
        text1: 'Please Enter Group Description'
      })
      return false;
    } else if (selectUserList.length == 0) {
      Toast.show({
        type: 'info',
        text1: 'Please Select User'
      })
      return false;
    } else {
      return true;
    }
  };

  return (
    <SafeAreaView style={style.safeArea}>
      <View style={{flex: 1, backgroundColor: color.background}}>
        <StatusBar barStyle={'dark-content'} backgroundColor={color.white} />
        <Header
          title={group}
          RightIcon={() => (
            <TouchableOpacity onPress={createGroup}>
              <Image
                source={IMAGE.check_mark}
                style={{height: 20, width: 20, tintColor: color.btnBlue, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          )}
        />
        <ScrollView>
          <View>
            <Loader isLoading={isLoading} type={'dots'} />
            <TouchableOpacity
              onPress={() => {
                setimgtype('cover'), bottomSheetRef?.current?.expand();
              }}
              style={style.coverView}>
              {cover ? (
                <Image
                  source={{uri: cover?.uri}}
                  style={{height: hp(25), width: wp(100), resizeMode: 'cover'}}
                />
              ) : oldCover ? (
                <Image
                  source={{uri: `${IMAGEURL}/${oldCover}`}}
                  style={{height: hp(25), width: wp(100), resizeMode: 'cover'}}
                />
              ) : (
                <>
                  <Image
                    source={IMAGE.upload_cover}
                    style={{height: 40, width: 40, resizeMode: 'contain'}}
                  />
                  <Text style={style.groupText}>Upload group cover image</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setimgtype('profile'), bottomSheetRef?.current?.expand();
              }}
              style={{justifyContent: 'center'}}>
              <View style={style.groupProfileView}>
                {profile ? (
                  <Image
                    source={{uri: profile?.uri}}
                    style={{
                      height: hp(14),
                      width: wp(30),
                      resizeMode: 'cover',
                      borderRadius: 20,
                      overflow: 'hidden',
                    }}
                  />
                ) : oldProfile ? (
                  <Image
                    source={{uri: `${IMAGEURL}/${oldProfile}`}}
                    style={{
                      height: hp(14),
                      width: wp(30),
                      resizeMode: 'cover',
                      borderRadius: 20,
                      overflow: 'hidden',
                    }}
                  />
                ) : (
                  <Image source={IMAGE.camera} style={style.groupimg} />
                )}
              </View>
              <Text
                style={[
                  style.groupText,
                  {textAlign: 'center', marginBottom: hp(3), marginTop: -hp(4)},
                ]}>
                Upload Group image
              </Text>
            </TouchableOpacity>

            <View>
              <TextInput
                onFocus={() => bottomSheetRef?.current?.close()}
                value={groupName}
                onChangeText={setgroupName}
                placeholderTextColor={'#0F2D52A6'}
                placeholder="Add Group Name"
                style={style.inputStyle}
              />
              <TextInput
                onFocus={() => bottomSheetRef?.current?.close()}
                value={groupDesc}
                onChangeText={setgroupDesc}
                placeholderTextColor={'#0F2D52A6'}
                placeholder="Add Group Description"
                style={style.inputStyle}
              />
              <TextInput
                onFocus={() => bottomSheetRef?.current?.close()}
                value={welcomeMessage}
                onChangeText={setWelcomeMessage}
                placeholderTextColor={'#0F2D52A6'}
                placeholder="Welcome message"
                style={style.inputStyle}
              />
            </View>
            <View style={{marginLeft: wp(5), marginVertical: hp(2)}}>
              <View style={{}}>
                <Text style={style.typeText}>Group Type</Text>
                <View>
                  <Radio
                    style={{marginBottom: '2%'}}
                    onPress={() => setgroupType(1)}
                    active={groupType == 1}
                    label={'Open (group member can send messages)'}
                  />
                  <Radio
                    onPress={() => setgroupType(2)}
                    active={groupType == 2}
                    label={'Close (only admin can send messages)'}
                  />
                </View>
              </View>
              <View style={{marginTop: hp(2)}}>
                <Text style={style.typeText}>Group Privacy</Text>
                <View>
                  <Radio
                    style={{marginBottom: '2%'}}
                    onPress={() => setgroupPrivacy(1)}
                    active={groupPrivacy == 1}
                    label={'Public (group members can add/remove member)'}
                  />
                  <Radio
                    onPress={() => setgroupPrivacy(2)}
                    active={groupPrivacy == 2}
                    label={'Private (only Admin can add/remove member)'}
                  />
                </View>
              </View>
              <View style={{marginTop: hp(2)}}>
                <Text style={style.typeText}>Media Privacy</Text>
                <View>
                  <Radio
                    style={{marginBottom: '2%'}}
                    onPress={() => setMediaPrivacy(1)}
                    active={MediaPrivacy == 1}
                    label={'Public (group member can attach media)'}
                  />
                  <Radio
                    onPress={() => setMediaPrivacy(2)}
                    active={MediaPrivacy == 2}
                    label={'Private (only Admin can attach media)'}
                  />
                </View>
              </View>
            </View>
            <View
              style={{
                paddingHorizontal: wp(5),
                marginVertical: hp(1),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={[style.typeText, {marginBottom: 0}]}>
                Select Group Members
              </Text>
              {/* <Image source={IMAGE.search} style={{height:20,width:20,tintColor:'#000',resizeMode:'contain'}} /> */}
            </View>
              {contactList.map((item, index) => (
                <RippleTouchable
                  key={`ContactListAddGroup-${index}`}
                  onPress={() => {
                    selectUser(item.id);
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      flexDirection: 'row',
                      paddingVertical: hp(1),
                      paddingLeft: wp(5),
                    }}>
                    <View style={style.imgview}>
                      <Image
                        source={{uri: `${IMAGEURL}/${item.avatar}`}}
                        style={style.imgBox}
                      />
                    </View>
                    <View style={style.chatView}>
                      <Text style={[style.typeText, {marginBottom: 0}]}>
                        {item.name}
                      </Text>

                      <Radio active={selectUserList.indexOf(item.id) != -1} />
                    </View>
                  </View>
                </RippleTouchable>
              ))
            }
          </View>
        </ScrollView>

        <RenderBottomSheet
          type={imgtype}
          setProfile={file => {
            setprofile(file);
            bottomSheetRef?.current?.close();
          }}
          setCover={file => {
            setcover(file);
            bottomSheetRef?.current?.close();
          }}
          snapPoints={snapPoints}
          bottomSheetRef={bottomSheetRef}
        />
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: color.white
  },
  icon: {
    resizeMode: 'contain',
    height: 22,
    width: 22,
  },
  cardText: {
    paddingLeft: wp(5),
    fontSize: 13,
    fontFamily: fontFamily.Regular,
    color: color.black,
  },
  cardBlock: {
    marginLeft: wp(10),
    paddingRight: wp(7),
    paddingVertical: hp(2),
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: color.borderGray,
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
    borderColor: color.textGray2,
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
  inputStyle: {
    paddingLeft: wp(3),
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    marginBottom: hp(2),
    width: wp(90),
    height: hp(6),
    alignSelf: 'center',
    color: '#0F2D52A6',
  },
  groupProfileView: {
    alignSelf: 'center',
    top: -hp(6),
    height: hp(14),
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(30),
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#F1F1F1',
  },
  coverView: {
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(25),
    width: wp(100),
    backgroundColor: '#F1F1F1',
  },
  groupText: {
    fontSize: 15,
    fontFamily: fontFamily.Regular,
    color: color.btnBlue,
  },
  typeText: {
    marginBottom: hp(2),
    fontSize: 17,
    fontFamily: fontFamily.Bold,
    color: color.black,
  },
  icon: {
    resizeMode: 'contain',
    height: 22,
    width: 22,
  },
  groupimg: {
    width: 35,
    height: 35,
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
  bodySection: {
    top: -hp(3),
  },
});
export default EditGroup;
