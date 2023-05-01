/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useState, useEffect, FC, Component, memo} from 'react';
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
} from 'react-native';
import {IMAGE, color, fontFamily, fontSize} from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {BottomSheet} from 'react-native-elements';
import Loader from './../../component/loader';
import {
  APIRequest,
  ApiUrl,
  IMAGEURL,
  twitterFailUrl,
  twitterSuccessUrl,
} from './../../utils/api';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import {User} from '../../utils/user';
import {Tooltip} from 'react-native-elements';
import Toast from 'react-native-toast-message';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SliderBox} from 'react-native-image-slider-box';
import ReadMore from '@fawazahmed/react-native-read-more';
import HtmlToText from '../../utils/HtmlToText';
import SvgUri from 'react-native-svg-uri-updated';
import ConfirmationModal from './Modal/ConfirmationModal';
import BottomSheetCustom from '../../component/BottomSheetCustom';
import DetailsSkelton from '../../utils/skeltons/DetailsSkelton';
import TwitterAuthorization from './Modal/TwitterAuthorization';
import WebView from 'react-native-webview';
import {log} from 'react-native-reanimated';
import NoFormatter from '../../utils/NoFormatter';
import BottomSheetMarketplace from '../../component/BottomSheetMarketplace';
import {BackgroundImage} from 'react-native-elements/dist/config';
import TwitterConfirmMessage from './Modal/TwitterConfirmMessage';
import BottomSheetWebview from '../../component/BottomSheetWebview';
import TwitterSuccessMessage from './Modal/TwitterSuccessMessage';
import RedirectToMap from '../../utils/RedirectToMap';

let strippedHtml;
const sponsorsImage = [
  'https://lybertine.com/images/danone-logo.png',
  'https://lybertine.com/images/Tata-Company.png',
  'https://lybertine.com/images/danone-logo.png',
];

const STATUSBAR_HEIGHT = StatusBar.currentHeight;

export default class MarketplaceDetails extends Component {
  constructor(props) {
    super(props);
    this.bottomSheetRef = React.createRef();
    this.state = {
      selected: 0,
      eventId: this.props.route.params.event_id,
      navigationKey: this.props.route.params.navigationKey,
      event: {},
      engagement: {},
      showText: 0,
      isRepetative: '',
      repititiveSchedule: [],
      hosts: [],
      dance: [],
      images: [],
      tag_group: [],
      webviewUrl: '',
      twitterMassage: '',
      isLoading: true,
      isShowBottomSheet: false,
      isPostTwitter: false,
      openWebview: false,
      twitterAuthorization: false,
      twitterConfirmMessage: false,
      twitterSuccessMessage: false,
      earningValue: {min: 0, max: 0, type: 'default'},
    };
  }

  // Calculate EarningValue
  CalculateEarningValue = () => {
    // this.setState({ ...this.state, isLoading: true })
    let earningCoins = [];
    for (let index = 0; index < this.state.event.marketings.length; index++) {
      earningCoins.push(this.state.event.marketings[index].commission);
    }
    let minValue = Math.min(...earningCoins);
    let maxValue = Math.max(...earningCoins);
    this.setState({
      ...this.state,
      earningValue: {
        min: minValue,
        max: maxValue,
        type: this.state.event.marketings[0].commission_type,
      },
    });
    // this.setState({ ...this.state, isLoading: false })
  };

  componentDidMount = () => {
    this.getEventDetails();
  };

  // Getg deeplink for socail share
  OtherShare = () => {
    this.setState({...this.state, isLoading: true, isShowBottomSheet: false});
    let config = {
      url: `${ApiUrl.getDeeplink}`,
      method: 'post',
      body: {
        event_id: this.state.event.id,
      },
    };
    APIRequest(
      config,
      res => {
        if (res.status) {
          console.log(res, 'getEventShareUrl');
            this.setState({...this.state, isLoading: false});
          this.onShare(res.deep_link);
        }
       
      },
      err => {
        console.log(err);
      },
    );
  };

