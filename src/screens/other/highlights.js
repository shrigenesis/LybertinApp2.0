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
} from 'react-native';
import {IMAGE, color, fontFamily} from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RippleTouchable, Header, Radio, Button, Loader} from '../../component/';
// import Loader from '../../component/loader';
import {useIsFocused} from '@react-navigation/native';
import {
  APIRequest,
  ApiUrl,
  APIRequestWithFile,
  IMAGEURL,
  Toast,
} from './../../utils/api';
import SimpleToast from 'react-native-simple-toast';
import {pickImage} from '../../component/';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class highlights extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: 0,
      highlights: [],
      selectedHighlight: [],
    };
  }

  componentDidMount() {
    this.getHighlight();
  }

  selectHighlight = id => {
    let index = this.state.selectedHighlight.indexOf(id);
    let data = this.state.selectedHighlight;
    if (index == -1) {
      data.push(id);
    } else {
      data.splice(index, 1);
    }
    this.setState({
      selectedHighlight: data,
    });

    console.log('selected hightLight', this.state.selectedHighlight);
  };

  getHighlight = () => {
    this.setState({isLoading: true});
    let config = {
      url: ApiUrl.userStories,
      method: 'get',
    };

    APIRequest(
      config,
      res => {
        this.setState({
          highlights: res.userStories,
        });
      },
      err => {
        this.setState({isLoading: false});
        console.log(err?.response?.data);
      },
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{flex: 1, backgroundColor: color.background}}>
          <StatusBar barStyle={'dark-content'} backgroundColor={color.white} />
          <Header
            title={'Stories'}
            RightIcon={() =>
              this.state.selectedHighlight?.length > 0 && (
                <Text
                  onPress={() =>
                    this.props?.navigation?.navigate('Createhightlights', {
                      selected: this.state.selectedHighlight,
                    })
                  }
                  style={styles.editText}>
                  Next
                </Text>
              )
            }
          />
          {this.state.highlights.length == 0 ? (
            <View>
              <Image
                source={IMAGE.noTicket}
                style={{
                  height: 131,
                  width: 143,
                  resizeMode: 'contain',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginTop: '40%',
                }}
              />
              <Text
                style={{
                  fontSize: 21,
                  fontFamily: fontFamily.Bold,
                  color: color.btnBlue,
                  textAlign: 'center',
                  marginTop: '5%',
                }}>
                No Story Found
              </Text>
            </View>
          ) : (
            <FlatList
              data={this.state.highlights}
              renderItem={({item: d}) => (
                <TouchableOpacity
                  onPress={() => {
                    this.selectHighlight(d.id);
                  }}
                  style={styles.cardContainer}>
                  <Image
                    source={{uri: `${IMAGEURL}/${d.image}`}}
                    style={{
                      height: '100%',
                      width: '100%',
                      resizeMode: 'cover',
                      alignSelf: 'center',

                      // marginTop: '2%',
                    }}
                  />
                  <View
                    style={{
                      backgroundColor: '#fff',
                      position: 'absolute',
                      alignItems: 'center',
                      borderRadius: 4,
                      paddingHorizontal: 5,
                      top: 15,
                      left: 15,
                    }}>
                    <Text
                      style={{
                        paddingTop: 4,
                        lineHeight: 20,

                        fontSize: 15,
                        color: '#000',
                        fontFamily: fontFamily.Bold,
                      }}>
                      {moment(d.story_date).format('DD')}
                    </Text>
                    <Text
                      style={{
                        lineHeight: 20,
                        fontSize: 13,
                        color: '#000',
                        fontFamily: fontFamily.Medium,
                      }}>
                      {moment(d.story_date).format('MMM')}
                    </Text>
                  </View>
                  <View>
                    {this.state.selectedHighlight.indexOf(d.id) != -1 ? (
                      <Image
                        source={IMAGE.checkNewFill}
                        style={styles.bottomImage}
                      />
                    ) : (
                      <Image
                        source={IMAGE.checkTick}
                        style={styles.bottomImage}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              )}
              //Setting the number of column
              numColumns={3}
            />
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: color.white
  },
  mediatext: {
    fontSize: 16,
    fontFamily: fontFamily.Bold,
    textAlign: 'center',
    marginTop: '8%',
  },
  bottomImage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    marginRight: 8,
    position: 'absolute',
    bottom: 10,
    right: 2,
  },
  divider: {
    height: 1,
    width: '80%',
    backgroundColor: 'red',
    marginTop: '2%',
  },
  cardContainer: {
    width: wp(33),
    height: hp(30),
    margin: 1,
    backgroundColor: '#fff',
    // marginTop:"-10%"
    // marginBottom:"30%"
  },
  editText: {
    fontSize: 15,
    fontFamily: fontFamily.Bold,
    color: color.btnBlue,
  },
  radioIcon: {
    marginTop: '-30%',
    alignSelf: 'flex-end',
  },
});
