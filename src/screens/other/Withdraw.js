import React, { useEffect, useState } from 'react';
import {
  TextInput,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
  SafeAreaView,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { Button, Divider } from 'react-native-elements';
import SvgUri from 'react-native-svg-uri';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Toast from 'react-native-toast-message';

import { color, fontFamily, fontSize, IMAGE } from '../../constant';
import BottomSheetCustom from '../../component/BottomSheetCustom';
import TextLineSkelton from '../../utils/skeltons/TextLineSkelton';
import { ApiUrl, APIRequest } from '../../utils/api';
import { KeyboardAvoidingView } from 'react-native';

const Withdraw = ({ navigation, route }) => {
  const [ACName, setACName] = useState('');
  const [ACNumber, setACNumber] = useState('');
  const [ACCode, setACCode] = useState('');
  const [PaypalID, setPaypalID] = useState('');
  const [bankTab, setbankTab] = useState('');
  const [isShowBottomSheet, setisShowBottomSheet] = useState(false);
  const [status, setstatus] = useState(true);
  const [Money, setMoney] = useState('');
  const { processing_fee, wallet_balance } = route.params;

  // Send mony request for withdraw money
  const postMonyRequest = () => {
    let config = {
      url: ApiUrl.widthdrawalRequest,
      method: 'post',
      body: {
        amount: parseFloat(Money) +  parseFloat(processing_fee),
        widthdrawl_info: {
          type: bankTab,
          data: bankTab === 'bank' ? [ACName, ACNumber, ACCode] : [PaypalID],
        },
      },
    };
    APIRequest(
      config,
      res => {
        setisShowBottomSheet(true);
      },
      err => {
        console.log(err?.response?.data);
        Toast.show({
          type: 'error',
          text1: 'Try agian',
        });
      },
    );
  };

  const handleSubmit = () => {
    if (Money > 0) {
      if (Money <= wallet_balance - 5) {
        if (bankTab === 'bank') {
          if (ACCode && ACNumber && ACName) {
            postMonyRequest();
          } else {
            Toast.show({
              type: 'info',
              text1: 'fill bank details',
            });
          }
        } else if (bankTab === 'paypal') {
          if (PaypalID) {
            postMonyRequest();
          } else {
            Toast.show({
              type: 'info',
              text1: 'fill paypal details',
            });
          }
        } else {
          Toast.show({
            type: 'info',
            text1: 'Select payment method',
          });
        }
      } else {
        Toast.show({
          type: 'info',
          text2:
            'Sorry, you have insufficient funds in your wallet',
        });
      }
    } else {
      Toast.show({
        type: 'info',
        text2: 'Withdraw amount should greater then 0',
      });
    }
  };
  useEffect(() => {
    if (!isShowBottomSheet && Money) {
      navigation.navigate('wallet');
    }
  }, [isShowBottomSheet]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={'light-content'}
        translucent
        backgroundColor={color.transparent}
      />
      <View style={styles.headerBox}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}>
            <Image
              source={IMAGE.backWhite}
              style={{
                height: 20,
                width: 20,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>
            {/* {this.props.route.params.title} */}
            Withdraw Money
          </Text>
          <TouchableOpacity>
            <SvgUri source={IMAGE.svgeducationShare} />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView >
      <SafeAreaView>
        <ScrollView>
          <View
            style={{
              backgroundColor: '#fff',
              marginTop: hp(15),
              // marginBottom: 50,
              height: bankTab === 'bank' ? '100%' : hp(80),
            }}>
            <View style={styles.inputBox}>
              {status ? (
                <>
                  {/* <Text style={styles.coinText}>10</Text> */}
                  <TextInput
                    onChangeText={(v) => setMoney(v)}
                    keyboardType="decimal-pad"
                    autoFocus={true}
                    maxLength={3}
                    value={Money.toString()}
                    style={styles.coinText}
                    placeholder="0"
                    editable={true}
                  />
                </>
              ) : (
                <TextLineSkelton />
              )}
              <Divider style={styles.divider} />
            </View>
            <View
              style={{
                ...styles.flexRow,
                justifyContent: 'space-evenly',
                marginVertical: 20,
              }}>
              <View style={{ ...styles.flexRow }}>
                <Image style={styles.coinStyle} source={IMAGE.coin} />
                <Text style={styles.topText}> Processing Fees</Text>
                <Text style={styles.topTextBold}> +{processing_fee}</Text>
              </View>
              <View style={{ ...styles.flexRow }}>
                <Image style={styles.coinStyle} source={IMAGE.coin} />
                <Text style={styles.topText}> Available Balance</Text>
                <Text style={styles.topTextBold}> +{wallet_balance}</Text>
              </View>
            </View>
            <View
              style={{
                ...styles.flexRow,
                justifyContent: 'space-evenly',
                marginVertical: 30,
              }}>
              <TouchableOpacity onPress={() => setbankTab('bank')}>
                <View
                  style={
                    bankTab === 'bank' ? styles.bankBoxActive : styles.bankBox
                  }>
                  <Image
                    style={[styles.bankImage, { width: 50 }]}
                    source={IMAGE.bank}
                  />
                  <Text>Bank</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setbankTab('paypal')}>
                <View
                  style={
                    bankTab === 'paypal' ? styles.bankBoxActive : styles.bankBox
                  }>
                  <Image
                    style={[styles.bankImage, { width: 40 }]}
                    source={IMAGE.paypal}
                  />
                  <Text>PayPal</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.formBox}>
              {bankTab === 'bank' && (
                <>
                  <TextInput
                    style={styles.input}
                    onChangeText={setACName}
                    value={ACName}
                    placeholder="Account name"
                    placeholderTextColor={color.lightBlack}
                  />
                  <TextInput
                    style={styles.input}
                    onChangeText={setACNumber}
                    value={ACNumber.toString()}
                    keyboardType="number-pad"
                    placeholder="Account Number"
                    placeholderTextColor={color.lightBlack}
                  />
                  <TextInput
                    style={styles.input}
                    onChangeText={setACCode}
                    value={ACCode.toString()}
                    keyboardType="number-pad"
                    placeholder="Code"
                    placeholderTextColor={color.lightBlack}
                  />
                </>
              )}
              {bankTab === 'paypal' && (
                <TextInput
                  style={styles.input}
                  onChangeText={setPaypalID}
                  value={PaypalID}
                  placeholder="Paypal ID"
                  placeholderTextColor={color.lightBlack}
                />
              )}
              <Button
                onPress={() => {
                  handleSubmit();
                }}
                title="Submit Request"
                buttonStyle={styles.buttonStyleSubmit}
              />
            </View>
          </View>
          <BottomSheetCustom
            isShowBottomSheet={isShowBottomSheet}
            setisShowBottomSheet={setisShowBottomSheet}
            cancelBtn={{
              color: color.lightGray,
              title: 'Okay',
              textColor: color.btnBlue,
            }}
            confetti={true}>
            <Image style={styles.alertImage} source={IMAGE.checkTick} />
            <Text style={styles.alertTitle}>Thank You!</Text>
            <Text style={styles.alertText}>
              Your payment request has been successfully submitted to Admin
            </Text>
          </BottomSheetCustom>
        </ScrollView>
      </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView >
  );
};

