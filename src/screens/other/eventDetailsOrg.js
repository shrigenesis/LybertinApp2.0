import React, { useState, useEffect, FC, Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  Share,
} from 'react-native';
import { IMAGE, color, fontFamily } from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { APIRequest, ApiUrl, IMAGEURL, Toast } from './../../utils/api';
import { SliderBox } from "react-native-image-slider-box";

let myHTML = '';
let strippedHtml = myHTML.replace(/<[^>]+>/g, '');

export default class eventDetailsOrg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // data: DATA,
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
      ticketinfo: {},
    };
  }

  componentDidMount = () => {
    console.log('event id is', this.state.eventId);
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
            ticketinfo: res?.ticket_info,
          });
          myHTML = res.event.description;
          strippedHtml = myHTML.replace(/<[^>]+>/g, '');

          // setrequestCount(res.follow_requests);
        }
        // setisLoading(false);
      },
      err => {
        // setisLoading(false);
        console.log(err);
      },
    );
  };

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
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
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
              marginBottom: 50,
              padding: 0,
              margin: -5,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: '5%',
              marginTop: Platform.OS == "ios" ? '-60%' : '-80%',
            }}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Image
                source={IMAGE.goBack}
                style={{
                  height: 24,
                  width: 24,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>

           
          </View>
          {/* <ImageBackground
            source={IMAGE.new}
            style={{
              height: 286,
              width: '100%',
              resizeMode: 'stretch',
              alignSelf: 'center',
              // marginTop: '2%',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: '5%',
                marginTop: '10%',
              }}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Image
                  source={IMAGE.goBack}
                  style={{
                    height: 24,
                    width: 24,
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>

              <Image
                source={IMAGE.share}
                style={{
                  height: 24,
                  width: 24,
                  resizeMode: 'contain',
                }}
              />
            </View>
          </ImageBackground> */}

          <View
            style={{
              marginTop: Platform.OS == "ios" ? '40%' : '50%',
              height: 30,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 40,
              backgroundColor: '#F9F9FA',
            }}></View>
          <View
            style={{
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
                      tintColor:color.btnBlue,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.ultimateText}>
                {this.state.event.excerpt}
              </Text>
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

                <View>
                  <Text style={styles.dateText}>Location</Text>
                  <Text style={styles.timeText} numberOfLines={2}>
                    {this.state.event.venue}, {this.state.event.state},{' '}
                    {this.state.event.city}, {this.state.event.zipcode}
                  </Text>
                </View>
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
                      Monthly Repetitive Event
                    </Text>
                  </View>
                </View>
              ) : (
                <View></View>
              )}
              <View style={styles.descriptionWrapper}>
                <Text style={styles.desHeading}>Event Description</Text>
                {this.state.showText == 0 ? (
                  <View>
                    <Text style={styles.desText} numberOfLines={2}>
                      {strippedHtml}
                    </Text>
                    <Text
                      onPress={() =>
                        this.setState({
                          showText: 1,
                        })
                      }
                      style={{ color: color.btnBlue, alignSelf: 'flex-end' }}>
                      ...Read more{' '}
                    </Text>
                  </View>
                ) : (
                  <View>
                    <Text style={styles.desText}>{strippedHtml}</Text>
                    {/* <Text style={{color: '#20BBF6',alignSelf:"flex-end"}}>...Read more </Text> */}
                  </View>
                )}

                {/* <Text style={styles.desHeading}>Event Info</Text>
              <Text style={styles.desText}>
                It Is Safe To Say Forbidden Nights Faces Have Been Seen Across
                The World Bringing In Girls From All Sides Of The Globe. You
                will <Text style={{color: '#20BBF6'}}>...Read more </Text>
              </Text> */}
              </View>
              <View
                style={{
                  marginTop: 10,
                  backgroundColor: '#e8dcec',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 20,
                  paddingHorizontal: 15,
                  borderRadius: 5,
                  margin: 14,

                }}>
                <Text
                  style={{
                    color: color.btnBlue,
                    fontFamily: fontFamily.Bold,
                    fontWeight: 'bold',
                  }}>
                  Tickets Sold
                </Text>
                <Text
                  style={{
                    color: color.btnBlue,
                    fontFamily: fontFamily.Bold,
                    fontWeight: 'bold',
                  }}>
                  {this.state.ticketinfo?.sold_tickets}/
                  {this.state.ticketinfo?.total_tickets}
                </Text>
              </View>
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

              {/* <View style={{marginTop: '8%'}}>
                <Text style={styles.ticketsText}>Co-sponsors</Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={this.state.data.coSponsors}
                  renderItem={({item: d}) => (
                    <View
                      style={{
                        borderColor: '#DEDEDE',
                        borderWidth: 1,
                        marginRight: 10,
                        borderRadius: 10,
                        marginTop: 30,
                        height: 190,
                        width: 128,
                      }}>
                      <Image
                        source={{uri: d.image}}
                        style={styles.profileImage}
                      />
                      <View style={{margin: 8}}>
                        <Text style={styles.nameText}>{d.name}</Text>
                        <Text style={styles.proText}>{d.professional}</Text>
                      </View>
                    </View>
                  )}
                />
              </View>
              <View style={{marginTop: '8%'}}>
                <Text style={styles.ticketsText}>Sponsors</Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={this.state.data.sponsors}
                  renderItem={({item: d}) => (
                    <View
                      style={{
                        borderColor: '#DEDEDE',
                        borderWidth: 1,
                        marginRight: 10,
                        borderRadius: 10,
                        marginTop: 30,
                      }}>
                      <Image
                        source={IMAGE.sponsers}
                        style={styles.sponsorsImage}
                      />
                    </View>
                  )}
                />
              </View> */}
              {/* <View style={{marginTop: '8%'}}>
                <Text style={styles.ticketsText}>Event Gallery</Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={this.state.data.eventGallery}
                  renderItem={({item: d}) => (
                    <View style={{marginRight: 10, marginTop: 30}}>
                      <Image
                        source={{uri: d.image}}
                        style={styles.galleryImage}
                      />
                    </View>
                  )}
                />
              </View> */}
            </View>
          </View>
        </ScrollView>
      </View>
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
  dateText: {
    fontSize: Platform.OS == 'ios' ? 14 : 12,
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
    marginTop: '8%',
  },
  desText: {
    fontSize: Platform.OS == 'ios' ? 15 : 13,
    fontFamily: fontFamily.Light,
    color: '#191926',
    marginTop: '4%',
  },
  ticketsText: {
    fontSize: 23,
    fontFamily: fontFamily.Bold,
    color: '#191926',
  },
  eventDate: {
    fontSize: Platform.OS == 'ios' ? 15 : 13,

    fontFamily: fontFamily.Light,
    color: '#191926',
    marginTop: '2%',
  },
  bottomImage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    marginRight: 8,
  },
  dayText: {
    fontSize: 13,
    fontFamily: fontFamily.Bold,
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
  buttonText: {
    fontSize: 15,
    fontFamily: fontFamily.Medium,
    color: color.white,
  },
  shareWrapp: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems:"center"
  }
});
