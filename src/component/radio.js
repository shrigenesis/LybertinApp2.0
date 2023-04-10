import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import {color} from './../constant/color';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {fontFamily} from './../constant/font';

const Radio = props => {
  let {
    label = '',
    outerStyle,
    innerStyle,
    labelStyle,
    onPress = () => {},
    active=false,
    style
  } = props;
  return (
    <TouchableOpacity
      style={[{flexDirection:'row',marginRight:wp(5),alignItems:'center'},{...style}]}
      onPress={() => {
        onPress(!active);
      }}>
        <View style={[styles.outerStyle, {...outerStyle},(active)&&{height: 18,width: 18,borderColor:color.btnBlue}]}>
          {(active)&&
            <View style={[styles.innerStyle,{...innerStyle}]}/>
          }
        </View>
        <Text style={[styles.labelStyle,{...labelStyle}]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  labelStyle: {
    marginLeft:wp(2),
    fontSize: 15,
    color: color.black,
    fontFamily: fontFamily.Regular,
  },
  innerStyle:{
    height: 8,
    width: 8,
    borderRadius: 6,
    backgroundColor: color.btnBlue,
  },
  outerStyle: {
    height: 18,
    width: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: color.borderGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default Radio;
