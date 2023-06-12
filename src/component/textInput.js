import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Easing,
  Image,
  StyleSheet,
  TextInput,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { color } from './../constant/color';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { fontFamily } from './../constant/font';
import { fontSize } from '../constant';

const Textinput = props => {
  let inputRef = React.useRef();
  let {
    error = '',
    value = '',
    autoCapitalize = 'sentences',
    changeText = () => { },
    keyboardType = 'default',
    secureTextEntry = false,
    placeholderTextColor = color.textslaty,
    style = {},
    textAlignVertical = 'center',
    multiline = false,
    numberOfLines,
    placeholder,
    inputViewCss,
    showError = true,
    editable = true,
    returnKeyType = 'next',
    withLeftDropDown = false,
    icon = undefined,
    suffixIcon = undefined,
    onsuffixIconPress = () => { },
    isEmail = false,
    onIconPress = () => { },
    onBlur = () => { },
    validationError = '',
  } = props;
  
  return (
    <View style={[styles.inputWrapper, inputViewCss]}>
      {icon && (
        <TouchableOpacity onPress={onIconPress} style={styles.LeftIconViewStyle}>
          <Image source={icon} style={styles.IconStyle} />
        </TouchableOpacity>
      )}
      <View>
        <TextInput
          ref={inputRef}
          textAlignVertical={textAlignVertical}
          value={value}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          multiline={multiline}
          placeholderTextColor={placeholderTextColor}
          placeholder={placeholder}
          numberOfLines={numberOfLines}
          secureTextEntry={secureTextEntry}
          editable={editable}
          onChangeText={value => {
            changeText(value);
          }}
          onFocus={() => {
            inputRef?.current?.setNativeProps({
              borderColor: color.iconBlue,
            });
          }}
          onBlur={() => {
            onBlur();
            inputRef?.current?.setNativeProps({
              borderColor: color.borderGray,
            });
          }}
          style={[withLeftDropDown == true ? styles.inputWithDropDown : styles.input, style]}
        />
      </View>
      {suffixIcon && (
        <TouchableOpacity onPress={onsuffixIconPress} style={styles.IconViewStyle}>
          <View style={styles.iconTouchableSize}>
            <Image source={suffixIcon} style={styles.IconStyle} />
          </View>
        </TouchableOpacity>
      )}
      {validationError !='' &&(
        <Text style={styles.errorText}>{validationError}</Text>
        )}
      {showError === true ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  IconStyle: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    tintColor: color.btnBlue
  },
  iconTouchableSize: {
    width: 40,
    height: 40,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS == "ios" ? 9 : 0,
  },
  IconViewStyle: {
    zIndex: 99999,
    position: 'absolute',
    right: wp(2),
    top: hp(.5)
  },
  LeftIconViewStyle: {
    zIndex: 999,
    position: 'absolute',
    left: wp(5),
    top: hp(2.2),
  },
  errorText: {
    color: 'red',
    fontSize: 10,
    fontFamily: fontFamily.Regular,
    paddingVertical: hp(0.5),
    paddingLeft: wp(1),
  },
  input: {
    paddingLeft: wp(15),
    color: color.textslaty,
    fontSize: fontSize.size14,
    width: wp(80),
    fontFamily: fontFamily.Regular,
    height: hp(7),
    padding: 0,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: color.borderGray,
  },
  inputWithDropDown: {
    paddingLeft: wp(0),
    color: color.textslaty,
    fontSize: 14,
    width: wp(80),
    fontFamily: fontFamily.Regular,
    height: hp(7),
    padding: 0,
    borderColor: color.borderGray
  },
});
export default Textinput;
