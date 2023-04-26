/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect, FC, Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Platform,
  ImageBackground,
  Share,
  Pressable,
  Linking,
} from 'react-native';
import { IMAGE, color, fontFamily, fontSize } from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RippleTouchable, StoryList } from '../../component/';
import SwipeableView from 'react-native-swipeable-view';
import Loader from './../../component/loader';
import CountDown from 'react-native-countdown-fixed';
import { APIRequest, ApiUrl, IMAGEURL } from './../../utils/api';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import { User } from '../../utils/user';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SliderBox } from "react-native-image-slider-box";
import DetailsSkelton from '../../utils/skeltons/DetailsSkelton';
import HtmlToText from '../../utils/HtmlToText';
import ReadMore from '@fawazahmed/react-native-read-more';
import RedirectToMap from '../../utils/RedirectToMap';


const STATUSBAR_HEIGHT = StatusBar.currentHeight;
let myHTML = '';

export default class eventDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
      eventId: this.props.route.params.event_id,
      event: {},
      showText: 0,
      isRepetative: '',
      repititiveSchedule: [],
      hosts: [],
      dance: [],
      images: [],
      tag_group_new: [],
      isLoading: true,
    };
    this.strippedHtml = ""
  }

  componentDidMount = () => {
    this.getEventDetails();
  };

  getEventDetails = () => {
    // setisLoading(true);

    let config = {
      url: ApiUrl.eventDetails,
      method: 'post',
      body: {
        event_id: this.state.eventId,
      },
    };

    APIRequest(
      config,

      res => {
        if (res.status) {
          this.setState({
            event: res.event,
            isRepetative: res.is_repetative,
            repititiveSchedule: res.repititive_schedule,
            tag_group_new: res.tag_group_new,
            hosts: res.tag_groups.speaker,
            dance: res.tag_groups.dance,
            images: res.event.images,
            strippedHtml: HtmlToText(res.event.description)
          });
          // setrequestCount(res.follow_requests);
        }
        this.setState({ ...this.state, isLoading: false })
      },
      err => {
        this.setState({ ...this.state, isLoading: false })
        console.log(err);
      },
    );
  };

  getSaleExpirationSeconds(originTime) {
    const eventDateTime = moment(originTime);
    const currentDateTime = moment();
    return eventDateTime.diff(currentDateTime, 'seconds');
  }
  sliderImageArray = (images) => {
    let res = [];
    for (let i = 0; i < images.length; i++) {
      res.push(images[i].img)
    }
    return res;
  }

  onShare = async () => {
    try {
      const result = await Share.share({
        message: this.state.event.share_link,
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
  render() {
    return (
      // <SafeAreaView style={{flex: 1}}>
      <>
        {!this.state.isLoading ? <View style={styles.container}>
          <StatusBar barStyle={'dark-content'} translucent={true} backgroundColor={color.transparent} />
          <View
            style={styles.backBtn}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Image
                source={IMAGE.ArrowLeft}
                style={styles.backBtnImage}
              />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ flex: 0.92 }}>
            <SliderBox
              images={this.sliderImageArray(this.state.images)}
              sliderBoxHeight={300}
              onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
              dotColor={color.btnBlue}
              inactiveDotColor={color.black}
              dotStyle={{
                width: 20,
                height: 5,
                borderRadius: 5,
                marginBottom: Platform.OS == "ios" ? 50 : 80,
                padding: 0,
                margin: -5,
              }}
            />
            {/* <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={this.state.images}
            renderItem={({item: d}) => (
              <ImageBackground
                source={{uri: d.img}}
                style={{
                  height: 300,
                  width: 400,
                  resizeMode: 'stretch',
                  alignSelf: 'center',
                  paddingTop: Platform.OS == "ios" ? 0 : 0,
                }}></ImageBackground>
            )}
          /> */}
            <View
              style={{
                marginTop: -30,
                height: 30,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                backgroundColor: '#F9F9FA',
              }}></View>
            <View
              style={{
                // borderTopLeftRadius: 40,
                // borderTopRightRadius: 40,
                backgroundColor: '#F9F9FA',
              }}>
              <View>
                <View style={styles.shareWrapp}>
                  <Text style={styles.heading}>{this.state.event.title}</Text>
                  <TouchableOpacity onPress={() => this.onShare()}>
                    <Image
                      source={IMAGE.ShareIco}
                      style={{
                        height: 25,
                        width: 25,
                        resizeMode: 'contain',
                        marginRight: 20,
                        tintColor: color.btnBlue,
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.ultimateText}>
                  {this.state.event.excerpt}
                </Text>
                {this.state.event.hashtags.length > 0 ?
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={{
                      flexDirection: 'row',
                      margin: 5,
                      flexWrap: 'wrap',
                      marginHorizontal: 15
                    }}>
                    {this.state.event.hashtags.map(item => (
                      <Text style={styles.tagText}>#{item.title}</Text>
                    ))}
                  </ScrollView>
                  : null
                }

                <View style={styles.imageContainer}>
                  <Image
                    source={IMAGE.dateColor}
                    style={{
                      height: 22,
                      width: 22,
                      resizeMode: 'contain',
                      marginRight: '4%',
                      tintColor: color.btnBlue,
                    }}
                  />
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
                    style={{
                      height: 22,
                      width: 22,
                      resizeMode: 'contain',
                      marginRight: '4%',
                      tintColor: color.btnBlue,
                    }}
                  />

                  <Pressable
                    onPress={() =>
                      RedirectToMap(
                        this.state.event.venue && this.state.event.venue,
                        this.state.event.state && ", " + this.state.event.state,
                        this.state.event.city && ", " + this.state.event.city,
                        this.state.event.zipcode && ", " + this.state.event.zipcode
                      )
                    }
                  >
                    <Text style={styles.dateText}>Location</Text>
                    <Text style={styles.timeText} numberOfLines={2}>
                      {this.state.event.venue && this.state.event.venue}
                      {this.state.event.state && ", " + this.state.event.state}
                      {this.state.event.city && ", " + this.state.event.city}
                      {this.state.event.zipcode && ", " + this.state.event.zipcode}
                    </Text>
                  </Pressable>
                </View>

                {this.state.event.repetitive === 1 ? (
                  <View style={styles.imageContainer}>
                    <Image
                      source={IMAGE.eventColor}
                      style={{
                        height: 22,
                        width: 22,
                        resizeMode: 'contain',
                        marginRight: '4%',
                        tintColor: color.btnBlue,
                      }}
                    />

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
                <View style={styles.descriptionWrapper}>
                  <Text style={styles.desHeading}>Event Description</Text>
                  <View>
                    <ReadMore
                      numberOfLines={4}
                      style={styles.desText}
                      seeMoreText=' ...read more'
                      ellipsis=''
                      seeMoreStyle={{ color: color.btnBlue}}>
                      {this.state.strippedHtml}
                    </ReadMore>
                  </View>
                </View>

                {this.state.isRepetative === true && (
                  <View style={styles.ticketWrapper}>
                    <View>
                      <Text style={styles.ticketsText}>Get Your Tickets</Text>
                      <Text style={styles.eventDate}>Choose Event Date</Text>
                    </View>
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      data={this.state.repititiveSchedule}
                      renderItem={({ item: d }) => (
                        <TouchableOpacity
                          onPress={() => [
                            this.setState({
                              selected: d.id,
                            }),
                            this.props.navigation.navigate('chooseEventDate', {
                              allData: d,
                            }),
                          ]}
                          style={{
                            borderColor:
                              this.state.selected == d.id ? color.white : color.white,
                            // borderWidth: 2,
                            marginRight: 10,
                            borderRadius: 10,
                            marginTop: 5,
                            backgroundColor: color.btnBlue
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-around',
                              alignItems: 'center',
                              borderColor: color.white,
                              borderWidth: 2,
                              padding: 10,
                              borderRadius: 10,


                            }}>
                            {this.state.selected == d.id ? (
                              <Image
                                source={IMAGE.dateColor}
                                style={styles.bottomImage}
                              />
                            ) : (
                              <Image
                                source={IMAGE.date}
                                style={styles.bottomImage}
                              />
                            )}

                            <View>
                              <Text
                                style={{
                                  fontSize: Platform.OS == 'ios' ? 15 : 13,
                                  fontFamily: fontFamily.Semibold,
                                  color:
                                    this.state.selected == d.id
                                      ? color.white
                                      : color.white,
                                }}>
                                {d.days_event}
                              </Text>
                              <Text
                                style={{
                                  fontSize: Platform.OS == 'ios' ? 15 : 14,
                                  fontFamily: fontFamily.Bold,
                                  color:
                                    this.state.selected == d.id
                                      ? color.white
                                      : color.white,
                                }}>
                                {d.event_schedule_formatted}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      )}
                    />
                    <View style={styles.saleWrapper}>
                      <CountDown
                        until={this.getSaleExpirationSeconds(
                          this.state.event.end_date,
                        )}
                        size={15}
                        onFinish={() => this.saleFinished()}
                        digitTxtStyle={{ color: color.btnBlue }}
                        digitStyle={{
                          backgroundColor: '#fff',
                          marginTop: 0,
                        }}
                        timeLabelStyle={{
                          fontSize: 12,
                          fontFamily: fontFamily.Semibold,
                          color: '#000',
                        }}
                        timeToShow={['D', 'H', 'M', 'S']}
                        timeLabels={{
                          d: 'D',
                          h: 'H',
                          m: 'M',
                          s: 'S',
                        }}
                      />
                    </View>
                  </View>
                )}
                {this.state.tag_group_new?.length > 0 &&
                  this.state.tag_group_new?.map((itt, indx) => {
                    return (
                      <View style={styles.eventItems} key={indx}>
                        <Text style={styles.ticketsText}>{itt?.name}</Text>
                        <FlatList
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          data={itt?.items}
                          renderItem={({ item, index }) => (
                            <View
                              style={styles.eventTagInner}>
                              <View style={styles.tagIMageWrapper}>
                                <Image
                                  source={{ uri: `${IMAGEURL}/${item.image}` }}
                                  style={styles.profileImage}
                                />
                              </View>
                              <View style={{ margin: 8 }}>
                                <Text style={styles.nameText}>{item.title}</Text>
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
          </ScrollView>
          {this.state.isRepetative == false && (
            <TouchableOpacity
              onPress={() =>
                this.state.isRepetative == false
                  ? this.props.navigation.navigate('buyTicket', {
                    event_id: this.state.eventId,
                    date: {
                      start_date: this.state?.event?.start_date,
                      end_date: this.state?.event?.end_date,
                      start_time: this.state?.event?.start_time,
                      end_time: this.state?.event?.end_time
                    },
                  })
                  :
                  Toast.show({
                    type: 'error',
                    text1: 'Choose event date'
                  })
              }
              style={{
                flex: 0.08,
                backgroundColor:
                  this.state.isRepetative == true && this.state.selected == 0
                    ? 'gray'
                    : color.btnBlue,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.buttonText}>Get Tickets</Text>
            </TouchableOpacity>
          )}
        </View> : <DetailsSkelton />}
      </>
      // </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: null,
    borderColor: '#fff',
  },
  backButton: {
    backgroundColor: '#fff',
    height: 24,
    width: 24,
    borderRadius: 40,
  },
  heading: {
    fontSize: 23,
    fontFamily: fontFamily.Bold,
    color: color.black,
    marginHorizontal: 15
  },
  ultimateText: {
    fontSize: Platform.OS == 'ios' ? 16 : 15,
    color: '#191926',
    fontFamily: fontFamily.Medium,
    marginTop: '4%',
    marginBottom: '6%',
    marginHorizontal: 15
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: color.borderGray
  },
  ticketWrapper: {
    marginTop: 15,
    paddingHorizontal: 15,
    // backgroundColor: '#e8dcec',
    paddingVertical: 15
  },
  eventItems: {
    paddingHorizontal: 15,
    marginTop: 20
  },
  eventTagInner:
  {
    backgroundColor: color.extralightSlaty,
    borderColor: '#DEDEDE',
    borderWidth: 1,
    marginRight: 10,
    borderRadius: 10,
    marginTop: 10,
    height: 190,
    width: 128,
  },
  dateText: {
    fontSize: Platform.OS == 'ios' ? 14 : 14,
    fontFamily: fontFamily.Medium,
    color: '#191926',
  },
  timeText: {
    fontSize: Platform.OS == 'ios' ? 15 : 13,
    fontFamily: fontFamily.Bold,
    color: '#191926',
    width: 320,
  },
  descriptionWrapper: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderColor: color.borderGray,
    borderBottomWidth: 1,
  },
  desHeading: {
    fontSize: 23,
    fontFamily: fontFamily.Bold,
    color: '#191926',
    marginTop: '1%',
  },
  desText: {
    fontSize: fontSize.size13,
    fontFamily: fontFamily.Medium,
    color: color.blueMagenta,
  },
  ticketsText: {
    fontSize: 23,
    fontFamily: fontFamily.Bold,
    color: color.black,
  },
  eventDate: {
    fontSize: Platform.OS == 'ios' ? 15 : 14,
    fontFamily: fontFamily.Light,
    color: color.black,
    // marginTop: '1%',
  },
  bottomImage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    marginRight: 8,
    tintColor: color.white,
  },
  dayText: {
    fontSize: 13,
    fontFamily: fontFamily.Bold,
  },
  tagIMageWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  profileImage: {
    width: '100%',
    height: 116,
    resizeMode: 'cover',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  nameText: {
    fontSize: 15,
    fontFamily: fontFamily.Bold,
    color: '#191926',
  },
  proText: {
    fontSize: Platform.OS == 'ios' ? 15 : 14,
    fontFamily: fontFamily.Light,
    color: '#191926',
  },
  sponsorsImage: {
    width: 161,
    height: 56,
    resizeMode: 'cover',
  },
  galleryImage: {
    height: 146,
    width: 161,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: fontFamily.Regular,
    color: color.white,
  },
  shareWrapp: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  backBtn: {
    position: 'absolute',
    left: 15,
    top: STATUSBAR_HEIGHT + 15,
    zIndex: 1
  },
  backBtnImage: {
    height: 32,
    width: 32,
    resizeMode: 'contain',
  },
  saleWrapper: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
});
