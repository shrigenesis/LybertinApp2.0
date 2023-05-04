/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Toast from 'react-native-toast-message';
import { color, IMAGE, fontFamily } from '../../constant/';
import { User } from '../../utils/user';
import { Button, Textinput } from './../../component/';
import { APIRequest, ApiUrl } from './../../utils/api';
import { LoginContext } from './../../context/LoginContext';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import messaging from '@react-native-firebase/messaging';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import Video from 'react-native-video';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { Platform } from 'react-native';
import { useRef } from 'react';
import RegisterDeeplink from '../../utils/RegisterDeeplink';
import getPathFromUrl from '../../utils/getPathFromUrl';

const Register = ({ navigation }) => {
  const { setLogin, setType } = useContext(LoginContext);
  const [email, setEmail] = useState('');
  const [emailError, setemailError] = useState('');
  const [usernameError, setusernameError] = useState('');
  const [username, setusername] = useState('');
  const [name, setname] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setsecureText] = useState(true);
  const [isLoading, setisLoading] = useState(false);
  const [CheckedBox, setCheckedBox] = useState(false);
  const [device_id, setdevice_id] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [isPaused, setisPaused] = useState(false);
  const videoRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      // Make textInput editable when page is in focus
      setIsFromRegister();
      GoogleSignin.configure({
        webClientId:
          '1039027435930-rvmunf4rq0v5irfk0g6gbuhispm28ap4.apps.googleusercontent.com',
      });
      messaging()
        .getToken()
        .then(fcmToken => {
          if (fcmToken) {
            console.log('FCM', fcmToken);
            setdevice_id(fcmToken);
          } else {
            console.log('[FCMService] User Does not have a device token');
          }
        })
        .catch(error => {
          console.log('[FCMService] getToken rejected', error);
        });
      return () => {
        // Makes textInput non-editable when page is out of focus
        setAudioLevel(0);
        setisPaused(true);
      };
    }, []),
  );
  const setIsFromRegister = () => {
    const user = new User();
    user.setFromRegister(true);
  };
  const DeepLinkNavigation = () => {
    const deepLink = SyncStorage.get('deepLink')
    if (deepLink) {
      RegisterDeeplink(deepLink)
    }
  }


  const signup = () => {
    if (validation()) {
      setisLoading(true);
      let config = {
        url: ApiUrl.signup,
        method: 'post',
        body: {
          email: email,
          password: password,
          name: name,
          username: username,
          device_type: Platform.OS.toUpperCase(),
          device_token: device_id,
        },
      };

      APIRequest(
        config,
        res => {
          setisLoading(false);
          if (res.status) {
            new User().setuserdata(res.auth);
            new User().setPrefixurl(res.files_prifix);
            new User().setToken(res.token);
            setType(res?.auth?.role_id);
            setLogin('true');
            DeepLinkNavigation()
          }
        },
        err => {
          setisLoading(false);
          if (err?.response?.data) {
            if (err?.response?.data?.error?.email?.[0] !== "") {
              Toast.show({
                type: 'error',
                text1:err?.response?.data?.error?.email?.[0]
              });
            } else {
              Toast.show({
                type: 'error',
                text1:err?.response?.data?.error?.username?.[0]
              });
            }
          }
        },
      );
    }
  };

  const onChangeCheckedBox = () => {
    setCheckedBox(!CheckedBox);
  };

  const checkusername = () => {
    if (email != '') {
      let config = {
        url: ApiUrl.checkusername,
        method: 'post',
        body: {
          username: username,
        },
      };

      APIRequest(
        config,
        res => {
          if (res.status) {
            setusernameError('');
          }
        },
        err => {
          console.log(err?.response?.data);
          if (err?.response?.data) {
            setusernameError(err?.response?.data?.error);
          }
        },
      );
    }
  };

  const checkEmail = () => {
    if (email != '') {
      let config = {
        url: ApiUrl.checkemail,
        method: 'post',
        body: {
          email: email,
        },
      };

      APIRequest(
        config,
        res => {
          if (res.status) {
            setemailError('');
          }
        },
        err => {
          console.log(err?.response?.data);
          if (err?.response?.data) {
            setemailError(err?.response?.data?.error);
            Toast.show({
              type: 'info',
              text1: err?.response?.data?.error
            })
          }
        },
      );
    }
  };

  const validation = () => {

    if (name == '') {
      Toast.show({
        type: 'info',
        text1: 'Please Enter Name',
      });
      return false;
    }
    if (username == '') {
      Toast.show({
        type: 'info',
        text1: 'Please Enter Username',
      });
      return false;
    }
    if (email == '') {
      Toast.show({
        type: 'info',
        text1: 'Please Enter Email',
      });
      return false;
    }
    if (password == '') {
      Toast.show({
        type: 'info',
        text1: 'Please Enter Password',
      });
      return false;
    }
    if (password?.length < 6) {
      Toast.show({
        type: 'info',
        text1: 'Please Enter Valid Password',
      });
      return false;
    }
    if (CheckedBox == false) {
      Toast.show({
        type: 'info',
        text1: 'Please Select Terms & Conditions ',
      });
      return false;
    } else {
      return true;
    }
  };

  const _googleLogin = async () => {
    console.log('ghnfgnfgjntfg');
    try {
      GoogleSignin.signOut();
      setisLoading(true);
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();
      let { accessToken } = await GoogleSignin.getTokens();
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      let response = await auth().signInWithCredential(googleCredential);

      if (response && Object.keys(response.additionalUserInfo).length) {
        let { user } = response;
        let { profile } = response.additionalUserInfo;
        console.log(profile);
        let data = {
          type: 'google',
          token: accessToken,
          social_id: user?.uid,
          name: user?.displayName,
          email: profile?.email,
          phone_number: user?.phoneNumber,
          id: profile.sub,
        };
        socialLogin(data);
      }
      setisLoading(false);
    } catch (err) {
      console.log(err);

      setisLoading(false);
    }
  };

  const _facebookLogin = async () => {
    try {
      // Attempt login with permissions
      const result = await LoginManager.logInWithPermissions([
        'email',
        'public_profile',
      ]);
      if (result.isCancelled) {
        throw 'User cancelled the login process';
      }

      // Once signed in, get the users AccesToken
      const { accessToken } = await AccessToken.getCurrentAccessToken();

      // Create a Firebase credential with the AccessToken
      const facebookCredential =
        auth.FacebookAuthProvider.credential(accessToken);

      // Sign-in the user with the credential
      let response = await auth().signInWithCredential(facebookCredential);
      if (response && Object.keys(response.additionalUserInfo).length) {
        let { profile } = response.additionalUserInfo;
        console.log(profile);
        let data = {
          type: 'facebook',
          id: profile.id,
          token: accessToken,
          name: profile.name,
          email: profile.email,
          phone_number: profile.mobile,
        };
        socialLogin(data);
      }
    } catch (err) {
      LoginManager.logOut();
    }
  };

  const onAppleButtonPress = async () => {
    try {
      // performs login request

      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      console.log(appleAuthRequestResponse)
      // get current authentication state for user
      // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );

      // use credentialState response to ensure the user is authenticated
      if (credentialState === appleAuth.State.AUTHORIZED) {
        // user is authenticated
        let data = {
          type: 'apple',
          id: appleAuthRequestResponse.user,
          token: appleAuthRequestResponse.identityToken,
          name: '',
          email: 'none',
          phone_number: '',
        };
        socialLogin(data);
      }
    } catch (e) { }
  };

  const socialLogin = data => {
    setisLoading(true);
    let config = {
      url: ApiUrl.oauth,
      method: 'post',
      body: {
        email: data.email,
        id: data.id,
        name: data.name,
        oauthToken: data.token,
        provider: data.type,
        device_type: Platform.OS.toUpperCase(),
        device_token: device_id,
      },
    };
    APIRequest(
      config,
      res => {
        if (res.status) {
          if (res?.is_email_required) {
            navigation.navigate('provideEmail', { token: res?.token });
          } else {
            if (!res?.is_first_login) {
              const user = new User();
              user.setFromRegister(false);
            }
            new User().setuserdata(res.auth);
            new User().setPrefixurl(res.files_prifix);
            new User().setToken(res.token);
            setType(res?.auth?.role_id);
            // setFromRegister(false);
            setLogin('true');
          }
        }
        setisLoading(false);
      },
      err => {
        console.log(err.response?.data);
        setisLoading(false);
        if (err?.response?.data) {
          Toast.show({
            type: 'error',
            text1: err?.response?.data?.error,
          });
        }
      },
    );
  };

  const redirectToLogin = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      }),
    );
  };
  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps={true}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={color.white}></StatusBar>
      <View style={style.registerView}>
        <Video
          source={IMAGE.lybertinVideo}
          controls={false}
          rate={1.0}
          volume={audioLevel}
          ref={videoRef}
          muted={isPaused}
          paused={isPaused}
          repeat={true}
          resizeMode={'cover'}
          style={style.video}
        />
        <ScrollView keyboardShouldPersistTaps={'always'}>
          <View></View>
          <View style={style.body}>
            <View>
              <Image source={IMAGE.logo1} style={style.registerBanner} />
              <Text style={style.heading}>LYBERTINE</Text>
              {/* <Text style={style.heading2}>Create an account</Text> */}
            </View>

            <View>
              <Textinput
                value={name}
                changeText={v => {
                  setname(v);
                }}
                style={{ backgroundColor: 'white' }}
                placeholder={'Full Name'}
                icon={IMAGE.user}
              />
              <Textinput
                error={emailError}
                value={email}
                style={{ backgroundColor: 'white' }}
                onBlur={checkEmail}
                keyboardType={'email-address'}
                changeText={v => {
                  setEmail(v);
                }}
                placeholder={'Email Address'}
                isEmail={true}
                icon={IMAGE.mail}
              />
              <Textinput
                error={usernameError}
                value={username}
                style={{ backgroundColor: 'white' }}
                onBlur={checkusername}
                changeText={v => {
                  setusername(v);
                }}
                placeholder={'Username'}
                icon={IMAGE.user}
              />
              <Textinput
                value={password}
                changeText={v => {
                  setPassword(v);
                }}
                style={{ backgroundColor: 'white' }}
                placeholder={'Password'}
                onIconPress={() => setsecureText(!secureText)}
                secureTextEntry={secureText}
                icon={IMAGE.password}
                suffixIcon={secureText ? IMAGE.show : IMAGE.hide}
                onsuffixIconPress={() => setsecureText(!secureText)}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <TouchableOpacity
                style={style.tncWrap}
                onPress={() => {
                  onChangeCheckedBox();
                }}>
                <Image
                  source={CheckedBox ? IMAGE.checkNewFill : IMAGE.checkmark_circle_outline}
                  style={style.checkIcon}
                />

                <Text style={style.agreeText}>I agree to Lybertine</Text>
              </TouchableOpacity>
              <Text
                style={style.termsText}
                onPress={() => navigation.navigate('Terms')}>
                Terms & Conditions
              </Text>
            </View>
            <View style={{ marginTop: hp(1) }}>
              <Button onPress={signup} loading={isLoading} label={'Continue'} />
            </View>
            <View style={{ marginVertical: hp(2) }}>
              <Text style={style.orregister}>Or sign up with</Text>
            </View>

            {Platform.OS == 'ios' ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: '4%',
                }}>
                <TouchableOpacity
                  onPress={_googleLogin}
                  style={style.socialBtn}>
                  <Image source={IMAGE.google} style={style.socialIcon} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={_facebookLogin}
                  style={style.socialBtn}>
                  <Image source={IMAGE.facebook} style={style.socialIcon} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={style.socialBtn}
                  onPress={onAppleButtonPress}>
                  <Image source={IMAGE.apple} style={style.socialIcon} />
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginHorizontal: '20%',
                }}>
                <TouchableOpacity
                  onPress={_googleLogin}
                  style={style.socialBtn}>
                  <Image source={IMAGE.google} style={style.socialIcon} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={_facebookLogin}
                  style={style.socialBtn}>
                  <Image source={IMAGE.facebook} style={style.socialIcon} />
                </TouchableOpacity>
                {/* <TouchableOpacity style={style.socialBtn}>
            <Image source={IMAGE.apple} style={style.socialIcon} />
          </TouchableOpacity>  */}
              </View>
            )}

            <TouchableOpacity
              onPress={() => {
                redirectToLogin();
              }}
              style={{ marginVertical: hp(3) }}>
              <Text style={style.dontText}>
                Already have an Account?{' '}
                <Text
                  style={{
                    fontFamily: fontFamily.Bold,
                    // textDecorationLine: 'underline',
                    color: color.white,
                  }}>
                  Sign in
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAwareScrollView>
  );
};

