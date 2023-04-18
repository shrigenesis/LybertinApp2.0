import React, { useEffect, useState } from 'react';
import { FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View, ImageBackground, ScrollView } from 'react-native';
import { Button, Divider } from 'react-native-elements';
import SvgUri from 'react-native-svg-uri';
import { SvgXml } from 'react-native-svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { color, fontFamily, fontSize, IMAGE } from '../../constant';
import TextLineSkelton from '../../utils/skeltons/TextLineSkelton';
import ChatListSkelton from '../../utils/skeltons/chatListSkelton';
import { User } from '../../utils/user';
import { APIRequest, ApiUrl, IMAGEURL } from '../../utils/api';
import NoRecord from './noRecord';

const Wallet = ({ navigation }) => {
  const userdata = new User().getuserdata();
  const [status, setstatus] = useState(true);
  const [data, setdata] = useState([])

  const getWalletTransaction = () => {
    let config = {
      url: ApiUrl.getWalletTransaction,
      method: 'get',
    };
    APIRequest(
      config,
      res => {
        setdata(res)
        setstatus(true)
      },
      err => {
        console.log(err?.response?.data);
      },
    );
  }

  useEffect(() => {
    setstatus(false)
    getWalletTransaction()
    return () => {
      setstatus(false)
      setdata([])
    }
  }, [])


  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={'dark-content'}
        translucent
        backgroundColor={color.transparent}
      />
      <ImageBackground source={IMAGE.wallet_bg} resizeMode="cover" style={styles.image}>
        <View style={styles.headerBox}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}>
              <Image
                source={IMAGE.back}
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
            <Text style={styles.headerText}>
              {/* {this.props.route.params.title} */}
              Wallet
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('MyProfile')}>
              {userdata?.avatar ? (
                <Image
                  style={styles.imageBoy}
                  source={{ uri: `${IMAGEURL}/${userdata.avatar}` }}
                />
              ) : (
                <Image source={IMAGE.boy} style={styles.imageBoy}
                />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.topText}>Available Balance</Text>
          <View style={{ ...styles.flexRow }}>
            <Image style={styles.coinImage} source={IMAGE.coin} />
            {status ?
              <Text style={styles.coinText}> {data.wallet_balance}</Text> :
              <TextLineSkelton />
            }
          </View>
        </View>

        <View style={{ margin: 50 }}>
          <Button
            onPress={() => navigation.navigate('withdraw',
              {
                processing_fee: data.processing_fee,
                wallet_balance: data.wallet_balance
              })}
            title="Withdraw"
            disabled={status ? false : true}
            buttonStyle={styles.buttonStyleWithdraw}
          />
        </View>
      </ImageBackground>
      <View
        style={styles.historyContainer}>
        {/* <Divider style={styles.divider} /> */}
        <ScrollView style={{ height: hp(70) }}>
          <Text style={styles.desHeading}>Transaction History</Text>
          {status ?
            <>{data?.data?.length > 0 ? <FlatList
              data={data.data}
              renderItem={({ item, index }) => (
                <View
                  key={`historyList-${index}`}
                  style={styles.historyList}
                >
                  <View style={{ width: '20%' }}>
                    <Image style={styles.coinImageHistory} source={IMAGE.coin} />
                  </View>
                  <View style={{ width: '60%' }}>
                    <Text style={styles.historyTitle}>{item.type}</Text>
                    <Text style={styles.historyDisc}>{item.description === "" ? item.updated_at : item.description}</Text>
                  </View>
                  <View style={{ width: '20%' }}>
                    <Text style={styles.historyCoin}>{item.amount}</Text>
                    <Text style={{ ...styles.historyDisc, color: color.liteGreen, textAlign: 'center' }}>
                      {item.widthrawal_status !== 'None' ? item.widthrawal_status : null}
                    </Text>
                  </View>
                </View>
              )}
              style={{ marginBottom: 170 }}
            /> : <NoRecord image={IMAGE.noFriends} title={'No history available'} />}</> :
            <FlatList
              data={[1, 2, 3, 4]}
              renderItem={({ item, index }) => (
                <View key={`historyListSkeleton-${index}`}><ChatListSkelton /></View>
              )}
            />
          }
        </ScrollView>
      </View>
    </View>
  );
};

export default Wallet;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: null,
    backgroundColor: color.liteRed,
  },
  headerBox: {
    marginHorizontal: 15,
    marginVertical: '6%',
  },
  headerContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS == 'ios' ? hp(4) : 30,
  },
  headerText: {
    fontSize: fontSize.size15,
    fontFamily: fontFamily.Bold,
    color: color.atomicBlack,
    textAlign: 'center',
    flex: 1,
  },
  divider: {
    height: 3,
    width: 20,
    backgroundColor: color.liteRed,
    marginVertical: 10,
  },
  topText: {
    fontSize: fontSize.size11,
    color: color.blueMagenta,
    opacity: 0.45,
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 15,
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinText: {
    fontSize: fontSize.size41,
    fontFamily: fontFamily.Semibold,
    color: color.blueMagenta,
    lineHeight: 45,
  },
  desHeading: {
    fontSize: fontSize.size19,
    fontFamily: fontFamily.Semibold,
    color: color.black,
    marginTop: 10,
    marginBottom: 30,
    textAlign: 'center',
  },
  historyList: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomColor: color.liteBlueMagenta,
    borderBottomWidth: 0.5,
    padding: 10,
  },
  historyTitle: {
    fontSize: fontSize.size18,
    fontFamily: fontFamily.Medium,
    color: color.black
  },
  historyDisc: {
    fontSize: fontSize.size11,
    fontFamily: fontFamily.Regular,
    color: color.black,
    opacity: 0.6,
  },
  historyCoin: {
    fontSize: fontSize.size18,
    fontFamily: fontFamily.Semibold,
    color: color.liteGreen,
    textAlign: 'center',
  },
  backBtn: {
    padding: 15,
  },
  imageBoy: {
    width: 42,
    height: 42,
    borderRadius: 21
  },
  coinImage: {
    width: 31,
    height: 31
  },
  buttonStyleWithdraw: {
    backgroundColor: color.btnBlue,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 30,
  },
  historyContainer: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    marginTop: -25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  coinImageHistory: {
    width: 31,
    height: 31,
    alignSelf: 'center',
    marginTop: 5
  },
});