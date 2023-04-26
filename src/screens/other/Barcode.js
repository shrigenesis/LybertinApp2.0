import React, {Component} from 'react';

import {
  PermissionsAndroid,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  BackHandler,
  Image,
} from 'react-native';
import Loader from './../../component/loader';

// import QRCodeScanner from 'react-native-qrcode-scanner';
import {fontFamily, IMAGE} from '../../constant';
import Toast from 'react-native-toast-message';
import {APIRequest, ApiUrl} from '../../utils/api';

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
      this.setState({viewFocused: true});
    });

    this.props.navigation.addListener('blur', () => {
      this.setState({viewFocused: false});
    });
  }

  onSuccess = async e => {
    const data = JSON.parse(e.data);
    console.log(data);

    this.setState({scannerData: data});

    Toast.show({
      type: 'success',
      text1: 'Ticket scanned.'
    })
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
        console.log('API response dance =====', res);

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
        console.log('ssssss', err?.response?.data);
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
        {/* <QRCodeScanner
          onRead={e => this.onSuccess(e)}
          topContent={
            <View style={{position: 'absolute', top: 240, zIndex: 9999}}>
              <Image
                source={IMAGE.qrscan3x}
                style={{
                  height: 250,
                  width: 260,
                  resizeMode: 'contain',
                }}
              />
            </View>
          }
          // bottomContent={
          //   <TouchableOpacity style={styles.buttonTouchable}>
          //     <Text style={styles.buttonText}>Scan Now</Text>
          //   </TouchableOpacity>
          // }
          showMarker={false}
          fadeIn={false}
          reactivate={true}
          reactivateTimeout={5000}
          checkAndroid6Permissions={true}
          // permissionDialogTitle=" App needs access to your camera to proceed further"
          // permissionDialogMessage="Need camera permission"
          ref={node => {
            this.scanner = node;
          }}
          containerStyle={{width: 100}}
          cameraStyle={{height: '100%'}}
        />
        {this.state.isLoading && (
          <Loader isLoading={this.state.isLoading} type={'dots'} />
        )} */}
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
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: 'red',
  },
  buttonText: {
    fontSize: 15,
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
    backgroundColor: '#20BBF6',
    position: 'absolute',
    bottom: 70,
  },
});
