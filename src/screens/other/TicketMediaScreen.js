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
import TicketListSkelton from '../../utils/skeltons/TicketListSkelton'
import moment from 'moment';

export default class TicketMediaScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      tickets: [],
      multipleOptions: [],
    };
  }

  componentDidMount = () => {
    this.getTickets();
  };

  getTickets = () => {
    let config = {
      url: ApiUrl.myBooking,
      method: 'post',
      body: {
        search: this.state.input,
      },
    };

    APIRequest(
      config,

      res => {
        this.setState({
          tickets: res.bookings,
        });
        res.bookings.forEach((data, i) => {
          this.state.multipleOptions.push({
            name: data.event_title,
            // index: i,
            // selected: false,
            // clientId: data.clientId._id,
          });
        });
        this.setState({ ...this.state, isLoading: false })
      },
      err => {
        this.setState({ ...this.state, isLoading: false })
        console.log(err);
      },
    );
  };

  render() {
    return (
      <View>
        {this.state.isLoading ?
          <FlatList
            data={[1, 2, 3,4]}
            renderItem={(item) => <TicketListSkelton />}
            keyExtractor={item => `SkeletonListOfMediaTickets${item}`}
          />
          :
          this.state.tickets.length == 0 ? (
            <View style={styles.NoRecordWrapper}>
              <NoRecord
                image={IMAGE.noTicket}
                title="No tickets"
                description="Buy a ticket of an event to make them appear here."
                buttonText="Explore events"
                navigation={this.props.navigation}
                navigateTo={'Events'}
                navigateParams={{
                  filter_type: 'top_selling_events ',
                  title: 'Top Selling Events',
                }}
                showButton={true}
              />
            </View>
          ) : (
            <View style={{ height: hp(75) }}>
              <FlatList
                //   horizontal
                showsVerticalScrollIndicator={false}
                data={this.state.tickets}
                keyExtractor={(item) => item.common_order}
                renderItem={({ item: d }) => (
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('ticketDetails', {
                        ticket: d,
                      })
                    }
                    style={{
                      marginTop: 20,
                      backgroundColor: color.background,
                      borderRadius: 10,
                      height: 135,
                    }}>
                    <View style={styles.flexContainer}>
                      <Image
                        source={{ uri: `${IMAGEURL}/${d.event_thumbnail}` }}
                        style={styles.galleryImage}
                      />
                      <View style={{ width: '50%', marginHorizontal: '5%' }}>
                        <Text style={styles.headingText} numberOfLines={1}>
                          {d.event_title}
                        </Text>
                        <Text style={styles.dateText} numberOfLines={1}>
                          #{d.common_order}
                        </Text>
                        <Text style={styles.dateText} numberOfLines={1}>
                          {d.formatted_date}
                        </Text>
                        <Text style={styles.dateText} numberOfLines={1}>
                          {d.formatted_time}                           
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
          
      </View>
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
    backgroundColor: '#fff',
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
  NoRecordWrapper: {
    height: hp(80),
    backgroundColor: color.white
  },
});
