/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { IMAGE, color, fontFamily, fontSize } from '../../constant';
import { BASEURL} from '../../utils/api';
import { useNavigation } from '@react-navigation/native';

const EducationListItem = ({ item }) => {
  const navigation = useNavigation()
  return (
    <View
      style={[
        style.cardContainer,
        { margin: 5, padding: 5, flex: 1 },
      ]}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('educationDetails', { id: item.id })
        }>
        <View style={{ flexDirection: 'column' }}>
          <Image
            source={{ uri: item.image }}
            style={style.imageStyle}
          />
          {item.hasOwnProperty('price') ?
            <Text
              style={style.headingText}
              numberOfLines={1}>
              ${item?.price ? item?.price : 0}
            </Text> : null}
          <View
            style={style.contentBox}>

            <Text style={[style.title, { marginLeft: 5 }]}>
              {item.title}
            </Text>
          </View>
          {!item.hasOwnProperty('price') ?
            <>
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 5,
                  marginTop: 5,
                }}>
                <Image
                  source={IMAGE.date}
                  style={style.IconImage}
                />
                <Text style={[style.dateText, { marginLeft: 5 }]}>
                  {item.date}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  margin: 5,
                }}>
                <Image
                  source={IMAGE.time}
                  style={style.IconImage}
                />
                <Text style={[style.dateText, { marginLeft: 5 }]}>
                  {item.time}
                </Text>
              </View>
            </> : null}
          {/* <View
            style={{
              flexDirection: 'row',
              margin: 3,
              alignItems:"center"
            }}>
            <Text style={style.ratingNumber}>{item?.featured?.rating}</Text>
            <Text>
              <Rating
                type='star'
                ratingColor={color.ratingColor}
                ratingCount={5}
                imageSize={18}
              // style={{ paddingHorizontal: 2 }}
              // onFinishRating={this.ratingCompleted}
              />
            </Text>
            <Text style={style.totleRating}>({item?.featured?.allReviews}0)</Text>
          </View> */}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const style = StyleSheet.create({
  cardContainer: {
    width: '47%',
    maxWidth: '47%',
    borderRadius: 10,
    backgroundColor: color.white,
    shadowColor: '#00000012',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  imageStyle:{
    height: Dimensions.get('window').width / 3,
    width: '100%',
    alignContent: 'stretch',
    resizeMode: 'stretch',
    alignSelf: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 7,
  },
  contentBox:{
    flexDirection: 'row',
    margin: 3,
    alignItems: "center",
  },
  IconImage:{
    height: 12,
    width: 12,
    resizeMode: 'contain',
    alignSelf: 'center',
    tintColor: '#0F1828D9',
  },
  headingText: {
    fontSize: fontSize.size18,
    fontFamily: fontFamily.Bold,
    color: color.blueMagenta,
    marginLeft: '4%',
  },
  title: {
    fontSize: fontSize.size13,
    fontFamily: fontFamily.Bold,
    color: color.black,
  },
  ratingNumber: {
    color: color.ratingColor,
    fontSize: fontSize.size18,
    fontFamily: fontFamily.Semibold,
    marginRight: 2
  },
  totleRating: {
    color: color.totalRating,
    fontSize: fontSize.size14,
    marginLeft: 2
  },

});
export default EducationListItem;
