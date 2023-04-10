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
  Platform,
  SafeAreaView,
} from 'react-native';
import { IMAGE, color, fontFamily } from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';

import { APIRequest, ApiUrl, IMAGEURL } from './../../utils/api';
import NoRecord from './noRecord';
import { StatusBar } from 'react-native';
import TicketVideoScreen from './TicketVideoScreen';
import TicketMediaScreen from './TicketMediaScreen';

export default class TicketScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'EVENTS',
    };
  }
  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>

          <StatusBar barStyle={'dark-content'} backgroundColor={color.white} />

          <View>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>My Bookings</Text>
            </View>
            {/* <View style={styles.divider}></View> */}

            <View style={{ marginHorizontal: '3%' }}>
              <View style={styles.tabView}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ activeTab: 'EVENTS' });
                  }}
                  style={[styles.tab, this.state.activeTab == 'EVENTS' && styles.activeTab]}>
                  <Text
                    style={[
                      styles.tabText,
                      this.state.activeTab == 'EVENTS' && {
                        color: color.black,
                        fontFamily: fontFamily.Bold,
                      },
                    ]}>
                    Media
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ activeTab: 'VIDEO_COURSE' });
                  }}
                  style={[styles.tab, this.state.activeTab == 'VIDEO_COURSE' && styles.activeTab]}>
                  <Text
                    style={[
                      styles.tabText,
                      this.state.activeTab == 'VIDEO_COURSE' && {
                        color: color.black,
                        fontFamily: fontFamily.Bold,
                      },
                    ]}>
                    Video Course
                  </Text>
                </TouchableOpacity>
              </View>
              {this.state.activeTab==='VIDEO_COURSE'?<TicketVideoScreen /> : null}
              {this.state.activeTab==='EVENTS'? <TicketMediaScreen /> :null}
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: color.background
  },
  container: {
    flex: 1,
    width: null,
    backgroundColor: color.background
  },
  headerContainer: {
    // backgroundColor: '#EDEDED',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    // flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 15,
    fontFamily: fontFamily.Bold,
    color: '#0F0F0F',
    textAlign: 'center',
  },
  filterText: {
    fontSize: 16,
    fontFamily: fontFamily.Regular,
    color: color.iconGray,
  },
  popularText: {
    fontSize: 15,
    fontFamily: fontFamily.Bold,
    color: color.black,
    marginRight: '2%',
  },
  divider: {
    height: 1,
    width: '200%',
    backgroundColor: 'red',
    marginHorizontal: '-10%',
    marginVertical: '5%',
  },
  galleryImage: {
    height: 135,
    width: 160,
    resizeMode: 'cover',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  headingText: {
    fontSize: Platform.OS == 'ios' ? 18 : 14,
    fontFamily: fontFamily.Bold,
    color: color.black,
    marginTop: '10%',
    width: '90%',
    // backgroundColor:"red"
    // textAlign: 'center',
  },
  dateText: {
    fontSize: Platform.OS == 'ios' ? 13 : 12,
    fontFamily: fontFamily.Light,
    color: '#8E8E93',
    marginTop: '5%',
  },
  flexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: color.btnBlue,
  },
  tab: {
    height: hp(5),
    width: wp(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(10),
  },
  tabText: {
    fontSize: 14,
    fontFamily: fontFamily.Semibold,
    color: color.textGray2,
  },
});
