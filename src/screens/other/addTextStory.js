import React, {useState, useEffect, FC, Component} from 'react';
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
  ActivityIndicator,
  Platform,
  ImageBackground,
  Share,
  TouchableWithoutFeedback,
} from 'react-native';
import {IMAGE, color, fontFamily} from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RippleTouchable, StoryList} from '../../component/';
import SwipeableView from 'react-native-swipeable-view';
import Loader from './../../component/loader';
import {APIRequestWithFile, ApiUrl, IMAGEURL} from './../../utils/api';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import {User} from '../../utils/user';
import Toast from 'react-native-toast-message';
import {Button, Textinput, PressableText} from './../../component/';

export default class addTextStory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      isLoding: false,
    };
  }

  postStory = () => {
    this.setState({isLoding: true});
    let formdata = new FormData();
    // let type = route.params?.file?.fileType == 'photo' ? 'image' : 'video';
    // formdata.append(type, route.params.file);
    formdata.append('link', this.state.email);
    formdata.append('story_type', 'HYPERLINK');

    let config = {
      url: ApiUrl.storyCreate,
      method: 'post',
      body: formdata,
    };

    APIRequestWithFile(
      config,
      res => {
        if (res.status) {
          this.setState({isLoding: false});
          Toast.show({
            type: 'success',
            text1: res?.alert?.message
          })
          this.props?.navigation.goBack();
        }
        this.setState({isLoding: false});
      },
      err => {
        this.setState({isLoding: false});

        console.log(err);
      },
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={styles.container}>
          {this.state.isLoding && (
            <View style={{position: 'absolute', top: hp(40), left: wp(40)}}>
              <Loader isLoading={this.state.isLoading} />
            </View>
          )}
          <View style={{backgroundColor: '#f5f5f5', height: 50}}>
            <View style={styles.headerContainer}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Image
                  source={IMAGE.back}
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>

              <Text style={styles.headerText}>Add Hyperlink</Text>
              <Text style={{color: '#f5f5f5'}}>new</Text>
            </View>
          </View>
          <View style={{marginTop:"16%"}}>
            <Textinput
              style={styles.inputStyle}
              adjustsFontSizeToFit
              value={this.state.email}
              keyboardType={'email-address'}
              autoFocus={true}
              changeText={value => {
                this.setState({
                  email: value,
                });
              }}
              multiline
              placeholder={'Type a Status'}
            />
          </View>
        </ScrollView>
        <View>
          {this.state.email.length == '0' ? (
            <View></View>
          ) : (
            <TouchableOpacity
              onPress={() => this.postStory()}
              style={{
                marginBottom: 50,
                borderWidth: 2,
                borderColor: color.btnBlue,
                alignSelf: 'flex-end',
                marginHorizontal: '5%',
                height: 60,
                width: 60,
                borderRadius: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={IMAGE.send}
                style={{height: 24, width: 24, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Platform.OS == 'ios' ? hp(7) : 10,
    marginHorizontal: '5%',
  },
  headerText: {
    fontSize: 15,
    fontFamily: fontFamily.Bold,
    color: '#0F0F0F',
  },
  inputStyle: {
    borderWidth: 0,
    fontSize: 40,
    height: Platform.OS == 'ios' ? '150%' : 300,
  },
  placeText: {
    fontSize: 20,
  },
});
