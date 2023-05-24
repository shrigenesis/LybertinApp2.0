import React, { useState, useEffect, FC, Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
  Platform,
  ScrollView,
} from 'react-native';
import { IMAGE, color, fontFamily, fontSize } from '../../constant';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MarketplaceListItem from './MarketplaceListItem';
import { ButtonGroup, Divider } from 'react-native-elements';
import { User } from './../../utils/user';
import { APIRequest, ApiUrl, BASEURL } from '../../utils/api';
import { Header, Loader } from '../../component';

import EventListSkelton from '../../utils/skeltons/eventListSkelton';
import MarketingListSkelton from '../../utils/skeltons/MarketingListSkelton';
import NoRecord from './noRecord';
import { useIsFocused } from '@react-navigation/native';


// const { state, navigate } = this.props.navigation;    

// return (
//     <View>
//         <Button title="Go to Page" onPress={ () => {
//             /* pass key down to *EditPage* */
//             navigate('EditPage', { go_back_key: state.key });
//         }} />
//     </View>

const Marketplace = ({ navigation }) => {
  const [selectedIndex, setselectedIndex] = useState(0);
  const [Interests, setInterests] = useState([])
  const [Event, setEvent] = useState([]);
  const [isLoding, setisLoding] = useState(false)
  const [status, setstatus] = useState(true)
  const navigationKey = navigation.getState().key;  
  const isFocus = useIsFocused();

  const updateIndex = e => {
    setselectedIndex(e);
  };
  // Get api for data 
  const getMarketingEventList = () => {
    setstatus(true)
    setisLoding(true)
    let config = {
      url: `${ApiUrl.getMarketingEventList}?filter_type=${Interests?.length > 0 ? Interests[selectedIndex] : 'Top'}`,
      method: 'get',
    };
    APIRequest(
      config,
      res => {
        if (res.status) {
          console.log(res, 'getEventShareUrl');
          setEvent(res.event_marketing)
          setisLoding(false)
        } else {
          setstatus(false);
        }
      },
      err => {
        console.log(err);
        setstatus(false);
        setisLoding(false)
      },
    );
  };
  // Add interest for filter  
  useEffect(() => {
    console.log(new User().getuserdata());
    let config = {
      url: `${ApiUrl.userinfo}${new User().getuserdata().id}`,
      method: 'get',
    };
    APIRequest(
      config,
      res => {
        console.log(res);
        if (res.user.interests.length>0) {
          setInterests(['Top', ...res.user.interests])
        } else {
          setInterests(null)
        }
      },
      err => {
        console.log(err);
      },
    );
    getMarketingEventList()
  }, []);

  useEffect(() => {
    if (isFocus) {
      setTimeout(() => {
        getMarketingEventList();
      });
    }
  }, [isFocus])

  // Get data when slect interest for filter  
  useEffect(() => {
    getMarketingEventList()
  }, [selectedIndex]);

  useEffect(() => {
    return () => {
      setselectedIndex(0)
      setInterests([])
      setEvent([])
      setisLoding(false)
      setstatus(true)
    }
  }, [])

  const TopButtonGroup = () => {
    return (
      <ButtonGroup
        onPress={e => updateIndex(e)}
        selectedIndex={selectedIndex}
        buttons={Interests}
        buttonStyle={{borderWidth:0, borderColor:'#fff'}}
        textStyle={styles.textStyle}
        selectedTextStyle={styles.selectedTextStyle}
        selectedButtonStyle={styles.selectedButtonStyle}
        containerStyle={styles.containerStyle}
        buttonContainerStyle={[styles.buttonContainerStyle, { width: Interests.length > 3 ? 95 : -1, }]}
        Component={TouchableOpacity}
      />
    )

  }


  return (
    <>
      <View style={styles.container}>
        <StatusBar
          barStyle={'dark-content'}
          translucent
          backgroundColor={color.transparent}
        />
        <>
          <View style={{ marginHorizontal: '4%', marginVertical: '6%' }}>
            <View style={styles.headerContainer}>
              <TouchableOpacity
                style={{ height: 30, width: 30 }}
                onPress={() => navigation.goBack()}>
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
                Marketplace
              </Text>
              <View style={{ height: 30, width: 30 }}></View>
            </View>
          </View>
          <View
            style={styles.bodyContainer}>
            {Interests?.length>0 ?
              <>
                {Interests?.length > 3 ?
                  <View style={{ height: 55 }}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                      <TopButtonGroup />
                    </ScrollView> 
                  </View> :
                  <TopButtonGroup />
                }
                <Divider style={styles.divider} />
              </> : null}
            {isLoding === true ?
              <FlatList
                data={[1, 2, 3]}
                renderItem={({ item }) => <MarketingListSkelton />}
                keyExtractor={item => `marketlistSkelton-${item}`}
              /> :
              <>{(status && Event.length > 0) ?
                <FlatList
                  data={Event}
                  contentContainerStyle={{paddingBottom:30}}
                  renderItem={({ item }) => <MarketplaceListItem navigationKey={navigationKey} Event={item} />}
                  keyExtractor={item => `marketlist-${item.id}`}
                /> :
                <NoRecord
                  image={IMAGE.noConversation}
                  title="No Event found"
                  description="You will get Upcoming and poular events here."
                  showButton={false}
                />
              }
              </>

            }
          </View>
        </>
      </View>
    </>
  );
};

export default Marketplace;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: null,
    backgroundColor: color.lightGray,
  },
  headerContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS == 'ios' ? hp(4) : 30,
  },
  headerBox: {
    marginHorizontal: '4%',
    marginVertical: '6%'
  },
  headerText: {
    fontSize: fontSize.size15,
    fontFamily: fontFamily.Bold,
    color: color.atomicBlack,
    textAlign: "center",
    flex: 1,
  },
  divider: {
    height: 0.5,
    width: '92%',
    backgroundColor: color.liteRed,
    marginHorizontal: '4%',
    marginVertical: 10,
  },
  bodyContainer: {
    backgroundColor: color.white,
    paddingHorizontal: 7,
    paddingVertical: 10,
    height: hp(90)
  },
  backImageBox: {
    height: 30,
    width: 30
  },
  backImage: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  textStyle: {
    fontSize: fontSize.size10,
    color: color.blackRussian,
  },
  selectedTextStyle: {
    color: color.violet
  },
  selectedButtonStyle: {
    backgroundColor: color.lightGray,
    borderRadius: 20,
    height: 19,
  },
  containerStyle: {
    borderWidth: 0,
    borderRadius: 0
  },
  buttonContainerStyle: {
    borderWidth: 0,
    borderColor: 'white',
    borderRightColor:'#fff'
  },
});
