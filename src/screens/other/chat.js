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
} from 'react-native';
import { Header } from './../../component/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { IMAGE, color, fontFamily } from '../../constant/';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  APIRequest,
  APIRequestWithFile,
  ApiUrl,
  IMAGEURL,
} from './../../utils/api';
import { useIsFocused } from '@react-navigation/native';
import { BottomView, RenderBottomSheet, ChatItem } from './chatComponent/';
import io from 'socket.io-client';
import { User } from '../../utils/user';
import Toast from 'react-native-toast-message';

import { Divider } from 'react-native-elements';

// const Socket = io.connect('https://nodejs.shrigenesis.com/');
const Socket = io.connect('http://devdemo.shrigenesis.com:3011');

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
      per_page: 0
    };
    this.bottomSheetRef = React.createRef();
    this.chatListRef = React.createRef();
    this.snapPoints = [1, 300];
  }

  componentDidMount() {
    this.focusListener = this.props?.navigation?.addListener('focus', () => {
      this.setState({ appReady: true });

      setTimeout(() => {
      let user_id = this.props?.route?.params?.user_id;
      if (user_id) {
        this.fetchChatList(user_id);
      }
      }, 300);

      this.socketEvents();
    });
  }

  socketEvents = () => {
    let userdata = new User().getuserdata();
    console.log(Socket);
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
      Socket.emit('typing', this.state.roomId);
    } else {
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
          if (res.roomId) {
            this.socketEvents();

            // Socket.emit('join chat', res.roomId);
          }
          let chatData = this.state.chatList.concat(data);

          this.setState({
            chatList: chatData,
            roomId: res.roomId,
            isOnline: res?.is_online,
            per_page: res?.conversation?.per_page,
            per_page_count: res?.conversation?.data.length
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
        text1: 'Message Required'
      })
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
            text1: err?.response?.data.message
          })
        },
      );
    }
  };

  sendFile = async () => {
    console.log('sendFile');
    let formData = new FormData();

    if (this.state.audioFile != '') {
      formData.append('file', {
        uri: this.state.audioFile,
        name: 'test.mp3',
        type: 'audio/mp3',
      });
      console.log('sendFile  this.state.audioFile', this.state.audioFile);
    } else {
      formData.append('file', this.state.file);
      console.log('sendFile  File', this.state.file);
    }

    this.setState({ isLoading: true });
    formData.append('to_id', `${this.props?.route?.params?.user_id}`);

    let config = {
      url: ApiUrl.sendFile,
      method: 'post',
      body: formData,
    };
    console.log('after config', formData);
    APIRequestWithFile(
      config,
      res => {
        if (res.status) {
          this.setMessages(res);
          console.log('sendFile', res);
        }
      },
      err => {
        this.setState({ isLoading: false });
        console.log('sendFile err', err);
      },
    );
  };
  render() {
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

                    <View style={{ marginLeft: wp(3), marginTop: hp(1.5) }}>
                      <Text numberOfLines={1} style={styles.heading} >
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

          <View style={{ flex: 1 }}>
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
                  this.bottomSheetRef?.current?.expand();
                }}
                emojiSelect={v => {
                  this.setState({ message: `${this.state.message}${v}` });
                }}
                setFile={file => {
                  this.setState({ file: file });
                }}
              />
            )}
            <RenderBottomSheet
              file={file => {
                this.setState({ file: file });
                this.bottomSheetRef?.current?.close();
              }}
              sendFile={this.sendFile}
              snapPoints={this.snapPoints}
              bottomSheetRef={this.bottomSheetRef}
            />
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
