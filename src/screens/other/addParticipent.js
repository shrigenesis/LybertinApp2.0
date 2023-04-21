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
import {IMAGE, color, fontFamily} from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RippleTouchable, Header, Radio, Button, Loader} from '../../component/';
// import Loader from '../../component/loader';
import {useIsFocused} from '@react-navigation/native';
import {
  APIRequest,
  ApiUrl,
  APIRequestWithFile,
  IMAGEURL,
} from './../../utils/api';
import Toast from 'react-native-toast-message';
import {pickImage} from '../../component/';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';


let apiMethod = '/add-members';
let apiUrl = ApiUrl.groups;
let arrayKey = 'members[]';

export default class addParticipent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      participents: [],
      selectUserList: [],
      groupId: this.props.route.params.groupId,
      selected: 0,
    };
  }

  componentDidMount() {
    this.getGroupInfo();
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
          participents: res.data.add_more_participent_list,
        });
      },
      err => {
        this.setState({isLoading: false});
        console.log(err?.response?.data);
      },
    );
  };

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

    this.setState({isLoading: true});
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
        this.setState({isLoading: false});
        console.log(err?.response?.data);
      },
    );
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: color.btnBlue }}>
      <View style={{flex: 1, backgroundColor: color.background}}>
        <StatusBar barStyle={'dark-content'} backgroundColor={color.white} />
        <Header
          title={'Add Participants'}
          RightIcon={() =>
            this.state.selected == 0 ||
            this.state.selectUserList.length == 0 ? (
              <Text
                // onPress={() => this.addUser()}
                style={styles.editText}></Text>
            ) : (
              <TouchableOpacity onPress={() => this.addUser()}>
                <Text style={styles.editText}>add</Text>
              </TouchableOpacity>
            )
          }
        />
        <FlatList
          data={this.state.participents}
          renderItem={({item: d}) => (
            <View>
              <RippleTouchable
                onPress={() => {
                  [this.selectUser(d.id), this.setState({selected: 1})];
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
                      source={{uri: `${IMAGEURL}/${d.avatar}`}}
                      style={styles.imgBox}
                    />
                  </View>
                  <View style={styles.chatView}>
                    <Text style={[styles.typeText, {marginBottom: 0}]}>
                      {d.name}
                    </Text>
                    <Radio
                      active={this.state.selectUserList.indexOf(d.id) != -1}
                    />
                  </View>
                </View>
              </RippleTouchable>
            </View>
          )}
        />
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
});
