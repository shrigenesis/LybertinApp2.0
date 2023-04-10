/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
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
  Dimensions,
} from 'react-native';
import { IMAGE, color, fontFamily, fontSize } from '../../constant';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import EducationVideoListItem from './educationVideoListItem';


export default class EducationVideoShowAll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selected: 0,
      Videos: this.props.route.params.Videos,
    };
  }

  componentDidMount = () => {
    console.log(this.state.Videos, "EducationVideoShowAll");
    // this.getEvents();
  };

  // getEvents = () => {
  //   // setisLoading(true);
  //   let config = {
  //     url: ApiUrl.eventFilter,
  //     method: 'post',
  //     body: {
  //       filter_type: this.state.filter_type,
  //     },
  //   };
  //   APIRequest(
  //     config,

  //     res => {
  //       this.setState({
  //         data: res.data,
  //       });
  //       // setisLoading(false);
  //     },
  //     err => {
  //       // setisLoading(false);
  //       console.log(err);
  //     },
  //   );
  // };

  render() {

    return (
      <View style={styles.container}>

        <StatusBar barStyle={'dark-content'} translucent backgroundColor={color.transparent} />
        <View style={{ marginHorizontal: '4%', marginVertical: '6%' }}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={{ height: 30, width: 30 }}
              onPress={() => this.props.navigation.goBack()}>
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
              {this.props.route.params.title}
            </Text>

          </View>
        </View>

        <View style={{ backgroundColor: color.white, paddingHorizontal: 7, paddingVertical: 15, height: '100%' }}>
          <FlatList
            data={this.state.Videos}
            keyExtractor={index => `educationList-${index}`}
            renderItem={({ item }) => (
              <EducationVideoListItem item={item} />
            )}
            numColumns={2}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: null,
    marginTop: 25,
    // backgroundColor: 'red',
  },
  headerContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS == 'ios' ? hp(4) : 2,
  },
  headerText: {
    fontSize: fontSize.size15,
    fontFamily: fontFamily.Bold,
    color: color.atomicBlack,
    textAlign: "center",
    flex: 1,
  },

});
