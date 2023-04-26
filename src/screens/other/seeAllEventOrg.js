import React, {useState, useEffect, FC, Component} from 'react';
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
import {IMAGE, color, fontFamily} from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Divider, Input, Overlay} from 'react-native-elements';

import {RippleTouchable, StoryList} from '../../component/';
import SwipeableView from 'react-native-swipeable-view';
import Loader from './../../component/loader';
import {APIRequest, ApiUrl, IMAGEURL, Toast} from './../../utils/api';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import {User} from '../../utils/user';

export default class seeAllEventOrg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selected: 0,
      category:this.props.route.params.category,
      date:this.props.route.params.date,
      price:this.props.route.params.price,
      country:this.props.route.params.country,
      city:this.props.route.params.city,
      search:this.props.route.params.input,
      //   filter_type: this.props.route.params.filter_type,
    };
  }

  componentDidMount = () => {
    this.getEvents();
  };

  getEvents = () => {
    // setisLoading(true);

    let config = {
      url: ApiUrl.organizerEvents,
      method: 'post',
      
    };

    APIRequest(
      config,

      res => {
        this.setState({
          data: res.events,
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
        <View style={{marginHorizontal: '4%', }}>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={{height:30,width:30}} onPress={() => this.props.navigation.goBack()}>
              <Image
                source={IMAGE.back}
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>

            <Text style={styles.headerText}>My Events</Text>
            <Text style={{color: '#EDEDED'}}>My</Text>

            {/* <TouchableOpacity onPress={()=>this.props.navigation.navigate("filterScreen")}>
                <Image
              source={IMAGE.filterList}
              style={{
                height: 20,
                width: 20,
                resizeMode: 'contain',
              }}
            />
            </TouchableOpacity> */}
          </View>
        </View>
        {/* <Divider style={styles.divider} /> */}
        <View style={{flex: 1, backgroundColor: '#EDEDED'}}>
          <View >
            <FlatList
              data={this.state.data}
              renderItem={({item: d}) => (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('eventDetailsOrg', {event_id: d.id})
                  }
                  style={styles.cardContainer}>
                  <Image
                    source={{uri: `${IMAGEURL}/${d.thumbnail}`}}
                    style={{
                      height: '100%',
                      width: '100%',
                      resizeMode: 'stretch',
                      alignSelf: 'center',
                      borderRadius: 10,
                    }}
                  />
                  <View style={{position: 'absolute', left: 10, bottom: 20}}>
                    <Text
                      style={[
                        styles.headingText,
                        {color: '#fff', fontWeight: 'bold'},
                      ]}
                      numberOfLines={1}>
                      {d.title}
                    </Text>
                    <TouchableOpacity
                     onPress={() =>
                      this.props.navigation.navigate('eventDetailsOrg', {event_id: d.id})
                    }
                      style={{
                        marginTop: 10,
                        backgroundColor: '#20BBF6',
                        borderRadius: 20,
                        width: 60,
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: '#fff',
                          fontSize: 12,
                          paddingVertical: 4,
                        }}>
                        Details
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              )}
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
    alignContent: 'center',
    alignItems: 'center',
    marginTop:(Platform.OS=='ios')?hp(6):hp(4),
    marginBottom:"3%"

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
  //   headingText: {
  //     fontSize: 15,
  //     fontFamily: fontFamily.Bold,
  //     color: color.black,
  //     marginLeft: '4%',
  //     marginTop: '6%',
  //   },
  dateText: {
    fontSize: 11,
    fontFamily: fontFamily.Light,
    color: '#8E8E93',
  },
  cardContainer: {
    width: '95%',
    height: 160,
    borderRadius: 10,
    margin: '1.5%',
    backgroundColor: '#fff',
    // marginTop:"-10%"
    // marginBottom:"30%"
  },
  headingText: {
    fontSize: 16,
    fontFamily: fontFamily.Bold,
    color: color.black,
    width: '100%',
  },
});
