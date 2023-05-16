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
  BackHandler,
  Alert,
  Platform,
} from 'react-native';
import { Header, Loader, pickDocument, pickImage } from './../../component/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { IMAGE, color, fontFamily } from '../../constant/';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  APIRequest,
  APIRequestWithFile,
  APIRequestWithFile1,
  ApiUrl,
  IMAGEURL,
  socketUrl,
} from './../../utils/api';
import { useIsFocused } from '@react-navigation/native';
import { BottomView, RenderBottomSheet, ChatItem } from './chatComponent/';
import io from 'socket.io-client';
import { User } from '../../utils/user';
import Toast from 'react-native-toast-message';
import { Divider } from 'react-native-elements';
import {
  BottomSheetUploadFile,
  BottomSheetUploadFileStyle,
} from '../../component/BottomSheetUploadFile';
import AudioContextProvider from '../../context/AudioContext';

const Socket = io.connect(socketUrl);

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
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
    };
    this.bottomSheetRef = React.createRef();
    this.chatListRef = React.createRef();
    this.snapPoints = [1, 300];
  }

  componentDidMount() {
    this.focusListener = this.props?.navigation?.addListener('focus', () => {
      this.setState({ appReady: true });

      // setTimeout(() => {
      let user_id = this.props?.route?.params?.user_id;
      if (user_id) {
        this.setState({ chatList: [] });
        this.fetchChatList(user_id);
      }
      // }, 300);

      this.socketEvents();
    });
  }

  socketEvents = () => {
    let userdata = new User().getuserdata();

    Socket.emit('setup', userdata.id);
    Socket.on('connected', () => {
      console.log('join connected');
      if (this.state.roomId) {
        Socket.emit('join chat', this.state.roomId);
      }
    });

    Socket.on('typing', () => {
      console.log('typing');
      this.setState({ isTyping: true });
    });
    Socket.on('stop typing', () => {
      console.log('stop typing');
      this.setState({ isTyping: false });
    });

    Socket.on('message recieved', newMessageRecieved => {
      console.log('message recieved');
      // let data = [...this.state.chatList];
      // data.push(newMessageRecieved);
      let data = [newMessageRecieved, ...this.state.chatList];
      this.setState({ isLoading: false, chatList: data });
      // this.chatListRef?.current?.scrollToEnd({animated: true});
    });
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
    Socket.off('setup');
    Socket.off('connected');
    Socket.off('typing');
    Socket.off('stop typing');
    Socket.off('message recieved');
  }

  componentWillUnmount() {
    this.removeSocket();
    this.focusListener();
  }

  onScrollHandler = () => {
    if (this.state.per_page_count === this.state.per_page) {
      this.setState(
        {
          page: this.state.page + 1,
        },
        () => {
          let user_id = this.props?.route?.params?.user_id;
          this.fetchChatList(user_id);
        },
      );
    }
  };

  // addDateInChatList = (items) => {
  //   const modifieditems = [];
  //   // loop through items array
  //   for (let i = 0; i < items.length; i++) {
  //     const currentItem = items[i];
  //     // check if current date already exists in modifieditems array
  //     const currentDateIndex = modifieditems.findIndex(item => item.created_time_ago === currentItem.created_time_ago);

  //     if (currentDateIndex === -1) {
  //       // if current date doesn't exist, add a label object and then add the current item
  //       modifieditems.push(currentItem);
  //       if (!currentItem.created_time_ago.includes("hrs")) {
  //         modifieditems.push({ type: 'agoDate', created_time_ago: currentItem.created_time_ago });
  //       }
  //     } else {
  //       // if current date already exists, just add the current item
  //       modifieditems.splice(currentDateIndex + 1, 0, currentItem);
  //     }
  //   }
  //   this.setState({
  //     chatList: modifieditems
  //   })
  // }

  fetchChatList = user_id => {
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
          console.log(res.roomId, '-----------------------');
          if (res.roomId) {
            Socket.emit('join chat', res.roomId);
          }
          let chatData = this.state.chatList.concat(data);
          // this.addDateInChatList(chatData)
          this.setState({
            chatList: chatData,
            roomId: res.roomId,
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

    let data = [res.conversation, ...this.state.chatList];

    this.setState({
      isLoading: false,
      file: undefined,
      audioFile: '',
      message: '',
      chatList: data,
    });

    // setTimeout(() => {
    //   this.chatListRef?.current?.scrollToEnd({animated: true});
    // }, 1000);
  };

  sendMessage = () => {
    if (this.state.message == '') {
      Toast.show({
        type: 'info',
        text1: 'Message Required',
      });
    } else {
      this.onTyping(false);
      this.setState({ isLoading: true });
      let config = {
        url: ApiUrl.sendMessage,
        method: 'post',
        body: {
          is_archive_chat: 0,
          to_id: `${this.props?.route?.params?.user_id}`,
          message: this.state.message,
          is_group: 0,
        },
      };

      APIRequest(
        config,
        res => {
          this.setMessages(res);
        },
        err => {
          this.setState({ isLoading: false });
          Toast.show({
            type: 'error',
            text1: err?.response?.data.message,
          });
        },
      );
    }
  };

  sendFile = async () => {
    console.log('sendFile::');
    let formData = new FormData();

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
          }
        })

      });
      console.log('sendFile  this.state.audioFile', this.state.audioFile);
    } else if (this.state.file.fileType === 'pdf') {
      formData.append('file', this.state.file);
    } else {
      let type = this.state.file.type.split('/');
      const d = new Date();
      let ms = d.getMilliseconds();
      formData.append('file', {
        ...this.state.file,
        name: `videos${ms}.${type[1]}`,
      });
      console.log('sendFile  File', this.state.file);
    }

    this.setState({ isLoading: true });
    formData.append('to_id', `${this.props?.route?.params?.user_id}`);

    let config = {
      url: ApiUrl.sendFile,
      method: 'post',
      body: formData,
    };
    console.log('sendFile  File', this.state.file);
    console.log('after config', config, formData);
    this.setState({ file: undefined });
    APIRequestWithFile1(
      config,
      res => {
        if (res.status) {
          this.setMessages(res);
          console.log('sendFile', res); 
        }
      },
      err => {
        if (err.response.status === 422) {
          let errorMsg = ''
          if (err?.response?.data?.error?.to_id) {
            errorMsg = err?.response?.data?.error?.to_id[0]
          }
          if (err?.response?.data?.error?.file) {
            errorMsg = err?.response?.data?.error?.file[0]
          }
          Toast.show({
            type: 'error',
            text1: errorMsg
          });
        } else {
          Toast.show({
            type: 'error',
            text1: err?.message
          });
        }
        this.setState({ isLoading: false });
        console.log('sendFile err', err);
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

  render() {
    console.log('=======================', this.state.file);
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View>
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
          </View>

          {/* <View
            style={{
              height: hp(100),
              width: wp(100),
              backgroundColor:
                color.black,
              zIndex: 99999999,
              marginTop: -50,
              display: !this.state.file===undefined? 'block':
            }}
          >
            <TouchableOpacity
              onPress={() => this.setState({ file: undefined })}
              style={{
                position: 'absolute', left: 10, top: 10
              }}>
              <Image
                source={IMAGE.redCancel}
                style={{
                  color: color.red,
                  height: 30,
                  width: 30,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.deleteFile}
              style={{
                position: 'absolute', right: 20, bottom: 40
              }}>
              <Image
                source={IMAGE.send}
                style={{
                  color: color.red,
                  height: 30,
                  width: 30,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
            <View>
              {this.state.file?.fileType == 'pdf' ? (
                <Image
                  source={IMAGE.pdf}
                  style={{ resizeMode: 'contain', height: 100, width: 100 }}
                />
              ) : this.state.file?.fileType == 'photo' || this.state.file?.fileType == 'image' ? (
                <Image
                  source={{ uri: this.state.file.uri }}
                  style={{ resizeMode: 'contain', height: hp(100), width: wp(90) }}
                />
              ) : (
                <Image
                  source={IMAGE.gallery}
                  style={{ resizeMode: 'contain', height: 100, width: 1000 }}
                />
              )}
            </View>
          </View> */}

          <View style={{ flex: 1 }}>
            <AudioContextProvider>
              <FlatList
                ref={this.chatListRef}
                data={this.state.chatList}
                keyExtractor={item => String(item.id)}
                inverted={true}
                onEndReached={this.onScrollHandler}
                onEndThreshold={1}
                renderItem={({ item, index }) => (
                  <ChatItem
                    onImagePress={files =>
                      this.props.navigation.navigate('ShowImg', {
                        file: files?.file,
                        fileType: files?.fileType,
                      })
                    }
                    user_id={this.props?.route?.params?.user_id}
                    avatar={this.props?.route?.params?.avatar}
                    item={item}
                    index={index}
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
                  inputFocus={() => this.bottomSheetRef?.current?.close()}
                  addPress={() => {
                    console.log('addPress');
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
                />
              )}
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
                {/* <View style={{ alignContent: 'center', paddingVertical: hp(1), marginBottom: 10 }}>
                  <Text style={BottomSheetUploadFileStyle.roportHeading}>Add Story</Text>
                  <Text style={BottomSheetUploadFileStyle.subHeading}>Post Photo Video To Your Story</Text>
                </View> */}
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

            {/* <RenderBottomSheet
              file={file => {
                this.setState({ file: file });
                this.bottomSheetRef?.current?.close();
              }}
              sendFile={this.sendFile}
              snapPoints={this.snapPoints}
              bottomSheetRef={this.bottomSheetRef}
            /> */}
            {/* <Loader isLoading={this.state.isLoading} type="dots" /> */}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

export default Chat;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heading: {
    marginTop: -10,
    lineHeight: 20,
    fontSize: 15,
    color: color.black,
    fontFamily: fontFamily.Bold,
  },

  onlineText: {
    fontSize: 12,
    color: color.textGray2,
    fontFamily: fontFamily.Regular,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
