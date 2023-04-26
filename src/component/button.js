import React, { FC } from 'react';
import {TouchableNativeFeedback, View, ActivityIndicator,Text, StyleSheet, Keyboard} from 'react-native';
import {color} from './../constant/color';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {fontFamily} from './../constant/font';
import Loader from './loader';
import Animated,{FadeIn} from 'react-native-reanimated';

const Button = (props) => {
  let {
    label,
    btnStyle={},
    labelStyle={},
    onPress = () => {},
    loading=false,
  } = props;

  return (
    <View style={{ borderRadius: 10, overflow: 'hidden' }}>
      <TouchableNativeFeedback disabled={loading} background={TouchableNativeFeedback.Ripple('#EEE',false)}
        onPress={() => {
          onPress();
          Keyboard.dismiss
        }}>
        <View style={[styles.button,btnStyle]}>
          {(loading)?
            <Animated.View entering={FadeIn}>
              <Loader isLoading={loading} type={'circle'}/>
            </Animated.View>
          :
            <Animated.Text entering={FadeIn} style={[styles.btnText, labelStyle]}>{label}</Animated.Text>
          }
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    fontSize: 16,
    fontFamily:fontFamily.Regular,
    color: color.white,
    resizeMode: 'contain',
    marginLeft: wp(1),
  },
  btnText: {
    fontSize: 16,
    color: color.white,
    fontFamily: fontFamily.Regular,
  },
  button: {
    backgroundColor: color.btnBlue,
    borderRadius: 10,
    height: hp(7),
    width: wp(80),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
export default Button;
