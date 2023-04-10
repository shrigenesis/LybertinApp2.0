/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,

} from 'react-native';
import { IMAGE } from '../constant';
import { IMAGEURL } from '../utils/api';
import { User } from '../utils/user';


const UserProfileImage = () => {
  const { avatar, id } = new User().getuserdata();
  const navigation = useNavigation();
  return (
    <TouchableOpacity
        onPress={() => navigation.navigate('MyProfile')}>
        {avatar != 'lybertineApp/default/default.png' ? (
          <Image
            source={{ uri: `${IMAGEURL}/${avatar}` }}
            style={style.userProfile}
          />
        ) : (
          <Image source={IMAGE?.defaultAvatar} style={style.userProfile} />
        )}
      </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  userProfile: {
    borderRadius: 120,
    height: 40,
    width: 40,
    resizeMode: 'cover',
  },
});
export default UserProfileImage;
