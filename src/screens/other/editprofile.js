/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
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
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';
import { IMAGE, color, fontFamily, fontSize } from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  RippleTouchable,
  Header,
  Radio,
  Textinput,
  Button,
  Loader,
} from '../../component/';
import Toast from 'react-native-toast-message';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import {
  APIRequest,
  ApiUrl,
  APIRequestWithFile,
  IMAGEURL,
} from './../../utils/api';
import { pickImage } from '../../component/';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { User } from '../../utils/user';
import moment from 'moment';
import { Overlay } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import DatePicker from 'react-native-date-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { pickImageCrop } from '../../component/ImagePickerWithCrop';
import {
  BottomSheetUploadFile,
  BottomSheetUploadFileStyle,
} from '../../component/BottomSheetUploadFile';

export const RenderBottomSheet = memo(
  ({ setCover, setProfile, type, bottomSheetRef, snapPoints, file }) => {
    return (
      <BottomSheet
        ref={bottomSheetRef}
        animateOnMount={false}
        snapPoints={snapPoints}
        onChange={v => {
          console.log(v);
        }}
        style={{ elevation: 10, shadowColor: '#000' }}
        backgroundStyle={{ borderRadius: 20 }}
        backdropComponent={BottomSheetBackdrop}>
        <TouchableOpacity
          onPress={
            () =>
              pickImageCrop(
                'camera',
                res => {
                  type == 'profile' ? setProfile(res) : setCover(res);
                },
                type == 'profile'
                  ? {
                    height: 200,
                    width: 20,
                  }
                  : {
                    height: 200,
                    width: 400,
                  },
              )
          }
          style={style.cardBlock}>
          <Image source={IMAGE.camera} style={style.icon} />
          <Text style={style.cardText}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={
            () =>
              pickImageCrop(
                'image',
                res => {
                  type == 'profile' ? setProfile(res) : setCover(res);
                },
                type == 'profile'
                  ? {
                    height: 200,
                    width: 200,
                  }
                  : {
                    height: 200,
                    width: 400,
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
              backgroundColor: color.lightGray,
              width: wp(90),
              height: hp(6),
            }}
            labelStyle={{ color: color.btnBlue }}
            label={'Cancel'}
          />
        </View>
      </BottomSheet>
    );
  },
);

const EditProfile = ({ navigation, route }) => {
  const [isLoading, setisLoading] = useState(true);
  const [name, setname] = useState('');
  const [username, setusername] = useState('');
  const [email, setemail] = useState('');
  const [number, setnumber] = useState('');
  const [likes, setlikes] = useState('');

  const [cover, setcover] = useState(false);
  const [profile, setprofile] = useState(false);
  const [oldProfile, setoldProfile] = useState(false);
  const [oldCover, setoldCover] = useState(false);
  const [genderType, setgenderType] = useState(1);
  const [otherGenderType, setOtherGenderType] = useState('');
  const [imgtype, setimgtype] = useState('cover');
  const bottomSheetRef = React.useRef();
  const [datePicker, setdatePicker] = useState(false);
  const [visible, setvisible] = useState(false);
  const [countryCode, setcountryCode] = useState([]);
  const [selectedCode, setselectedCode] = useState('');
  const [selectedCodeId, setselectedCodeId] = useState('');
  const [interests, setInterests] = useState([]);
  const [personalities, setPersonalities] = useState([]);
  const [dob, setdob] = useState('');
  const snapPoints = [1, hp(26)];
  const [validationError, setValidationError] = useState({});
  const [selectdate, setselectDate] = useState(new Date());
  const [open, setOpen] = useState(true);
  const [isShowBottomSheet, setisShowBottomSheet] = useState(false);

  var datalocal;
  useFocusEffect(
    React.useCallback(() => {
      fetchProfile();
      return () => {
        setisLoading(false);
      };
    }, [navigation]),
  );

  const setDate = (event, date) => {
    setdob(moment(date).format('YYYY-MM-DD'));
    setdatePicker(false);
  };

  const fetchProfile = async () => {
    setisLoading(isLoading => true);

    let config = {
      url: ApiUrl.myprofile,
      method: 'post',
    };

    APIRequest(
      config,
      res => {
        console.log('api response', res.auth);
        setisLoading(state => !state);
        if (res.status) {
          let data = res.auth;
          setname(data.name);
          setemail(data.email);
          setusername(data.username);
          // setpassword(data.password)
          setgenderType(data.gender);
          setOtherGenderType(data.gender_pronoun ? data.gender_pronoun : '');
          setoldProfile(data.avatar);
          setoldCover(data.cover);
          setnumber(data.phone);
          setdob(data.dob);
          setlikes(data.likes_n_hobby);
          setcountryCode(res.calling_code_list);
          setselectedCode(data?.calling_code);
          setselectedCodeId(data?.calling_code_id);
          setInterests(data?.interests);
          setPersonalities(data?.personality);
        }
      },
      err => {
        setisLoading(state => !state);

        console.log(err?.response?.data);
      },
    );
  };

  const hasError = key => {
    if (validationError[key] !== undefined) {
      return (
        <Text
          style={[
            style.validationError,
            { fontSize: fontSize.size12, textAlign: 'center' },
          ]}>
          {validationError[key][0]}
        </Text>
      );
    }
  };

  const updateProfile = () => {
    let formData = new FormData();
    if (name === '') {
      return Toast.show({
        type: 'info',
        text1: 'Please enter name',
      });
    }
    if (username === '') {
      return Toast.show({
        type: 'info',
        text1: 'Please enter user name',
      });
    }
    if (email === '') {
      return Toast.show({
        type: 'info',
        text1: 'Please enter email',
      });
    }
    if (number == '') {
      return Toast.show({
        type: 'info',
        text1: 'Please enter mobile number',
      });
    }
    if (dob == '') {
      return Toast.show({
        type: 'info',
        text1: 'Please enter dob',
      });
    }
    if (genderType == 4 && otherGenderType == '') {
      return Toast.show({
        type: 'info',
        text1: 'Please specify pronoun',
      });
    }
    if (likes == '') {
      return Toast.show({
        type: 'info',
        text1: 'Please enter likes and hobby',
      });
    } else {
      setisLoading(state => !state);

      formData.append('name', name ? name : '');
      formData.append('email', email ? email : '');
      formData.append('username', username ? username : '');
      formData.append('gender', genderType ? genderType : '');
      formData.append('gender_pronoun', otherGenderType ? otherGenderType : '');
      formData.append('dob', dob ? dob : '');
      formData.append('likes_n_hobby', likes ? likes : '');
      formData.append('phone', number ? number : '');
      formData.append('calling_code_id', selectedCodeId ? selectedCodeId : '');
      // if (cover) {
      //   formData.append('cover', cover);
      // }
      // if (profile) {
      //   formData.append('avatar', profile);
      // }
      if (personalities?.length > 0) {
        for (let i = 0; i < personalities.length; i++) {
          formData.append('personality[]', personalities[i]);
        }
      }
      if (interests?.length > 0) {
        for (let i = 0; i < interests.length; i++) {
          formData.append('interests[]', interests[i]);
        }
      }
      let config = {
        url: ApiUrl.updateprofile,
        method: 'post',
        body: formData,
      };

      APIRequestWithFile(
        config,
        res => {
          console.log(res);
          setisLoading(state => !state);
          Toast.show({
            type: 'success',
            text1: res?.alert?.message,
          });
          new User().setuserdata(res?.auth);
          navigation?.goBack();
        },
        err => {
          setisLoading(state => !state);
          Toast.show({
            type: 'error',
            text1: err?.message,
          });
          if (err?.response?.status == 422) {
            if (err?.response?.data?.error?.phone) {
              Toast.show({
                type: 'error',
                text1: err?.response?.data?.error?.phone[0],
              });
            }

            setValidationError(err?.response?.data?.error);
          }
        },
      );
    }
  };

  useEffect(() => {
    if (cover) {
      uploadCoverOrAvatar('cover')
    }
  }, [cover])
  useEffect(() => {
    if (profile) {
      uploadCoverOrAvatar('avatar')
    }
  }, [profile])

  const uploadCoverOrAvatar = type => {
    setisLoading(true);
    let formData = new FormData();
    if (type === 'cover') {
      formData.append('file', cover);
    } else {
      formData.append('file', profile);
    }
    let config = {
      url: `${ApiUrl.updateProfileAvatarOrCover}/${type}`,
      method: 'post',
      body: formData,
    };

    APIRequestWithFile(
      config,
      res => {
        setisLoading(false);
        Toast.show({
          type: 'success',
          text1: res?.message,
        });

        new User().setuserdata(res?.auth);
      },
      err => {
        setisLoading(false);
        Toast.show({
          type: 'error',
          text1: err?.message,
        });
      },
    );
  };

  const handleRemoveQuestion = (item, i, type) => {
    if (type === 'personality') {
      let index = personalities.indexOf(item);
      let data = [...personalities];
      if (index == -1) {
        data.push(item.value);
      } else {
        data.splice(index, 1);
      }
      setPersonalities(data);
    } else {
      let index = interests.indexOf(item);
      let data = [...interests];
      if (index == -1) {
        data.push(item.value);
      } else {
        data.splice(index, 1);
      }
      setInterests(data);
    }
  };

  return (
    <SafeAreaView style={style.safeArea}>
      <View style={{ flex: 1, backgroundColor: color.background }}>
        <StatusBar barStyle={'dark-content'} backgroundColor={color.white} />
        {<Loader isLoading={isLoading} type={'dots'} />}
        <Header title={'Edit Profile'} />
        <KeyboardAwareScrollView>
          <View>
            <TouchableOpacity
              onPress={() => {
                setimgtype('cover'), setisShowBottomSheet(true);
              }}
              style={style.coverView}>
              {cover ? (
                <Image
                  source={{ uri: cover?.uri }}
                  style={{ height: hp(25), width: wp(100), resizeMode: 'cover' }}
                />
              ) : oldCover ? (
                <Image
                  source={{ uri: `${IMAGEURL}/${oldCover}` }}
                  style={{ height: hp(25), width: wp(100), resizeMode: 'cover' }}
                />
              ) : (
                <>
                  <Image
                    source={IMAGE.upload_cover}
                    style={{ height: 40, width: 40, resizeMode: 'contain' }}
                  />
                  <Text style={style.groupText}>Upload cover image</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setimgtype('profile'), setisShowBottomSheet(true);
              }}
              style={style.groupProfileView}>
              <View>
                {profile ? (
                  <Image
                    source={{ uri: profile?.uri }}
                    style={{
                      height: 110,
                      width: 110,
                      resizeMode: 'cover',
                      borderRadius: 20,
                      overflow: 'hidden',
                    }}
                  />
                ) : oldProfile != 'lybertineApp/default/default.png' ? (
                  <Image
                    source={{ uri: `${IMAGEURL}/${oldProfile}` }}
                    style={{
                      height: 110,
                      width: 110,
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
                  {
                    textAlign: 'center',
                    position: 'absolute',
                    bottom: -30,
                  },
                ]}>
                Upload image
              </Text>
            </TouchableOpacity>

            <View style={{ paddingHorizontal: wp(10) }}>
              <Textinput
                value={name}
                changeText={setname}
                placeholder={'Full Name'}
                icon={IMAGE.user}
              />
              <Textinput
                value={username}
                changeText={setusername}
                placeholder={'Username'}
                icon={IMAGE.user}
              />
              <Textinput
                value={email}
                changeText={setemail}
                placeholder={'Email Address'}
                isEmail={true}
                icon={IMAGE.mail}
                validationError={hasError('email')}
              />
              <View style={[style.inputStyle1, style.customInputs]}>
                <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                  <TouchableOpacity
                    onPress={() => setvisible(true)}
                    style={{
                      marginTop: '0%',
                      alignItems: 'center',
                      flexDirection: 'row',
                      marginLeft: '7%',
                      width: wp(18),
                      height: hp(6),
                    }}>
                    <Image
                      source={IMAGE.mobile}
                      style={{
                        height: 14,
                        width: 14,
                        resizeMode: 'contain',
                        marginRight: '2%',
                      }}
                    />
                    <Text style={{ marginHorizontal: '4%' }}>
                      {selectedCode != '' ? '+' + selectedCode : ''}
                    </Text>
                    <Image
                      source={IMAGE.dropDown}
                      style={{
                        height: 6,
                        width: 10,
                        resizeMode: 'contain',
                        marginRight: '4%',
                      }}
                    />
                  </TouchableOpacity>
                  <View>
                    <Textinput
                      value={number}
                      style={style.inputStyle2}
                      withLeftDropDown={true}
                      changeText={setnumber}
                      placeholder={'Mobile number'}
                      keyboardType="number-pad"
                    />
                  </View>
                </View>
              </View>
              <View style={{ marginTop: -20, marginBottom: 15 }}>
                {hasError('phone')}
              </View>
              <DatePicker
                modal
                open={datePicker}
                mode={'date'}
                date={new Date()}
                onConfirm={date => {
                  setdatePicker(false);
                  setDate('event', date);
                }}
                onCancel={() => {
                  setdatePicker(false);
                }}
              />

              <TouchableOpacity
                onPress={() => setdatePicker(true)}
                style={style.inputStyle1}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginHorizontal: '6%',
                    // alignSelf:"flex-start",
                  }}>
                  {dob == '' || dob == null ? (
                    <Text style={style.dobText}>Date of Birth</Text>
                  ) : (
                    <Text style={style.dobText}>{dob}</Text>
                  )}
                  <Image
                    source={IMAGE.event}
                    style={{
                      height: 22,
                      width: 22,
                      resizeMode: 'contain',
                      alignSelf: 'center',
                      marginTop: '1%',
                    }}
                  />
                </View>
              </TouchableOpacity>
              <View style={{ marginTop: -20, marginBottom: 15, alignItems: 'flex-start' }}>
                {hasError('dob')}
              </View>
              <Textinput
                value={likes}
                style={{ paddingLeft: wp(6) }}
                changeText={setlikes}
                placeholder={'Hobbies and likes'}
              //   keyboardType="Number-pad"
              //   icon={IMAGE.mobile}
              />
              {/* <Textinput value={about} style={style.inputStyle}  changeText={setabout} placeholder={'likes and characters'}/> */}

              <View style={style.genderWrapper}>
                <Radio
                  active={genderType == 1}
                  onPress={() => {
                    setgenderType(1);
                  }}
                  style={style.genderType}
                  labelStyle={{ fontFamily: fontFamily.Bold }}
                  label={'She/Her'}
                />
                <Radio
                  active={genderType == 2}
                  onPress={() => {
                    setgenderType(2);
                  }}
                  style={style.genderType}
                  labelStyle={{ fontFamily: fontFamily.Bold }}
                  label={'He/Him'}
                />
                <Radio
                  active={genderType == 3}
                  onPress={() => {
                    setgenderType(3);
                  }}
                  style={style.genderType}
                  labelStyle={{ fontFamily: fontFamily.Bold }}
                  label={'They/Them'}
                />
                <Radio
                  active={genderType == 4}
                  onPress={() => {
                    setgenderType(4);
                  }}
                  style={style.genderType}
                  labelStyle={{ fontFamily: fontFamily.Bold }}
                  label={'Other'}
                />
              </View>
              {genderType == 4 && (
                <Textinput
                  value={otherGenderType}
                  style={{ paddingLeft: wp(6), marginTop: 10 }}
                  changeText={setOtherGenderType}
                  placeholder={'Specifiy pronoun'}
                />
              )}
              <View style={style.pillsWrapper}>
                <Text style={style.questionText}>
                  Let’s get to know you better, What type of events interest
                  you?
                </Text>
                <View style={style.questionOuter}>
                  <View style={style.pillBackDefault}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={style.removeIconWrapperDefault}
                      onPress={() => {
                        navigation.navigate('UpdateQuestions', {
                          title: 'interests',
                          selected: interests,
                        });
                      }}>
                      <Image source={IMAGE.plus} style={style.addNewIcon} />
                    </TouchableOpacity>
                  </View>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={style.pillsWrapperInner}>
                    {interests?.map((item, index) => (
                      <View key={`interests-${index}`} style={style.pillBack}>
                        <Text style={style.pillText}>{item}</Text>
                        <TouchableOpacity
                          key={`interests-${index}`}
                          activeOpacity={0.8}
                          style={style.removeIconWrapper}
                          onPress={() => {
                            handleRemoveQuestion(item, index, 'interests');
                          }}>
                          <Image
                            source={IMAGE.cancel}
                            style={style.imgBoxSelectedQuestions}
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </View>
              <View style={style.pillsWrapper}>
                <Text style={style.questionText}>
                  What words best describe you?
                </Text>
                <View style={style.questionOuter}>
                  <View style={style.pillBackDefault}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={style.removeIconWrapperDefault}
                      onPress={() => {
                        navigation.navigate('UpdateQuestions', {
                          title: 'personality',
                          selected: personalities,
                        });
                      }}>
                      <Image source={IMAGE.plus} style={style.addNewIcon} />
                    </TouchableOpacity>
                  </View>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={style.pillsWrapperInner}>
                    {personalities?.map((item, index) => (
                      <View key={`personality-${index}`} style={style.pillBack}>
                        <Text style={style.pillText}>{item}</Text>
                        <TouchableOpacity
                          key={`personality-${index}`}
                          activeOpacity={0.8}
                          style={style.removeIconWrapper}
                          onPress={() => {
                            handleRemoveQuestion(item, index, 'personality');
                          }}>
                          <Image
                            source={IMAGE.cancel}
                            style={style.imgBoxSelectedQuestions}
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </View>

              <TouchableOpacity style={{ marginVertical: hp(5) }}>
                <Button
                  onPress={updateProfile}
                  btnStyle={{ height: hp(5.5) }}
                  label={'Save'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>

        {/* <RenderBottomSheet
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
        /> */}

        <BottomSheetUploadFile
          cancelBtn={{
            color: color.lightGray,
            title: 'Cancel',
            textColor: color.btnBlue,
          }}
          isShowBottomSheet={isShowBottomSheet}
          setisShowBottomSheet={setisShowBottomSheet}>
          <View>
            <TouchableOpacity
              onPress={() =>
                pickImageCrop(
                  'camera',
                  res => {
                    imgtype == 'profile'
                      ? (setprofile(res),
                        setisShowBottomSheet(false))
                      : (setcover(res),
                        setisShowBottomSheet(false))
                  },
                  imgtype == 'profile'
                    ? {
                      height: 200,
                      width: 200,
                    }
                    : {
                      height: 200,
                      width: 400,
                    },
                )
              }
              style={BottomSheetUploadFileStyle.cardBlock}>
              <Image
                source={IMAGE.camera}
                style={BottomSheetUploadFileStyle.icon}
              />
              <Text style={BottomSheetUploadFileStyle.cardText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                pickImageCrop(
                  'image',
                  res => {
                    imgtype == 'profile'
                      ? (setprofile(res),
                        console.log('setProfile'),
                        setisShowBottomSheet(false))
                      : (setcover(res),
                        setisShowBottomSheet(false))
                  },
                  imgtype == 'profile'
                    ? {
                      height: 200,
                      width: 200,
                    }
                    : {
                      height: 200,
                      width: 400,
                    },
                  'photo',
                )
              }
              style={BottomSheetUploadFileStyle.cardBlock}>
              <Image
                source={IMAGE.media}
                style={BottomSheetUploadFileStyle.icon}
              />
              <Text style={BottomSheetUploadFileStyle.cardText}>
                Mobile Library
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetUploadFile>

        <Overlay
          visible={visible}
          transparent={true}
          width="auto"
          height=""
          overlayStyle={{
            width: wp(85),
            maxWidth: 350,
            maxHeight: hp(80),

            alignSelf: 'center',
            borderRadius: 10,
            // backgroundColor:"#3C444C"
            backgroundColor: '#fff',
            marginVertical: '20%',
            paddingBottom: hp(10),
            overflow: 'hidden',
          }}>
          <View style={{ marginVertical: '5%' }}>
            <Text
              style={{
                marginBottom: '4%',
                fontSize: 14,
                fontFamily: fontFamily.Bold,
                marginHorizontal: '6%',
                color: color.black,
              }}>
              Select Country Code
            </Text>
            <TouchableOpacity
              onPress={() => {
                setvisible(false);
              }}
              style={{ position: 'absolute', right: 10, top: -10 }}>
              <Icon
                name={'times'}
                style={{
                  fontSize: 25,
                  color: 'gray',
                }}
              />
            </TouchableOpacity>
            <ScrollView style={{ paddingVertical: hp(0) }}>
              {countryCode.map((d, index) => (
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                  onPress={() => {
                    [
                      setselectedCode(d.calling_code),
                      setselectedCodeId(d.calling_code_id),
                      setvisible(false),
                    ];
                  }}>
                  <Text
                    style={{
                      paddingVertical: wp(4),
                      fontSize: 14,
                      borderBottomWidth: 1,
                      borderColor: color.borderGray,
                      color: color.black,
                      fontFamily: fontFamily.Regular,
                      paddingHorizontal: '6%',
                    }}>
                    + {d.calling_code} - {d.country_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={() => setvisible(false)}>
              <Text
                style={{
                  marginTop: '5%',
                  fontSize: 14,
                  fontFamily: fontFamily.Regular,
                  marginHorizontal: '1%',
                  color: color.btnBlue,
                  textAlign: 'center',
                }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </Overlay>
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: color.white,
  },
  icon: {
    resizeMode: 'contain',
    height: 22,
    width: 22,
    tintColor: color.btnBlue,
  },
  cardText: {
    paddingLeft: wp(5),
    fontSize: 13,
    fontFamily: fontFamily.Regular,
    color: color.black,
  },
  cardBlock: {
    marginLeft: wp(5),
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
  inputStyle2: {
    marginTop: 20,
    height: hp(6),
    width: wp(60),
    borderWidth: 0,
    fontSize: fontSize.size14,
    // backgroundColor:"red"
  },
  inputStyle1: {
    height: hp(7),
    borderWidth: 1,
    borderColor: color.borderGray,
    borderRadius: 10,
    marginBottom: '7%',
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    justifyContent: 'space-around',
  },

  groupProfileView: {
    alignSelf: 'center',
    top: -hp(6),
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    width: 110,
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
    fontFamily: fontFamily.Light,
    color: color.btnBlue,
  },
  icon: {
    resizeMode: 'contain',
    height: 22,
    width: 22,
    tintColor: color.btnBlue,
  },
  groupimg: {
    width: 35,
    height: 35,
    resizeMode: 'cover',
  },
  bodySection: {
    top: -hp(3),
  },
  dobText: {
    color: color.textslaty,
    fontSize: fontSize.size14,
    fontFamily: fontFamily.Regular,
  },
  validationError: {
    color: color.red,
    marginTop: 2,
  },
  genderWrapper: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  genderType: {
    flexBasis: '40%',
    marginVertical: 10,
  },
  removeIconWrapper: {
    flex: 1,
    backgroundColor: color.btnBlue,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 30,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 0,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  imgBoxSelectedQuestions: {
    height: 12,
    width: 12,
    tintColor: color.white,
  },
  editIcon: {
    height: 20,
    width: 20,
    // tintColor: color.black,
    marginLeft: 10,
  },
  pillsWrapper: {},
  pillsWrapperInner: {
    marginVertical: 20,
  },
  pillBack: {
    borderRadius: 30,
    backgroundColor: color.borderGray,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    flex: 1,
    height: 40,
  },
  pillText: {
    fontFamily: fontFamily.Regular,
    fontSize: fontSize.size14,
    color: color.btnBlue,
    paddingVertical: 10,
    paddingLeft: 15,
    paddingRight: 10,
  },
  questionOuter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillBackDefault: {
    borderRadius: 8,
    backgroundColor: color.white,
    alignItems: 'center',
    marginRight: 10,
    height: 40,
    flex: 1,
    minWidth: 40,
    maxWidth: 40,
  },
  addNewIcon: {
    height: 12,
    width: 12,
    tintColor: color.btnBlue,
  },
  removeIconWrapperDefault: {
    flex: 1,
    minWidth: 40,
    maxWidth: 40,
    backgroundColor: 'rgba(104,31,132,0.3)',
    borderRadius: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  questionText: {
    fontFamily: fontFamily.Regular,
    fontSize: fontSize.size15,
    textAlign: 'left',
    color: color.black,
    marginVertical: 10,
    marginHorizontal: 10,
  },
});
export default EditProfile;
