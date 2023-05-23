import React, { useState, useEffect, FC, Component } from 'react';
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
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import { IMAGE, color, fontFamily } from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import { Header, RippleTouchable, StoryList } from '../../component/';
import SwipeableView from 'react-native-swipeable-view';
import Loader from './../../component/loader';
import { APIRequestWithFile, ApiUrl, IMAGEURL } from './../../utils/api';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import { User } from '../../utils/user';
import Toast from 'react-native-toast-message';
import { Button, Textinput, PressableText } from './../../component/';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class addTextStory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      isLoding: false,
    };
  }

  postStory = () => {
    this.setState({ isLoding: true });
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
          this.setState({ isLoding: false });
          Toast.show({
            type: 'success',
            text1: res?.alert?.message
          })
          this.props?.navigation.goBack();
        }
        this.setState({ isLoding: false });
      },
      err => {
        this.setState({ isLoding: false });

        console.log(err);
      },
    );
  };

  render() {
    return (
      <SafeAreaView>
        <KeyboardAvoidingView
        >
          <StatusBar barStyle={'dark-content'} backgroundColor={color.white} />
          <Header
            title={'Add Hyperlink'}
            RightIcon={() => (
              this.state?.email?.length>0 ?<TouchableOpacity onPress={() => this.postStory()}>
                <Image
                source={IMAGE.send}
                style={{ height: 20, width: 20, resizeMode: 'contain', tintColor: color.btnBlue, marginBottom:-10 }}
              />
              </TouchableOpacity> : null
            )}
          />

          <View style={styles.container}>


            <View style={{ marginTop: 70 }}>
              <Textinput
                style={styles.inputStyle}
                value={this.state.email}
                autoFocus={true}
                changeText={value => {
                  this.setState({
                    email: value,
                  });
                }}
                multiline={true}
                placeholder={'Type a Status'}
              />
            </View>

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
                position: 'absolute',
                bottom: 0
              }}>
              <Image
                source={IMAGE.send}
                style={{ height: 24, width: 24, resizeMode: 'contain', tintColor: color.btnBlue }}
              />
            </TouchableOpacity>
            
            {this.state.isLoding && (
              <View style={{ position: 'absolute', top: hp(40), left: wp(40) }}>
                <Loader isLoading={this.state.isLoading} />
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  inputStyle: {
    borderWidth: 0,
    fontSize: 20,
    textAlign: 'center',
    paddingLeft: 0,

  },
  placeText: {
    fontSize: 20,
  },
});
