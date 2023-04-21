/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { IMAGE, color, fontFamily, fontSize } from '../../constant';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { BaseURL } from '../../utils/api';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-elements';
import Toast from 'react-native-toast-message';




const EducationVideoListItem = (props) => {
  const navigation = useNavigation()
  // const [isAddButton, setisAddButton] = useState(props.item.added)
  const AddToCart = () => {
    if (props?.setAddVideo) {
      // setisAddButton((d) => !d);
      if (!props.item.added) {
        props?.setAddVideo(props.item.id, props.item.price, props.item);
      } else {
        props?.setRemoveVideo(props.item.id, props.item.price, props.item);
      }
    }
  }
  // const AddToCart = () => {
  //   if (props?.setAddVideo) {
  //     // setisAddButton((d) => !d);
  //     if (!isAddButton) {
  //       props?.setAddVideo(props.item.id, props.item.price, props.item);
  //     } else {
  //       props?.setRemoveVideo(props.item.id, props.item.price, props.item);
  //     }
  //   }
  // }
  return (
    <View
      style={[
        style.cardContainer,
        { flex: 1 },
      ]}>
      <TouchableOpacity
        onPress={() =>
          props.purchased ?
            navigation.navigate('videoPlayer', { VideoURL: props.item.video_url })
            :
            Toast.show({
              type: 'info',
              text1: 'Please buy this video'
            })
        }
      >
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={{ uri: props.item.image }}
            style={style.imageStyle}
          />
          <View style={style.textOuterBox}>
            <View style={{ width: wp(40) }} >
              <Text style={style.preHeading} numberOfLines={1}>{props.item.session}</Text>
              <Text style={style.headingText} numberOfLines={1}>{props.item.title}</Text>
              {!props.purchased ? <Text style={style.money} numberOfLines={1}>{props.item.price}</Text> : null}
            </View>
            {!props.purchased ? <View>
              <Button
                title={props.item.added ? "Remove" : "Add"}
                onPress={AddToCart}
                buttonStyle={style.buttonStyle}
                titleStyle={style.titleStyle}
                containerStyle={style.containerStyle}
              />
            </View> :
              <Button
                title={'Play'}
                onPress={()=>navigation.navigate('videoPlayer', { VideoURL: props.item.video_url})}
                buttonStyle={style.buttonStyle}
                titleStyle={style.titleStyle}
                containerStyle={style.containerStyle}
              />
            }
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const style = StyleSheet.create({
  cardContainer: {
    backgroundColor: color.white,
    marginBottom: 10,
    borderRadius: 5,
  },
  preHeading: {
    fontSize: fontSize.size11,
    color: color.blueMagenta
  },
  headingText: {
    fontSize: fontSize.size13,
    fontFamily: fontFamily.Medium,
    color: color.blueMagenta,
  },
  imageStyle: {
    height: 80,
    width: 116,
    alignContent: 'stretch',
    resizeMode: 'cover',
    alignSelf: 'center',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  buttonStyle: {
    backgroundColor: color.btnSeashell,
    borderWidth: 1,
    borderColor: color.violet,
    borderRadius: 3,
    padding: 2,
  },
  titleStyle: {
    fontSize: fontSize.size11,
    color: color.violet,
  },
  containerStyle: {
    width: 55,
    marginVertical: 10,
  },
  money: {
    fontSize: fontSize.size15,
    fontFamily: fontFamily.Bold,
    color: color.blueMagenta,
    lineHeight: fontSize.size17,
  },
  textOuterBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    width: wp(92) - 116,
    alignItems: 'center',
  }
});
export default EducationVideoListItem;
