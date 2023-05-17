import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Image,
  Button,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Platform,
  ImageBackground,
  Share,
  Pressable,
  SafeAreaView,
  Linking,
} from 'react-native';
import {SliderBox} from 'react-native-image-slider-box';
import {IMAGE, color, fontFamily, fontSize} from '../../constant';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import {User} from '../../utils/user';
import {Tooltip} from 'react-native-elements';
import Toast from 'react-native-toast-message';
import ReadMore from '@fawazahmed/react-native-read-more';
import HtmlToText from '../../utils/HtmlToText';
import ConfirmationModal from './Modal/ConfirmationModal';
import DetailsSkelton from '../../utils/skeltons/DetailsSkelton';
import TwitterAuthorization from './Modal/TwitterAuthorization';
import WebView from 'react-native-webview';
import NoFormatter from '../../utils/NoFormatter';
import BottomSheetMarketplace from '../../component/BottomSheetMarketplace';
import TwitterConfirmMessage from './Modal/TwitterConfirmMessage';
import BottomSheetWebview from '../../component/BottomSheetWebview';
import TwitterSuccessMessage from './Modal/TwitterSuccessMessage';
import RedirectToMap from '../../utils/RedirectToMap';

let strippedHtml;

import {
  APIRequest,
  ApiUrl,
  IMAGEURL,
  twitterFailUrl,
  twitterSuccessUrl,
} from './../../utils/api';

const STATUSBAR_HEIGHT = StatusBar.currentHeight;

