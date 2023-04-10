/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Platform,

} from 'react-native';
import { IMAGE, color, fontFamily } from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';


export default class GenrateAttendee extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {

    let { attendees, item, handleAttendeeChange } = this.props;
    let hasAttendees = attendees.filter(t => t.ticket_id == item.id)
    if (hasAttendees.length > 0 ) {
      return hasAttendees.map((seat, i) => (
        <View style={styles.attendeeWrapper}>
          <Text style={styles.upperText}>{`Attendee #${(i + 1)}`}</Text>
          <View style={styles.inputContainerOverlay}>
            <TextInput
              placeholder="Full Name"
              placeholderTextColor={'gray'}
              textContentType="emailAddress"
              inputContainerStyle={
                styles.inputFiedContainerOverlay
              }
              style={{
                color: '#000000',
                width: '90%',
                marginLeft: '3%',
              }}
              keyboardType="email-address"
              inputStyle={styles.inputTextOverlay}
              onChangeText={v => { handleAttendeeChange(v, seat, 'name') }}
              value={seat?.name}
            />
            <View style={styles.iconcontainer}>
              <Image
                source={IMAGE.user}
                style={styles.inputIcon}
              />
            </View>
          </View>
          <View style={styles.inputContainerOverlay}>
            <TextInput
              placeholder="Mobile No."
              textContentType="emailAddress"
              placeholderTextColor={'gray'}
              inputContainerStyle={
                styles.inputFiedContainerOverlay
              }
              style={{
                width: '90%',
                marginLeft: '3%',
                color: '#000',
              }}
              keyboardType="number-pad"
              inputStyle={styles.inputTextOverlay}
              onChangeText={v => {
                handleAttendeeChange(v, seat, 'phone')
              }}
              value={seat?.phone}
            />
            <View style={styles.iconcontainer}>
              <Image
                source={IMAGE.mobile}
                style={styles.inputIcon}
              />
            </View>
          </View>
          <View style={styles.inputContainerOverlay}>
            <TextInput
              placeholder="Address"
              textContentType="emailAddress"
              placeholderTextColor={'gray'}
              style={{
                color: '#000000',
                width: '90%',
                marginLeft: '3%',
              }}
              inputContainerStyle={
                styles.inputFiedContainerOverlay
              }
              keyboardType="email-address"
              inputStyle={styles.inputTextOverlay}
              onChangeText={v => {
                handleAttendeeChange(v, seat, 'address')
              }}
              value={seat?.address}
            />
            <View style={styles.iconcontainer}>
              <Image
                source={IMAGE.location}
                style={styles.inputIcon}
              />
            </View>
          </View>
        </View>
      ));

    } else {
      return null
    }
  }
}




const styles = StyleSheet.create({
  activityIndicatorWrapper: {
    elevation: 10,
    backgroundColor: '#FFFFFF',
    height: 300,
    width: 300,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(110, 110, 110, 0.6)',
  },
  container: {
    flex: 1,
    width: null,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  bottomText1: {
    fontSize: 15,
    fontFamily: fontFamily.Medium,
    color: color.black,
    marginTop: '2%',
    width: 100,
    // backgroundColor:"red"
  },
  downIcon: {
    height: 10,
    width: 10,
    resizeMode: 'contain',
  },
  flexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1%',
  },
  inputFiedContainer: {
    borderBottomWidth: 0,
    backgroundColor: '#fff',
    height: 34,
    borderWidth: 0,
    borderColor: '#8A8787',
    width: '100%',
    alignSelf: 'center',
  },
  seatingAvailabilityContainer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',

    marginHorizontal: widthPercentageToDP(1),
  },
  inputText: {
    color: color.black,
    fontSize: 13,
    marginHorizontal: 10,
    // fontFamily:global.FONT.REGULAR,
    marginTop: '2%',
  },
  bookedContainer: {
    borderRadius: 4,
    height: 15,
    width: 15,
    backgroundColor: 'grey',
  },
  bookedContainer1: {
    borderRadius: 4,

    height: 15,
    width: 15,
    backgroundColor: 'red',
  },
  bookedContainer2: {
    borderRadius: 4,
    height: 15,
    width: 15,
    backgroundColor: '#f2f2f2',
  },
  bookedContainer3: {
    borderRadius: 4,
    height: 15,
    width: 15,
    backgroundColor: 'green',
  },
  seatingText: {
    color: 'gray',
    fontSize: widthPercentageToDP(3),
    fontWeight: '700',
  },
  backInput: {
    height: 41,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    flexDirection: 'row',
    borderRadius: 10,
    marginTop: '4%',
    marginBottom: '8%',
  },
  applyText: {
    fontSize: 15,
    fontFamily: fontFamily.Medium,
    color: color.white,
  },
  applyButton: {
    backgroundColor: '#20BBF6',
    height: 40,
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '-0.2%',
    marginLeft: '1%',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  removeButton: {
    backgroundColor: '#d14e4e',
    height: 40,
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '-0.2%',
    marginLeft: '1%',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  inputContainerOverlay: {
    flexDirection: 'row',
    marginRight: 20,
    marginTop: '6%',
    width: '100%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#DEDEDE',
    height: 51.25,
    marginHorizontal: '5%',
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  inputFiedContainerOverlay: {
    borderBottomWidth: 0,
    height: 45,
    marginLeft: -40,
    paddingLeft: 50,
    borderRadius: 8,
    width: '100%',
  },
  inputTextOverlay: {
    color: 'Gray',
    fontSize: 16,
    marginTop: '3%',
    marginLeft: '5%',
  },
  iconcontainer: {
    width: 45,
    height: 45,
    marginLeft: '-10%',
    zIndex: 9,
    borderColor: 'gray',
  },
  inputIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: '30%',
    // marginRight: '30%',
  },
  amountText: {
    fontSize: 19,
    fontFamily: fontFamily.Bold,
    color: color.black,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: fontFamily.Medium,
    color: color.white,
  },
  overlayStyle: {
    // height:"80%",
    width: 60,
    backgroundColor: color.white,
    // marginBottom: "6%",
    // marginTop: "4%",
  },
  overlayText: {
    fontSize: 20,
    fontFamily: fontFamily.Bold,
    color: color.black,
    marginTop: '5%',
    textAlign: 'center',
  },
  dropDownIcon: {
    width: 10,
    height: 10
  },
  taxesContiner: {
    flex: 1,
    backgroundColor: '#ddd',
    borderRadius: wp(2),
    padding: wp(2),
    marginBottom: hp(2),
    marginTop: hp(2)
  },
  totalTicketMainContainer: {
    // marginHorizontal: hp(2),
  },
  totalTicketContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: wp(2),
  },
  totalTicketText: {
    fontSize: 15,
    fontFamily: fontFamily.Regular,
    color: '#000',
  },
  attendeeWrapper: {
    marginTop: 20,
    // marginHorizontal:wp(2),
    // marginVertical:wp(2), 
    // backgroundColor:"#ddd",
    // borderRadius:wp(2)
  }
});
