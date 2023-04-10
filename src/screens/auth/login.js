/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { color, IMAGE, fontFamily } from '../../constant/';
import { User } from '../../utils/user';
import Video from 'react-native-video';
import {
  Button,
  Textinput,
  PressableText,
  RippleTouchable,
} from './../../component/';
import { APIRequest, ApiUrl, Toast } from './../../utils/api';
import { LoginContext } from './../../context/LoginContext';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import messaging from '@react-native-firebase/messaging';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Dimensions } from 'react-native';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import SyncStorage from 'sync-storage';
import RegisterDeeplink from '../../utils/RegisterDeeplink';
import getPathFromUrl from '../../utils/getPathFromUrl';


const Login = ({ navigation, route }) => {
  const { setLogin, setType } = useContext(LoginContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setsecureText] = useState(true);
  const [isLoading, setisLoading] = useState(false);
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

  const DeepLinkNavigation = ()=>{
   const deepLink = SyncStorage.get('deepLink')
    if(deepLink){
      RegisterDeeplink(deepLink)
    }
  }


  const setIsFromRegister = () => {
    const user = new User();
    user.setFromRegister(false);
  };

  const onAppleButtonPress = async () => {
    try {
      // performs login request

      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

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
    } catch (e) {
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

  const _googleLogin = async () => {
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
          Toast(err?.response?.data?.error);
        }
      },
    );
  };

  const userLogin = () => {
    if (validation()) {
      setisLoading(true);
      let config = {
        url: ApiUrl.login,
        method: 'post',
        body: {
          email: email,
          password: password,
          device_type: Platform.OS == 'ios' ? 'IOS' : 'ANDROID',
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
            setIsFromRegister();
            setType(res?.auth?.role_id);
            setLogin('true');
            DeepLinkNavigation()
          } else {
            Toast(res?.error);
          }
        },
        err => {
          console.log(err);
          setisLoading(false);
          if (err?.response?.data) {
            Toast(err?.response?.data?.error);
          }
        },
      );
    }
  };

  const validation = () => {
    if (email == '') {
      // emailRef.current.focus();
      Toast('Please Enter Email');
      return false;
    } else if (password == '') {
      // passwordRef.current.focus();
      Toast('Please Enter Password');
      return false;
    } else {
      return true;
    }
  };

  return (
    <View style={style.loginView}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={color.white}></StatusBar>
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
      <KeyboardAwareScrollView keyboardShouldPersistTaps={true}>
        <ScrollView keyboardShouldPersistTaps={'always'}>
          <View>
            {/* <Image
              source={IMAGE.shape_bg}
              style={{
                height: hp(45),
                resizeMode: 'contain',
                top: -hp(14),
                position: 'absolute',
                width: wp(100),
              }}
            /> */}
          </View>
          <View style={style.body}>
            <View>
              <Image source={IMAGE.logo1} style={style.loginBanner} />
              <Text style={style.heading}>Welcome Back!</Text>
              {/* <Text style={style.heading2}>Login to your account</Text> */}
            </View>
            {/* <View
            style={{
              marginTop: hp(2),
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <RippleTouchable onPress={_googleLogin} style={style.socialBtn}>
              <Image source={IMAGE.google} style={style.socialIcon} />
              <Text style={style.socialBtnText}>Log In via Google</Text>
            </RippleTouchable>
            <RippleTouchable onPress={_facebookLogin} style={style.socialBtn}>
              <Image source={IMAGE.facebook} style={style.socialIcon} />
              <Text style={style.socialBtnText}>Log In via Facebook</Text>
            </RippleTouchable>
          </View> */}
            {/* <View style={{marginVertical: hp(2.5)}}>
            <Text style={style.orLogin}>Or Log In Using Email</Text>
          </View> */}
            <View>
              <Textinput
                value={email}
                keyboardType={'email-address'}
                changeText={value => {
                  setEmail(value);
                }}
                // ref={(input) => { emailRef = input; }}
                // onSubmitEditing={() => { passwordRef.current.focus(); }}
                style={{ backgroundColor: 'white' }}
                placeholder={'Email Address'}
                isEmail={true}
                returnKeyType="next"
                icon={IMAGE.mail}
              />
              <Textinput
                value={password}
                // ref={(input) => { passwordRef = input; }}
                changeText={value => {
                  setPassword(value);
                }}
                style={{ backgroundColor: 'white' }}
                placeholder={'Password'}
                secureTextEntry={secureText}
                iconColor={'#687c94'}
                icon={IMAGE.password}
                suffixIcon={secureText ? IMAGE.show : IMAGE.hide}
                onsuffixIconPress={() => setsecureText(!secureText)}
              />
              <PressableText
                onPress={() => navigation.navigate('ForgetPassword')}
                labelStyle={style.forget}
                text={'Forgot your P assword?'}
              />
            </View>
            <View style={{ marginTop: hp(4) }}>
              <Button
                loading={isLoading}
                onPress={userLogin}
                label={'Continue'}
              />
            </View>
            <View style={{ marginVertical: hp(2) }}>
              <Text style={style.orLogin}>Or sign in with</Text>
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
              onPress={() => navigation.navigate('Register')}
              style={{ marginTop: hp(2), marginBottom: hp(3) }}>
              <Text style={style.dontText}>
                Don’t have an Account?{' '}
                <Text
                  style={{
                    fontFamily: fontFamily.Bold,
                    // textDecorationLine: 'underline',
                    color: color.white,
                  }}>
                  Sign up
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    </View>
  );
};

const style = StyleSheet.create({
  socialIcon: {
    height: 32,
    width: 32,
    resizeMode: 'contain',
  },
  loginBanner: {
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
    alignItems: 'center',
    // paddingHorizontal:wp(3),
    // flexDirection:'row',
    // justifyContent:'space-between',
    height: 74,
    width: 74,
    backgroundColor: color.white,
    shadowColor: '#00000029',
    shadowOffset: { width: 5, height: 10 },
    shadowOpacity: 4,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: '5%',
  },
  socialBtnText: {
    fontSize: 11,
    fontFamily: fontFamily.Regular,
    color: color.slaty,
  },
  dontText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: fontFamily.Regular,
    color: color.white,
  },
  body: {
    // marginTop: -hp(5),
    paddingHorizontal: wp(10),
  },
  heading: {
    fontSize: 30,
    fontFamily: fontFamily.Bold,
    color: color.white,
    textAlign: 'center',
    marginVertical: 20,
    // opacity: 0.45,
  },
  forget: {
    marginTop: -hp(1),
    textAlign: 'right',
    fontSize: 14,
    fontFamily: fontFamily.Regular,
    color: color.white,
    // textShadowColor: '#171717',
    // textShadowOffset: {width: -2, height: 4},
    // shadowOpacity: 0.2,
    // elevation: 3,
    // shadowRadius: 3,

    // with:'50%',
    // minWidth:'50%',
    // maxWidth:'50%',
  },
  orLogin: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: fontFamily.Regular,
    color: color.white,
  },
  heading2: {
    fontSize: 15,
    fontFamily: fontFamily.Regular,
    color: color.textslaty,
    marginBottom: wp(8),
  },
  loginView: {
    flex: 1,
    backgroundColor: color.white,
  },
  video: {
    position: 'absolute',
    zIndex: -1,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: Dimensions.get('window').height + 80,
    width: Dimensions.get('window').width + 20,
  },
});
export default Login;
