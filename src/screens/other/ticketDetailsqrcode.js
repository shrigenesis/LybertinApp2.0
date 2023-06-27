import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView
} from 'react-native';
import {  color, fontFamily, fontSize } from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { Header } from '../../component/';
import Loader from './../../component/loader';
import { APIRequest, ApiUrl } from './../../utils/api';
import moment from 'moment';
import Toast from 'react-native-toast-message';

export default class ticketDetailsqrcode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticket: this.props.route.params.ticket,
      isLoading: false,
      selected: 0,
    };
  }

  componentDidMount() {
    this.setState({ selected: this.props.route?.params?.ticket?.checked_in })
  }

  expiryDays(date_string) {
    var dd = moment(date_string).format('MM/DD/YYYY');
    var b = dd.split(/\D/);
    var expiry = new Date(b[2], --b[0], b[1]);
    var d = Math.round((expiry - new Date().setHours(0, 0, 0, 0)) / 8.64e7);
    return d;
  }
  checkout = () => {
    this.setState({ isLoading: true });

    var id = this.state.ticket?.id;
    var order_number = this.state.ticket?.order_number;
    let config = {
      url: ApiUrl.checkinCheckout,
      method: 'post',
      body: {
        id: id,
        order_number: order_number,
      },
    };

    APIRequest(
      config,
      res => {
        this.setState({ isLoading: false, selected: 1 });

        if (res?.status) {
          Toast.show({
            type: 'success',
            text1: res?.message
          })
        }
      },
      err => {
        this.setState({ isLoading: false });
      },
    );
  };
  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title="Ticket Details" />
        <ScrollView style={styles.container}>
          <Loader type="dots" isLoading={this.state.isLoading} />

          <Text style={[styles.upperText, { marginTop: 10 }]}>Event</Text>
          <Text style={styles.bottomText}>{this.state.ticket.event_title}</Text>
          <View style={styles.divider}></View>
          <Text style={styles.upperText}>Order ID</Text>
          <Text style={styles.bottomText}>
            {' '}
            #{this.state.ticket?.order_number}
          </Text>
          <View style={styles.divider}></View>
          <Text style={styles.upperText}>Days</Text>
          <Text style={styles.bottomText}>
            {moment(this.state.ticket?.event_start_date).format('DD MMMM')} to{' '}
            {moment(this.state.ticket?.event_end_date).format('DD MMMM')}{' '}
            {moment(this.state.ticket?.event_end_date).format('YYYY')}
          </Text>
          <View style={styles.divider}></View>
          <Text style={styles.upperText}>Timings</Text>
          <Text style={styles.bottomText}>
            {this.state.ticket?.event_start_time} -{' '}
            {this.state.ticket?.event_end_time}
          </Text>
          <View style={styles.divider}></View>
          <Text style={styles.upperText}>Order Total</Text>
          <Text style={styles.bottomText}>
            {this.state.ticket?.net_price} {this.state.ticket?.currency}
          </Text>
          <View style={styles.divider}></View>
          <Text style={styles.upperText}>Promocode</Text>
          <Text style={styles.bottomText}>
            {this.state?.ticket?.promocode == null
              ? 'NILL'
              : this.state.ticket?.promocode}
          </Text>
          <View style={styles.divider}></View>
          <Text style={styles.upperText}>Booked On</Text>
          <Text style={styles.bottomText}>{moment(this.state.ticket.created_at).format('DD MMM, YYYY HH:mm')}</Text>
          <View style={styles.divider}></View>
          <Text style={styles.upperText}>Payment </Text>
          <Text style={styles.bottomTextGreen}>
            {this.state.ticket?.payment_type} (
            {this.state.ticket?.is_paid == 0 ? 'Unpaid' : 'Paid'})
          </Text>
          <View style={styles.divider}></View>
          <Text style={styles.upperText}>Checked in </Text>
          <Text style={styles.bottomTextRed}>
            {this.state.ticket?.checked_in == 0 ? 'No' : 'Yes'}
          </Text>
          <View style={styles.divider}></View>
          <Text style={styles.upperText}>Status </Text>
          <Text style={styles.bottomTextGreen}>
            {this.state.ticket?.status == 1 ? 'Enabled' : 'Disable'}
          </Text>
          <View style={styles.divider}></View>
          <Text style={styles.upperText}>Cancellation</Text>
          <Text style={styles.bottomTextRed}>
            {this.state?.ticket?.booking_cancel == 0 ? 'No' : 'Yes'}
          </Text>
          <View style={styles.divider}></View>
          <Text style={styles.upperText}>Expired</Text>
          <Text style={styles.bottomText}>
            {this.expiryDays(this.state?.ticket?.event_end_date) >= 0
              ? 'No'
              : 'yes'}
          </Text>
          <View style={styles.divider}></View>
          {/* <Text style={styles.upperText}>Actions</Text> */}

          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            {this.state.selected == 1 ? (
              <TouchableOpacity
                onPress={() => [
                  this.checkout(),
                  this.setState({
                    selected: 0,
                  }),
                ]}>
                <View style={styles.buttonWrapper}>
                  <Text style={[styles.buttonText]}>
                    Check-Out
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => [this.checkout()]}>
                <View style={styles.buttonWrapper}>
                  <Text style={styles.buttonText}>Check-In</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: color.white,
  },
  container: {
    flex: 1,
    width: null,
    backgroundColor: '#fff',
    paddingHorizontal: 20
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 15,
    fontFamily: fontFamily.Bold,
    color: '#0F0F0F',
  },
  bottomImage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    marginRight: 8,
  },
  divider: {
    height: 1,
    width: '200%',
    backgroundColor: '#EDEDED',
    marginHorizontal: '-10%',
    marginVertical: '2%',
  },
  upperText: {
    fontSize: 15,
    fontFamily: fontFamily.Light,
    color: color.black,
  },
  bottomText: {
    fontSize: 15,
    fontFamily: fontFamily.Medium,
    color: color.black,
    marginTop: '2%',
  },
  bottomTextGreen: {
    fontSize: 15,
    fontFamily: fontFamily.Medium,
    color: color.green,
    marginTop: '2%',
  },
  bottomTextRed: {
    fontSize: 15,
    fontFamily: fontFamily.Medium,
    color: color.red,
    marginTop: '2%',
  },
  buttonWrapper: {
    backgroundColor: color.btnBlue,
    borderRadius: 10,
    width: wp(88),
    height: 45,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: fontSize.size16,
    fontFamily: fontFamily.Regular,
    color: color.white,
    textAlign: 'center'
  },
  buttonImage: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: color.btnBlue,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: 145,
    height: 42,
    borderRadius: 5,
    marginVertical: '5%',
    marginRight: 10,
  },
  button1: {
    backgroundColor: color.btnBlue,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: 210,
    height: 42,
    borderRadius: 5,
    marginVertical: '5%',
    marginRight: 10,
  },
});
