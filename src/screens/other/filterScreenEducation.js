/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
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
  Platform,
  StatusBar,
} from 'react-native';
import {IMAGE, color, fontFamily} from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Overlay} from 'react-native-elements';

import {APIRequest, ApiUrl} from './../../utils/api';

import moment from 'moment';

import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-date-picker';

import {SafeAreaView} from 'react-native-safe-area-context';

export default class filterScreenEducation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      hashTagInput: '',
      event: 0,
      hashtag: 0,
      category: 0,
      date: 0,
      price: 0,
      country: 0,
      city: 0,
      selected: 1,
      category1: [],
      price1: [],
      visible: false,
      priceVisible: false,
      countryVisible: false,
      cityVisible: false,
      country1: [],
      city1: [],
      selectedCategory: '',
      selectedPrice: '',
      selectedCountry: '',
      selectCity: '',
      datePicker: false,
      dob: '',
      countryId: '',
      datePicker1: false,
      dob1: '',
      showCity: '',
      newCountryId: '',
    };
  }

  componentDidMount = () => {
    this.getEvents();
  };

  setDate = (event, date) => {
    this.setState({dob: moment(date).format('YYYY-MM-DD'), datePicker: false});
  };
  setDate1 = (event, date) => {
    this.setState({
      dob1: moment(date).format('YYYY-MM-DD'),
      datePicker1: false,
    });
  };

  getEvents = () => {
    // setisLoading(true);

    let config = {
      url: ApiUrl.educationListFilter,
      method: 'post',
    };

    APIRequest(
      config,

      res => {
        console.log('API response =====', res.filters.categories);

        if (res.status) {
          this.setState({
            category1: res.filters.categories,
          });

          // console.log(
          //   'API response from state =====',
          //   res.data.filters.location_filter.cities,
          // );

          // setrequestCount(res.follow_requests);
        }
        // setisLoading(false);
      },
      err => {
        // setisLoading(false);
        console.log(err);
      },
    );
  };

  chooseCategory = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle={'dark-content'}
          translucent
          backgroundColor={color.lightGray}
        />
        <ScrollView style={styles.container}>
          <View
            style={{
              backgroundColor: color.lightGray,
              paddingTop: 15,
              paddingBottom: 10,
            }}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Filter by</Text>
              <Text
                onPress={() =>
                  this.setState({
                    input: '',
                    hashTagInput: '',
                    hashtag: 0,
                    input: 0,
                    category: 0,
                    date: 0,
                    dob: '',
                    dob1: '',
                  })
                }
                style={styles.clearAllText}>
                Clear all
              </Text>
            </View>
          </View>
          <DatePicker
            modal
            open={this.state.datePicker}
            mode={'date'}
            date={new Date()}
            onConfirm={date => {
              this.setDate('event', date);
            }}
            onCancel={() => {
              this.setState({...this.state, datePicker: false});
            }}
          />
          <DatePicker
            modal
            open={this.state.datePicker1}
            mode={'date'}
            date={new Date()}
            onConfirm={date => {
              this.setDate1('event', date);
            }}
            onCancel={() => {
              this.setState({...this.state, datePicker1: false});
            }}
          />
          <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
            <View>
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    event: !this.state.event,
                    selected: 1,
                  })
                }
                style={[
                  styles.categoryContainer,
                  {
                    borderColor:
                      this.state.event == 0 ? color.iconGray : '#fff',
                    backgroundColor:
                      this.state.event == 0 ? color.background2 : '#fff',
                  },
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    height: 56,
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      height: '100%',
                      width: 4.42,
                      backgroundColor:
                        this.state.event == 0 ? '#fff' : color.btnBlue,
                    }}></View>
                  <Text style={styles.categotyText}>Search Course</Text>
                  {this.state.event == '0' ? (
                    <View></View>
                  ) : (
                    <Image
                      source={IMAGE.checkMarkPurple}
                      style={{
                        height: 15,
                        width: 12,
                        resizeMode: 'contain',
                        marginLeft: '3%',
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    category: !this.state.category,

                    selected: 2,
                  })
                }
                style={[
                  styles.categoryContainer,
                  {
                    borderColor:
                      this.state.category == 0 ? color.iconGray : '#fff',
                    backgroundColor:
                      this.state.category == 0 ? color.background2 : '#fff',
                  },
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    height: 56,
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      height: '100%',
                      width: 4.42,
                      backgroundColor:
                        this.state.category == 0 ? '#fff' : color.btnBlue,
                    }}></View>

                  <Text style={styles.categotyText}>Category</Text>
                  {this.state.category == '0' ? (
                    <View></View>
                  ) : (
                    <Image
                      source={IMAGE.checkMarkPurple}
                      style={{
                        height: 15,
                        width: 12,
                        resizeMode: 'contain',
                        marginLeft: '3%',
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    date: !this.state.date,
                  })
                }
                style={[
                  styles.categoryContainer,
                  {
                    borderColor: this.state.date == 0 ? color.iconGray : '#fff',
                    backgroundColor:
                      this.state.date == 0 ? color.background2 : '#fff',
                  },
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    height: 56,
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      height: '100%',
                      width: 4.42,
                      backgroundColor:
                        this.state.date == 0 ? '#fff' : color.btnBlue,
                    }}></View>

                  <Text style={styles.categotyText}>Date</Text>
                  {this.state.date == '0' ? (
                    <View></View>
                  ) : (
                    <Image
                      source={IMAGE.checkMarkPurple}
                      style={{
                        height: 15,
                        width: 12,
                        resizeMode: 'contain',
                        marginLeft: '3%',
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    hashtag: !this.state.hashtag,
                    selected: 1,
                  })
                }
                style={[
                  styles.categoryContainer,
                  {
                    borderColor:
                      this.state.hashtag == 0 ? color.iconGray : '#fff',
                    backgroundColor:
                      this.state.hashtag == 0 ? color.background2 : '#fff',
                  },
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    height: 56,
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      height: '100%',
                      width: 4.42,
                      backgroundColor:
                        this.state.hashtag == 0 ? '#fff' : color.btnBlue,
                    }}></View>
                  <Text style={styles.categotyText}>Hastags</Text>
                  {this.state.hashtag == '0' ? (
                    <View></View>
                  ) : (
                    <Image
                      source={IMAGE.checkMarkPurple}
                      style={{
                        height: 15,
                        width: 12,
                        resizeMode: 'contain',
                        marginLeft: '3%',
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>
            <View>
              <View style={styles.input}>
                <View style={{position: 'absolute', left: wp(3)}}>
                  <Image
                    source={IMAGE.search}
                    style={{height: 20, width: 20, resizeMode: 'contain'}}
                  />
                </View>
                <TextInput
                  style={{
                    paddingVertical: 0,
                    color: color.textGray2,
                    marginLeft: '18%',
                  }}
                  onChangeText={v => this.setState({input: v})}
                  placeholder={`Type Course Name`}
                  value={this.state.input}
                  placeholderTextColor={'#000'}
                />
              </View>
              {this.state.category == 1 && (
                <TouchableOpacity
                  onPress={() => this.chooseCategory()}
                  style={styles.input}>
                  {this.state.selectedCategory == '' ? (
                    <Text style={styles.selectText}>Select Category</Text>
                  ) : (
                    <Text style={styles.selectText}>
                      {this.state.selectedCategory}
                    </Text>
                  )}
                  {/* <Text style={styles.selectText}>
                  {this.state.selectedCategory}
                </Text> */}
                </TouchableOpacity>
              )}
              {this.state.date == 1 && (
                <View>
                  <TouchableOpacity
                    onPress={() => this.setState({datePicker: true})}
                    style={styles.input}>
                    {this.state.dob == '' ? (
                      <Text style={styles.selectText}>Start Date</Text>
                    ) : (
                      <Text style={styles.selectText}>{this.state.dob}</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.setState({datePicker1: true})}
                    style={styles.input}>
                    {this.state.dob1 == '' ? (
                      <Text style={styles.selectText}>End Date</Text>
                    ) : (
                      <Text style={styles.selectText}>{this.state.dob1}</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
              {this.state.hashtag == 1 && (
                <View style={styles.input}>
                  <View style={{position: 'absolute', left: wp(3)}}>
                    <Image
                      source={IMAGE.search}
                      style={{height: 20, width: 20, resizeMode: 'contain'}}
                    />
                  </View>
                  <TextInput
                    style={{
                      paddingVertical: 0,
                      color: color.textGray2,
                      marginLeft: '18%',
                    }}
                    onChangeText={v => this.setState({hashTagInput: v})}
                    placeholder={`Type Hashtags`}
                    placeholderTextColor={'#000'}
                  />
                </View>
              )}
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('featuredCourse', {
                  category: this.state.selectedCategory,
                  date: this.state.dob,
                  input: this.state.input,
                  hashtag: this.state.hashTagInput,
                  endDate: this.state.dob1,
                })
              }
              style={styles.applyButton}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>
          <Overlay
            visible={this.state.visible}
            transparent={true}
            width="auto"
            height=" "
            animationType="slide"
            onRequestClose={this.chooseCategory}
            onBackdropPress={this.chooseCategory}>
            <View style={styles.overlayStyle}>
              <FlatList
                data={this.state.category1}
                renderItem={({item: d}) => (
                  <TouchableOpacity
                    onPress={() => [
                      this.setState({
                        selectedCategory: d.name,
                      }),
                      this.chooseCategory(),
                    ]}>
                    <Text style={styles.nameText}>{d.name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </Overlay>
          <Overlay
            visible={this.state.priceVisible}
            transparent={true}
            width="auto"
            height=" "
            animationType="slide"
            onRequestClose={this.choosePrice}
            onBackdropPress={this.choosePrice}>
            <View style={styles.overlayStyle}>
              <FlatList
                data={this.state.price1}
                renderItem={({item: d}) => (
                  <TouchableOpacity
                    onPress={() => [
                      this.setState({
                        selectedPrice: d.title,
                      }),
                      this.choosePrice(),
                    ]}>
                    <Text style={styles.nameText}>{d.title}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </Overlay>
          <Overlay
            visible={this.state.countryVisible}
            transparent={true}
            width="auto"
            height=" "
            animationType="slide"
            onRequestClose={this.chooseCountry}
            onBackdropPress={this.chooseCountry}>
            <View style={styles.overlayStyle}>
              <FlatList
                data={this.state.country1}
                renderItem={({item: d}) => (
                  <TouchableOpacity
                    onPress={() => [
                      this.setState({
                        newCountryId: d.id,
                        selectedCountry: d.country_name,
                        showCity: '1',
                      }),
                      this.getCity(d.id),
                      this.chooseCountry(),
                    ]}>
                    <Text style={styles.nameText}>{d.country_name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </Overlay>
          <Overlay
            visible={this.state.cityVisible}
            transparent={true}
            width="auto"
            height=" "
            animationType="slide"
            onRequestClose={this.chooseCity}
            onBackdropPress={this.chooseCity}>
            <View style={styles.overlayStyle}>
              <FlatList
                data={this.state.city1}
                renderItem={({item: d}) => (
                  <TouchableOpacity
                    onPress={() => [
                      this.setState({
                        selectCity: d.city,
                      }),
                      this.chooseCity(),
                    ]}>
                    <Text style={styles.nameText}>{d.city}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </Overlay>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: null,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '4%',
    alignItems: 'center',
    marginBottom: '2.5%',
    marginTop: Platform.OS == 'ios' ? 0 : 0,
  },
  headerText: {
    fontSize: 19,
    fontFamily: fontFamily.Bold,
    color: '#0F0F0F',
  },
  clearAllText: {
    fontSize: 15,
    fontFamily: fontFamily.Regular,
    color: color.btnBlue,
  },
  categoryContainer: {
    height: 56,
    width: 140,
    justifyContent: 'center',
    borderWidth: 0.5,
    marginLeft: '-1%',
    // borderColor: color.iconGray,
    // alignItems:"center"
  },
  categotyText: {
    textAlign: 'left',
    marginLeft: '10%',
  },
  input: {
    opacity: 1,
    // backgroundColor: '#F5F6F8',
    height: hp(5),
    width: wp(56),
    alignSelf: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    // elevation:2,
    borderRadius: 5,
    borderColor: color.btnBlue,
    color: '#000',
    marginLeft: wp(4),
    marginTop: wp(1.5),
  },
  closeButton: {
    height: 56,
    width: '50%',
    borderWidth: 1,
    borderColor: color.iconGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 15,
    fontFamily: fontFamily.Medium,
  },
  applyButton: {
    height: 56,
    width: '50%',
    // borderWidth:1,
    backgroundColor: color.btnBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: {
    fontSize: 15,
    fontFamily: fontFamily.Medium,
    color: color.white,
  },
  selectText: {
    fontSize: 13,
    fontFamily: fontFamily.Regular,
    marginLeft: '10%',
    color: '#000',
  },
  overlayStyle: {
    // height:"80%",
    width: 300,
    // backgroundColor: color.chatLeft,
    // marginBottom: "6%",
    // marginTop: "60%",
    alignSelf: 'center',
    borderRadius: 10,
  },
  nameText: {
    fontSize: 15,
    fontFamily: fontFamily.Light,
    marginTop: '5%',
  },
});