const style = StyleSheet.create({
  socialIcon: {
    height: 32,
    width: 32,
    resizeMode: 'contain',
  },
  registerBanner: {
    alignSelf: 'center',
    height: 140,
    width: 140,
    resizeMode: 'contain',
    marginTop: hp(15),
  },
  socialBtn: {
    borderRadius: 40,
    // borderWidth:0.5,
    // borderColor:color.lightSlaty,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingHorizontal:wp(3),
    // flexDirection:'row',
    // justifyContent:'space-between',
    height: 74,
    width: 74,
    backgroundColor: color.white,
    shadowColor: '#00000029',
    shadowOffset: { width: 5, height: 10 },
    shadowOpacity: 6,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: '5%',
  },
  socialBtnText: {
    fontSize: 11,
    fontFamily: fontFamily.Regular,
    color: color.white,
  },
  dontText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: fontFamily.Regular,
    color: color.white,
  },
  body: {
    marginTop: -hp(7),
    paddingHorizontal: wp(10),
  },
  forget: {
    marginTop: -hp(1),
    textAlign: 'right',
    fontSize: 14,
    fontFamily: fontFamily.Regular,
    color: color.white,
  },
  orregister: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: fontFamily.Regular,
    color: color.white,
  },
  heading2: {
    fontSize: 15,
    fontFamily: fontFamily.Regular,
    color: color.white,
    marginBottom: wp(8),
  },
  heading: {
    fontSize: 30,
    fontFamily: fontFamily.Bold,
    color: color.white,
    textAlign: 'center',
    marginVertical: 20,
    // opacity: 0.45,
  },
  registerView: {
    flex: 1,
    backgroundColor: color.white,
  },
  checkIcon: {
    height: 16,
    width: 16,
    resizeMode: 'contain',
    tintColor: color.white,
  },
  tncWrap: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  agreeText: {
    fontSize: 14,
    fontFamily: fontFamily.Medium,
    color: color.white,
    marginLeft: '5%',
  },
  termsText: {
    fontSize: 14,
    fontFamily: fontFamily.Bold,
    color: color.white,
    marginLeft: '2%',
    textDecorationLine: 'underline',
  },
  video: {
    flex: 1,
    // objectFit:'cover',
    position: 'absolute',
    zIndex: -1,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: Dimensions.get('window').height + 140,
    width: Dimensions.get('window').width + 20,
  },
});
export default Register;
