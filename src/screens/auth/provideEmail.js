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
import { color, IMAGE, fontFamily } from '../../constant';
import { User } from '../../utils/user';
import { Button, Textinput } from '../../component';
import { APIRequest, ApiUrl } from '../../utils/api';
import { LoginContext } from '../../context/LoginContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Video from 'react-native-video';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { useRef } from 'react';



const ProvideEmail = ({ navigation, route }) => {
  const { token } = route.params;
  console.log(token);
  const { setLogin, setType } = useContext(LoginContext);
  const [email, setEmail] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [emailError, setemailError] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [isPaused, setisPaused] = useState(false);
  const videoRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      // Make textInput editable when page is in focus
      setIsFromRegister();

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

  const handleSubmit = () => {


    if (validation()) {
      setisLoading(true);
      let config = {
        url: ApiUrl.continueWithEmail,
        method: 'post',
        body: {
          email: email,
          token: token,
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
          }
        },
        err => {
          setisLoading(false);
          console.log(err);
          if (err?.response?.status == 422) {
            setemailError(err?.response?.data?.error);
          } else {
            Toast.show({
              type: 'info',
              text1: 'Invalid user',
            });
          }
        },
      );
    }
  };

  const validation = () => {


    if (email == '') {
      Toast.show({
        type: 'info',
        text1: 'Please Enter Email',
      });
      return false;
    }
    return true;

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
    <View style={style.registerView}>
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
        <ScrollView keyboardShouldPersistTaps={'always'} >

          <View></View>
          <View style={style.body}>
            <View>
              <Image source={IMAGE.logo1} style={style.registerBanner} />
              <Text style={style.heading}>LYBERTINE</Text>
              {/* <Text style={style.heading2}>Create an account</Text> */}
            </View>

            <View>


              <Textinput
                error={emailError}
                value={email}
                style={{ backgroundColor: 'white' }}
                keyboardType={'email-address'}
                changeText={v => {
                  setEmail(v);
                }}
                placeholder={'Email Address'}
                isEmail={true}
                icon={IMAGE.mail}
              />

            </View>

            <View style={{ marginTop: hp(1) }}>
              <Button onPress={handleSubmit} loading={isLoading} label={'Continue'} />
            </View>
            <View style={{ marginVertical: hp(2) }}>
              <Text style={style.orregister}>Or sign up with</Text>
            </View>



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
    // marginRight: 10,
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
export default ProvideEmail;
