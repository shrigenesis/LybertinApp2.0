import React, { useState, useMemo, useRef, memo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Keyboard,
  SafeAreaView,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Header, Loader, pickDocument, pickImage } from './../../component/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { IMAGE, color, fontFamily, fontSize } from '../../constant/';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  APIRequest,
  APIRequestWithFile1,
  ApiUrl,
  IMAGEURL,
  socketUrl,
} from './../../utils/api';
import { BottomView, ChatItem } from './chatComponent/';
import io from 'socket.io-client';
import { User } from '../../utils/user';
import Toast from 'react-native-toast-message';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  BottomSheetUploadFile,
  BottomSheetUploadFileStyle,
} from '../../component/BottomSheetUploadFile';
import AudioContextProvider from '../../context/AudioContext';
import FocusAwareStatusBar from '../../utils/FocusAwareStatusBar';

// const Socket = io.connect(socketUrl);
var Socket;
const userdata = new User().getuserdata();
class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadMore: '',
      page: 1,
      last_page: 1,
      isLoading: false,
      message: '',
      chatList: [],
      file: undefined,
      isTyping: false,
      audioFile: '',
      appReady: false,
      roomId: '',
      isOnline: '',
      per_page_count: 0,
      per_page: 0,
      isShowBottomSheet: false,
      bottomViewHeight: 0,
      isConnected: true,
      offlinemessagesend: [],
    };
    this.bottomSheetRef = React.createRef();
    this.chatListRef = React.createRef();
    this.snapPoints = [1, 300];
  }

  componentWillMount() {
    Socket = io.connect(socketUrl);
  }

  componentDidMount() {
    this.focusListener = this.props?.navigation?.addListener('focus', () => {
      this.setState({ appReady: true });
      let user_id = this.props?.route?.params?.user_id;
      if (user_id) {
        this.setState({ page: 1, chatList: [] });
        this.fetchChatList(user_id);
      }
      this.socketEvents();
    });
    this.unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        this.setState({ isConnected: true });
      } else {
        this.setState({ isConnected: false });
      }
    });
  }

  socketEvents = () => {
    Socket.emit('setup', userdata.id);
    Socket.on('connected', () => {
      console.log('join connected');
      if (this.state.roomId) {
        Socket.emit('join chat', this.state.roomId);
      }
    });
    Socket.on('disconnect', reason => {
      console.log(reason);
    });

    Socket.on('typing', () => {
      console.log('typing');
      this.setState({ isTyping: true });
    });
    Socket.on('stop typing', () => {
      console.log('stop typing');
      this.setState({ isTyping: false });
    });
    Socket.on('user_offline', id => {
      console.log('user_offline', id);
      this.setState({ isOnline: '0' });
    });

    Socket.on('message recieved', newMessageRecieved => {
      const isExist = this.state.chatList?.findIndex(
        item => item.uuid === newMessageRecieved.uuid,
      );
      if (isExist === -1) {
        let data = [newMessageRecieved, ...this.state.chatList];
        this.setState({ isLoading: false, chatList: data });
        this.MarkReadMessage(newMessageRecieved.uuid);
      }
    });
  };

  MarkReadMessage = message_id => {
    let config = {
      url: ApiUrl.markReadMessage,
      method: 'post',
      body: {
        message_id: message_id,
      },
    };
    console.log(config);
    APIRequest(
      config,
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      },
    );
  };

  onTyping = isTyping => {
    if (isTyping) {
      console.log('typing');
      Socket.emit('typing', this.state.roomId);
    } else {
      console.log('stop typing');
      Socket.emit('stop typing', this.state.roomId);
    }
  };

  removeSocket() {
    Socket.emit('makeOffline', userdata.id);
    Socket.disconnect();
    Socket.off('setup');
    Socket.off('connected');
    Socket.off('typing');
    Socket.off('stop typing');
    Socket.off('message recieved');
    Socket.off('disconnect');
    Socket.on('makeOffline');
  }

  componentWillUnmount() {
    this.removeSocket();
    this.focusListener();
    this.unsubscribe();
  }

  onScrollHandler = () => {
    if (this.state.per_page_count === this.state.per_page) {
      this.setState(
        {
          page: this.state.page + 1,
        },
        () => {
          let user_id = this.props?.route?.params?.user_id;

          this.setState({
            loadMore: true,
          });
          this.fetchChatList(user_id);
        },
      );
    }
  };

  fetchChatList = user_id => {

    if (this.state.page > this.state.last_page) {
      return
    }

    this.setState({ isLoading: true });
    let config = {
      url: `${ApiUrl.conversations}/${user_id}?page=${this.state.page}`,
      method: 'get',
    };
    APIRequest(
      config,
      res => {
        if (res.status) {
          let data = res?.conversation?.data;

          if (res.roomId && this.state.page === 1) {
            Socket.emit('join chat', res.roomId);
          }

          const chatData = this.state.chatList.concat(data);
          // this.addDateInChatList(chatData)
          this.setState({
            chatList: chatData,
            roomId: res.roomId,
            last_page: res?.conversation.last_page,
            isOnline: res?.is_online,
            per_page: res?.conversation?.per_page,
            per_page_count: res?.conversation?.data.length,
          });
          // setTimeout(() => {
          //   this.chatListRef?.current?.scrollToEnd({animated: true});
          // }, 2000);
        }
        this.setState({ isLoading: false });
      },
      err => {
        this.setState({ isLoading: false });
      },
    );
  };

  setMessages = res => {
    Socket.emit('new message', {
      ...res.conversation,
      roomId: this.state.roomId,
    });

    const data = this.state.chatList?.filter(
      item => item.uuid !== res.conversation.uuid,
    );

    this.setState({
      isLoading: false,
      file: undefined,
      audioFile: '',
      message: '',
      chatList: [res.conversation, ...data],
    });
  };

  prepareSocketMessageObject = (uuid, message_type) => {
    let date = new Date();
    let userdata = new User().getuserdata();
    
    let message = {
      uuid: uuid,
      from_id: userdata.id,
      to_id: `${this.props?.route?.params?.user_id}`,
      created_at: date,
      // time_zone: timeZone,
      reply_to: null,
      roomId: this.state.roomId,
      message: this.state.message,
      is_archive_chat: 0,
      is_group: 0,
      message_type: message_type,
      sender: {
        id: userdata.id,
        name: userdata.name,
        avatar: userdata.avatar,
      },
    };
    return message;
  };

  sendMessage = async () => {
    if (this.state.message == '') {
      Toast.show({
        type: 'info',
        text1: 'Message Required',
      });
    } else {
      this.onTyping(false);
      // this.setState({isLoading: true});

      let uuid = uuidv4();

      let message = this.prepareSocketMessageObject(uuid, 0);
      let data = [message, ...this.state.chatList];

      if (!this.state.isConnected) {
        try {
          let OfflineMessage = await AsyncStorage.getItem(
            'SINGLE_CHAT_MESSAGE',
          );
          if (OfflineMessage === null) {
            OfflineMessage = [];
          } else {
            OfflineMessage = JSON.parse(OfflineMessage);
          }
          OfflineMessage.push(message);
          await AsyncStorage.setItem(
            'SINGLE_CHAT_MESSAGE',
            JSON.stringify(OfflineMessage),
          );
        } catch (error) {
          console.log(error);
        }

        this.setState({
          isLoading: false,
          file: undefined,
          audioFile: '',
          message: '',
          chatList: data,
        });

        return;
      }

      Socket.emit('new message', message);

      let config = {
        url: ApiUrl.sendMessage,
        method: 'post',
        body: {
          uuid: uuid,
          is_archive_chat: 0,
          to_id: `${this.props?.route?.params?.user_id}`,
          message: this.state.message,
          is_group: 0,
          message_type: 0,
        },
      };

      this.setState({
        isLoading: false,
        file: undefined,
        audioFile: '',
        message: '',
        chatList: data,
      });

      APIRequest(
        config,
        res => {
          // this.setMessages(res);
          console.log(res);
        },
        err => {
          this.setState({ isLoading: false });
          console.log(err);
          Toast.show({
            type: 'error',
            text1: err?.response?.data.message,
          });
        },
      );
    }
  };

  sendFile = async () => {
    if (this.state.file?.fileSize > 14) {
      Toast.show({
        type: 'error',
        text1: 'Size should be less than 14 MB',
      });
      return;
    }
    let formData = new FormData();
    let uuid = uuidv4();
    if (this.state.audioFile != '') {
      formData.append('file', {
        uri: this.state.audioFile,
        ...Platform.select({
          ios: {
            name: 'test.m4a',
            type: 'audio/m4a',
          },
          android: {
            name: 'test.mp3',
            type: 'audio/mp3',
          },
        }),
      });
    } else if (this.state.file.fileType === 'pdf') {
      formData.append('file', this.state.file);
    } else {
      let type = this.state.file.type.split('/');
      formData.append('file', {
        ...this.state.file,
        name: `videos${uuid}.${type[1]}`,
      });
    }

    formData.append('to_id', `${this.props?.route?.params?.user_id}`);
    formData.append('uuid', String(uuid));
    // this.setState({isLoading: true});

    let config = {
      url: ApiUrl.sendFile,
      method: 'post',
      body: formData,
    };

    let message = this.prepareSocketMessageObject(uuid, 20);
    let data = [message, ...this.state.chatList];

    this.setState({
      file: undefined,
      audioFile: '',
      chatList: data,
    });

    APIRequestWithFile1(
      config,
      res => {
        if (res.status) {
          this.setMessages(res);
        }
      },
      err => {
        if (err?.response?.data?.uuid) {
          const data = this.state.chatList?.filter(
            item => item.uuid !== err?.response?.data?.uuid,
          );
          this.setState({
            chatList: data,
          });
        }

        if (err.response.status === 422) {
          let errorMsg = '';
          if (err?.response?.data?.error?.to_id) {
            errorMsg = err?.response?.data?.error?.to_id[0];
          }
          if (err?.response?.data?.error?.file) {
            errorMsg = err?.response?.data?.error?.file[0];
          }
          Toast.show({
            type: 'error',
            text1: errorMsg,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: err?.message,
          });
        }
        // this.setState({isLoading: false});
      },
    );
  };

  // hide Bottom sheet
  setisShowBottomSheet = () => {
    this.setState({ isShowBottomSheet: false });
  };
  // Update file from bottom sheet
  UpdateFile = file => {
    this.setState({ file: file, isShowBottomSheet: false });
  };

  handleOnReportOn = item => {
    Alert.alert('Alert', 'Are you sure you want to report this message?', [
      {
        text: 'NO',
        onPress: () => null,
        style: 'Cancel',
      },
      {
        text: 'YES',
        onPress: () => [this.reportMessage(item)],
      },
    ]);
  };

  reportMessage = item => {
    console.log('reportMessage', item);
    let config = {
      url: ApiUrl.reportMessage,
      method: 'post',
      body: {
        reported_to: item.uuid,
      },
    };
    APIRequest(
      config,
      res => {
        console.log(res);
        Toast.show({
          type: 'success',
          text1: res.alert.message,
        });
      },
      err => {
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
        });
      },
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView>
          <FocusAwareStatusBar
            barStyle={'dark-content'}
            backgroundColor={color.white}
          />
          <Header
            appReady={this.state.appReady}
            isLoading={this.state.isLoading}
            LeftIcon={() => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.goBack();
                  }}
                  style={{
                    height: 34,
                    width: 30,
                    marginLeft: hp(-1),
                    marginRight: hp(-2),
                  }}>
                  <Icon
                    name={'angle-left'}
                    style={{
                      fontSize: 30,
                      color: color.black,
                      marginLeft: hp(1),
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ page: 1 });
                    this.props.navigation.navigate('UserProfile', {
                      data: {
                        ...this.props?.route?.params,
                        name: this.props?.route?.params?.userName,
                      },
                    });
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: wp(3),
                  }}>
                  {this.props?.route?.params?.avatar ? (
                    <Image
                      source={{
                        uri: `${IMAGEURL}/${this.props?.route?.params?.avatar}`,
                      }}
                      style={{
                        marginLeft: wp(2),
                        borderRadius: 120,
                        height: 40,
                        width: 40,
                      }}
                    />
                  ) : (
                    <Image
                      source={IMAGE.chatgirl}
                      style={{
                        marginLeft: wp(2),
                        borderRadius: 120,
                        height: 30,
                        width: 30,
                      }}
                    />
                  )}
                  <View
                    style={{
                      marginLeft: wp(3),
                      marginTop: hp(1.5),
                      width: wp(60),
                    }}>
                    <Text numberOfLines={1} style={styles.heading}>
                      {this.props?.route?.params?.userName}
                    </Text>
                    <Text
                      style={[
                        styles.onlineText,
                        {
                          color:
                            this.state.isOnline == '1'
                              ? 'green'
                              : color.textGray2,
                        },
                      ]}>
                      {this.state.isTyping
                        ? 'Typing...'
                        : this.state.isOnline == '1'
                          ? 'Online'
                          : 'Offline'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            title={null}
          />
        </SafeAreaView>

        <View style={styles.listWrapper}>
          {this.state.isLoading && this.state.page > 1 && (
            <View
              style={{
                position: 'absolute',
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center',
                backgroundColor: color.chatRight,
                padding: 10,
                borderRadius: 10,
                columnGap: 10,
                top: 0,
                zIndex: 1,
              }}>
              <ActivityIndicator size="small" color={color.btnBlue} />
              <Text style={{ fontStyle: 'italic' }}>Please wait...</Text>
            </View>
          )}
          <AudioContextProvider>
            <FlatList
              ref={this.chatListRef}
              data={this.state.chatList}
              keyExtractor={item => item.uuid}
              inverted={true}
              onEndReached={this.onScrollHandler}
              onEndThreshold={1}
              style={styles.flatlist}
              renderItem={({ item, index }) => (
                <ChatItem
                  onImagePress={files => {
                    this.setState({ page: 1 }),
                      this.props.navigation.navigate('ShowImg', {
                        file: files?.file,
                        fileType: files?.fileType,
                      });
                  }}
                  user_id={this.props?.route?.params?.user_id}
                  avatar={this.props?.route?.params?.avatar}
                  item={item}
                  index={index}
                  menu={this.state.menu}
                  reportOn={replyMSG => this.handleOnReportOn(replyMSG)}
                />
              )}
            />

            {this.state.appReady && (
              <BottomView
                message={this.state.message}
                file={this.state.file}
                audioFile={file => this.setState({ audioFile: file })}
                deleteFile={() => this.setState({ file: undefined })}
                sendMessage={
                  this.state.file || this.state.audioFile != ''
                    ? this.sendFile
                    : this.sendMessage
                }
                textChange={v => {
                  this.setState({ message: v });
                  this.onTyping(v != '');
                }}
                inputFocus={() => this.setState({ isShowBottomSheet: false })}
                addPress={() => {
                  Keyboard.dismiss();
                  // this.bottomSheetRef?.current?.expand();
                  this.setState({ isShowBottomSheet: true });
                }}
                emojiSelect={v => {
                  this.setState({ message: `${this.state.message}${v}` });
                }}
                setFile={file => {
                  this.setState({ file: file });
                }}
                isConnected={this.state.isConnected}
              />
            )}
            {/* </View> */}
          </AudioContextProvider>

          <BottomSheetUploadFile
            cancelBtn={{
              color: color.lightGray,
              title: 'Cancel',
              textColor: color.btnBlue,
            }}
            isShowBottomSheet={this.state.isShowBottomSheet}
            setisShowBottomSheet={this.setisShowBottomSheet.bind(this)}>
            <View>
              <View>
                <TouchableOpacity
                  onPress={() =>
                    pickImage(
                      'camera',
                      res => {
                        // file(res);
                        this.UpdateFile(res);
                      },
                      'photo',
                    )
                  }
                  style={BottomSheetUploadFileStyle.cardBlock}>
                  <Image
                    source={IMAGE.camera}
                    style={BottomSheetUploadFileStyle.icon}
                  />
                  <Text style={BottomSheetUploadFileStyle.cardText}>
                    Take Photo
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    pickImage(
                      'image',
                      res => {
                        this.UpdateFile(res);
                      },
                      'photo',
                    )
                  }
                  style={BottomSheetUploadFileStyle.cardBlock}>
                  <Image
                    source={IMAGE.camera}
                    style={BottomSheetUploadFileStyle.icon}
                  />
                  <Text style={BottomSheetUploadFileStyle.cardText}>
                    Select Photo
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    pickImage(
                      'camera',
                      res => {
                        this.UpdateFile(res);
                      },
                      'video',
                    )
                  }
                  style={BottomSheetUploadFileStyle.cardBlock}>
                  <Image
                    source={IMAGE.video}
                    style={BottomSheetUploadFileStyle.icon}
                  />
                  <Text style={BottomSheetUploadFileStyle.cardText}>
                    Take Video
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    pickImage(
                      'image',
                      res => {
                        this.UpdateFile(res);
                      },
                      'video',
                    )
                  }
                  style={BottomSheetUploadFileStyle.cardBlock}>
                  <Image
                    source={IMAGE.video_add}
                    style={BottomSheetUploadFileStyle.icon}
                  />
                  <Text style={BottomSheetUploadFileStyle.cardText}>
                    Select Video
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    pickDocument(res => {
                      this.UpdateFile(res);
                    })
                  }
                  style={BottomSheetUploadFileStyle.cardBlock}>
                  <Image
                    source={IMAGE.note}
                    style={BottomSheetUploadFileStyle.icon}
                  />
                  <Text style={BottomSheetUploadFileStyle.cardText}>
                    Document
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </BottomSheetUploadFile>
        </View>
      </View>
    );
  }
}

export default Chat;

const styles = StyleSheet.create({
  listWrapper: {
    // gap: 10,
    ...Platform.select({
      ios: {
        flex: 1,
        // minHeight: Dimensions.get('window').height - 60
      },
      android: {
        flex: 1,
      },
    }),
  },
  flatlist: {
    flex: 1,
    marginBottom: Platform.OS === 'ios' ? 15 : 15,
  },
  heading: {
    marginTop: -10,
    lineHeight: 20,
    fontSize: 15,
    color: color.black,
    fontFamily: fontFamily.Bold,
  },

  onlineText: {
    fontSize: fontSize.size12,
    color: color.textGray2,
    fontFamily: fontFamily.Regular,
  },
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
});
