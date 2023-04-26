
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
} from 'react-native';
import { IMAGE, color, fontFamily } from '../../constant/';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { RippleTouchable, StoryList } from '../../component/';
import SwipeableView from 'react-native-swipeable-view';
import Loader from './../../component/loader';

import { APIRequest, ApiUrl, IMAGEURL, Toast } from './../../utils/api';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import { User } from '../../utils/user';
import { WebView } from 'react-native-webview';


export default class aboutUs extends React.Component {

    render() {
        return (
            <View style={styles.container}>
                <View style={{marginHorizontal: '4%', marginVertical: '6%'}}>
      <View style={styles.headerContainer
            }>
              <TouchableOpacity style={{height:30,width:30}} onPress={() => this.props.navigation.goBack()}>
                <Image
                  source={IMAGE.back}
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>

              <Text style={styles.headerText}>About Us</Text>
              <Text style={{color: '#fff'}}>new</Text>
            </View>
            </View>

                <WebView source={{ uri: 'https://lybertine.com/about' }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop:(Platform.OS=='ios')?hp(4):2
      },
      headerText: {
        fontSize: 15,
        fontFamily: fontFamily.Bold,
        color: '#0F0F0F',
      },

});