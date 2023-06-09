import React from 'react';
import {
  Pressable,
  SafeAreaView,
  TouchableHighlight,
  Platform,
} from 'react-native';
import {View, StyleSheet, Text} from 'react-native';
import {BottomSheet, Button} from 'react-native-elements';
import {color, fontFamily, fontSize} from '../constant';
import {Divider} from 'react-native-elements';
import LottieView from 'lottie-react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const BottomSheetUploadFile = props => {
  return (
    <>
      <BottomSheet modalProps={{}} isVisible={props.isShowBottomSheet}>
        <Pressable
          style={styles.outerContainer}
          onPress={() => props.setisShowBottomSheet(false)}>
          <Pressable style={styles.container}>
            <View>
              {props?.confetti ? (
                <LottieView
                  speed={1}
                  style={{height: 300, position: 'absolute', marginStart: 30}}
                  source={require('./../animation/Confetti.json')}
                  autoPlay
                  loop={false}
                />
              ) : null}
              <Divider style={styles.divider} />
              {props.children}
              <Divider style={styles.dividerSpace} />
              <Button
                onPress={() => props.setisShowBottomSheet(false)}
                title={props.cancelBtn.title}
                titleStyle={{
                  color: props?.cancelBtn?.textColor
                    ? props?.cancelBtn?.textColor
                    : color.white,
                }}
                buttonStyle={{
                  backgroundColor: props.cancelBtn.color,
                  borderWidth: 2,
                  borderColor: 'white',
                  borderRadius: 11,
                  padding: 15,
                }}
              />
            </View>
          </Pressable>
        </Pressable>
      </BottomSheet>
    </>
  );
};

const BottomSheetUploadFileStyle = StyleSheet.create({
  roportHeading: {
    fontSize: fontSize.size15,
    fontFamily: fontFamily.Bold,
    textAlign: 'center',
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 12,
    fontFamily: fontFamily.Regular,
    color: color.textGray2,
    textAlign: 'center',
  },
  cardBlock: {
    // marginLeft: wp(10),
    paddingRight: wp(7),
    paddingVertical: hp(2),
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: color.borderGray,
  },
  icon: {
    resizeMode: 'contain',
    height: 22,
    width: 22,
    tintColor: color.btnBlue,
  },
  cardText: {
    paddingLeft: wp(5),
    fontSize: Platform.OS === 'ios' ? 15 : 13,
    fontFamily: fontFamily.Regular,
    color: color.black,
  },
});

export {BottomSheetUploadFile, BottomSheetUploadFileStyle};

const styles = StyleSheet.create({
  outerContainer: {
    height: hp(100),
    backgroundColor: color.extralightSlaty,
  },
  container: {
    backgroundColor: color.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    width: wp(100),
  },
  divider: {
    height: 2,
    width: 30,
    backgroundColor: color.divider,
    alignSelf: 'center',
    marginBottom: 20,
  },
  dividerSpace: {
    height: 20,
    backgroundColor: color.white,
    alignSelf: 'center',
  },
});
