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
import { APIRequest, ApiUrl } from '../../utils/api';
import { Loader } from '../../component';

import EventListSkelton from '../../utils/skeltons/eventListSkelton';
import MarketingListSkelton from '../../utils/skeltons/MarketingListSkelton';
import NoRecord from './noRecord';

const Marketplace = ({ navigation }) => {
  const [selectedIndex, setselectedIndex] = useState(0);
  const [Interests, setInterests] = useState([])
  const [Event, setEvent] = useState([]);
  const [isLoding, setisLoding] = useState(false)
  const [status, setstatus] = useState(true)

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
    const interest = new User().getuserdata().interests;
    if (interest) {
      setInterests(['Top', ...interest])
    } else {
      setInterests(null)
    }
    getMarketingEventList()
  }, []);

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
        textStyle={styles.textStyle}
        selectedTextStyle={styles.selectedTextStyle}
        selectedButtonStyle={styles.selectedButtonStyle}
        containerStyle={styles.containerStyle}
        buttonContainerStyle={[styles.buttonContainerStyle, { width: Interests.length > 3 ? 95 : -1,}]}
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
          <View style={styles.headerContainer}>
            <View style={styles.headerBox}>
              <TouchableOpacity
                style={styles.backImageBox}
                onPress={() => navigation.goBack()}>
                <Image
                  source={IMAGE.back}
                  style={styles.backImage}
                />
              </TouchableOpacity>

              <Text style={styles.headerText}>
                {/* {this.props.route.params.title} */}
                Marketplace
              </Text>
            </View>
          </View>
          <View
            style={styles.bodyContainer}>
            {Interests ?
              <>
                {Interests.length > 3 ?
                  <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                    <TopButtonGroup />
                  </ScrollView> :
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
                  renderItem={({ item }) => <MarketplaceListItem Event={item} />}
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
    backgroundColor: color.liteRed,
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
    textAlign: 'center',
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
    fontWeight: fontFamily.Medium,
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
    borderRadius: 20
  },
  buttonContainerStyle: {
    borderWidth: 0,
    borderColor: 'white',
    borderRadius: 20,
  },
});
