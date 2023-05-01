import { CommonActions } from '@react-navigation/native';
import React, {useState, useContext, useEffect, FC} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { heightPercentageToDP as hp , widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { color,IMAGE,fontFamily } from '../../constant/';
import {Button,Textinput} from './../../component/';
import {APIRequest,ApiUrl} from './../../utils/api';
import Toast from 'react-native-toast-message';
const STATUSBAR_HEIGHT = StatusBar.currentHeight;


const ForgetPassword  = ({navigation}) => {
  const [isLoading,setisLoading] = useState(false);
  const [email,setemail] = useState('');

  
  const _forgetPassword = () =>{
    if(email=='') {
      Toast.show({
        type: 'info',
        text1: 'Please Enter Email Address',
      });
    } else {
      setisLoading(true)
      let config = {
        url:ApiUrl.forget,
        method:'post',
        body:{
          email:email,
        }
      }

      APIRequest(config,
      (res) =>{
        Toast.show({
          type: 'success',
          text1: res.message
        });
        if(res.status) {
        }
        setisLoading(false)
      },
      (err) =>{
        console.log(err.response?.data);
        setisLoading(false)
        if(err?.response?.data) {
          Toast.show({
            type: 'error',
            text1: err?.response?.data?.error
          });
        }
      })
    }
  }
  const redirectToLogin = () =>{
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'Login' },
        ],
      })
    );
  
  }

  return (
    <View style={style.forgetView}>
      <View
          style={[
            style.backBtnPosition,
            {top: STATUSBAR_HEIGHT + (Platform.OS == 'ios' ? 50 : 15)},
          ]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={IMAGE.ArrowLeft} style={style.backImage} />
          </TouchableOpacity>
        </View>
      <ScrollView>
        <View>
          <Image source={IMAGE.shape_bg} style={{height:hp(45),resizeMode:'contain',top:-hp(14),position:'absolute',width:wp(100)}} />
          <Image source={IMAGE.forget} style={style.forgetBanner} />
        </View>
        <View style={style.body}>
            <View>
              <Text style={style.heading2}>Forgot Password</Text>
              <Text style={style.passText}>To receive a confirmation email, enter your correct email address.</Text>
            </View>
            <View style={{marginTop:hp(4), marginBottom:hp(2)}}>
              <Textinput changeText={setemail} value={email} placeholder={'Enter Email Address'} isEmail={true} icon={IMAGE.mail} />
            </View>
            <View style={{marginTop:hp(1)}}>
              <Button onPress={_forgetPassword} loading={isLoading} label={"Send"} />
            </View>
            <TouchableOpacity onPress={()=>{redirectToLogin()}} style={{marginVertical:hp(3)}}>
              <Text style={style.dontText}>Remember Password ? <Text style={{fontFamily:fontFamily.Bold,color:color.btnBlue}}>SIGN IN</Text></Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const style = StyleSheet.create({
  socialIcon:{
    height:15,
    width:15,
    resizeMode:'contain'
  },
  forgetBanner:{
    alignSelf:'center',
    height:hp(45),
    width:wp(80),
    resizeMode:'contain'
  },
  socialBtn:{
    borderRadius:10,
    borderWidth:1,
    borderColor:color.lightSlaty,
    alignItems:'center',
    paddingHorizontal:wp(3),
    flexDirection:'row',
    justifyContent:'space-between',
    height:hp(6),
    width:wp(37),
    backgroundColor:color.extralightSlaty,
  },
  socialBtnText:{
    fontSize:11,
    fontFamily:fontFamily.Regular,
    color:color.slaty,
  },
  dontText:{
    textAlign:'center',
    fontSize:13,
    fontFamily:fontFamily.Regular,
    color:color.slaty,
  },
  body:{
    marginTop:-hp(7),
    paddingHorizontal:wp(10),
  },
  forget:{
    marginTop:-hp(1),
    textAlign:'right',
    fontSize:12,
    fontFamily:fontFamily.Regular,
    color:color.slaty,
  },
  orforget:{
    textAlign:'center',
    fontSize:12,
    fontFamily:fontFamily.Regular,
    color:color.slaty,
  },
  heading2:{
    fontSize:23,
    fontFamily:fontFamily.Bold,
    color:color.btnBlue,
  },
  passText:{
    marginTop: hp(1),
    fontSize:15,
    fontFamily:fontFamily.Regular,
    color:'#0F2D52',
  },
  forgetView:{
    flex:1,
    backgroundColor:color.background2
  },
  backBtnPosition: {
    position: 'absolute',
    left: 15,
    top: STATUSBAR_HEIGHT + 15,
    zIndex: 1,
  },
  backImage: {
    height: 32,
    width: 32,
    resizeMode: 'contain',
  },
});
export default ForgetPassword;
