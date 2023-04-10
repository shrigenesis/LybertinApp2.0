import React, {
  useState,
  useEffect,
  memo,
  useRef,
  useMemo,
  useContext,
  Component,
} from 'react';
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
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import {IMAGE, color, fontFamily, fontSize} from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RippleTouchable, Header, Button} from '../../component/';
import Loader from '../../component/loader';
import {useIsFocused} from '@react-navigation/native';
import {APIRequest, ApiUrl, IMAGEURL, Toast} from './../../utils/api';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {User} from '../../utils/user';
import {LoginContext} from './../../context/LoginContext';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class myEarning extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalEarning: {},
      currency: '',
    };
  }

  componentDidMount = () => {
    this.getEarnings();
  };

  getEarnings = () => {
    let config = {
      url: ApiUrl.organiserTotalEarning,
      method: 'post',
    };

    APIRequest(
      config,
      res => {
        console.log(res);
        this.setState({
          totalEarning: res.total_earning,
          currency: res.currency,
        });
      },
      err => {
        console.log(err);
      },
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{flex: 1, backgroundColor: color.background2}}>
          <StatusBar barStyle={'dark-content'} backgroundColor={color.white} />
          <Header title={'My Earnings'} />
          <View style={[styles.cardWrapper]}>
            <View style={styles.card}>
              <Image style={styles.backImage} source={IMAGE.wallet} />
              <Text style={styles.leftText}>Total Bookings</Text>
              <Text style={styles.rightText}>
                {`${this.state.totalEarning.customer_paid_total} ${this.state.currency}`}
              </Text>
            </View>
          </View>
          <View style={[styles.cardWrapper, styles.blueBackground]}>
            <View style={styles.card}>
              <Image style={styles.backImage} source={IMAGE.wallet} />
              <Text style={styles.leftText}>Total Admin Commission</Text>
              <Text style={styles.rightText}>
                {`${this.state.totalEarning.admin_commission_total} ${this.state.currency}`}
              </Text>
            </View>
          </View>
          <View style={[styles.cardWrapper, styles.greenBackGround]}>
            <View style={styles.card}>
              <Image style={styles.backImage} source={IMAGE.wallet} />
              <Text style={styles.leftText}>Total Profit</Text>
              <Text style={styles.rightText}>
                {`${this.state.totalEarning.organiser_earning_total} ${this.state.currency}`}
              </Text>
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
    backgroundColor: color.white,
  },
  backImage: {
    tintColor: color.white,
    position: 'absolute',
    right: 0,
    top: 0,
    opacity: 0.2,
  },
  cardWrapper: {
    backgroundColor: '#38C17212',
    marginHorizontal: 10,
    marginTop: 15,
    borderRadius: 10,
    backgroundColor: color.white,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    elevation: 3,
    shadowRadius: 3,
    padding: 20,
    backgroundColor: color.btnBlue,
  },
  blueBackground: {
    backgroundColor: color.fbBlue,
  },
  greenBackGround: {
    backgroundColor: color.green,
  },
  card: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  leftText: {
    fontSize: fontSize.size14,
    color: color.white,
    fontFamily: fontFamily.Semibold,
    marginBottom: 20,
  },
  rightText: {
    fontSize: fontSize.size20,
    color: color.white,
    fontFamily: fontFamily.Bold,
  },
});
