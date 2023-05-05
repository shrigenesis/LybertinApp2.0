/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, FC, Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Share,
  ScrollView,
} from 'react-native';
import { IMAGE, color, fontFamily, fontSize } from '../../constant/';
import { APIRequest, IMAGEURL, ApiUrl } from '../../utils/api';
import { useNavigation } from '@react-navigation/native';
import SvgUri from 'react-native-svg-uri-updated';
import { Loader } from '../../component';


const Tag = ['#event', '#event', '#event'];

const MarketplaceListItem = ({ Event, navigationKey }) => {
  const navigation = useNavigation();
  const [isLoding, setisLoding] = useState(false);
  const [EarningValue, setEarningValue] = useState({ min: 0, max: 0, type: 'default' });
  //  social share
  const onShare = async (link) => {
    setisLoding(false)
    try {
      const result = await Share.share({
        message:
          link,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  // get social share url
  const getEventShareUrl = () => {
    setisLoding(true)
    let config = {
      url: `${ApiUrl.getDeeplink}`,
      method: 'post',
      body: {
        event_id: Event.id,
      },
    };
    APIRequest(
      config,
      res => {
        if (res.status) {
          console.log(res, 'getEventShareUrl');
          onShare(res.deep_link)
        }
      },
      err => {
        console.log(err);
      },
    );
  };

  // Find min and max value and commission type
  useEffect(() => {
    let earningCoins = [];
    for (let index = 0; index < Event.marketings.length; index++) {
      earningCoins.push(Event.marketings[index].commission)
    }
    let minValue = Math.min(...earningCoins);
    let maxValue = Math.max(...earningCoins);
    setEarningValue({ min: minValue, max: maxValue, type: Event.marketings[0].commission_type })
  }, [])




  return (
    <View style={styles.container}>
      <View>
        {isLoding !== true ? <View>
          <TouchableOpacity
            activeOpacity={0.4}
            onPress={() =>
              navigation.navigate('marketplaceDetails', {
                event_id: Event.id,
                navigationKey:navigationKey
              })
            }
            style={styles.cardContainer}>
            <Image
              source={{
                uri: `${IMAGEURL}/${Event.thumbnail}`,
              }}
              style={styles.thumbnailStyle}
            />
            <View style={styles.contentBox}>
              <Text style={styles.dateText}>
                {Event.formatted_date}
              </Text>
              <Text style={styles.headingText} numberOfLines={1}>
                {Event.title}
              </Text>
              <View
                style={styles.tagGroup}>
                <View
                  style={styles.imageWithText}>
                  <Image
                    source={IMAGE.coin}
                    style={styles.imageOfTag}
                  />
                  <Text style={styles.dateText}>{`${EarningValue.min} to ${EarningValue.max} ${EarningValue.type === "percentage" ? "%" : "$"} earnings`} </Text>
                </View>
                <View
                  style={styles.imageWithText}>
                  <Image
                    source={IMAGE.location}
                    style={styles.imageOfTag}
                  />
                  <Text style={styles.dateText}>{Event.city}</Text>
                </View>
                <View
                  style={styles.imageWithText}>
                  <Image
                    source={IMAGE.Ticket}
                    style={styles.imageOfTag}
                  />
                  <Text style={styles.dateText}>{Event.total_tickets - Event.total_shares} Tickets Left</Text>
                </View>
              </View>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                style={{
                  flexDirection: 'row',
                  margin: 5,
                  flexWrap: 'wrap',
                }}>
                {Event.hashtags.map(item => (
                  <Text key={`hastag-${item.title}`} style={styles.tagText}>#{item.title}</Text>
                ))}
              </ScrollView>
              <TouchableOpacity
                activeOpacity={0.4}
                onPress={() =>
                  navigation.navigate('marketplaceDetails', {
                    event_id: Event.id,
                    navigationKey:navigationKey
                  })
                }
                style={[styles.button, {
                  backgroundColor:
                    (Event.hasShared.normalShare || Event.hasShared.sharedOnTwitter) ? color.chatRight : color.lightGray
                }]}>
                <SvgUri
                  style={styles.rightSpace}
                  fill={color.violet}
                  fillAll={true}
                  source={IMAGE.svgsend}
                />
                <Text style={[styles.buttonText, {
                  color:
                    (Event.hasShared.normalShare || Event.hasShared.sharedOnTwitter) ? color.violet : color.blueMagenta
                }]}>
                  {(Event.hasShared.normalShare || Event.hasShared.sharedOnTwitter) ? 'Share again' : 'Share Now'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View> : <Loader isLoading={true} type={'dots'} />
        }
      </View >
    </View >
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: null,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  cardContainer: {
    width: '100%',
    maxWidth: '100%',
    borderRadius: 10,
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.liteRed,
    shadowColor: color.liteRed,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  headingText: {
    fontSize: fontSize.size20,
    fontFamily: fontFamily.Bold,
    color: color.black,
  },
  thumbnailStyle: {
    height: 144,
    width: '100%',
    resizeMode: 'cover',
    alignSelf: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  dateText: {
    fontSize: fontSize.size12,
    fontFamily: fontFamily.Light,
    color: color.liteBlueMagenta,
    marginTop: 3,
  },
  contentBox: {
    padding: 15,
  },
  tagText: {
    fontSize: fontSize.size10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: color.liteRed,
    color: color.liteBlueMagenta,
    borderRadius: 3,
    marginRight: 4,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 10,
  },
  buttonText: {
    fontSize: fontSize.size15,
    fontWeight: '700',
    fontFamily: fontFamily.Regular,
    paddingVertical: 11,
  },
  rightSpace: {
    marginRight: 5,
  },
  imageOfTag: {
    height: 12,
    width: 12,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginRight: '2%',
  },
  imageWithText: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  tagGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    columnGap: 10
  }
});

export default MarketplaceListItem;
