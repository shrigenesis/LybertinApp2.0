
import React, { useState, useEffect, FC, Component } from 'react';
import { Text } from 'react-native';
import { Image } from 'react-native';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform

} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { panHandlerName } from 'react-native-gesture-handler/lib/typescript/handlers/PanGestureHandler';
import { color, fontFamily } from '../../constant';



export default class NoRecord extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    const { image, title, description, buttonText, navigateTo, showButton, navigation, navigateParams } = this.props
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={image} />
        <View style={styles.noFoundText}>
          <Text style={styles.title}>{title}</Text>
          {description !=''  && (
            <Text style={styles.description}>{description}</Text>
          )}
        </View>

        {showButton && (

          <TouchableOpacity
            onPress={() =>
              !navigateParams ? navigation?.navigate(navigateTo) : navigation?.navigate(navigateTo, navigateParams)}
          >
            <View style={styles.button}>
              <Text style={styles.buttonText}>{buttonText}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: hp(70),
    flex: 1,
    backgroundColor: 'white',
    justifyContent: "center",
    alignItems: "center",
  },
  noFoundText: {
    marginTop: hp(2),
  },
  image: {
    height: 120,
    width: 120,
    resizeMode: 'contain',
  },
  title: {
    fontFamily: fontFamily.Bold,
    color: color.black,
    fontSize: Platform.OS == 'ios' ? 20 : 18,
    textAlign: "center"
  },
  description: {
    marginTop: hp(1),
    maxWidth: wp(80),
    fontFamily: fontFamily.Regular,
    color: color.black,
    fontSize: Platform.OS == 'ios' ? 14 : 15,
    textAlign: "center",
  },
  button: {
    marginTop: hp(1.3),
    maxWidth: wp(60),
  },
  buttonText: {
    fontFamily: fontFamily.Bold,
    color: color.btnBlue,
    fontSize: Platform.OS == 'ios' ? 14 : 15,
    textAlign: "center",
  },
});