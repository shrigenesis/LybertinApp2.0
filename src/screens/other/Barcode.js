import React, { Component } from 'react';

import {
  View,
  StyleSheet,
  Text,
  BackHandler,
} from 'react-native';
import Loader from './../../component/loader';
import {
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { color, fontFamily, fontSize } from '../../constant';
import Toast from 'react-native-toast-message';
import { APIRequest, ApiUrl } from '../../utils/api';
import { Platform } from 'react-native';

class Barcode extends Component {
  constructor(props) {
    super(props);
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPressLogin',
      this.backButtonHandler,
    );
    this.state = {
      isFlash: false,
      isLoading: false,
      isBarcodeScannerEnabled: true,
    };
  }

  backButtonHandler = () => {
    this.props.navigation.navigate('Home');
    return true;
  };

  async componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.setState({ viewFocused: true });
    });

    this.props.navigation.addListener('blur', () => {
      this.setState({ viewFocused: false });
    });
  }

  onSuccess = async e => {
    const data = JSON.parse(e.data);

    this.setState({ scannerData: data, isLoading: true });

    let config = {
      url: ApiUrl.scanTicket,
      method: 'post',
      body: {
        id: data?.id,
        order_number: data?.order_number,
      },
    };

    APIRequest(
      config,

      res => {
        this.setState({ isLoading: false })

        if (res.status) {
          // setrequestCount(res.follow_requests);
          this.props?.navigation?.navigate('ticketDetailsqrcode', {
            ticket: res?.booking[0],
          });
        } else {
          Toast.show({
            type: 'success',
            text1: 'Ticket scanned.'
          })
        }
        // setisLoading(false);
      },
      err => {
        // setisLoading(false);
        this.setState({ isLoading: false })
        if (!err?.status) {
          Toast.show({
            type: 'error',
            text1: err?.message
          })
        }
      },
    );
  };

  render() {
    return (
      <View style={styles.QrCodeContainer}>
        <QRCodeScanner
          onRead={e => this.onSuccess(e)}
          // topContent={
          //   <View style={{position: 'absolute', top: 240, zIndex: 9999999}}>
          //     <Image
          //       source={IMAGE.qrscan3x}
          //       style={{
          //         height: 250,
          //         width: 260,
          //         resizeMode: 'contain',
          //       }}
          //     />
          //   </View>
          // }
          topContent={
            <Text style={styles.centerText}>
              Scan Ticket
            </Text>
          }
          // bottomContent={
          //   <TouchableOpacity style={styles.buttonTouchable}>
          //     <Text style={styles.buttonText}>Scan Now</Text>
          //   </TouchableOpacity>
          // }
          showMarker={true}
          fadeIn={false}
          reactivate={true}
          reactivateTimeout={5000}
          checkAndroid6Permissions={true}
          // permissionDialogTitle=" App needs access to your camera to proceed further"
          // permissionDialogMessage="Need camera permission"
          ref={node => {
            this.scanner = node;
          }}
          containerStyle={{ width: hp(100) }}
          cameraStyle={{ height: Platform.OS === 'ios' ? hp(70) : hp(60) }}
        />

        {this.state.isLoading && (
          <Loader isLoading={this.state.isLoading} type={'dots'} />
        )}
      </View>
    );
  }
}

export default Barcode;

const styles = StyleSheet.create({
  QrCodeContainer: {
    flex: 1,
    height: '100%',
  },
  centerText: {
    flex: 1,
    fontSize: fontSize.size20,
    padding: 32,
    color: color.btnBlue,
  },
  textBold: {
    fontWeight: '500',
    color: 'red',
  },
  buttonText: {
    fontSize: fontSize.size12,
    fontFamily: fontFamily.Medium,
    paddingHorizontal: 80,
    paddingVertical: 8,
    color: 'white',
  },
  TopTouchable: {
    position: 'absolute',
    bottom: 200,
  },
  buttonTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: color.btnBlue,
    position: 'absolute',
    bottom: 20,
  },
});
