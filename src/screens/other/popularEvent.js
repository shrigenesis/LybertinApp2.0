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
  Dimensions,
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

export default class popularEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selected: 0,
      filter_type: this.props.route.params.filter_type,
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
        filter_type: this.state.filter_type,
      },
    };

    APIRequest(
      config,

      res => {
        console.log('================', res.data);
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

        <StatusBar barStyle={'dark-content'} backgroundColor={color.white} />
        <View style={{ marginHorizontal: '4%', marginVertical: '6%' }}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={{ height: 30, width: 30 }}
              onPress={() => this.props.navigation.goBack()}>
              <Image
                source={IMAGE.back}
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>

            <Text style={styles.headerText}>
              {this.props.route.params.title}
            </Text>
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
        <View style={{ backgroundColor: '#00000012', paddingHorizontal: 10 }}>
          <FlatList
            data={this.state.data}
            renderItem={({ item: d }) => (
              <View style={[styles.cardContainerNew, { margin: 5, padding: 5 }]}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('eventDetails', {
                      event_id: d.id,
                    })
                  }>
                  <View style={{ flexDirection: 'column' }}>
                    <Image
                      source={{ uri: `${IMAGEURL}/${d.thumbnail}` }}
                      style={{
                        height: Dimensions.get('window').width / 3,
                        width: '100%',
                        alignContent: 'stretch',
                        resizeMode: 'stretch',
                        alignSelf: 'center',
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                      }}
                    />

                    <Text style={styles.headingText} numberOfLines={1}>
                      {d.title}
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 5,
                        marginLeft: 5,
                      }}>
                      <Image
                        source={IMAGE.date}
                        style={{
                          height: 12,
                          width: 12,
                          resizeMode: 'contain',
                          alignSelf: 'center',
                          tintColor: '#0F1828D9',
                        }}
                      />
                      <Text style={[styles.dateText, { marginLeft: 5 }]}>
                        {d.start_date} to {d.end_date}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        marginHorizontal: 5,
                        marginTop: 5,
                      }}>
                      <Image
                        source={IMAGE.location}
                        style={{
                          height: 12,
                          width: 12,
                          resizeMode: 'contain',
                          alignSelf: 'center',
                          tintColor: '#0F1828D9',
                        }}
                      />
                      <Text style={[styles.dateText, { marginLeft: 5 }]}>
                        {d.city}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        margin: 5,
                      }}>
                      <Image
                        source={IMAGE.time}
                        style={{
                          height: 12,
                          width: 12,
                          resizeMode: 'contain',
                          alignSelf: 'center',
                          tintColor: '#0F1828D9',
                        }}
                      />
                      <Text style={[styles.dateText, { marginLeft: 5 }]}>
                        {d.start_time} - {d.end_time}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            //Setting the number of column
            numColumns={2}
          />
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
    alignContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS == 'ios' ? hp(4) : 2,
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
    height: 250,
    borderRadius: 10,
    margin: '1.5%',
    backgroundColor: '#fff',
    marginTop: '4%',
    borderWidth: 1,
    borderColor: '#EDEDED',
    // marginBottom:"30%"
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
    color: '#0F1828D9',
  },
  cardContainerNew: {
    width: '47%',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
});
