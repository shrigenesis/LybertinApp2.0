import React, { FC } from 'react';
import {TouchableOpacity,Text} from 'react-native';

const PressableText = (props) => {
  let {
    onPress=()=>{},
    text,
    labelStyle,
  } = props;

  return (
      <TouchableOpacity 
        onPress={() => {
          onPress();
        }}>
        <Text style={labelStyle}>{text}</Text>
      </TouchableOpacity>
  );
};

export default PressableText;