  // Get message and check user autoraizd
  TwittwrShare = permission => {
    if (permission) {
      this.setState({
        ...this.state,
        isLoading: true,
        twitterAuthorization: false,
      });
      let config = {
        url: `${ApiUrl.getDeeplink}`,
        method: 'post',
        body: {
          event_id: this.state.event.id,
        },
      };
      APIRequest(
        config,
        res => {
          if (res.status) {
            this.setState({
              ...this.state,
              twitterMassage: `${res.promotional_text} Book your tickets at ${res.deep_link}`,
              twitterConfirmMessage: true,
            });
          }
          this.setState({...this.state, isLoading: false});
        },
        err => {
          console.log(err);
          this.setState({...this.state, isLoading: false});
        },
      );
    } else {
      this.setState({...this.state, twitterAuthorization: false});
    }
  };

  // Post on twitter
  PostTwitter = permission => {
    if (permission) {
      this.setState({
        ...this.state,
        isLoading: true,
        twitterConfirmMessage: false,
      });
      let config = {
        url: `${ApiUrl.twitterPost}`,
        method: 'post',
        body: {
          event_id: this.state.event.id,
          text: this.state.twitterMassage,
        },
      };
      APIRequest(
        config,
        res => {
          if (res.status) {
            if (!res.alreadyHasAuthorized) {
              this.setState({
                ...this.state,
                webviewUrl: res.authorize_url,
                openWebview: true,
                isShowBottomSheet: true,
                isPostTwitter: true,
              });
            } else {
              Toast.show({
                type: 'success',
                text1: res.message,
              });
              this.setState({...this.state, isShowBottomSheet: false});
            }
          }
          this.setState({...this.state, isLoading: false});
        },
        err => {
          console.log(err);
          this.setState({...this.state, isLoading: false});
        },
      );
    } else {
      this.setState({...this.state, twitterConfirmMessage: false});
    }
  };

  settwitterSuccessMessage = () => {
    this.getEventDetails();
  };

  // Get event details
  getEventDetails = () => {
    this.setState({
      ...this.state,
      isLoading: true,
      twitterSuccessMessage: false,
    });

    let config = {
      url: `${ApiUrl.getMarketingEventDetails}/${this.state.eventId}`,
      method: 'get',
    };
    APIRequest(
      config,
      res => {
        if (res.status) {
          console.log(res, 'getEventDetails');
          this.setState({
            ...this.state,
            event: res.marketing_event_info.event,
            engagement: res.engagement.data,
            last_sync: res.engagement.last_sync,
            // isRepetative: res.marketing_event_info.is_repetative,
            // repititiveSchedule: res.marketing_event_info.repititive_schedule,
            tag_group: res.marketing_event_info.tag_group,
            images: res.marketing_event_info.event.images,
          });
          let myHTML = res.marketing_event_info.event.description;
          strippedHtml = HtmlToText(myHTML);
          this.CalculateEarningValue();
        }
        setTimeout(() => {
          this.setState({
            ...this.state,
            isLoading: false,
            isShowBottomSheet: false,
          });
        }, 3000);
      },
      err => {
        this.setState({...this.state, isLoading: false});
        console.log(err);
      },
    );
  };

  // Extrect Image string to array
  sliderImageArray = images => {
    let res = [];
    for (let i = 0; i < images.length; i++) {
      res.push(images[i].img);
    }
    return res;
  };

  // Handle Bottom Sheet
  setisShowBottomSheet(value) {
    if (!value) {
      this.setState({
        ...this.state,
        isShowBottomSheet: value,
        isPostTwitter: false,
        openWebview: false,
      });
    }
  }

