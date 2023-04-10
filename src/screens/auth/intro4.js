import React, {useState, useContext, useEffect, FC} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {color, IMAGE, fontFamily} from '../../constant';
import {User} from '../../utils/user';
import {
  Button,
  Textinput,
  PressableText,
  RippleTouchable,
} from '../../component';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

const Intro4 = ({navigation}) => {
  const [isLoading, setisLoading] = useState(false);
  const onSwipe = (gestureName, gestureState) => {
    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    console.log(gestureName);
    {
      gestureName == SWIPE_LEFT
        ? (navigation.navigate('Login'), new User().setisOld())
        : navigation.navigate('Intro3');
    }
  };

  return (
    <GestureRecognizer onSwipe={onSwipe} style={style.introView}>
      <ScrollView>
        <View>
          <Image source={IMAGE.stories_bg} style={style.introBanner} />
        </View>
        <View style={style.body}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Intro3')}
              style={style.dot}></TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Intro3')}
              style={style.dot}></TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Intro3')}
              style={style.dot}></TouchableOpacity>
            <View style={style.dotActive}></View>
          </View>
          <View style={{marginVertical: 50, alignItems: 'center'}}>
            <Text style={style.heading}>Stories</Text>
            <Text style={style.heading2}>
              Let your friends know what you're up to via your stories.
            </Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <Button
              loading={isLoading}
              onPress={() => navigation.navigate('Register')}
              label={'Create an account'}
            />
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={{marginTop: hp(2), marginBottom: hp(3)}}>
            <Text style={style.dontText}>
              Already have an account ?{' '}
              <Text
                style={{
                  fontFamily: fontFamily.Light,
                  // textDecorationLine: 'underline',
                  color: color.btnBlue,
                }}>
                Sign in
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </GestureRecognizer>
  );
};

const style = StyleSheet.create({
  introView: {
    flex: 1,
    backgroundColor: '#F3F3F3',
  },
  introBanner: {
    alignSelf: 'center',
    height: hp(55),
    width: wp(80),
    resizeMode: 'contain',
  },
  body: {
    height: hp(45),
    backgroundColor: color.white,
    borderTopLeftRadius: 113,
    alignItems: 'center',
    paddingVertical: 40,
  },
  dotActive: {
    width: 26,
    height: 9,
    borderRadius: 5,
    margin: 1,
    backgroundColor: color.btnBlue,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    margin: 1,
    backgroundColor: color.borderGray,
  },
  heading: {
    fontSize: 25,
    fontFamily: fontFamily.Bold,
    color: color.black,
    lineHeight: 30,
    // opacity: 0.45,
  },
  heading2: {
    fontSize: 13,
    marginHorizontal: 80,
    textAlign: 'center',
    fontFamily: fontFamily.Light,
    color: color.textslaty,
  },
  dontText: {
    textAlign: 'center',
    fontSize: 13,
    fontFamily: fontFamily.Regular,
    color: color.slaty,
  },
});
export default Intro4;
