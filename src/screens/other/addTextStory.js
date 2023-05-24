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
      storyText: '',
      isLoading: false,
    };
  }

  postStory = () => {
    let formdata = new FormData();
    formdata.append('link', this.state.storyText);
    formdata.append('story_type', 'HYPERLINK');

    this.setState({ isLoading: true, storyText:'' });
    let config = {
      url: ApiUrl.storyCreate,
      method: 'post',
      body: formdata,
    };

    APIRequestWithFile(
      config,
      res => {
        if (res.status) {
          this.setState({ isLoading: false });
          Toast.show({
            type: 'success',
            text1: res?.alert?.message
          })
          this.props?.navigation.goBack();
        }
      },
      err => {
        this.setState({ isLoading: false });
        console.log(err);
      },
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
        >
          <StatusBar barStyle={'dark-content'} backgroundColor={color.white} />
          <Header
            title={'Add Hyperlink'}
            headStyle={{backgroundColor:color.white}}
            RightIcon={() => (
              (this.state?.storyText?.length ) > 0 ? <TouchableOpacity onPress={() => this.postStory()}>
                <Image
                  source={IMAGE.send}
                  style={{ height: 20, width: 20, resizeMode: 'contain', tintColor: color.btnBlue, marginBottom: -10 }}
                />
              </TouchableOpacity> : null
            )}
          />

          <View 
          // style={styles.container}
          >


            <View style={{ marginTop: 70 }}>
              <Textinput
                style={styles.inputStyle}
                value={this.state.storyText}
                autoFocus={true}
                changeText={value => {
                  this.setState({
                    storyText: value,
                  });
                }}
                multiline={true}
                placeholder={'Type a Status'}
              />
            </View>
            <Loader isLoading={this.state.isLoading} type='dots' />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: color.white,
  },
  inputStyle: {
    borderWidth: 0,
    fontSize: 20,
    textAlign: 'center',
    paddingLeft: 0,
    height: 300,
  },
  placeText: {
    fontSize: 20,
  },
});
