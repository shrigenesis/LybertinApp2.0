import React, { useState, useEffect, FC } from 'react';
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
} from 'react-native';
import { IMAGE, color, fontFamily } from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RippleTouchable, Header } from '../../component/';
import { APIRequest, ApiUrl, IMAGEURL, Toast } from './../../utils/api';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import NoRecord from './noRecord';

const RequestList = ({ navigation }) => {
  const [isLoading, setisLoading] = useState(false);
  const [requestList, setrequestList] = useState([]);
  const isFocus = useIsFocused();

  useEffect(() => {
    if (isFocus) {
      fetchRequest();
    }
  }, [isFocus]);

  const fetchRequest = () => {
    setisLoading(true);

    let config = {
      url: ApiUrl.requestList,
      method: 'get',
    };

    APIRequest(
      config,
      res => {
        if (res.status) {
          setrequestList(res.requests);
        }
        setisLoading(false);
      },
      err => {
        setisLoading(false);
        console.log(err);
      },
    );
  };

  const requestAction = (id, type) => {
    setisLoading(true);
    let config = {
      url: type == 'accept' ? ApiUrl.accpetRequest : ApiUrl.rejectReq,
      method: 'post',
      body: { user_id: id },
    };

    APIRequest(
      config,
      res => {
        if (res.status) {
          let reqList = [...requestList];
          let index = reqList.findIndex(v => v.id == id);
          reqList.splice(index, 1);
          setrequestList(reqList);
        }
      
        setisLoading(false);
      },
      err => {
        setisLoading(false);
        console.log(err);
      },
    );
  };

  const _renderRequestList = (item, index) => {
    return (
      <RippleTouchable
      // onPress={()=>{
      //     navigation.navigate('Chat');
      //   }}
      >
        {console.log(item)}
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            paddingLeft: wp(5),
          }}>
          <View style={style.imgview}>
            {item.avatar ? (
              <Image
                source={{ uri: `${IMAGEURL}/${item.avatar}` }}
                style={style.imgBox}
              />
            ) : (
              <Image source={IMAGE.chatgirl} style={style.imgBox} />
            )}
          </View>
          <View style={style.requestView}>
            <Text style={style.name}>{item.name}</Text>
            <View
              style={{
                marginTop: hp(1),
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <RippleTouchable
                onPress={() => {
                  requestAction(item.id, 'reject');
                }}
                backgroundColor={color.white}
                borderRadius={5}
                style={{ ...style.btn, backgroundColor: '#92969B' }}>
                <Text style={style.btnText}>Reject</Text>
              </RippleTouchable>
              <RippleTouchable
                onPress={() => {
                  requestAction(item.id, 'accept');
                }}
                backgroundColor={color.iconGray}
                borderRadius={5}
                style={style.btn}>
                <Text style={style.btnText}>Accept</Text>
              </RippleTouchable>
            </View>
          </View>
        </View>
      </RippleTouchable>
    );
  };

  return (
    <SafeAreaView style={style.safeArea}>
      <View style={{ flex: 1, backgroundColor: color.white }}>
        <StatusBar barStyle={'dark-content'} backgroundColor={color.white} />
        <View>
          <Header
            appReady={isLoading}
            isLoading={isLoading}
            title={'Requests'}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={style.bodySection}>
              {requestList?.length > 0 ? (
                <FlatList
                  showsVerticalScrollIndicator={false}
                  keyExtractor={index => index}
                  data={requestList}
                  contentContainerStyle={{ marginBottom: hp(25) }}
                  renderItem={({ item, index }) => _renderRequestList(item, index)}
                />) : (
                  <>
                  {!
                  isLoading && (
                    <NoRecord
                    image={IMAGE.noFriendRequests}
                    title="No friend requests"
                    description="Make friends with people you know by accepting their friend requests."
                    // buttonText="Find friends"
                    navigation={navigation}
                    // navigateTo={'Search'}
                    showButton={false}
                    />
                  )}
                  </>
                  
                
              )}
            </View>
          </ScrollView>

        </View>
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  
  safeArea: {
    flex: 1,
    backgroundColor: color.white
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(4),
    width: wp(35),
    borderRadius: 2,
    backgroundColor: color.btnBlue,
  },
  name: {
    fontSize: 14,
    fontFamily: fontFamily.Bold,
    color: color.black,
  },
  btnText: {
    fontSize: 13,
    fontFamily: fontFamily.Regular,
    color: color.white,
  },
  imgview: {
    overflow: 'hidden',
    borderColor: color.lightSlaty,
  },
  imgBox: {
    borderRadius: 120,
    height: 60,
    width: 60,
    resizeMode: 'cover',
  },

  bodySection: {},
  requestView: {
    paddingRight: wp(5),
    paddingVertical: hp(1.5),
    flex: 1,
    marginLeft: wp(3),
    borderBottomWidth: 0.4,
    borderColor: color.textGray2,
  },
});
export default RequestList;
