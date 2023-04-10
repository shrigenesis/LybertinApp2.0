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
} from 'react-native';
import { IMAGE, color, fontFamily } from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Divider, Input, Overlay } from 'react-native-elements';

import { RippleTouchable, StoryList } from '../../component/';
import SwipeableView from 'react-native-swipeable-view';
import Loader from './../../component/loader';
import { APIRequest, ApiUrl, IMAGEURL, Toast } from './../../utils/api';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import { User } from '../../utils/user';

export default class featured_events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selected: 0,
      category: this.props.route.params.category,
      date: this.props.route.params.date,
      price: this.props.route.params.price,
      country: this.props.route.params.country,
      city: this.props.route.params.city,
      search: this.props.route.params.input,
      hashtag: this.props.route.params.hashtag,
      endDate: this.props.route.params.endDate,
    };
  }

  componentDidMount = () => {
    this.getEvents();
  };

  getEvents = () => {
    // setisLoading(true);

    let config = {
      url: ApiUrl.eventFilter,
      method: 'post',
      body: {
        city: this.state.city,
        start_date: this.state.date,
        price: this.state.price,
        category: this.state.category,
        country_id: this.state.country,
        search: this.state.search,
        hashtag: this.state.hashtag,
        end_date: this.state.endDate,
      },
    };
    console.log(config);
    APIRequest(
      config,

      res => {
        this.setState({
          data: res.data,
        });

        // setisLoading(false);
      },
      err => {
        // setisLoading(false);
        console.log(err);
      },
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{ marginHorizontal: '4%' }}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Image
                source={IMAGE.back}
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>

            <Text style={styles.headerText}>Filter</Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('filterScreen')}>
              <Image
                source={IMAGE.filterList}
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* <Divider style={styles.divider} /> */}
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <View>
            <FlatList
              data={this.state.data}
              renderItem={({ item: d }) => (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('eventDetails', {
                      event_id: d.id,
                    })
                  }
                  style={styles.cardContainer}>
                  <Image
                    source={{ uri: `${IMAGEURL}/${d.thumbnail}` }}
                    style={{
                      height: '50%',
                      width: '96%',
                      resizeMode: 'stretch',
                      alignSelf: 'center',
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                      // marginTop: '4%',
                    }}
                  />
                  <Text style={styles.headingText} numberOfLines={1}>
                    {d.title}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      marginHorizontal: '4%',
                    }}>
                    <Image
                      source={IMAGE.date}
                      style={{
                        height: 12,
                        width: 12,
                        resizeMode: 'contain',
                        alignSelf: 'center',
                        marginRight: '2%',
                      }}
                    />
                    <Text style={styles.dateText}>
                      {d.start_date} to {d.end_date}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      marginHorizontal: '4%',
                    }}>
                    <Image
                      source={IMAGE.location}
                      style={{
                        height: 12,
                        width: 12,
                        resizeMode: 'contain',
                        alignSelf: 'center',
                        marginRight: '2%',
                      }}
                    />
                    <Text style={styles.dateText}>{d.city}</Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      marginHorizontal: '3%',
                    }}>
                    <Image
                      source={IMAGE.time}
                      style={{
                        height: 12,
                        width: 12,
                        resizeMode: 'contain',
                        alignSelf: 'center',
                        marginHorizontal: '2%',
                      }}
                    />
                    <Text style={styles.dateText}>
                      {d.start_time} - {d.end_time}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              //Setting the number of column
              numColumns={2}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: null,
    // backgroundColor: 'red',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '4%',
    alignItems: 'center',
    marginBottom: '2.5%',
    marginTop: Platform.OS == 'ios' ? hp(6) : hp(4),
  },
  headerText: {
    fontSize: 15,
    fontFamily: fontFamily.Bold,
    color: '#0F0F0F',
  },
  divider: {
    height: 1,
    width: '200%',
    backgroundColor: '#EDEDED',
    marginHorizontal: '-10%',
    marginVertical: '5%',
  },
  cardContainer: {
    width: '47%',
    maxWidth: '47%',
    height: 220,
    borderRadius: 10,
    margin: '1.5%',
    backgroundColor: '#fff',
    marginTop: '4%',
    borderWidth: 1,
    borderColor: '#EDEDED',
    // marginBottom:"30%"



    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  headingText: {
    fontSize: Platform.OS == 'ios' ? 18 : 15,
    fontFamily: fontFamily.Bold,
    color: color.black,
    marginLeft: '4%',
    marginTop: '6%',
  },
  dateText: {
    fontSize: Platform.OS == 'ios' ? 13 : 11,
    fontFamily: fontFamily.Light,
    color: '#8E8E93',
    marginTop: '3%',
  },
});
