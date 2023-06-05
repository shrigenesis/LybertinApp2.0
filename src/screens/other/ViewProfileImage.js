import React from 'react'
import { StatusBar, View, Image } from 'react-native'
import { Header } from '../../component'
import { IMAGE, color } from '../../constant'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const ViewProfileImage = ({route}) => {
  const { image, name } = route?.params
  return (
    <View>
      <StatusBar barStyle={'dark-content'} backgroundColor={color.white} />
      <Header
        title={name}
      />
      <View style={{ backgroundColor: color.black }}>
        {image==='default'?
        <Image style={{ height: hp(100), width: wp(100), resizeMode: 'contain' }} source={IMAGE.defaultAvatar} />:
        <Image style={{ height: hp(100), width: wp(100), resizeMode: 'contain' }} source={{ uri: image }} />}
      </View>
    </View>
  )
}

export default ViewProfileImage