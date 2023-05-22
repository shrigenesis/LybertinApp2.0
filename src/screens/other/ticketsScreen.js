import React, { useState, useEffect, FC, Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from 'react-native';
import { IMAGE, color, fontFamily, fontSize } from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { StatusBar } from 'react-native';
import TicketVideoScreen from './TicketVideoScreen';
import TicketMediaScreen from './TicketMediaScreen';
import { Header } from '../../component';
import FocusAwareStatusBar from '../../utils/FocusAwareStatusBar';

export default class TicketScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'EVENTS',
      bkg: '#ff0000'
    };
  }
  componentDidMount() {
    this.props.navigation.addListener('focus', async () => {
      // StatusBar.setBackgroundColor('#000000')
      await this.setState({
        ...this.state,
        bkg: '#000000',
        activeTab: 'EVENTS'
      })
      console.log('Screen.js focused', this.state.bkg)

    });
  }

  // FocusAwareStatusBar=(props)=> {  
  //   return isFocus ? <StatusBar {...props} /> : null;
  // }

  // componentWillUnmount() {
  //   this._navListener.remove();
  // }

  Report = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          reportBottomSheetRef?.current?.present();
        }}>
        <Image
          source={IMAGE.report}
          style={{
            height: 20,
            width: 20,
            resizeMode: 'contain',
            marginRight: 10,
          }}
        />
      </TouchableOpacity>
    )
  }



  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>

          <FocusAwareStatusBar barStyle={'dark-content'} backgroundColor={color.white} />

          <Header headStyle={{backgroundColor: color.white}} title="My Bookings" />

          <View style={styles.bodyContainer}>
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
                    Events
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
                    Video Courses
                  </Text>
                </TouchableOpacity>
              </View>
              {this.state.activeTab === 'VIDEO_COURSE' ? <TicketVideoScreen navigation={this.props.navigation} /> : null}
              {this.state.activeTab === 'EVENTS' ? <TicketMediaScreen navigation={this.props.navigation} /> : null}
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
    backgroundColor: color.white
  },
  container: {
    flex: 1,
    width: null,
    backgroundColor: color.white,
  },
  headerContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    // marginTop: Platform.OS == 'ios' ? hp(4) : 2,
  },
  bodyContainer: {
    backgroundColor: color.white,
    paddingTop: 15,
  },
  headerText: {
    fontSize: fontSize.size15,
    fontFamily: fontFamily.Bold,
    color: color.atomicBlack,
    textAlign: "center",
    flex: 1,
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
