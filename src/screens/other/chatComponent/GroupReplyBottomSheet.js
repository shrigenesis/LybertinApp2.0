import React, {memo} from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity, Platform} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {IMAGE, color, fontFamily} from '../../../constant';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {
  Button
} from '../../../component';

export const GroupReplyBottomSheet = memo(({bottomSheetRef}) => {
  const snapPoints = [1, 150];

  return (
    <BottomSheet
      ref={bottomSheetRef}
      animateOnMount={true}
      snapPoints={snapPoints}
      onChange={v => {
        console.log(v);
      }}
      style={{elevation: 10, shadowColor: '#000'}}
      backgroundStyle={{borderRadius: 20}}
      backdropComponent={BottomSheetBackdrop}>
      <TouchableOpacity
        onPress={() =>{alert('das')} }
        style={styles.cardBlock}>
        <Image source={IMAGE.media} style={styles.icon} />
        <Text style={styles.cardText}>Reply</Text>
      </TouchableOpacity>
      <View>
        <Button
          onPress={() => bottomSheetRef?.current?.close()}
          btnStyle={{
            marginTop: hp(2),
            alignSelf: 'center',
            backgroundColor: color.red,
            width: wp(90),
            height: hp(5),
          }}
          label={'Cancel'}
        />
      </View>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  icon: {
    resizeMode: 'contain',
    height: 22,
    width: 22,
    tintColor: color.btnBlue
  },
  cardText: {
    paddingLeft: wp(5),
    fontSize: Platform.OS === 'ios' ? 15 : 13,
    fontFamily: fontFamily.Regular,
    color: color.black,
  },
  cardBlock: {
    marginLeft: wp(10),
    paddingRight: wp(7),
    paddingVertical: 15,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: color.borderGray,
  },
});