export default Withdraw;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: null,
    backgroundColor: color.btnBlue,
    marginBottom: Platform.OS === 'ios' ? -50 : 0,
  },
  headerBox: {
    marginHorizontal: 15,
    marginVertical: '6%',
  },
  headerContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS == 'ios' ? 0 : hp(4),
  },
  headerText: {
    fontSize: fontSize.size15,
    fontFamily: fontFamily.Bold,
    color: color.white,
    textAlign: 'center',
    flex: 1,
  },
  divider: {
    height: 1,
    width: 110,
    backgroundColor: color.liteRed,
    alignSelf: 'center',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinText: {
    alignSelf: 'center',
    fontSize: fontSize.size55,
    fontFamily: fontFamily.Bold,
    color: color.blueMagenta,
    borderWidth: 1,
    borderColor: color.white,
    height: 120,
    width: 250,
    textAlign: 'center',
  },
  bankBoxActive: {
    borderRadius: 11,
    borderColor: color.violet,
    borderWidth: 1,
    padding: 15,
    alignItems: 'center',
    backgroundColor: color.lightGray,
    width: 110,
    height: 100,
  },
  bankBox: {
    borderRadius: 11,
    padding: 15,
    alignItems: 'center',
    width: 110,
    height: 100,
    borderColor: color.white,
    borderWidth: 1,
    shadowColor: color.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    elevation: 1,
    shadowRadius: 11,
    backgroundColor: color.white,
  },
  input: {
    borderWidth: 1,
    borderColor: color.borderGray,
    borderRadius: 11,
    padding: 20,
    marginBottom: 15,
  },
  formBox: {
    padding: 15,
  },
  topText: {
    fontSize: fontSize.size11,
    fontFamily: fontFamily.Medium,
    lineHeight: 16,
  },
  topTextBold: {
    fontSize: fontSize.size11,
    fontFamily: fontFamily.Bold,
    lineHeight: 16,
  },
  alertImage: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    marginVertical: 20,
  },
  alertTitle: {
    fontSize: fontSize.size20,
    color: color.black,
    textAlign: 'center',
    marginVertical: 10,
  },
  alertText: {
    fontSize: fontSize.size15,
    color: color.liteBlueMagenta,
    textAlign: 'center',
    marginBottom: 25,
  },
  backBtn: {
    padding: 15,
  },
  inputBox: {
    backgroundColor: '#fff',
    paddingVertical: 40,
    marginHorizontal: 20,
    marginTop: -80,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  coinStyle: {
    width: 13,
    height: 13,
  },
  buttonStyleSubmit: {
    backgroundColor: color.btnBlue,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 11,
    padding: 15,
  },
  bankImage: {
    height: 50,
    marginBottom: 5,
  },
});