const MarketplaceDetails = props => {
  const [event, setEvent] = useState();
  const [isLoading, setisLoading] = useState(true);
  const [tag_group, settag_group] = useState([]);
  const [isShowBottomSheet, setisShowBottomSheet] = useState(false);
  const [earningValue, setearningValue] = useState({
    min: 0,
    max: 0,
    type: 'default',
  });
  const [openWebview, setopenWebview] = useState(false);
  const [isPostTwitter, setisPostTwitter] = useState(false);
  const [twitterAuthorization, settwitterAuthorization] = useState(false);
  const [twitterConfirmMessage, settwitterConfirmMessage] = useState(false);
  const [twitterMassage, settwitterMassage] = useState('');
  const [webviewUrl, setwebviewUrl] = useState('');
  const [twitterSuccessMessage, settwitterSuccessMessage] = useState(false);
  const [isExtend, setisExtend] = useState(false);
  const [strippedHtml, setstrippedHtml] = useState('');

  const SetTwitterSuccessMessage = () => {
    getEventDetails();
  };

  // Get event details
  const getEventDetails = () => {
    let config = {
      url: `${ApiUrl.getMarketingEventDetails}/${props.route.params.event_id}`,
      method: 'get',
    };
    APIRequest(
      config,
      res => {
        if (res.status) {
          setEvent(res.marketing_event_info.event);
          settag_group(res.marketing_event_info.tag_group);
          let myHTML = res.marketing_event_info.event.description;
          setstrippedHtml(HtmlToText(myHTML));
        }
        setisLoading(false);
        console.log(res);
      },
      err => {
        console.log(err);
      },
    );
  };

  // Extrect Image string to array
  const sliderImageArray = images => {
    console.log(images);
    let res = [];
    for (let i = 0; i < images.length; i++) {
      res.push(images[i].img);
    }
    return res;
  };

  useEffect(() => {
    getEventDetails();
  }, []);

  const OtherShare = () => {
    setisShowBottomSheet(false);
    setisLoading(true);
    let config = {
      url: `${ApiUrl.getDeeplink}`,
      method: 'post',
      body: {
        event_id: event.id,
      },
    };
    APIRequest(
      config,
      res => {
        if (res.status) {
          console.log(res, 'getEventShareUrl');
          setisLoading(false);
          onShare(res.deep_link);
        }
      },
      err => {
        console.log(err);
      },
    );
  };
  const onShare = async link => {
    try {
      const result = await Share.share({
        message: link,
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
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }
  };
  // Calculate EarningValue
  const CalculateEarningValue = () => {
    let earningCoins = [];
    for (let index = 0; index < event.marketings.length; index++) {
      earningCoins.push(event.marketings[index].commission);
    }
    let minValue = Math.min(...earningCoins);
    let maxValue = Math.max(...earningCoins);
    setearningValue({
      min: minValue,
      max: maxValue,
      type: event.marketings[0].commission_type,
    });
  };

  // Post on twitter
  const PostTwitter = (permission, Message) => {
    if (permission) {
      setisLoading(true);
      settwitterConfirmMessage(false);
      let config = {
        url: `${ApiUrl.twitterPost}`,
        method: 'post',
        body: {
          event_id: event.id,
          text: Message,
        },
      };
      APIRequest(
        config,
        res => {
          if (res.status) {
            if (!res.alreadyHasAuthorized) {
              setwebviewUrl(res.authorize_url);
              setopenWebview(true);
              setisPostTwitter(true);
            } else {
              Toast.show({
                type: 'success',
                text1: res.message,
              });
              setisShowBottomSheet(false);
            }
          }
          setisLoading(false);
        },
        err => {
          console.log(err);
          setisLoading(false);
        },
      );
    } else {
      setisShowBottomSheet(false);
      settwitterConfirmMessage(false);
    }
  };

  // Get message and check user autoraizd
  const TwittwrShare = permission => {
    // setisShowBottomSheet(false);
    if (permission) {
      setisLoading(true);
      settwitterAuthorization(false);
      let config = {
        url: `${ApiUrl.getDeeplink}`,
        method: 'post',
        body: {
          event_id: event.id,
        },
      };
      APIRequest(
        config,
        res => {
          if (res.status) {
            settwitterMassage(
              `${
                res.promotional_text ? res.promotional_text : ''
              }Book your tickets at ${res.deep_link}`,
            );
            settwitterConfirmMessage(true);
          }
          setisLoading(false);
        },
        err => {
          console.log(err);
          setisLoading(false);
        },
      );
    } else {
      settwitterAuthorization(false);
      setisShowBottomSheet(false);
    }
  };
  const SetIsShowBottomSheet=() =>{
    setopenWebview(false);
    setisPostTwitter(false);
    setwebviewUrl('');
    settwitterSuccessMessage(false);
    setisShowBottomSheet(false);
    settwitterAuthorization(false);
    settwitterConfirmMessage(false);
    settwitterMassage('');
  }

  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={'light-content'}
        translucent
        backgroundColor="transparent"
      />
      <View
        style={[
          styles.backBtnPosition,
          {top: STATUSBAR_HEIGHT + (Platform.OS == 'ios' ? 120 : 85)},
        ]}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Image source={IMAGE.ArrowLeft} style={styles.backImage} />
        </TouchableOpacity>
      </View>

      <ScrollView style={{flex: 0.92}}>
        {isLoading === true ? (
          <DetailsSkelton />
        ) : (
          <>
            <SliderBox
              images={event.images && sliderImageArray(event.images)}
              sliderBoxHeight={300}
              onCurrentImagePressed={index =>
                console.warn(`image ${index} pressed`)
              }
              dotColor={color.btnBlue}
              inactiveDotColor={color.black}
              dotStyle={styles.dotStyle}
            />

            <View style={styles.bodyContainer} />
            <View
              style={{
                backgroundColor: color.white,
              }}>
              <Text style={styles.mainHeading}>{/* ${this.minPrice()} */}</Text>
              <View>
                <View style={styles.shareWrapp}>
                  <Text style={styles.heading}>{event.title}</Text>
                </View>
                {event.hashtags?.length > 0 ? (
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={{
                      flexDirection: 'row',
                      margin: 5,
                      flexWrap: 'wrap',
                      marginHorizontal: 15,
                    }}>
                    {event.hashtags.map((item, index) => (
                      <Text key={`hastagList${index}`} style={styles.tagText}>
                        #{item.title}
                      </Text>
                    ))}
                  </ScrollView>
                ) : null}
                <View style={styles.shareBox}>
                  <TouchableOpacity
                    onPress={() => {
                      !event?.hasShared?.sharedOnTwitter
                        ? setisShowBottomSheet(true)
                        : OtherShare();
                    }}
                    style={styles.shareBtnText}>
                    <Image
                      source={
                        event?.hasShared?.sharedOnTwitter ||
                        event?.hasShared?.normalShare
                          ? IMAGE.shareMarketplace
                          : IMAGE.sendBlue
                      }
                      style={styles.shareImage}
                    />
                    {event?.hasShared?.sharedOnTwitter ||
                    event?.hasShared?.normalShare ? (
                      <Text style={[styles.buttonText, {color: color.violet}]}>
                        Share again{' '}
                      </Text>
                    ) : (
                      <Text style={styles.buttonText}>Share Now </Text>
                    )}
                  </TouchableOpacity>
                </View>

                <View
                  style={[
                    styles.borderBox,
                    {padding: 15, marginHorizontal: 14, marginVertical: 15},
                  ]}>
                  <View style={styles.engagementTitleBox}>
                    <Text style={styles.engagementTitle}>POST ENGAGEMENT</Text>
                  </View>
                  <View style={[styles.engagementTitleBox, {marginTop: 15}]}>
                    <Tooltip
                      width={250}
                      popover={
                        <Text style={{color: '#fff'}}>
                          My Friends Who Booked Event{' '}
                        </Text>
                      }>
                      <Text style={styles.detailsTitle}>
                        {event.total_bookings_by_friends}
                      </Text>
                      <Image
                        source={IMAGE.friendsMarket}
                        style={styles.engagementImage}
                      />
                    </Tooltip>
                    <Tooltip
                      width={250}
                      popover={
                        <Text style={{color: '#fff'}}>
                          Booking with same interest people
                        </Text>
                      }>
                      <Text style={styles.detailsTitle}>
                        {NoFormatter(event.total_bookings_by_same_interest)}
                      </Text>
                      <Image
                        source={IMAGE.people}
                        style={styles.engagementImage}
                      />
                    </Tooltip>
                    <Tooltip
                      width={150}
                      popover={
                        <Text style={{color: '#fff'}}>Total views</Text>
                      }>
                      <Text style={styles.detailsTitle}>
                        {NoFormatter(event.total_views)}
                      </Text>
                      <Image
                        source={IMAGE.eye}
                        style={styles.engagementImage}
                      />
                    </Tooltip>
                    <Tooltip
                      width={250}
                      popover={
                        <Text style={{color: '#fff'}}>
                          How many earning on this post
                        </Text>
                      }>
                      <Text style={styles.detailsTitle}>
                        {event.total_coins_distributed === null
                          ? 0
                          : event.total_coins_distributed < 1000
                          ? parseFloat(event.total_coins_distributed).toFixed(1)
                          : NoFormatter(event.total_coins_distributed)}
                      </Text>
                      <Image
                        source={IMAGE.salary}
                        style={styles.engagementImage}
                      />
                    </Tooltip>
                    <Tooltip
                      width={250}
                      popover={
                        <Text style={{color: '#fff'}}>
                          How many booking on this post
                        </Text>
                      }>
                      <Text style={styles.detailsTitle}>
                        {NoFormatter(event.total_bookings_from_links)}
                      </Text>
                      <Image
                        source={IMAGE.booking}
                        style={styles.engagementImage}
                      />
                    </Tooltip>
                  </View>
                </View>
                <View style={styles.imageContainer}>
                    <Image
                      source={IMAGE.category}
                      style={{
                        height: 22,
                        width: 22,
                        resizeMode: 'contain',
                        marginRight: '4%',
                        tintColor: color.btnBlue,
                      }}
                    />

                    <View>
                      <Text style={styles.dateText}>Category</Text>
                      <Text style={styles.timeText} numberOfLines={1}>
                        {event?.category_name}
                      </Text>
                    </View>
                  </View>
                <View style={styles.imageContainer}>
                  <Image source={IMAGE.star_earn} style={styles.dateStyle} />
                  <View>
                    <Text style={styles.dateText}>Earnings</Text>
                    <Text style={styles.timeText}>
                      {`${earningValue.min} to ${earningValue.max} ${
                        earningValue.type === 'percentage' ? '%' : '$'
                      } earnings`}
                    </Text>
                  </View>
                </View>
                <View style={styles.imageContainer}>
                  <Image source={IMAGE.dateColor} style={styles.dateStyle} />
                  <View>
                    <Text style={styles.dateText}>Date & Time</Text>
                    <Text style={styles.timeText}>
                      {event.event_timing_formatted}
                    </Text>
                  </View>
                </View>

                <View style={styles.imageContainer}>
                  <Image
                    source={IMAGE.locationColor}
                    style={styles.dateStyle}
                  />

                  <Pressable
                    onPress={() =>
                      RedirectToMap(`${event?.venue}+${event?.state}+${event?.city}+${event?.zipcode}`)
                    }>
                    <Text style={styles.dateText}>Location</Text>
                    <Text style={styles.timeText} numberOfLines={2}>
                      {event.venue && event.venue}
                      {event.state && ', ' + event.state}
                      {event.city && ', ' + event.city}
                      {event.zipcode && ', ' + event.zipcode}
                    </Text>
                  </Pressable>
                </View>

                {event.repetitive === 1 ? (
                  <View style={styles.imageContainer}>
                    <Image source={IMAGE.eventColor} style={styles.dateStyle} />

                    <View>
                      <Text style={styles.dateText}>Event type</Text>
                      <Text style={styles.timeText} numberOfLines={2}>
                        {event.event_type_text}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View></View>
                )}

                {strippedHtml === '' ? null : (
                  <View>
                    <View style={styles.descriptionWrapper}>
                      <Text style={styles.desHeading}>Event Description</Text>
                      <Text numberOfLines={isExtend ? -1 : 2}>
                        {strippedHtml}
                      </Text>
                      <TouchableOpacity onPress={() => setisExtend(d => !d)}>
                        <Text
                          style={{color: color.btnBlue, textAlign: 'right'}}>
                          {isExtend ? 'less' : '...read more'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                {tag_group?.length > 0 &&
                  tag_group?.map((itt, indx) => {
                    return (
                      <View style={styles.eventItems} key={indx}>
                        <Text style={styles.ticketsText}>{itt?.name}</Text>
                        <FlatList
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          data={itt?.items}
                          renderItem={({item, index}) => (
                            <View
                              key={`marketplace-details${index}`}
                              style={styles.eventTagInner}>
                              <View style={styles.tagIMageWrapper}>
                                <Image
                                  source={{uri: `${IMAGEURL}/${item.image}`}}
                                  style={styles.profileImage}
                                />
                              </View>
                              <View style={{margin: 8}}>
                                <Text style={styles.nameText}>
                                  {item.title}
                                </Text>
                                <Text style={styles.proText}>{item.type}</Text>
                              </View>
                            </View>
                          )}
                        />
                      </View>
                    );
                  })}
              </View>
            </View>
          </>
        )}

        <BottomSheetWebview
          cancelBtn={{
            color: color.lightGray,
            title: 'Cancel',
            textColor: color.btnBlue,
          }}
          isShowBottomSheet={isShowBottomSheet}
          setisShowBottomSheet={SetIsShowBottomSheet}>
          {openWebview && isPostTwitter ? (
            <View style={{height: 500}}>
              <WebView
                source={{uri: webviewUrl}}
                onNavigationStateChange={navState => {
                  // Keep track of going back navigation within component
                  console.log('navstate', navState);
                  if (navState?.url.includes(twitterSuccessUrl)) {
                    Toast.show({
                      type: 'info',
                      text1: 'Tweeted successfully',
                    });
                    setopenWebview(false);
                    setisPostTwitter(false);
                    setwebviewUrl('');
                    settwitterSuccessMessage(false);
                    setisShowBottomSheet(false);
                    settwitterAuthorization(false);
                    settwitterConfirmMessage(false);
                    settwitterMassage('');
                    getEventDetails();
                  }
                  if (navState?.url.includes(twitterFailUrl)) {
                    Toast.show({
                      type: 'error',
                      text1: res.message,
                    });
                    setopenWebview(false);
                    setisPostTwitter(false);
                    setwebviewUrl('');
                    settwitterSuccessMessage(false);
                    setisShowBottomSheet(false);
                    settwitterAuthorization(false);
                    settwitterConfirmMessage(false);
                    settwitterMassage('');
                  }
                }}
              />
            </View>
          ) : (
            <>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: fontSize.size21,
                  fontFamily: fontFamily.Bold,
                  color: color.blueMagenta,
                  marginBottom: 20,
                }}>
                Share Your Post
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}>
                <TouchableOpacity
                  onPress={() => OtherShare()}
                  activeOpacity={0.9}
                  style={styles.twitterShareBtn}>
                  <View
                    style={[
                      styles.shareIconBox,
                      {backgroundColor: color.lightGray},
                    ]}>
                    <Image
                      style={styles.shareIcon}
                      source={IMAGE.shareMarketplace}
                    />
                  </View>
                  <Text style={styles.buttonText}>Other</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    settwitterAuthorization(true);
                  }}
                  activeOpacity={0.9}
                  style={styles.twitterShareBtn}>
                  <View
                    style={[
                      styles.shareIconBox,
                      {backgroundColor: color.twitterColor},
                    ]}>
                    <Image style={styles.shareIcon} source={IMAGE.twitter} />
                  </View>
                  <Text style={styles.buttonText}>Twitter</Text>
                  <Text style={styles.recommendText}>we recommend</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {twitterAuthorization ? (
            <TwitterAuthorization
              twitterAuthorization={twitterAuthorization}
              TwittwrShare={TwittwrShare}
            />
          ) : null}
          {twitterConfirmMessage ? (
            <TwitterConfirmMessage
              twitterMassage={twitterMassage}
              twitterConfirmMessage={twitterConfirmMessage}
              PostTwitter={PostTwitter}
            />
          ) : null}
          {/* {twitterSuccessMessage ? (
            <TwitterSuccessMessage
              confetti={true}
              SetTwitterSuccessMessage={SetTwitterSuccessMessage}
            />
          ) : null} */}
        </BottomSheetWebview>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MarketplaceDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: null,
    borderColor: color.white,
    backgroundColor: color.white,
    marginTop: -(STATUSBAR_HEIGHT + (Platform.OS == 'ios' ? 60 : 15)),
  },
  backButton: {
    backgroundColor: color.white,
    height: 24,
    width: 24,
    borderRadius: 40,
  },
  dotStyle: {
    width: 20,
    height: 5,
    borderRadius: 5,
    marginBottom: Platform.OS == 'ios' ? 50 : 80,
    padding: 0,
    margin: -5,
  },
  backImageBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '5%',
    marginTop: Platform.OS == 'ios' ? '-60%' : '-70%',
  },
  backImage: {
    height: 32,
    width: 32,
    resizeMode: 'contain',
  },
  engagementImage: {
    height: 26,
    width: 26,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  backBtnPosition: {
    position: 'absolute',
    left: 15,
    top: STATUSBAR_HEIGHT + 15,
    zIndex: 1,
  },
  bodyContainer: {
    marginTop: -30,
    height: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: color.white,
  },
  shareBox: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 14,
  },
  shareBtnText: {
    backgroundColor: color.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 10,
    width: '100%',
    // marginRight: '2%'
  },
  shareImage: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginRight: 4,
  },
  engagementTitle: {
    textAlign: 'center',
    fontFamily: fontFamily.Semibold,
    fontSize: fontSize.size12,
    color: color.blackRussian,
  },
  dateStyle: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    marginRight: '4%',
    tintColor: color.btnBlue,
  },
  twitterShareBtn: {
    width: wp(40),
    height: wp(42),
    borderRadius: 13,
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.liteRed,
    shadowColor: color.liteRed,
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    paddingTop: 20,
    alignItems: 'center',
    position: 'relative',
  },
  shareIconBox: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    borderRadius: 12,
  },
  shareIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  recommendText: {
    backgroundColor: color.twitterColor,
    color: color.white,
    padding: 5,
    position: 'absolute',
    width: wp(40),
    textAlign: 'center',
    borderBottomRightRadius: 13,
    borderBottomLeftRadius: 13,
    fontSize: fontSize.size10,
    bottom: 0,
  },
  postTwitterBtn: {
    backgroundColor: '#F6EAFA',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: '5%',
    marginVertical: 10,
    width: '90%',
  },
  mainHeading: {
    fontSize: fontSize.size31,
    fontFamily: fontFamily.Bold,
    color: color.btnBlue,
    marginHorizontal: 15,
  },
  heading: {
    fontSize: fontSize.size21,
    fontFamily: fontFamily.Bold,
    color: color.blueMagenta,
    marginHorizontal: 15,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: color.borderGray,
  },
  eventItems: {
    paddingHorizontal: 15,
    marginTop: 20,
  },
  eventTagInner: {
    backgroundColor: color.extralightSlaty,
    borderColor: color.borderGray,
    borderWidth: 1,
    marginRight: 10,
    borderRadius: 10,
    marginTop: 10,
    height: 190,
    width: 128,
  },
  dateText: {
    fontSize: fontSize.size12,
    fontFamily: fontFamily.Regular,
    color: color.blueMagenta,
  },
  timeText: {
    fontSize: fontSize.size13,
    fontFamily: fontFamily.Bold,
    color: color.blueMagenta,
    width: 320,
  },
  descriptionWrapper: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderColor: color.borderGray,
    borderBottomWidth: 1,
  },
  desHeading: {
    fontSize: fontSize.size19,
    fontFamily: fontFamily.Bold,
    color: color.blueMagenta,
    marginTop: 10,
  },
  desText: {
    fontSize: fontSize.size13,
    fontFamily: fontFamily.Medium,
    color: color.blueMagenta,
    marginTop: 5,
  },
  ticketsText: {
    fontSize: fontSize.size19,
    fontFamily: fontFamily.Bold,
    color: color.blueMagenta,
    marginTop: 10,
  },
  dayText: {
    fontSize: fontSize.size13,
    fontFamily: fontFamily.Bold,
  },
  tagIMageWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: 116,
    resizeMode: 'cover',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  nameText: {
    fontSize: fontSize.size15,
    fontFamily: fontFamily.Bold,
    color: color.blueMagenta,
  },
  proText: {
    fontSize: fontSize.size11,
    fontFamily: fontFamily.Light,
    color: color.blueMagenta,
  },
  sponsorsImage: {
    width: 161,
    height: 56,
    resizeMode: 'cover',
  },
  shareWrapp: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sponsorTagInner: {
    backgroundColor: color.extralightSlaty,
    borderColor: color.borderGray,
    borderWidth: 1,
    marginRight: 10,
    borderRadius: 5,
    marginTop: 10,
    height: 50,
    width: 128,
  },
  sponsorImage: {
    width: 'auto',
    height: '70%',
    resizeMode: 'contain',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
    marginVertical: 7,
    // alignSelf:'center'
  },
  buttonText: {
    fontSize: fontSize.size14,
    fontWeight: '700',
    fontFamily: fontFamily.Regular,
    color: color.violet,
    paddingVertical: 11,
    color: color.blueMagenta,
  },
  borderBox: {
    borderColor: color.liteMagenta,
    borderWidth: 1,
    borderRadius: 5,
  },
  detailsTitle: {
    fontSize: fontSize.size25,
    color: color.blueMagenta,
    fontWeight: '700',
    fontFamily: fontFamily.Semibold,
    textAlign: 'center',
  },
  tagText: {
    fontSize: fontSize.size11,
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: color.liteRed,
    color: color.liteBlueMagenta,
    borderRadius: 3,
    marginRight: 4,
  },
  detailsText: {
    fontSize: fontSize.size11,
    color: color.blueMagenta,
    fontFamily: fontFamily.Regular,
    textAlign: 'center',
  },
  button: {
    fontSize: fontSize.size15,
    fontWeight: '700',
    fontFamily: fontFamily.Regular,
    color: color.violet,
    paddingVertical: 20,
  },
  input: {
    borderColor: color.borderGray,
    borderWidth: 1,
    height: 100,
    borderRadius: 10,
    textAlignVertical: 'top',
  },
  syncImage: {
    width: 20,
    height: 20,
  },
  engagementTitleBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
