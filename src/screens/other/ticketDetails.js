import React, { Component, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Pressable,
  TouchableOpacity
} from 'react-native';
import { IMAGE, color, fontFamily, fontSize } from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Button, Header } from '../../component/';
import Loader from './../../component/loader';
import { APIRequest, ApiUrl } from './../../utils/api';
import moment from 'moment';
import { Download } from './../../utils/download';
import { User } from '../../utils/user';
import RedirectToMap from '../../utils/RedirectToMap';
import Toast from 'react-native-toast-message'
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';

const reportPoints = [1, hp(55)];

export default class TicketDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticket: this.props.route.params.ticket,
      isLoading: false,
      isVisible: false,
      qrCode: '',
      settext:'',
      userdata: new User().getuserdata()
    };
    this.reportBottomSheetRef = React.createRef();
  }

  componentDidMount = () => {
    this.downlodeQrCode()
  };
  renderSeprator = () => {
    return (
      <View style={styles.sepratorWrapper}>
        <View style={styles.sepratorLeftCircle}></View>
        <Text
          style={styles.sepratorDashedLine}
          ellipsizeMode="clip"
          numberOfLines={1}>
          - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - - - - - - - - - -
        </Text>
        <View style={styles.sepratorRightCircle}></View>
      </View>
    );
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
  downlodeQrCode = () => {
    var id = this.state.ticket?.id;
    let config = {
      url: `${ApiUrl.getQr}/${id}`,
      method: 'get',
    };
    APIRequest(
      config,
      res => {
        this.setState({
          qrCode: res.file,
        });
      },
      err => {
      },
    );
  };


  _reportStory = (text) => {
    console.log(text);
    let config = {
      url: ApiUrl.eventReport,
      method: 'post',
      body: {
        booking_id:this.state.ticket?.id, 
        reason: text,
      },
    };
    console.log(config);
    APIRequest(
      config,
      res => {
        if (res?.status) {
          Toast.show({
            type: 'success',
            text1: res?.message
          })
          this.props.navigation.goBack(); 
        }
      },
      err => {
        console.log(err?.response);
        Toast.show({
          type: 'info',
          text1: 'Something went wrong'
        })
        this.props.navigation.goBack();
      },
    );
  };


  downlodTicket = () => {
    this.setState({ isLoading: true });
    const id = this.state.ticket?.id;
    const order_number = this.state.ticket?.order_number;
    const config = {
      url: `${ApiUrl.downloadTicket}/${id}/${order_number}`,
      method: 'get',
    };
    APIRequest(
      config,
      res => {
        this.setState({ isLoading: false });
        if (res?.success) {
          let url = res?.data;
          let ext = url.split('.').pop();
          Download(url, ext);
        }
      },
      err => {
        this.setState({ isLoading: false });
      },
    );
  };
  downlodInvoice = () => {
    this.setState({ isLoading: true });
    const id = this.state.ticket?.id;
    const config = {
      url: `${ApiUrl.downloadInvoice}/${id}`,
      method: 'get',
    };
    APIRequest(
      config,
      res => {
        this.setState({ isLoading: false });
        if (res?.success) {
          let url = res?.file;
          let ext = url.split('.').pop();
          Download(url, ext);
        }
      },
      err => {
        console.log(err);
        this.setState({ isLoading: false });
      },
    );
  };

  expiryDays(date_string) {
    var dd = moment(date_string).format('MM/DD/YYYY');
    var b = dd.split(/\D/);
    var expiry = new Date(b[2], --b[0], b[1]);
    var d = Math.round((expiry - new Date().setHours(0, 0, 0, 0)) / 8.64e7);
    return d;
  }


  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Loader type="dots" isLoading={this.state.isLoading} />
        <StatusBar barStyle={'dark-content'} backgroundColor={color.white} />
        <Header title={'Ticket Details'}
          // RightIcon={() => (
          //   <TouchableOpacity
          //     onPress={() => {
          //       this.reportBottomSheetRef?.current?.present();
          //     }}>
          //     <Image
          //       source={IMAGE.report}
          //       style={{
          //         height: 20,
          //         width: 20,
          //         resizeMode: 'contain',
          //         marginRight: 10,
          //       }}
          //     />
          //   </TouchableOpacity>
          // )}
        />

        <ScrollView style={styles.container}>
          <View style={styles.wrapperView}>
            <View style={styles.qrWrapper}>
              <Image source={{ uri: this.state.qrCode }} style={styles.qrImage} />
            </View>
            {this.renderSeprator()}
            <View style={styles.midSectionrapper}>
              <View style={styles.textWrapper}>
                <Text style={styles.upperText}>Event</Text>
                <Text style={[styles.bottomText, styles.eventTitle]}>
                  {this.state.ticket.event_title}
                </Text>
              </View>
              <View style={styles.textWrapper}>
                <Text style={styles.upperText}>Booked By</Text>
                <Text style={styles.bottomText}>{this.state.userdata?.name}</Text>
              </View>
              <View style={styles.textWrapper}>
                <Text style={styles.upperText}>Date</Text>
                <Text style={styles.bottomText}>
                  {moment(this.state.ticket?.event_start_date).format('ll')} to{' '}
                  {moment(this.state.ticket?.event_end_date).format('ll')}{' '}
                </Text>
                <Text style={styles.bottomText}>
                  {this.state.ticket?.event_start_time} -{' '}
                  {this.state.ticket?.event_end_time}
                </Text>
              </View>
              <View style={styles.textWrapper}>
                <Text style={styles.upperText}>Venue</Text>
                <Pressable
                  onPress={() => RedirectToMap(`${this.state.ticket?.event_venue}+${this.state?.ticket.city}+${this.state?.ticket.state}`)}
                  style={styles.bottomText}>
                  <Text>
                    {this.state.ticket.event_venue} , {this.state.ticket.city} ,{' '}
                    {this.state.ticket.state}
                  </Text>
                </Pressable>
              </View>
            </View>
            {this.renderSeprator()}
            <View style={styles.midSectionrapper}>
              <View style={styles.textWrapper}>
                <Text style={styles.upperText}>Order Number</Text>
                <Text style={[styles.bottomText, styles.eventTitle]}>
                  #{this.state.ticket?.order_number}
                </Text>
              </View>
              <View style={styles.textWrapper}>
                <Text style={styles.upperText}>Order Total</Text>
                <Text style={styles.bottomText}>
                  {this.state.ticket?.net_price} {this.state.ticket?.currency}
                </Text>
              </View>
              <View style={styles.textWrapper}>
                <Text style={styles.upperText}>Booked On</Text>
                <Text style={styles.bottomText}>
                  {moment(this.state.ticket?.created_at).format('lll')}
                </Text>
              </View>
              <View style={styles.textWrapperColumn}>
                <View
                  style={[styles.textWrapper, styles.textWrapperColumnInner]}>
                  <Text style={styles.upperText}>Payment</Text>
                  <Text style={[styles.bottomText, styles.paymentLabel]}>
                    {this.state.ticket?.payment_type} (
                    {this.state.ticket?.is_paid == 0 ? 'Unpaid' : 'Paid'})
                  </Text>
                </View>
                <View
                  style={[styles.textWrapper, styles.textWrapperColumnInner]}>
                  <Text style={styles.upperText}>PromoCode</Text>
                  <Text style={styles.bottomText}>
                    {this.state?.ticket?.promocode == null
                      ? 'Not Applied'
                      : this.state.ticket?.promocode}
                  </Text>
                </View>
              </View>
              <View style={styles.textWrapperColumn}>
                <View
                  style={[styles.textWrapper, styles.textWrapperColumnInner]}>
                  <Text style={styles.upperText}>Checked In</Text>
                  <Text style={[styles.bottomText, styles.checkedIn]}>
                    {this.state.ticket?.checked_in == 0 ? 'No' : 'Yes'}
                  </Text>
                </View>
                <View
                  style={[styles.textWrapper, styles.textWrapperColumnInner]}>
                  <Text style={styles.upperText}>Cancellation</Text>
                  <Text
                    style={[styles.bottomText, styles.checkedIn]}
                    onPress={() =>
                      this.state?.ticket?.booking_cancel == 0 ? (
                        this.cancelBooking()
                      ) : (
                        <Text></Text>
                      )
                    }>
                    {this.state?.ticket?.booking_cancel == 0 ? 'No' : 'Yes'}
                  </Text>
                </View>
              </View>
              <View style={styles.textWrapperColumn}>
                <View
                  style={[styles.textWrapper, styles.textWrapperColumnInner]}>
                  <Text style={styles.upperText}>Status</Text>
                  <Text style={styles.bottomText}>
                    {this.state.ticket?.status == 1 ? 'Enabled' : 'Disable'}
                  </Text>
                </View>
                <View
                  style={[styles.textWrapper, styles.textWrapperColumnInner]}>
                  <Text style={styles.upperText}>Expired</Text>
                  <Text style={styles.bottomText}>
                    {this.expiryDays(this.state?.ticket?.event_end_date) >= 0
                      ? 'No'
                      : 'yes'}
                  </Text>
                </View>
              </View>
              <View style={styles.btnWrapperColumn}>
                <Button
                  btnStyle={[styles.downloadTicket]}
                  onPress={() => {
                    this.downlodTicket();
                  }}
                  label={'Ticket'}
                />
                <Button
                  btnStyle={[styles.downloadTicket]}
                  onPress={() => {
                    this.downlodInvoice();
                  }}
                  label={'Invoice'}
                />
              </View>
            </View>
          </View>
        </ScrollView>


        <BottomSheetModal
          ref={this.reportBottomSheetRef}
          index={1}
          snapPoints={reportPoints}
          onChange={v => {
            console.log(v);
          }}
          backdropComponent={BottomSheetBackdrop}>
          <View style={{ alignSelf: 'center', paddingVertical: hp(1) }}>
            <Text style={styles.roportHeading}>Report</Text>
            <Text style={styles.subHeading}>Why Are You Reporting This ticket?</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              [
                this._reportStory("It's spam"),
                this.reportBottomSheetRef?.current?.close(),
                this.props.navigation.goBack(),
              ];
            }}
            style={styles.cardBlock}>
            <Text style={styles.cardText}>It's spam</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              [
                this._reportStory("Nudity or sexual activity"),
                this.reportBottomSheetRef?.current?.close(),
                this.props.navigation.goBack(),
              ];
            }}
            style={styles.cardBlock}>
            <Text style={styles.cardText}>Nudity or sexual activity</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              [
                this._reportStory("I just don't like it"),
                this.reportBottomSheetRef?.current?.close(),
                this.props.navigation.goBack(),
              ];
            }}
            style={styles.cardBlock}>
            <Text style={styles.cardText}>I just don't like it</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              [
                this._reportStory( "Hate speech or symbols"),
                this.reportBottomSheetRef?.current?.close(),
                this.props.navigation.goBack(),
              ];
            }}
            style={styles.cardBlock}>
            <Text style={styles.cardText}>Hate speech or symbols</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              [
                this._reportStory("Bullying or harassment"),
                this.reportBottomSheetRef?.current?.close(),
                this.props.navigation.goBack(),
              ];
            }}
            style={styles.cardBlock}>
            <Text style={styles.cardText}>Bullying or harassment</Text>
          </TouchableOpacity>
          <View>
            <Button
              onPress={() => this.reportBottomSheetRef?.current?.close()}
              btnStyle={{
                marginTop: hp(2),
                alignSelf: 'center',
                backgroundColor: color.red,
                width: wp(90),
                height: hp(6),
              }}
              label={'Cancel'}
            />
          </View>
        </BottomSheetModal>
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
    backgroundColor: color.borderGray,
  },
  wrapperView: {
    borderRadius: 4,
    flexDirection: 'column',
    width: null,
    backgroundColor: color.white,
    paddingVertical: 20,
    marginHorizontal: 10,
    marginVertical: 20,
    overflow: 'hidden',
  },
  qrWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20
  },
  qrImage: {
    height: wp(60),
    width: wp(60),
    resizeMode: 'stretch',
  },
  sepratorWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sepratorLeftCircle: {
    width: 25,
    height: 25,
    borderRadius: 25,
    backgroundColor: color.borderGray,
    marginLeft: -15,
  },
  sepratorDashedLine: {
    flex: 1,
    color: color.borderGray,
  },
  sepratorRightCircle: {
    width: 25,
    height: 25,
    borderRadius: 25,
    backgroundColor: color.borderGray,
    marginRight: -15,
  },
  midSectionrapper: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'column',
  },
  textWrapper: {
    paddingVertical: 15,
  },
  textWrapperColumn: {
    flex: 1,
    flexDirection: 'row',
  },
  textWrapperColumnInner: {
    flex: 1,
  },
  upperText: {
    fontSize: fontSize.size15,
    fontFamily: fontFamily.Regular,
    color: color.iconGray,
  },
  bottomText: {
    fontSize: fontSize.size15,
    fontFamily: fontFamily.Semibold,
    color: color.black,
    marginTop: 10,
  },
  eventTitle: {
    fontSize: fontSize.size18,
    fontFamily: fontFamily.Bold,
  },
  paymentLabel: {
    color: color.green,
  },
  checkedIn: {
    color: color.red,
  },
  btnWrapperColumn: {
    marginTop: 30,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadTicket: {
    marginHorizontal: 10,
    flex: 1,
    width: wp(40),
    height: hp(6),
  },
  roportHeading: {
    fontSize: 17,
    lineHeight: hp(2.5),
    fontFamily: fontFamily.Bold,
    color: color.btnBlue,
    textAlign: 'center',
  },
  subHeading: {
    fontSize: 10,
    fontFamily: fontFamily.Regular,
    color: color.textGray2,
    textAlign: 'center',
  },
  cardBlock: {
    marginLeft: wp(10),
    paddingRight: wp(7),
    paddingVertical: hp(2),
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: color.borderGray,
  },
});
