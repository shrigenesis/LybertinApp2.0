/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from 'react-native';
import React, {Component} from 'react';
import {IMAGE, color, fontFamily} from '../../constant';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import { Header } from '../../component/'

export default class chooseEventDate extends Component {
  constructor(props) {
    super(props);
    const formatted_schedule_dates =
      this.props.route.params.allData.schedule_dates.formatted_schedule_dates.map(
        (f, i) => ({...f, id: i + 1, selected: false}),
      );
    this.state = {
      formatted_schedule_dates: formatted_schedule_dates,
      selected: 0,
      selectedDate: [],
      eventId: this.props.route.params.allData?.event_id,
    };
  }

  componentDidMount = () => {};

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{...styles.container}}>
          <View style={{flex: 0.92}}>
            <Header title="Choose Event Date" />
            <FlatList
              showsVerticalScrollIndicator={false}
              data={this.state.formatted_schedule_dates}
              renderItem={({item: d}, index) => (
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        selected: d.id,
                        selectedDate: d.date_value,
                      });
                    }}
                    style={{
                      marginRight: 10,
                      borderRadius: 10,
                      flex: 1,
                      marginHorizontal: '5%',
                      paddingTop: 15,
                      flexDirection: 'row',
                      // justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        width: wp(10),
                        // flexDirection: 'row',
                        // justifyContent: 'flex-start',
                        // alignItems: 'center',
                        // margin: 4,
                      }}>
                      {this.state.selected === d.id ? (
                        <Image
                          source={IMAGE.dateColor}
                          style={styles.bottomImage}
                        />
                      ) : (
                        <Image source={IMAGE.date} style={styles.bottomImage} />
                      )}
                    </View>
                    <View
                      style={{
                        width: wp(75),
                        // flexDirection: 'row',
                        // justifyContent: 'flex-start',
                        // alignItems: 'center',
                        // margin: 4,
                      }}>
                      <Text
                        style={{
                          fontSize: Platform.OS === 'ios' ? 14 : 15,
                          fontFamily: fontFamily.Medium,
                          color:
                            this.state.selected === d.id
                              ? color.btnBlue
                              : '#191926',
                        }}>
                        {d.date_format_text}
                      </Text>
                      <Text
                        style={{
                          fontSize: Platform.OS === 'ios' ? 15 : 13,
                          fontFamily: fontFamily.Bold,
                          color:
                            this.state.selected === d.id
                              ? color.btnBlue
                              : '#191926',
                        }}>
                        {moment(
                          `${d?.date_value?.start_date} ${d?.date_value?.start_time}`,
                        ).format('h:mm A')}{' '}
                        to{' '}
                        {moment(
                          `${d?.date_value?.end_date} ${d?.date_value?.end_time}`,
                        ).format('h:mm A')}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: wp(10),
                        // flexDirection: 'row',
                        // justifyContent: 'flex-start',
                        // alignItems: 'center',
                        // margin: 4,
                      }}>
                      {this.state.selected === d.id ? (
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
                  <View style={styles.divider}></View>
                </View>
              )}
            />
          </View>

          <TouchableOpacity
            onPress={() =>
              this.state.selected !== 0 &&
              this.props.navigation.navigate('buyTicket', {
                event_id: this.state.eventId,
                date: this.state.selectedDate,
              })
            }
            style={{
              flex: 0.08,
              backgroundColor: color.btnBlue,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.buttonText}>Get Tickets</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Platform.OS == 'ios' ? hp(4) : 2,
  },
  headerText: {
    fontSize: 15,
    fontFamily: fontFamily.Bold,
    color: '#0F0F0F',
  },
  bottomImage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    marginRight: 8,
    tintColor: color.btnBlue,
  },
  divider: {
    height: 1,
    width: '200%',
    backgroundColor: '#EDEDED',
    marginHorizontal: '-10%',
    marginVertical: '5%',
  },
  buttonText: {
    fontSize: Platform.OS == 'ios' ? 18 : 16,
    fontFamily: fontFamily.Medium,
    color: color.white,
  },
});
