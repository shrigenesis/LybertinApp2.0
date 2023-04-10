import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, SafeAreaView } from 'react-native';
import { IMAGE, color, fontFamily } from '../../constant/';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { APIRequest, ApiUrl, Toast } from './../../utils/api';
import SimpleToast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button, Header, Textinput } from './../../component/';

const ChangePassword = ({ navigation }) => {
  const [isLoading, setisLoading] = useState(false);
const [oldPassword, setOldPassword] = useState('');
const [newPassword, setNewPassword] = useState('');
const [confirmNewPassword, setConfirmNewPassword] = useState('');
const [secureText, setsecureText] = useState(true);
const [validationError, setValidationError] = useState({});

const hasError = (key) => {
  if (validationError[key] !== undefined) {
    return <Text style={style.validationError}>{validationError[key][0]}</Text>
  }

}
const updatePassword = () => {

  setisLoading(true)
  let config = {
    url: ApiUrl.changePassword,
    method: 'post',
    body: {
      old_password: oldPassword,
      password: newPassword,
      confirm_password: confirmNewPassword
    }
  }
  APIRequest(config,
    (res) => {
      if (res?.status) {

        if (res?.alert?.message) {
          SimpleToast.show(res?.alert?.message)
          navigation.goBack()
        }
      } else {
        Toast(res?.message);
      }
      setisLoading(false)
    },
    (err) => {
      setisLoading(false)
      if (err?.response?.status == 422) {
        console.log(err?.response?.data?.error);
        setValidationError(err?.response?.data?.error)
      }
    })
}

  return (
      <SafeAreaView style={style.safeArea}>
        <View style={{flex: 1, backgroundColor: color.white}}>
          <StatusBar barStyle={'dark-content'} backgroundColor={color.white} />
          <Header
              title="Change Password"
            />
    
          <View style={style.body}>
            <ScrollView showsVerticalScrollIndicator={false}>
    
              <View style={style.fieldwrapper}>
    
                <Textinput
                  value={oldPassword}
                  changeText={value => {
                    setOldPassword(value);
                  }}
                  placeholder={'Current Password'}
                  secureTextEntry={secureText}
                  iconColor={'#687c94'}
                  icon={IMAGE.password}
                  suffixIcon={secureText ? IMAGE.show : IMAGE.hide}
                  onsuffixIconPress={() => setsecureText(!secureText)}
                  validationError={hasError('old_password')}
                />
    
                <Textinput
                  value={newPassword}
                  changeText={value => {
                    setNewPassword(value);
                  }}
                  placeholder={'New Password'}
                  secureTextEntry={secureText}
                  iconColor={'#687c94'}
                  icon={IMAGE.password}
                  suffixIcon={secureText ? IMAGE.show : IMAGE.hide}
                  validationError={hasError('password')}
                  onsuffixIconPress={() => setsecureText(!secureText)}
                />
    
                <Textinput
                  value={confirmNewPassword}
                  changeText={value => {
                    setConfirmNewPassword(value);
                  }}
                  placeholder={'Confirm New Password'}
                  secureTextEntry={secureText}
                  iconColor={'#687c94'}
                  icon={IMAGE.password}
                  validationError={hasError('confirm_password')}
                  suffixIcon={secureText ? IMAGE.show : IMAGE.hide}
                  onsuffixIconPress={() => setsecureText(!secureText)}
                />
    
              </View>
              <View style={style.btn}>
                <Button
                  onPress={updatePassword}
                  loading={isLoading}
                  label={"Change Password"} />
              </View>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    );
  }
  
  const style = StyleSheet.create({
    
    safeArea: {
      flex: 1,
      backgroundColor: color.white
    },
    body: {
      flex: 1,
      paddingHorizontal: wp(10),
    },
    fieldwrapper: {
      flex: 1,
      flexDirection: "column",
      marginVertical: hp(2)
    },
    passText: {
      marginTop: hp(1),
      fontSize: 15,
      fontFamily: fontFamily.Regular,
      color: '#0F2D52',
      textAlign: "center",
    },
    btn: {
      marginTop: hp(2)
    },
    validationError: {
      color: color.red,
      fontSize: 13,
      textAlign: "left"
    }
  });
  export default ChangePassword;