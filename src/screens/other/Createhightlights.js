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
import {Overlay} from 'react-native-elements';

import {
  APIRequest,
  ApiUrl,
  APIRequestWithFile,
  IMAGEURL,
} from './../../utils/api';
import Toast from 'react-native-toast-message';
import {pickImage} from '../../component/';
import {BottomSheetModal, BottomSheetBackdrop} from '@gorhom/bottom-sheet';

import moment from 'moment';

export default class Createhightlights extends Component {
  constructor(props) {
    super(props);

    this.state = {
      covername: '',
      selected: 0,
      highlights: [],
      selectedHighlight: this.props?.route?.params?.selected,
      hightlightname: '',
      cover: {},
      selected: 0,
      priceVisible: false,
    };
  }

  componentDidMount() {
    console.log('selected', this.props?.route?.params?.selected);
  }

  Createhightlight = () => {
    let formData = new FormData();

    if (this.state.covername != '') {
      formData.append('cover', {
        uri: this.state.cover?.uri,
        name: this.state.covername,
        type: this.state.cover?.type,
      });
    }

    this.setState({isLoading: true});
    formData.append('title', this.state.hightlightname);
    formData.append('story_ids', this.state.selectedHighlight?.toString());

    let config = {
      url: ApiUrl.create,
      method: 'post',
      body: formData,
    };

    APIRequestWithFile(
      config,
      res => {
        console.log(res);
        if (res.status) {
          Toast.show({
            type: 'info',
            text1: res.message
          })
          this.props?.navigation.navigate('MyProfile');
        }
        this.setState({isLoading: false});
      },
      err => {
        this.setState({isLoading: false});
        console.log(err?.response);
      },
    );
  };

  choosePrice = () => {
    this.setState({
      priceVisible: !this.state.priceVisible,
    });
  };

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{flex: 1, backgroundColor: color.background}}>
          <StatusBar barStyle={'dark-content'} backgroundColor={color.white} />
          <Loader isLoading={this.state.isLoading} type={'dots'} />

          <Header
            title={'Highlights'}
            RightIcon={() =>
              this.state.covername != '' &&
              this.state.hightlightname != '' && (
                <Text
                  onPress={() => this.Createhightlight()}
                  style={styles.editText}>
                  Done
                </Text>
              )
            }
          />
          <TouchableOpacity
            onPress={() => this.choosePrice()}
            // onPress={
            //   () => this.setState({selected: 1})
            // pickImage(
            //   'image',
            //   res => {
            //     console.log(res);
            //     this.setState({cover: res, covername: res.name});
            //   },
            //   'photo',
            // )
            // }
            style={{
              marginTop: hp(30),
              backgroundColor: '#F1F1F1',
              borderRadius: 16,
              alignSelf: 'center',
              height: 130,
              width: 130,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {this.state.covername != '' ? (
              <Image
                source={{uri: this.state.cover?.uri}}
                resizeMode={'contain'}
                style={{width: 120, height: 120, borderRadius: 16}}
              />
            ) : (
              <Image
                source={IMAGE.camera}
                resizeMode={'contain'}
                style={{width: wp(8), height: hp(18)}}
              />
            )}
          </TouchableOpacity>
          <Text
            style={{
              color: color.btnBlue,
              fontSize: 12,
              alignSelf: 'center',
              fontFamily: fontFamily.Regular,
            }}>
            Upload Image
          </Text>
          <TextInput
            value={this.state.hightlightname}
            placeholderTextColor={'gray'}
            onChangeText={value => {
              this.setState({hightlightname: value});
            }}
            placeholder="Highlights"
            style={{
              marginTop: 10,
              fontSize: 20,
              paddingVertical: 0,
              color: '#000',
              textAlign: 'center',
            }}
          />

          <Overlay
            visible={this.state.priceVisible}
            transparent={true}
            width="100%"
            height=""
            animationType="slide"
            onRequestClose={this.choosePrice}
            onBackdropPress={this.choosePrice}
            overlayStyle={{marginTop: '140%'}}>
            <View style={styles.overlayStyle}>
              <View style={{alignSelf: 'center', paddingVertical: hp(1)}}>
                <Text style={styles.heading}>Add Cover</Text>
                <Text style={styles.subHeading}>Post Photo To Your Cover</Text>
              </View>
              <TouchableOpacity
                onPress={() => [
                  pickImage(
                    'camera',
                    res => {
                      console.log(res);
                      this.setState({cover: res, covername: res.name});
                    },
                    'photo',
                  ),
                  this.choosePrice(),
                ]}
                style={styles.cardBlock}>
                <Image source={IMAGE.camera} style={styles.icon} />
                <Text style={styles.cardText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => [
                  pickImage(
                    'image',
                    res => {
                      console.log(res);
                      this.setState({cover: res, covername: res.name});
                    },
                    'photo',
                  ),
                  this.choosePrice(),
                ]}
                style={styles.cardBlock}>
                <Image source={IMAGE.camera} style={styles.icon} />
                <Text style={styles.cardText}>Select Photo</Text>
              </TouchableOpacity>

              <View>
                <Button
                  onPress={() => this.choosePrice()}
                  btnStyle={{
                    marginTop: hp(2),
                    alignSelf: 'center',
                    backgroundColor: color.red,
                    width: wp(90),
                    height: hp(6),
                  }}
                  label={'Cancel'}
                />
              </View>
            </View>
          </Overlay>
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
  overlayStyle: {
    // height:"80%",
    width: '110%',
    // backgroundColor: color.chatLeft,
    // marginBottom: "6%",
    // marginTop: "60%",
    alignSelf: 'flex-start',
    borderRadius: 10,
  },
  icon: {
    resizeMode: 'contain',
    height: 22,
    width: 22,
  },
  heading: {
    fontSize: 17,
    lineHeight: hp(2.5),
    fontFamily: fontFamily.Bold,
    color: color.btnBlue,
    textAlign: 'center',
  },
  subHeading: {
    fontSize: 10,
    fontFamily: fontFamily.Regular,
    color: color.textGray2,
    textAlign: 'center',
  },
  cardText: {
    paddingLeft: wp(5),
    fontSize: Platform.OS === 'ios' ? 15 : 13,
    fontFamily: fontFamily.Regular,
    color: color.black,
  },
  cardBlock: {
    marginLeft: wp(10),
    paddingRight: wp(7),
    paddingVertical: hp(2),
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: color.borderGray,
  },
  blueDot: {
    borderWidth: 1,
    borderColor: color.white,
    position: 'absolute',
    zIndex: 99,
    right: 0,
    bottom: 0,
    height: 14,
    width: 14,
    borderRadius: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.btnBlue,
  },
  dottedBorder: {
    borderRadius: 120,
    borderWidth: 3,
    borderColor: 'red',
    borderStyle: 'dashed',
  },
  imgview: {
    alignItems: 'center',
    paddingHorizontal: wp(2),
    paddingVertical: hp(1),
    overflow: 'hidden',
    borderColor: color.lightSlaty,
  },
  imgBox: {
    height: 52,
    width: 52,
    borderRadius: 120,
    resizeMode: 'cover',
  },
  storyText: {
    textAlign: 'center',
    fontSize: 10,
    fontFamily: fontFamily.Medium,
    color: color.btnBlue,
  },
});
