/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect, FC, Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Share,
  Pressable,
} from 'react-native';
import { IMAGE, color, fontFamily, fontSize } from '../../constant';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { APIRequest, ApiUrl, BASEURL, domainUriPrefix } from '../../utils/api';
import Toast from 'react-native-toast-message';
import { SliderBox } from "react-native-image-slider-box";
import RenderHtml from 'react-native-render-html';
import ReadMore from '@fawazahmed/react-native-read-more';
import HtmlToText from '../../utils/HtmlToText';
import SvgUri from 'react-native-svg-uri-updated';
import EducationVideoListItem from './educationVideoListItem';
import BottomSheetAddVideo from '../../component/BottomSheetAddVideo';
import Video from 'react-native-video';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import DetailsSkelton from '../../utils/skeltons/DetailsSkelton';
import { Button, Loader } from '../../component';

const STATUSBAR_HEIGHT = StatusBar.currentHeight;


export default class educationDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.route.params.id,
      selected: 0,
      Course: [],
      event: {},
      allVideos: [],
      addedVideo: [],
      allPurchasedVideo: [],
      showText: 0,
      isRepetative: '',
      repititiveSchedule: [],
      hosts: [],
      dance: [],
      images: [],
      tag_group_new: [],
      AddedVideoPrice: 0,
      AddedVideoCount: 0,
      readMore: false,
      isShowBottomSheet: false,
      selectAllVideo: false,
      isLoading: true,
    };
    this.videoRef = React.createRef();
    this.strippedHtml = ""
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', async () => {
      this.getEventDetails();
      this.setState({...this.state, AddedVideoPrice:0,AddedVideoCount:0 })
    });
    this.getEventDetails();
  };

  // Get course details
  getEventDetails = () => {
    this.setState({ ...this.state, isLoading: true })
    let config = {
      url: `${ApiUrl.educationList}/${this.state.id}`,
      method: 'post',
    };
    APIRequest(
      config,
      res => {
        this.setState({
          ...this.state,
          Course: res.data,
          allVideos: res.data.session_videos.filter(item => !item.is_purchased),
          allPurchasedVideo: res.data.session_videos.filter(item => item.is_purchased),
          strippedHtml: HtmlToText(res.data.video_description)
        });
        this.setState({ ...this.state, isLoading: false })
      },
      err => {
        console.log(err);
        this.setState({ ...this.state, isLoading: false })
      },
    );
  };

  // Enroll for live Course
  EnrollCourse = () => {
    let config = {
      url: `${ApiUrl.educationAddInterest}`,
      method: 'post',
      body: {
        course_id: [this.state.id],
        is_live_interest: 1
      }
    };
    APIRequest(
      config,
      res => {
        if (res.status) {
          this.getEventDetails()
          Toast.show({
            type: 'info',
            text1: res.Message
          })
        }
        this.setState({ ...this.state, isLoading: false })
      },
      err => {
        console.log(err);
        this.setState({ ...this.state, isLoading: false })
      },
    );
  }


  // Extract image string for image slider
  sliderImageArray = (images) => {
    let res = [];
    for (let i = 0; i < images.length; i++) {
      res.push(images[i].img)
    }
    return res;
  }

  // Add cart video
  setAddVideo(id, price, item) {
    this.setState({
      ...this.state,
      allVideos: this.state.allVideos.map((item) => (item.id === id ? { ...item, added: true } : item)),
      AddedVideoCount: this.state.AddedVideoCount + 1,
      AddedVideoPrice: this.state.AddedVideoPrice + price,
      addedVideo: [...this.state.addedVideo, id]
    });

  }
  // Remove cart video
  setRemoveVideo(id, price, item) {
    this.setState({
      ...this.state,
      allVideos: this.state.allVideos.map((item) => (item.id === id ? { ...item, added: false } : item)),
      AddedVideoCount: this.state.AddedVideoCount - 1,
      AddedVideoPrice: this.state.AddedVideoPrice - price,
      // addedVideo: this.state.addedVideo.map((d)=> d.id !== item.id && d)
      addedVideo: this.state.addedVideo.splice(this.state.addedVideo.findIndex((i) => i === id), 0)
    });
  }
  // Add and reamove all cart video
  selectAllVideo() {
    let x = 0;
    this.setState({
      ...this.state,
      selectAllVideo: !this.state.selectAllVideo,
      allVideos: this.state.allVideos.map(item => ({ ...item, added: !this.state.allVideos.is_purchased ? !this.state.selectAllVideo : this.state.allVideos.added })),
      AddedVideoCount: !this.state.selectAllVideo ? this.state.allVideos.length : 0,
      AddedVideoPrice: !this.state.selectAllVideo ?
        this.state.allVideos.reduce((x, item) => x + item.price, 0) : 0,
      addedVideo: !this.state.selectAllVideo ?
        this.state.allVideos.map(item => item.id) : [],
    });
  }
  // Share Course Function
  onShare = async (link) => {
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
  // Create link for share course
  buildLink = async () => {
    const link = await dynamicLinks().buildLink({
      link: `${BASEURL}/education/?id=${this.state.Course.id}`,
      domainUriPrefix: domainUriPrefix
    });
    this.onShare(link)
  };


  render() {
    // let SliderImage = JSON.parse(this.state.Course.image);
    // SliderImage = SliderImage.map((item) => BaseURL + item);
    return (
      <View style={styles.container}>
        <StatusBar barStyle={'light-content'} translucent={true} backgroundColor={color.transparent} />
        <View
          style={[styles.backBtnPosition, {top: STATUSBAR_HEIGHT + (Platform.OS == "ios" ? 50 : 15)}]}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Image
              source={IMAGE.ArrowLeft}
              style={styles.backBtnImage}
            />
          </TouchableOpacity>
        </View>
        {this.state.isLoading ? <DetailsSkelton /> :
          <>
            <ScrollView style={{ flex: 0.92 }}>
              <SliderBox
                images={[this.state.Course.image]}
                sliderBoxHeight={300}
                onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
                dotColor={color.btnBlue}
                inactiveDotColor={color.black}
                dotStyle={styles.dotStyle}
              />
              <View
                style={styles.radiusDesign}></View>

              <View
                style={styles.bodyBox}>
                <View>
                  <View style={styles.shareWrapp}>
                    <Text style={styles.heading}>${this.state.Course?.price}</Text>
                    <TouchableOpacity onPress={() => this.buildLink()}>
                      <Image source={IMAGE.educationShareBlue} style={styles.rightSpace} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.headingText}>{this.state.Course.title}</Text>
                  <Text style={styles.ultimateText}>{this.state.Course?.team}</Text>
                  {this.state.Course?.hashtags.length > 0 ?
                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      style={{
                        flexDirection: 'row',
                        margin: 5,
                        flexWrap: 'wrap',
                        marginHorizontal: 15
                      }}>
                      {this.state.Course?.hashtags.map(item => (
                        <Text key={`item-${item.title}`} style={styles.tagText}>#{item.title}</Text>
                      ))}
                    </ScrollView>
                    : null
                  }
                  {/* <View
                style={{
                  flexDirection: 'row',
                  margin: 3,
                  marginHorizontal: 15,
                  alignItems: "center"
                }}>
                <Text style={styles.ratingNumber}>{this.state.Course.rating} </Text>
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
                <Text style={styles.totleRating}>({this.state.Course.allReviews})</Text>
              </View> */}
                  <View style={styles.imageContainer}>
                    <SvgUri style={styles.rightSpace} source={IMAGE.svgeventType} />
                    <View>
                      <Text style={styles.dateText}>Type</Text>
                      <Text style={styles.timeText} numberOfLines={2}>{this.state.Course?.type}</Text>
                    </View>
                  </View>
                  <View>
                    <View style={{ ...styles.descriptionWrapper, borderBottomWidth: 1 }}>
                      <Text style={styles.desHeading}>Video Description</Text>
                      <View>
                        <ReadMore
                          numberOfLines={4}
                          style={styles.desText}
                          seeMoreText='read more'
                          seeMoreStyle={{ color: color.btnBlue }}>
                          {this.state.strippedHtml}
                        </ReadMore>
                      </View>
                    </View>
                  </View>

                  {this.state.Course?.trailer_video ? <View>
                    <View style={styles.descriptionWrapper}>
                      <Text style={styles.desHeading}>Trailer Video</Text>
                      <View>
                        <TouchableOpacity
                          style={{ width: wp(60) }}
                          onPress={() => this.props.navigation.navigate('videoPlayer', { VideoURL: this.state.Course.trailer_video })}
                        >
                          <Image
                            source={{ uri: this.state.Course.image }}
                            style={{
                              height: hp(25),
                              resizeMode: 'cover',
                              width: wp(91),
                              borderRadius: 5,
                              marginTop: 10
                            }}
                          />
                        </TouchableOpacity>
                      </View>

                      {/* <Video
                          source={{ uri: this.state.Course.trailer_video }}
                          // source={IMAGE.lybertinVideo}
                          onBuffer={this.onBuffer}
                          onLoadEnd={this.onLoadEnd}
                          resizeMode={'cover'}
                          muted={true}
                          style={styles.trailerVideo}
                        /> */}
                    </View>
                  </View> : null}

                  {this.state.Course.type !== 'live' ? <View>
                    <View style={styles.descriptionWrapper}>
                      <View style={styles.videoBox}>
                        <Text style={styles.desHeading}>Session videos</Text>
                      </View>

                      {this.state.allVideos.length > 0 ? <View style={[styles.shareWrapp, { marginBottom: 15 }]}>
                        <Text>Select All Session</Text>
                        <TouchableOpacity
                          onPress={() => this.selectAllVideo()}
                        >
                          <Image style={styles.iconImage} source={this.state.selectAllVideo ? IMAGE.checkNewFill : IMAGE.checkmark_circle_outline} />
                        </TouchableOpacity>
                      </View> : null}
                      <FlatList
                        showsHorizontalScrollIndicator={false}
                        data={this.state.allPurchasedVideo}
                        renderItem={({ item, index }) => {
                          if (item.is_purchased) {
                            return (
                              <View>
                                <EducationVideoListItem
                                  setAddVideo={this.setAddVideo.bind(this)}
                                  setRemoveVideo={this.setRemoveVideo.bind(this)}
                                  purchased={item.is_purchased}
                                  item={item} />
                              </View>
                            )
                          }
                        }}
                        keyExtractor={((item, index) => `VideoListDetailsPerchesed${index}`)}
                      />
                      <FlatList
                        showsHorizontalScrollIndicator={false}
                        data={this.state.allVideos}
                        renderItem={({ item, index }) => {
                          if (!item.is_purchased) {
                            return (
                              <View>
                                <EducationVideoListItem
                                  setAddVideo={this.setAddVideo.bind(this)}
                                  setRemoveVideo={this.setRemoveVideo.bind(this)}
                                  purchased={item.is_purchased}
                                  item={item} />
                              </View>
                            )
                          }
                        }}
                        keyExtractor={((item, index) => `VideoListDetailsPage${index}`)}
                      />
                    </View>
                  </View> : null}

                  {this.state.Course.type === 'live' ?
                    <View style={styles.descriptionWrapper}>
                      <View style={styles.videoBox}>
                        <Text style={styles.desHeading}>Join live session</Text>
                      </View>
                      <View style={styles.joinBtn}>
                        {this.state.Course.is_live_interest ? <Button
                          label='Join Now'
                          onPress={() => this.props.navigation.navigate('LiveConference')}
                        /> :
                          <Button
                            label='Enroll Now'
                            onPress={() => this.EnrollCourse()}
                          />}
                      </View>
                    </View> : null}

                  <View>
                    {this.state.Course?.sponsors?.length > 0 ?
                      <View style={styles.descriptionWrapper}>
                        <Text style={styles.desHeading}>Sponsors</Text>
                        <FlatList
                          horizontal={true}
                          showsHorizontalScrollIndicator={true}
                          data={this.state.Course.sponsors}
                          renderItem={({ item, index }) => (
                            <View
                              style={styles.sponsorTagInner}>
                              <View >
                                <Image
                                  source={{ uri: item }}
                                  style={styles.sponsorImage}
                                />
                              </View>
                            </View>
                          )}
                        />
                      </View> : null}
                  </View>
                  {/* <View>
                  Dance Artist and other tag use it loop
                    {this.state.tag_group_new?.length > 0 &&
                      this.state.tag_group_new?.map((itt, indx) => {
                        return (
                          <View style={styles.eventItems} key={indx}>
                            <View style={{
                              flexDirection: 'row',
                              alignItems: "center",
                              justifyContent: "space-between"
                            }}>
                              <Text style={styles.ticketsText}>{itt?.name}</Text>
                              <TouchableOpacity
                                onPress={() =>
                                  this.props.navigation.navigate('educationVideoShowAll', {
                                    // filter_type: 'upcomming_events ',
                                    title: 'Course Videos',
                                  })
                                }>
                                <Text style={styles.seeAllText}>View all</Text>
                              </TouchableOpacity>
                            </View>
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
                  </View> */}
                </View>
              </View>
            </ScrollView>
            {(this.state.Course.type !== 'live' && this.state.allVideos.length > 0) && (
              <Pressable
                onPress={() =>
                  this.state.AddedVideoCount > 0
                    ? this.props.navigation.navigate('Payment', {
                      course_id: this.state.id,
                      video_id: this.state.addedVideo,
                      promocode: [],
                    })
                    : Toast.show({
                      type: 'info',
                      text1: 'Sorry, Cart is empty'
                    })
                }
                style={styles.bottomCheckoutBox}>
                <View>
                  <Text style={styles.btnTextWhite}>{this.state.AddedVideoCount} video</Text>
                  <Text style={styles.btnTextWhite}>${this.state.AddedVideoPrice} All prices</Text>
                </View>
                <View style={styles.checkoutTextBox}>
                  <Text style={styles.buttonText}>Checkout  </Text>
                  <Image style={styles.checkoutImage} source={IMAGE.arrow} />
                </View>
              </Pressable>
            )}
          </>}
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
  heading: {
    fontSize: fontSize.size21,
    fontFamily: fontFamily.Bold,
    color: color.btnBlue,
    marginHorizontal: 15
  },
  backBtnPosition: {
    position: 'absolute',
    left: 15,
    zIndex: 1
  },
  headingText: {
    fontSize: fontSize.size18,
    fontFamily: fontFamily.Bold,
    color: color.black,
    marginHorizontal: 15,
    marginTop: 5
  },
  dotStyle: {
    width: 20,
    height: 5,
    borderRadius: 5,
    marginBottom: Platform.OS == "ios" ? 50 : 80,
    padding: 0,
    margin: -5,
  },
  backBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '5%',
    marginTop: Platform.OS == "ios" ? '-60%' : '-70%',
  },
  backBtnImage: {
    height: 32,
    width: 32,
    resizeMode: 'contain',
  },
  radiusDesign: {
    marginTop: -30,
    height: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: color.background,
  },
  bodyBox: {
    backgroundColor: color.background,
  },
  trailerVideo: {
    height: hp(26),
    resizeMode: 'cover',
    width: wp(92),
    borderRadius: 5,
    marginTop: 10
  },
  videoBox: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15
  },
  iconImage: {
    width: 20,
    height: 20
  },
  bottomCheckoutBox: {
    flexDirection: 'row',
    backgroundColor: color.btnBlue,
    paddingTop: 15,
    paddingBottom: Platform.OS == "ios" ? 25 : 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Platform.OS == "ios" ? 30 : 10,
  },
  ultimateText: {
    fontSize: fontSize.size15,
    color: color.liteBlueMagenta,
    fontFamily: fontFamily.Regular,
    marginVertical: 10,
    marginHorizontal: 15
  },

  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingBottom: 10,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderTopColor: color.borderGray,
    borderBottomColor: color.borderGray
  },
  eventItems: {
    paddingHorizontal: 15,
    marginTop: 20
  },
  eventTagInner:
  {
    backgroundColor: color.extralightSlaty,
    borderColor: color.borderGray,
    borderWidth: 1,
    marginRight: 10,
    borderRadius: 10,
    marginTop: 10,
    height: 190,
    width: 128,
  },
  sponsorTagInner:
  {
    backgroundColor: color.extralightSlaty,
    borderColor: color.borderGray,
    borderWidth: 1,
    marginRight: 10,
    borderRadius: 5,
    marginTop: 10,
    height: 50,
    width: 128,
  },
  dateText: {
    fontSize: fontSize.size12,
    fontFamily: fontFamily.Medium,
    color: color.liteBlueMagenta,
  },
  timeText: {
    fontSize: fontSize.size15,
    fontFamily: fontFamily.Semibold,
    color: color.blueMagenta,
    width: 320,
  },
  descriptionWrapper: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 15,
    borderColor: color.borderGray,
    // borderBottomWidth: 1,
  },
  desHeading: {
    fontSize: fontSize.size19,
    fontFamily: fontFamily.Bold,
    color: color.blueMagenta,
    marginTop: '1%',
  },
  desText: {
    fontSize: fontSize.size13,
    fontFamily: fontFamily.Medium,
    color: color.blueMagenta,
  },
  ticketsText: {
    fontSize: fontSize.size23,
    fontFamily: fontFamily.Bold,
    color: color.black,
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
  nameText: {
    fontSize: fontSize.size12,
    fontFamily: fontFamily.Medium,
    color: color.blueMagenta,
  },
  sponsorsImage: {
    width: 161,
    height: 56,
    resizeMode: 'cover',
  },
  buttonText: {
    fontSize: fontSize.size15,
    fontFamily: fontFamily.Regular,
    color: color.white,
  },
  shareWrapp: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  ratingNumber: {
    color: color.ratingColor,
    fontSize: fontSize.size18,
    fontFamily: fontFamily.Semibold,
    marginRight: 5
  },
  totleRating: {
    color: color.totalRating,
    fontSize: fontSize.size14,
    marginLeft: 5
  },
  seeAllText: {
    fontSize: fontSize.size15,
    fontFamily: fontFamily.Semibold,
    color: color.btnBlue,
    marginRight: '4%',
  },
  rightSpace: {
    marginRight: 18,
    width: 20,
    height: 20,
    resizeMode: 'contain'
  },
  btnTextWhite: {
    color: color.white,
    fontSize: fontSize.size12,
    lineHeight: fontSize.size18,
  },
  checkoutTextBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkoutImage: {
    width: 7,
    height: 10,
    resizeMode:'contain'
  },
  joinBtn: { alignItems: 'center' },
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
