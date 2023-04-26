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
import { IMAGE, color, fontFamily } from '../../constant';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Divider, Input, Overlay } from 'react-native-elements';

import { RippleTouchable, StoryList } from '../../component';
import SwipeableView from 'react-native-swipeable-view';
import Loader from '../../component/loader';
import { APIRequest, ApiUrl, IMAGEURL, Toast } from '../../utils/api';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import { User } from '../../utils/user';
import EducationListItem from './educationListItem';
import EventListSkelton from '../../utils/skeltons/eventListSkelton';
import NoRecord from './noRecord';

export default class FeaturedCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selected: 0,
      isLoading: true,
      category: this.props.route.params.category,
      date: this.props.route.params.date,
      search: this.props.route.params.input,
      hashtag: this.props.route.params.hashtag,
      endDate: this.props.route.params.endDate,
    };
  }

  componentDidMount = () => {
    this.getEvents();
  };

  getEvents = () => {
    let config = {
      url: ApiUrl.educationListFilter,
      method: 'post',
      body: {
        search: this.state.search,
        category: this.state.category,
        hashtag: this.state.hashtag,
        start_date: this.state.date,
        end_date: this.state.endDate,
      },
    };
    APIRequest(
      config,

      res => {
        this.setState({
          data: res.data,
        });
        this.setState({ ...this.state, isLoading: false })
      },
      err => {
        this.setState({ ...this.state, isLoading: false })
        console.log(err);
      },
    );
  };

  renderEventBox = (item, type) => {
    return (
      <EducationListItem item={item} type={type} />
    )
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle={'dark-content'}
          translucent
          backgroundColor={color.transparent}
        />
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
              onPress={() => this.props.navigation.navigate('filterScreenEducation')}>
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
        <View style={{ flex: 1, backgroundColor: color.lightGray, paddingHorizontal: 10 }}>
          {!this.state.isLoading ?
            this.state.data.length > 0 ?
              <FlatList
                data={this.state.data}
                keyExtractor={index => `featuredCourse-${index}`}
                renderItem={({ item, index }) => this.renderEventBox(item, index)}
                //Setting the number of column
                numColumns={2}
              /> :
              <NoRecord
                image={IMAGE.noConversation}
                title="No Courses found"
                description="You will get Featured and Live conferences Courses here."
                showButton={false}
              />
            :
            <FlatList
              keyExtractor={index => `featuredCourseSkelton-${index}`}
              showsVerticalScrollIndicator={false}
              data={[0, 1, 2, 3, 4, 6]}
              numColumns={2}
              renderItem={() => (
                <EventListSkelton />
              )}
            />
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: null,
    marginTop: 25,
    // backgroundColor: color.lightGray,
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
