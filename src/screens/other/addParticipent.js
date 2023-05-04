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
} from 'react-native';
import { IMAGE, color, fontFamily } from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RippleTouchable, Header, Radio, Button, Loader } from '../../component/';
// import Loader from '../../component/loader';
import { useIsFocused } from '@react-navigation/native';
import {
  APIRequest,
  ApiUrl,
  APIRequestWithFile,
  IMAGEURL,
} from './../../utils/api';
import Toast from 'react-native-toast-message';
import { pickImage } from '../../component/';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import NoRecord from './noRecord';


let apiMethod = '/add-members';
let apiUrl = ApiUrl.groups;
let arrayKey = 'members[]';

export default class addParticipent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      participents: [],
      selectUserList: [],
      group_members: [],
      groupId: this.props.route.params.groupId,
      selected: 0,
    };
  }

  componentDidMount() {
    this.getGroupInfo();
  }

  getGroupInfo = () => {
    this.setState({ isLoading: true });
    let config = {
      url: `${ApiUrl.groupDetail}${this.state.groupId}`,
      method: 'get',
    };

    APIRequest(
      config,
      res => {
        this.setState({
          participents: res.data.add_more_participent_list,
          group_members: res.data.group_members
        });
      },
      err => {
        this.setState({ isLoading: false });
        console.log(err?.response?.data);
      },
    );
  };


   RemoveMember = (id) => {
    let config = {
      url: `${apiUrl}/removemember/${this.state.groupId}/members/${id}`,
      method: 'post',
    };
    console.log('config', config);
    APIRequest(
      config,
      res => {
        if (res?.status) {
          fetchGroupDetail();
          Toast.show({
            type: 'success',
            text1: 'Remove Participent successful '
          })
          this.getGroupInfo()
        }
      },
      err => {
        console.log(err?.response?.data);
      },
    );
  }
   AddMember = (id) => {
    let config = {
      url: `${apiUrl}/${this.state.groupId}${apiMethod}`,
      method: 'post',
      body: {
        members: id,
      },
    };
    console.log('config', config);
    APIRequest(
      config,
      res => {
        if (res?.status) {
          Toast.show({
            type: 'success',
            text1: 'Add Participent successful '
          })
        }
        this.getGroupInfo();
      },
      err => {
        console.log(err?.response?.data);
      },
    );
  }

  selectUser = id => {
    let index = this.state.selectUserList.indexOf(id);
    let data = this.state.selectUserList;
    if (index == -1) {
      data.push(id);
    } else {
      data.splice(index, 1);
    }
    this.setState({
      selectUserList: data,
    });

    console.log('selected user', this.state.selectUserList);
  };

  addUser = () => {
    console.log('selected user list sedn', this.state.selectUserList);

    this.setState({ isLoading: true });
    let config = {
      url: `${apiUrl}/${this.state.groupId}${apiMethod}`,
      method: 'post',
      body: {
        members: this.state.selectUserList,
      },
    };
    console.log('config', config);
    APIRequest(
      config,
      res => {
        console.log('Api response @@@@@@@', res);
        this.setState({
          selectUserList: [],
        });
        if (res?.status) {
          Toast.show({
            type: 'success',
            text1: 'Add Participent Done'
          })
          this.props?.navigation.goBack();
        }
      },
      err => {
        this.setState({ isLoading: false });
        console.log(err?.response?.data);
      },
    );
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: color.white }}>
        <View style={{ flex: 1, backgroundColor: color.background }}>
          <StatusBar barStyle={'dark-content'} backgroundColor={color.white} />
          <Header
            title={'Add Participants'}
          // RightIcon={() =>
          //   this.state.selected == 0 ||
          //     this.state.selectUserList.length == 0 ? (
          //     <Text
          //       // onPress={() => this.addUser()}
          //       style={styles.editText}></Text>
          //   ) : (
          //     <TouchableOpacity onPress={() => this.addUser()}>
          //       <Text style={styles.editText}>add</Text>
          //     </TouchableOpacity>
          //   )
          // }
          />
          {this.state.participents.length > 0 ?
            <>
              <FlatList
                data={this.state.participents}
                renderItem={({ item: d }) => (
                  <View
                    style={{
                      alignItems: 'center',
                      flexDirection: 'column',
                      padding: wp(3),
                      backgroundColor: '#fff',
                      borderRadius: 10,
                      elevation: 5,
                      marginVertical: hp(1),
                      width: wp(90),
                      alignSelf: 'center',
                    }}>
                    <View
                      style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        paddingVertical: hp(1),
                        paddingLeft: wp(5),
                      }}>
                      <View style={styles.imgview}>
                        <Image
                          source={{ uri: `${IMAGEURL}/${d.avatar}` }}
                          style={styles.imgBox}
                        />
                      </View>
                      <View style={styles.chatView}>
                        <Text numberOfLines={1} style={[styles.typeText, { marginBottom: 0 , width:wp(30)}]}>
                          {d.name}
                        </Text>
                        <RippleTouchable
                          onPress={() => {
                            this.AddMember(d.id)
                          }}
                          backgroundColor={color.white}
                          borderRadius={5}
                          style={{ ...styles.btn, backgroundColor: '#92969B' }}>
                          <Text style={styles.btnText}>Add</Text>
                        </RippleTouchable>
                      </View>
                    </View>
                  </View>
                )}
              />
            </> :
            <NoRecord
              image={IMAGE.noFriends}
              title="No participants found"
              // description="You will get Upcoming and poular events here."
              showButton={false}
            />
          }
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  editText: {
    fontSize: 15,
    fontFamily: fontFamily.Bold,
    color: color.btnBlue,
  },
  imgview: {
    overflow: 'hidden',
    borderColor: color.lightSlaty,
  },
  imgBox: {
    borderRadius: 120,
    height: 52,
    width: 50.5,
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
    borderColor: color.textGray2,
  },
  typeText: {
    marginBottom: hp(2),
    fontSize: 17,
    fontFamily: fontFamily.Bold,
    color: color.black,
  },
  btn: {
    marginTop: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(4.5),
    width: wp(25),
    borderRadius: 20,
    backgroundColor: color.btnBlue,
  },
  btnText: {
    fontSize: 13,
    fontFamily: fontFamily.Regular,
    color: color.white,
  },
});
