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
  Share,
  SafeAreaView,
} from 'react-native';
import {IMAGE, color, fontFamily} from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Divider, Input, Overlay, Icon} from 'react-native-elements';
import {Header, RippleTouchable, StoryList} from '../../component/';
import SwipeableView from 'react-native-swipeable-view';
import Loader from './../../component/loader';
import {APIRequest, ApiUrl, IMAGEURL, Toast} from './../../utils/api';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import {User} from '../../utils/user';
import {FA5Style} from 'react-native-vector-icons/FontAwesome5';
import {Download} from './../../utils/download';
let qr_code = '';
export default class TicketDetailsSpare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticket: this.props.route.params.ticket,
      isLoading: false,
      ticketLink: '',
      isVisible: false,
      qrCode: '',
    };
  }
  componentDidMount = () => {
    console.log('this.state.ticket', this.state.ticket);
  };
  expiryDays(date_string) {
    var dd = moment(date_string).format('MM/DD/YYYY');
    var b = dd.split(/\D/);
    var expiry = new Date(b[2], --b[0], b[1]);
    var d = Math.round((expiry - new Date().setHours(0, 0, 0, 0)) / 8.64e7);
    console.log('dddd', d);
    return d;
  }
  downlodeticketIphone = () => {
    // this.setState({isLoading: true});
    var id = this.state.ticket?.id;
    var order_number = this.state.ticket?.order_number;
    let config = {
      url: `${ApiUrl.downloadTicket}/${id}/${order_number}`,
      method: 'get',
    };
    APIRequest(
      config,
      res => {
        this.setState({
          ticketLink: res.data,
        });
        this.onShare();
        // if (res?.success) {
        //   let url = res?.data;
        //   let ext = url.split('.').pop();
        //   Download(url, ext);
        // }
      },
      err => {
        // this.setState({isLoading: false});
        // setisLoading(false);
        console.log(err);
      },
    );
  };
  downlodeticket = () => {
    this.setState({isLoading: true});
    var id = this.state.ticket?.id;
    var order_number = this.state.ticket?.order_number;
    let config = {
      url: `${ApiUrl.downloadTicket}/${id}/${order_number}`,
      method: 'get',
    };
    APIRequest(
      config,
      res => {
        this.setState({isLoading: false});
        if (res?.success) {
          let url = res?.data;
          let ext = url.split('.').pop();
          Download(url, ext);
        }
      },
      err => {
        this.setState({isLoading: false});
        // setisLoading(false);
        console.log(err);
      },
    );
  };
  downlodeinvoiceIphone = () => {
    // this.setState({isLoading: true});
    var id = this.state.ticket?.id;
    let config = {
      url: `${ApiUrl.downloadInvoice}/${id}`,
      method: 'get',
    };
    APIRequest(
      config,
      res => {
        // this.setState({isLoading: false});
        console.log('API response downlodeinvoice =====', res);
        this.setState({
          ticketLink: res.file,
        });
        // let url = res.file;
        // let ext = url.split('.').pop();
        // Download(url, ext);
        this.onShare();
      },
      err => {
        // this.setState({isLoading: false});
        // setisLoading(false);
        console.log(err);
      },
    );
  };
  downlodeinvoice = () => {
    this.setState({isLoading: true});
    var id = this.state.ticket?.id;
    let config = {
      url: `${ApiUrl.downloadInvoice}/${id}`,
      method: 'get',
    };
    APIRequest(
      config,
      res => {
        this.setState({isLoading: false});
        console.log('API response downlodeinvoice =====', res);
        if (res?.success) {
          let url = res?.file;
          let ext = url.split('.').pop();
          Download(url, ext);
        }
      },
      err => {
        this.setState({isLoading: false});
        // setisLoading(false);
        console.log(err);
      },
    );
  };
  downlodeqrcode = () => {
    this.setState({isLoading: true});
    var id = this.state.ticket?.id;
    let config = {
      url: `${ApiUrl.getQr}/${id}`,
      method: 'get',
    };
    APIRequest(
      config,
      res => {
        this.setState({isLoading: false});
        console.log('API response downlodeqr =====', res.file);
        qr_code = res.file.toString();
        this.setState({
          qrCode: res.file,
        });
        this.chooseQuiz();
        // if (res?.success) {
        //   let url = res?.file;
        //   let ext = url.split('.').pop();
        //   Download(url, ext);
        // }
      },
      err => {
        this.setState({isLoading: false});
        // setisLoading(false);
        console.log(err);
      },
    );
  };
  chooseQuiz = () => {
    this.setState({
      isVisible: !this.state.isVisible,
    });
  };
  onShare = async () => {
    try {
      const result = await Share.share({
        message: this.state.ticketLink,
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
  cancelBooking = () => {
    var id = this.state.ticket?.id;
    let config = {
      url: `${ApiUrl.cancelBooking}/${id}`,
      method: 'post',
      body: {
        event_id: this.state.ticket.event_id,
        ticket_id: this.state.ticket.ticket_id,
        booking_id: this.state.ticket.id,
      },
    };
    APIRequest(
      config,
      res => {
        console.log(res);
      },
      err => {
        console.log(err?.response);
      },
    );
  };
  render() {
    console.log(
      'this.props.route.params.ticket',
      this.props.route.params.ticket,
    );
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container}>
          <Loader type="dots" isLoading={this.state.isLoading} />
          <Header title={'Ticket Details'}/>

          <View style={{marginHorizontal: '4%', marginVertical: 0}}>
          <View style={styles.divider}></View>
            <Text style={styles.upperText}>Event</Text>
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
            <Text style={styles.bottomText}>{this.state.ticket.created_at}</Text>
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
            <Text
              onPress={() =>
                this.state?.ticket?.booking_cancel == 0 ? (
                  this.cancelBooking()
                ) : (
                  <Text></Text>
                )
              }
              style={styles.bottomTextRed}>
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
            <Text style={styles.upperText}>Actions</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              {Platform.OS == 'ios' ? (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => [this.downlodeticket()]}>
                  <Image
                    source={IMAGE.downloadWhite}
                    style={styles.buttonImage}
                  />
                  <Text style={styles.buttonText}>Ticket</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.downlodeticket()}>
                  <Image
                    source={IMAGE.downloadWhite}
                    style={styles.buttonImage}
                  />
                  <Text style={styles.buttonText}>Ticket</Text>
                </TouchableOpacity>
              )}
              {Platform.OS == 'ios' ? (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.downlodeinvoiceIphone()}>
                  <Image
                    source={IMAGE.downloadWhite}
                    style={styles.buttonImage}
                  />
                  <Text style={styles.buttonText}>Invoice</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.downlodeinvoice()}>
                  <Image
                    source={IMAGE.downloadWhite}
                    style={styles.buttonImage}
                  />
                  <Text style={styles.buttonText}>Invoice</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.button1}
                onPress={() => [this.downlodeqrcode()]}>
                {/* <Image source={IMAGE.downloadWhite} style={styles.buttonImage} /> */}
                <Text style={styles.buttonText}>Ticket QR Code</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          <Overlay
            overlayStyle={styles.overlay}
            containerStyle={styles.overlayContainer}
            visible={this.state.isVisible}
            transparent={true}
            //   width={200}
            //   height="30%"
            animationType="fade"
            onRequestClose={this.chooseQuiz}
            onBackdropPress={this.chooseQuiz}>
            <View style={styles.overlayStyle}>
              <TouchableOpacity
                onPress={() => [
                  this.chooseQuiz(),
                  console.log('qr code is ', qr_code),
                ]}
                style={{
                  height: 40,
                  width: 40,
                  alignSelf: 'flex-end',
                  // backgroundColor: "#fff",
                  // marginRight:"-6%",
                  // borderRadius:40,
                  // justifyContent:"center",
                  // marginTop:"-7%"
                }}>
                <Icon
                  name="close"
                  type="material-community"
                  color="gray"
                  size={30}
                />
              </TouchableOpacity>
              <Image
                source={{uri: this.state.qrCode}}
                style={{height: '90%', width: '100%', resizeMode: 'cover'}}
              />
            </View>
          </Overlay>
        </ScrollView>
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
    backgroundColor: '#fff',
  },
  headerContainer: {
    paddingTop: 30,
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
    fontSize: 16,
    fontFamily: fontFamily.Semibold,
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
  buttonText: {
    fontSize: 19,
    fontFamily: fontFamily.Regular,
    color: color.white,
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
  overlay: {
    backgroundColor: '#fff',
    width: '90%',
    alignSelf: 'center',
    height: '50%',
  },
  overlayContainer: {
    backgroundColor: 'transparent',
  },
  overlayStyle: {
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
    // marginBottom: "6%",
    // marginTop: "4%",
    alignSelf: 'center',
  },
});
