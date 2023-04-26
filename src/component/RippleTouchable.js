import React, { FC } from 'react';
import {TouchableNativeFeedback,View} from 'react-native';
import { color } from '../constant';

const RippleTouchable = (props) => {
  let {
    onPress=()=>{},
    children,
    backgroundColor=color.lightSlaty,
    style,
    borderRadius=10,
    viewStyle
  } = props;

  return (
    <View style={{ borderRadius: borderRadius,...viewStyle, overflow: 'hidden' }}>
      <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple(backgroundColor,false)}
        onPress={() => {
          onPress(); 
        }}>
        <View style={style}>
          {children}
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

export default RippleTouchable;
