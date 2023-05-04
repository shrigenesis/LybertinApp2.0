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
  Alert,
  SafeAreaView,
} from 'react-native';
import {IMAGE, color, fontFamily, fontSize} from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RippleTouchable, Header, Radio, Button, Loader} from '../../component/';

import {
  APIRequest,
  ApiUrl,
  APIRequestWithFile,
  IMAGEURL,
} from './../../utils/api';
import Toast from 'react-native-toast-message';


let apiMethod = '/leave';
let apiUrl = ApiUrl.groups;
let apiMethodNew = '/remove';
let reportMethod = '/report-group';

export default class groupInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // groupId:this.props.route.params.group_id,
      coverImage: '',
      image: '',
      groupName: '',
      description: '',
      groupMembers: [],
      memberCount: '',
      groupId: this.props.route.params.groupId,
      mediaCount: '',
      data: {},
      privacy: this.props.route.params.privacy,
      isAdmin: this.props.route.params.isAdmin,
      isExit: '',
    };
  }

  componentDidMount() {
    // alert('privacy',this.props.route.params.groupId);
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getGroupInfo();
    });
  }

  getGroupInfo = () => {
    this.setState({isLoading: true});
    let config = {
      url: `${ApiUrl.groupDetail}${this.state.groupId}`,
      method: 'get',
    };

    APIRequest(
      config,
      res => {
        this.setState({
          groupName: res.data.name,
          description: res.data.description,
          coverImage: res.data.cover,
          image: res.data.photo_url,
          groupMembers: res.data.group_members,
          memberCount: res.data.group_members.length,
          mediaCount: res.data.group_media_count,
          data: res.data,
          isExit: res.data.is_exit,
        });
      },
      err => {
        this.setState({isLoading: false});
      },
    );
  };

  exitGroup = () => {
    this.setState({isLoading: true});
    let config = {
      url: `${apiUrl}/${this.state.groupId}${apiMethod}`,
      method: 'post',
    };

    APIRequest(
      config,
      res => {
        Toast.show({
          type: 'success',
          text1: 'Group left successfully'
        })
      },
      err => {
        this.setState({isLoading: false});
        console.log(err?.response?.data);
        Toast.show({
          type: 'error',
          text1: 'Something went wrong'
        })
      },
    );
  };

  deleteGroup = () => {
    this.setState({isLoading: true});
    let config = {
      url: `${apiUrl}/${this.state.groupId}${apiMethodNew}`,
      method: 'post',
    };

    APIRequest(
      config,
      res => {
        Toast.show({
          type: 'success',
          text1: 'Deleted group successfully'
        })
      },
      err => {
        this.setState({isLoading: false});
        console.log(err?.response?.data);
        Toast.show({
          type: 'error',
          text1: 'Something went wrong'
        })
      },
    );
  };

  reportGroup = () => {
    this.setState({isLoading: true});
    let config = {
      url: `${apiUrl}${reportMethod}`,
      method: 'post',
      body: {
        group_id: this.state.groupId,
        notes: 'content is not appropirate',
      },
    };

    APIRequest(
      config,
      res => {
        Toast.show({
          type: 'success',
          text1:res?.message
        })
        this.props.navigation.navigate('Groups');
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
            title={this.state.groupName}
            RightIcon={() =>
              this.state.isAdmin == true ? (
                <Text
                  onPress={() =>
                    this.props.navigation.navigate('AddGroup', {
                      groupName: this.state.groupName,
                      groupDes: this.state.description,
                      image: this.state.image,
                      coverImage: this.state.coverImage,
                      group_id: this.state.groupId,
                      groupType: this.state.data.group_type,
                      groupPrivacy: this.state.data.privacy,
                      mediaPrivacy: this.state.data.media_privacy,
                      EditGroup: 'Edit group',
                    })
                  }
                  style={styles.editText}>
                  Edit
                </Text>
              ) : (
                <Text></Text>
              )
            }
          />
          <ScrollView>
            <View style={styles.coverView}>
              <Image
                source={{uri: `${IMAGEURL}/${this.state.coverImage}`}}
                style={{height: hp(25), width: wp(100), resizeMode: 'cover'}}
              />
            </View>
            <View style={styles.profileContainer}>
              <Image
                source={{uri: `${IMAGEURL}/${this.state.image}`}}
                style={{
                  height: '94%',
                  width: '94%',
                  resizeMode: 'cover',
                  alignSelf: 'center',
                  borderRadius: 20,
                }}
              />
            </View>
            <View>
              <Text style={styles.groupName}>{this.state.groupName}</Text>
              <Text style={styles.description} numberOfLines={3}>
                {this.state.description}
              </Text>
            </View>
            <RippleTouchable
              onPress={() => {
                this.props.navigation.navigate('Media', {
                  id: this.state.groupId,
                  from: 'group',
                });
              }}
              style={styles.cardBlock}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={IMAGE.media}
                  style={[styles.icon, {tintColor: color.btnBlue}]}
                />
                <Text style={styles.cardText}>Media, Docs</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.counter}>{this.state.mediaCount}</Text>
                <Image
                  source={IMAGE.arrow}
                  style={[
                    styles.icon,
                    {height: 15, marginLeft: wp(3), width: 15},
                  ]}
                />
              </View>
            </RippleTouchable>
            <Text style={styles.participant}>
              {this.state.memberCount} Participants
            </Text>
            {this.state.isExit === false ? (
              <View style={styles.participantList}>
                {(this.state.privacy == 2 && this.state.isAdmin == true) ||
                this.state.privacy == 1 ? (
                  <RippleTouchable
                    onPress={() =>
                      this.props.navigation.navigate('addParticipent', {
                        groupId: this.state.groupId,
                        groupMembers: this.state.groupMembers
                      })
                    }
                    style={styles.cardBlock}>
                    <View style={{flexDirection: 'row'}}>
                      <Image
                        source={IMAGE.add}
                        style={[styles.icon, {tintColor: color.btnBlue}]}
                      />
                      <Text style={styles.cardText}>Add Participants</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      {/* <Text style={styles.counter}>83</Text> */}
                      <Image
                        source={IMAGE.arrow}
                        style={[
                          styles.icon,
                          {height: 15, marginLeft: wp(3), width: 15},
                        ]}
                      />
                    </View>
                  </RippleTouchable>
                ) : (
                  <View></View>
                )}
              </View>
            ) : (
              <View></View>
            )}

            <FlatList
              data={this.state.groupMembers}
              renderItem={({item: d}) => (
                <View>
                  <RippleTouchable>
                    <View style={styles.card}>
                      <RippleTouchable
                        onPress={() =>
                          this.props?.navigation.navigate('UserProfile', {
                            data: d,
                          })
                        }
                        style={{
                          alignItems: 'center',
                          flexDirection: 'row',
                          paddingLeft: wp(5),
                          marginBottom: hp(3),
                        }}>
                        <View style={styles.imgview}>
                          {/* <View style={styles.onlineDot} /> */}
                          <Image
                            source={{uri: `${IMAGEURL}/${d.avatar}`}}
                            style={styles.imgBox}
                          />
                        </View>
                        <View style={styles.chatView}>
                          <View>
                            <Text style={styles.chatname}>{d.name}</Text>
                          </View>
                          <View style={{paddingRight: wp(3)}}>
                            {d.is_admin === true ? (
                              <Text style={styles.adminText}>Admin</Text>
                            ) : (
                              <TouchableOpacity
                                onPress={() =>
                                  this.props?.navigation.navigate(
                                    'UserProfile',
                                    {
                                      data: d,
                                    },
                                  )
                                }>
                                <Image
                                  source={IMAGE.arrow}
                                  style={[
                                    styles.icon,
                                    {height: 15, marginLeft: wp(3), width: 15},
                                  ]}
                                />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      </RippleTouchable>
                    </View>
                  </RippleTouchable>
                </View>
              )}
            />
            <View style={{marginTop: '5%'}}></View>
            {this.state.isExit === false ? (
              <RippleTouchable
                onPress={() => {
                  Alert.alert('Alert', 'Are you sure you want to exit group?', [
                    {
                      text: 'NO',
                      onPress: () => null,
                      style: 'Cancel',
                    },
                    {
                      text: 'YES',
                      onPress: () => [
                        this.exitGroup(),
                        this.props.navigation.navigate('ChatList'),
                      ],
                    },
                  ]);
                }}
                style={styles.redContainer}>
                <Image source={IMAGE.exit} style={styles.redIcon} />
                <Text style={styles.redText}>Exit Group</Text>
              </RippleTouchable>
            ) : (
              <View></View>
            )}
            {this.state.data.can_delete == true ? (
              <RippleTouchable
                onPress={() => {
                  Alert.alert(
                    'Alert',
                    'Are you sure you want to delete group?',
                    [
                      {
                        text: 'NO',
                        onPress: () => null,
                        style: 'Cancel',
                      },
                      {
                        text: 'YES',
                        onPress: () => [
                          this.deleteGroup(),
                          // this.props.navigation.navigate('ChatList'),
                          this.props.navigation.navigate('Friends'),
                        ],
                      },
                    ],
                  );
                }}
                style={styles.redContainer}>
                <Image source={IMAGE.deleteRed} style={styles.redIcon} />
                <Text style={styles.redText}>Delete Group</Text>
              </RippleTouchable>
            ) : (
              <View></View>
            )}

            <RippleTouchable
              onPress={() => {
                Alert.alert(
                  'Alert',
                  'Are you sure you want to report this group?',
                  [
                    {
                      text: 'NO',
                      onPress: () => null,
                      style: 'Cancel',
                    },
                    {
                      text: 'YES',
                      onPress: () => [
                        this.reportGroup(),
                        // this.props.navigation.navigate('ChatList'),
                        // this.props.navigation.navigate('Friends'),
                      ],
                    },
                  ],
                );
              }}
              style={styles.redContainer}>
              <Image source={IMAGE.report} style={styles.redIcon} />
              <Text style={styles.redText}>Report Group</Text>
            </RippleTouchable>
            <View style={{marginTop: '5%'}}></View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: color.white,
  },
  editText: {
    fontSize: 15,
    fontFamily: fontFamily.Bold,
    color: color.btnBlue,
  },
  profileContainer: {
    height: 136,
    width: 136,
    backgroundColor: color.white,
    marginTop: '-16%',
    alignSelf: 'center',
    borderRadius: 20,
    justifyContent: 'center',
  },
  groupName: {
    fontSize: 27,
    fontFamily: fontFamily.Bold,
    color: color.black,
    alignSelf: 'center',
    marginTop: '4%',
  },
  description: {
    fontSize: 15,
    fontFamily: fontFamily.Light,
    color: color.iconGray,
    // alignSelf: 'center',
    textAlign: 'center',
  },
  participantList: {
    paddingVertical: 10,
  },
  cardBlock: {
    paddingLeft: wp(5),
    paddingRight: wp(7),
    paddingVertical: hp(4),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  counter: {
    fontSize: 10,
    fontFamily: fontFamily.Regular,
    color: color.textGray2,
  },
  icon: {
    resizeMode: 'contain',
    height: 22,
    width: 22,
  },
  cardText: {
    paddingLeft: wp(5),
    fontSize: 13,
    fontFamily: fontFamily.Regular,
    color: color.black,
  },
  participant: {
    fontSize: 18,
    fontFamily: fontFamily.Medium,
    color: color.black,
    marginLeft: '4%',
  },
  addImage: {
    height: 23.3,
    width: 20,
    resizeMode: 'contain',
  },
  imgview: {
    overflow: 'hidden',
    borderColor: color.lightSlaty,
  },
  onlineDot: {
    borderWidth: 1,
    borderColor: color.white,
    position: 'absolute',
    zIndex: 99,
    right: 0,
    bottom: 0,
    height: 13,
    width: 13,
    borderRadius: 120,
    backgroundColor: color.green,
  },
  imgBox: {
    borderRadius: 120,
    height: 52,
    width: 52,
    resizeMode: 'cover',
  },
  chatView: {
    paddingRight: wp(5),
    paddingVertical: hp(1.5),
    flex: 1,
    marginLeft: wp(3),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomWidth: 0.4,
    borderColor: color.extralightSlaty,
    // marginTop:hp(2)
  },
  time: {
    fontSize: 8,
    fontFamily: fontFamily.Semibold,
    color: color.black,
  },
  chatname: {
    fontSize: 15,
    fontFamily: fontFamily.Bold,
    color: color.black,
  },
  msg: {
    fontSize: 12,
    fontFamily: fontFamily.Thin,
    color: color.textGray2,
  },
  redIcon: {
    height: 19,
    width: 19,
    resizeMode: 'contain',
  },
  redText: {
    fontSize: fontSize.size17,
    fontFamily: fontFamily.Light,
    color: color.red,
    marginLeft: '5%',
  },
  redContainer: {
    flexDirection: 'row',
    marginHorizontal: '8%',
    alignItems: 'center',
    marginBottom: '5%',
  },
  adminText: {
    fontSize: 12,
    fontFamily: fontFamily.Bold,
    color: color.green,
  },
});
