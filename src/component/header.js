import React, {useEffect, useState, FC} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import {color} from '../constant/color';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {fontFamily} from '../constant/font';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import Loader from './loader';
import {fontSize} from '../constant';

const Header = props => {
  const {
    isLoading,
    headStyle = {},
    title,
    LeftRouteParams = {},
    headingStyle = {},
    LeftIcon = false,
    expandedTitle = false,
    leftRoute = '',
    RightIcon = null,
    appReady = false,
  } = props;

  const navigation = useNavigation();

  const renderOtherHeader = () => {
    return (
      <View style={[style.headerWrapper, headStyle]}>
        <View
          style={
            !expandedTitle
              ? style.leftIconWrapper
              : style.expandedLeftIconWrapper
          }>
          {LeftIcon ? (
            <LeftIcon />
          ) : (
            <TouchableOpacity
              style={style.leftIconWrapper}
              onPress={() => {
                navigation && leftRoute
                  ? navigation.navigate(leftRoute, LeftRouteParams)
                  : navigation.goBack(null);
              }}>
              <Icon
                name={'angle-left'}
                style={{fontSize: 30, color: color.black}}
              />
            </TouchableOpacity>
          )}
        </View>
        {title && (
          <View style={style.titleWrapper}>
            <Text style={[style.heading, headingStyle]}>{title}</Text>
          </View>
        )}
        {RightIcon && (
          <View style={style.rightIconWrapper}>
            <RightIcon />
          </View>
        )}
      </View>
    );
  };

  return renderOtherHeader();
};

const style = StyleSheet.create({
  headerWrapper: {
    height: 50,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#171717',
    shadowOffset: {width: -1, height: 4},
    shadowOpacity: 0.1,
    elevation: 2,
    shadowRadius: 2,
    backgroundColor: color.white,
  },
  leftIconWrapper: {
    width: 45,
    height: 45,
    paddingLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandedLeftIconWrapper: {
    minWidth: 250,
    height: 45,
    paddingLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleWrapper: {
    width: Dimensions.get('window').width - 130,
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  heading: {
    textAlign: 'center',
    fontSize: fontSize.size13,
    color: color.black,
    fontFamily: fontFamily.Bold,
  },
  rightIconWrapper: {
    width: 45,
    height: 45,
    paddingRight: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
export default Header;