  // Social Share fundtion
  onShare = async link => {
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

  // Extract min price to Tickets array
  minPrice = () => {
    let priceValue = [];
    for (let index = 0; index < this.state.event?.tickets?.length; index++) {
      priceValue.push(this.state.event.tickets[index].price);
    }
    return Math.min(...priceValue);
  };
  TimeDiff = () => {
    var a = moment(new Date()); //now
    var b = moment(this.state.last_sync);
    console.log(a.diff(b, 'minutes'));
    return a.diff(b, 'minutes') > 10 ? true : false;
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle={'light-content'}
          translucent
          backgroundColor="transparent"
        />
        <View
          style={[
            styles.backBtnPosition,
            {top: STATUSBAR_HEIGHT + (Platform.OS == 'ios' ? 50 : 15)},
          ]}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Image source={IMAGE.ArrowLeft} style={styles.backImage} />
          </TouchableOpacity>
        </View>
        {this.state.isLoading === true ? (
          <DetailsSkelton />
        ) : (
          <ScrollView style={{flex: 0.92}}>
            <SliderBox
              images={
                this.state.event.images &&
                this.sliderImageArray(this.state.event.images)
              }
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
              <Text style={styles.mainHeading}>${this.minPrice()}</Text>
              <View>
                <View style={styles.shareWrapp}>
                  <Text style={styles.heading}>{this.state.event.title}</Text>
                </View>
                {this.state.event.hashtags.length > 0 ? (
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={{
                      flexDirection: 'row',
                      margin: 5,
                      flexWrap: 'wrap',
                      marginHorizontal: 15,
                    }}>
                    {this.state.event.hashtags.map((item, index) => (
                      <Text key={`hastagList${index}`} style={styles.tagText}>
                        #{item.title}
                      </Text>
                    ))}
                  </ScrollView>
                ) : null}
                <View style={styles.shareBox}>
                  <TouchableOpacity
                    onPress={() => {
                      !this.state.event?.hasShared?.sharedOnTwitter
                        ? this.setState({
                            ...this.state,
                            isShowBottomSheet: true,
                          })
                        : this.OtherShare();
                    }}
                    style={styles.shareBtnText}>
                    <Image
                      source={
                        this.state.event?.hasShared?.sharedOnTwitter ||
                        this.state.event?.hasShared?.normalShare
                          ? IMAGE.shareMarketplace
                          : IMAGE.sendBlue
                      }
                      style={styles.shareImage}
                    />
                    {this.state.event?.hasShared?.sharedOnTwitter ||
                    this.state.event?.hasShared?.normalShare ? (
                      <Text style={[styles.buttonText, {color: color.violet}]}>
                        Share again{' '}
                      </Text>
                    ) : (
                      <Text style={styles.buttonText}>Share Now </Text>
                    )}
                    {/* <Text style={styles.buttonText}>
                                            {(this.state.event?.hasShared?.sharedOnTwitter || !this.state.event?.hasShared?.normalShare)? 'Share again' : 'Share Now'}
                                        </Text> */}
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
                        {this.state.event.total_bookings_by_friends}
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
                        {NoFormatter(
                          this.state.event.total_bookings_by_same_interest,
                        )}
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
                        {NoFormatter(this.state.event.total_views)}
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
                        {this.state.event.total_coins_distributed < 1000
                          ? parseFloat(
                              this.state.event.total_coins_distributed,
                            ).toFixed(1)
                          : NoFormatter(
                              this.state.event.total_coins_distributed,
                            )}
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
                        {NoFormatter(
                          this.state.event.total_bookings_from_links,
                        )}
                      </Text>
                      <Image
                        source={IMAGE.booking}
                        style={styles.engagementImage}
                      />
                    </Tooltip>
                  </View>
                </View>
                {/* {this.state.event?.hasShared?.sharedOnTwitter ?
                                    <View style={[styles.borderBox, { padding: 15, paddingBottom: 5, marginHorizontal: 14, marginVertical: 15 }]}>
                                        <View style={styles.engagementTitleBox}>
                                            <Text style={styles.engagementTitle}>POST ENGAGEMENT</Text>
                                            <TouchableOpacity onPress={this.getEventDetails}>
                                                <Image source={IMAGE.sync} style={styles.syncImage} />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={[styles.engagementTitleBox, { marginTop: 15 }]}>
                                            <View>
                                                <Text style={styles.detailsTitle}>{NoFormatter(this.state.event.total_shares)}</Text>
                                                <Text style={styles.detailsText}>Share</Text>
                                            </View>
                                            <View>
                                                <Text style={styles.detailsTitle}>{this.state.event.total_coins_distributed ? NoFormatter(this.state.event.total_coins_distributed) : 0}</Text>
                                                <Text style={styles.detailsText}>Earning</Text>
                                            </View>
                                            <View>
                                                <Text style={styles.detailsTitle}>{NoFormatter(this.state.event.total_bookings_from_links)}</Text>
                                                <Text style={styles.detailsText}>Booking</Text>
                                            </View>
                                        </View>
                                        <Text style={[styles.detailsText, { marginTop: 10 }]}>Last sync {this.state.last_sync}</Text>
                                    </View> : null} */}
                <View style={styles.imageContainer}>
                  <Image source={IMAGE.star_earn} style={styles.dateStyle} />
                  <View>
                    <Text style={styles.dateText}>Earnings</Text>
                    <Text style={styles.timeText}>
                      {`${this.state.earningValue.min} to ${
                        this.state.earningValue.max
                      } ${
                        this.state.earningValue.type === 'percentage'
                          ? '%'
                          : '$'
                      } earnings`}
                    </Text>
                  </View>
                </View>
                <View style={styles.imageContainer}>
                  <Image source={IMAGE.dateColor} style={styles.dateStyle} />
                  <View>
                    <Text style={styles.dateText}>Date & Time</Text>
                    <Text style={styles.timeText}>
                      {this.state.event.event_timing_formatted}
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
                      RedirectToMap(
                        this.state.event.venue && this.state.event.venue,
                        this.state.event.state && ', ' + this.state.event.state,
                        this.state.event.city && ', ' + this.state.event.city,
                        this.state.event.zipcode &&
                          ', ' + this.state.event.zipcode,
                      )
                    }>
                    <Text style={styles.dateText}>Location</Text>
                    <Text style={styles.timeText} numberOfLines={2}>
                      {this.state.event.venue && this.state.event.venue}
                      {this.state.event.state && ', ' + this.state.event.state}
                      {this.state.event.city && ', ' + this.state.event.city}
                      {this.state.event.zipcode &&
                        ', ' + this.state.event.zipcode}
                    </Text>
                  </Pressable>
                </View>

                {this.state.event.repetitive === 1 ? (
                  <View style={styles.imageContainer}>
                    <Image source={IMAGE.eventColor} style={styles.dateStyle} />

                    <View>
                      <Text style={styles.dateText}>Event type</Text>
                      <Text style={styles.timeText} numberOfLines={2}>
                        {this.state.event.event_type_text}
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
                      <ReadMore
                        numberOfLines={4}
                        style={styles.desText}
                        seeMoreText="read more"
                        seeMoreStyle={{color: color.btnBlue}}>
                        {strippedHtml}
                      </ReadMore>
                    </View>
                  </View>
                )}
                {this.state.tag_group?.length > 0 &&
                  this.state.tag_group?.map((itt, indx) => {
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
                <View>
                  <View style={styles.descriptionWrapper}>
                    <Text style={styles.desHeading}>Sponsors</Text>
                    <FlatList
                      horizontal={true}
                      showsHorizontalScrollIndicator={true}
                      data={sponsorsImage}
                      renderItem={({item, index}) => (
                        <View style={styles.sponsorTagInner}>
                          <View>
                            <Image
                              source={{uri: item}}
                              style={styles.sponsorImage}
                            />
                          </View>
                        </View>
                      )}
                    />
                  </View>
                </View>
              </View>
            </View>
            {false ? <ConfirmationModal /> : null}
            {/* <BottomSheetCustom
                            cancelBtn={{ color: color.lightGray, title: "Cancel", textColor: color.btnBlue }}
                            isShowBottomSheet={this.state.isShowBottomSheet}
                            setisShowBottomSheet={this.setisShowBottomSheet.bind(this)}
                        >
                            {!this.state.isPostTwitter ? <>
                                <TouchableOpacity
                                    onPress={this.TwittwrShare}
                                    style={styles.twitterShareBtn}>
                                    <Text style={styles.buttonText}>Twitter</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={this.OtherShare}
                                    style={styles.twitterShareBtn}>
                                    <Text style={styles.buttonText}>Others</Text>
                                </TouchableOpacity></> : null}
                            {(this.state.isPostTwitter && !this.state.openWebview) ?
                                <>
                                    <TextInput
                                        value={this.state.twitterMassage}
                                        onChangeText={(e) => this.setState({ ...this.state, twitterMassage: e })}
                                        maxLength={280}
                                        style={styles.input}
                                        multiline={true}
                                        numberOfLines={4}
                                    />
                                    <TouchableOpacity
                                        onPress={this.PostTwitter}
                                        style={styles.postTwitterBtn}>
                                        <Text style={styles.buttonText}>Post</Text>
                                    </TouchableOpacity></> : null}
                            {(this.state.openWebview && this.state.isPostTwitter) ?
                                <View style={{ height: 500 }}>
                                    <WebView
                                        source={{ uri: this.state.webviewUrl }}

                                        onNavigationStateChange={navState => {
                                            // Keep track of going back navigation within component
                                            console.log('navstate', navState);
                                            if (navState?.url.includes(twitterSuccessUrl)) {
                                                SimpleToast.show('Post successfully posted on Twitter')
                                                this.setState({ ...this.state, isPostTwitter: false, openWebview: false, isShowBottomSheet: false });
                                            }
                                            if (navState?.url.includes(twitterFailUrl)) {
                                                SimpleToast.show('Sorry, Something went wrong, please try again.')
                                                this.setState({ ...this.state, isPostTwitter: false, openWebview: false, isShowBottomSheet: false });
                                            }
                                        }}

                                    />
                                </View> : null}
                        </BottomSheetCustom> */}
            {this.state.openWebview && this.state.isPostTwitter ? (
              <BottomSheetWebview
                cancelBtn={{
                  color: color.lightGray,
                  title: 'Cancel',
                  textColor: color.btnBlue,
                }}
                isShowBottomSheet={this.state.isShowBottomSheet}
                setisShowBottomSheet={this.setisShowBottomSheet.bind(this)}>
                {this.state.openWebview && this.state.isPostTwitter ? (
                  <View style={{height: 500}}>
                    <WebView
                      source={{uri: this.state.webviewUrl}}
                      onNavigationStateChange={navState => {
                        // Keep track of going back navigation within component
                        console.log('navstate', navState);
                        if (navState?.url.includes(twitterSuccessUrl)) {
                          this.setState({
                            ...this.state,
                            isPostTwitter: false,
                            openWebview: false,
                            isShowBottomSheet: false,
                            twitterSuccessMessage: true,
                          });
                        }
                        if (navState?.url.includes(twitterFailUrl)) {
                          Toast.show({
                            type: 'error',
                            text1: res.message,
                          });
                          this.setState({
                            ...this.state,
                            isPostTwitter: false,
                            openWebview: false,
                            isShowBottomSheet: false,
                          });
                        }
                      }}
                    />
                  </View>
                ) : null}
              </BottomSheetWebview>
            ) : (
              <BottomSheetMarketplace
                isShowBottomSheet={this.state.isShowBottomSheet}
                setisShowBottomSheet={this.setisShowBottomSheet.bind(this)}>
                {!this.state.isPostTwitter ? (
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
                        onPress={this.OtherShare}
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
                        onPress={() =>
                          this.setState({
                            ...this.state,
                            twitterAuthorization: true,
                            isShowBottomSheet: false,
                          })
                        }
                        activeOpacity={0.9}
                        style={styles.twitterShareBtn}>
                        <View
                          style={[
                            styles.shareIconBox,
                            {backgroundColor: color.twitterColor},
                          ]}>
                          <Image
                            style={styles.shareIcon}
                            source={IMAGE.twitter}
                          />
                        </View>
                        <Text style={styles.buttonText}>Twitter</Text>
                        <Text style={styles.recommendText}>we recommend</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : null}
              </BottomSheetMarketplace>
            )}
            {this.state.twitterAuthorization ? (
              <TwitterAuthorization
                twitterAuthorization={this.state.twitterAuthorization}
                TwittwrShare={this.TwittwrShare.bind(this)}
              />
            ) : null}
            {this.state.twitterConfirmMessage ? (
              <TwitterConfirmMessage
                twitterMassage={this.state.twitterMassage}
                twitterConfirmMessage={this.state.twitterConfirmMessage}
                PostTwitter={this.PostTwitter.bind(this)}
              />
            ) : null}
            {this.state.twitterSuccessMessage ? (
              <TwitterSuccessMessage
                confetti={true}
                settwitterSuccessMessage={this.settwitterSuccessMessage.bind(
                  this,
                )}
              />
            ) : null}
          </ScrollView>
        )}
        <Loader isLoading={this.state.isLoading} type={'dots'} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: null,
    borderColor: color.white,
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
