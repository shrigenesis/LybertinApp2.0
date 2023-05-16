/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState, useMemo, useRef, memo, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Keyboard,
  Pressable,
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
  ApiUrl,
  IMAGEURL,
  socketUrl,
} from './../../utils/api';
import { BottomView, RenderBottomSheet, ChatItemgroup } from './chatComponent/';
import io from 'socket.io-client';
import { User } from '../../utils/user';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomSheetUploadFile, BottomSheetUploadFileStyle } from '../../component/BottomSheetUploadFile';
import AudioContextProvider, { AudioContext } from '../../context/AudioContext';




const Socket = io.connect(socketUrl);
class GroupChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      isLoading: false,
      message: '',
      groupDetail: {},
      chatList: [],
      file: undefined,
      isTyping: false,
      audioFile: '',
      appReady: false,
      groupId: this.props.route.params.group_id,
      groupType: this.props.route.params.groupType,
      mediaPrivacy: this.props.route.params.mediaPrivacy,
      isAdmin: this.props.route.params.isAdmin,
      is_exit: false,
      roomId: '',
      menu: [],
      isShowBottomSheet: false,
    };
    this.bottomSheetRef = React.createRef();
    this.chatListRef = React.createRef();
    this.snapPoints = [1, 300];
  }


  componentDidMount() {
    this.focusListener = this.props?.navigation?.addListener('focus', () => {
      this.setState({ appReady: true });
      // let group_id = this.props?.route?.params?.group_id;
      // setTimeout(() => {
      let group_id = this.props?.route?.params?.group_id;
      if (group_id) {
        this.setState({
          group_id: group_id,
          chatList: [],
        });
        this.fetchGroupDetail(group_id);
        this.fetchChatList(group_id);
      }
      // }, 300);

      this.socketEvents();
    });
  }

  onScrollHandler = () => {
    this.setState(
      {
        page: this.state.page + 1,
      },
      () => {
        let group_id = this.props?.route?.params?.group_id;
        this.fetchChatList(group_id);
      },
    );
  };
  handleOnReplyOn = (item) => {
    this.setState({ replyOn: item });
  };

  fetchChatList = group_id => {
    let userdata = new User().getuserdata();
    this.setState({ isLoading: true });
    let config = {
      url: `${ApiUrl.groups}/${group_id}/getConversation?page=${this.state.page}`,
      method: 'post',
    };

    APIRequest(
      config,
      res => {
        if (res.status) {
          let data = res?.conversation?.data;

          let chatData = this.state.chatList.concat(data);
          this.setState({
            chatList: chatData,
            roomId: res.roomId,
            is_exit: res?.is_exit,
          });

          if (res.roomId) {
            console.log('join chat', res.roomId);
            Socket.emit('join chat', res.roomId);
          }
        }
        this.setState({ isLoading: false });
      },
      err => {
        this.setState({ isLoading: false });
      },
    );
  };

  socketEvents = () => {
    let userdata = new User().getuserdata();
    Socket.emit('setup', userdata.id);
    Socket.on('connected', () => {
      if (this.state.roomId) {
        Socket.emit('join chat', this.state.roomId);
      }
    });

    Socket.on('typing', () => {
      this.setState({ isTyping: true });
    });
    Socket.on('stop typing', () => {
      this.setState({ isTyping: false });
    });

    Socket.on('message recieved', newMessageRecieved => {
      let data = [newMessageRecieved, ...this.state.chatList];
      this.setState({ isLoading: false, chatList: data });
    });
  };

  componentWillUnmount() {
    this.focusListener();
  }

  fetchGroupDetail = group_id => {
    this.setState({ isLoading: true });
    let config = {
      url: `${ApiUrl.groupDetail}${group_id}`,
      method: 'get',
    };

    APIRequest(
      config,
      res => {
        if (res.status) {
          let data = res?.conversation?.data;

          this.setState({ groupDetail: res?.data });
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
  };

  sendMessage = () => {
    let userdata = new User().getuserdata();

    if (this.state.message == '') {
      Toast.show({
        type: 'info',
        text1: 'Message Required'
      })
    } else {
      // this.setState({ isLoading: true });
      let reply_on = null;
      if (this.state?.replyOn !== undefined) {
        reply_on = {
          name: this.state?.replyOn?.sender?.name,
          message_type: this.state?.replyOn?.message_type,
          message: this.state?.replyOn?.message,
          file_name: this.state?.replyOn?.file_name,
        }
      }

      let config = {
        url: ApiUrl.sendMessage,
        method: 'post',
        body: {
          is_archive_chat: 0,
          to_id: `${this.props?.route?.params?.group_id}`,
          message: this.state.message,
          reply_to: this.state?.replyOn !== undefined ? JSON.stringify(reply_on) : null,
          is_group: 1,
        },
      };

      APIRequest(
        config,
        res => {
          console.log(res);
          this.setState({
            replyOn: undefined
          });
          this.setMessages(res);
        },
        err => {
          console.log(err);
          this.setState({ isLoading: false });
        },
      );
    }
  };

  sendFile = async () => {
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
    } else if (this.state.file.fileType === 'pdf') {
      formData.append('file', this.state.file);
    } else {
      let type = this.state.file.type.split("/")
      const d = new Date();
      let ms = d.getMilliseconds();
      if (this.state.file != '') {
        formData.append('file', {
          uri: this.state.file.uri,
          name: `images${ms}.${type[1]}`,
          type: this.state.file.type
        })
      }
      else {
        Toast.show({
          type: 'info',
          text1: 'Media Required'
        })
        return;
      }

      // formData.append('file', this.state.file);
    }

    this.setState({ isLoading: true });
    formData.append('to_id', `${this.props?.route?.params?.group_id}`);
    formData.append('is_group', 1);

    console.log(formData, "formData")

    let config = {
      url: ApiUrl.sendFile,
      method: 'post',
      body: formData,
    };
    this.setState({ file: undefined })
    APIRequestWithFile(
      config,
      res => {
        if (res.status) {
          this.setMessages(res);
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
    const { group_type, privacy, media_privacy, name, description } =
      this.state?.groupDetail;
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
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
                    this.props.navigation.navigate('groupInfo', {
                      groupId: this.state.groupId,
                      privacy: this.props.route.params.privacy,
                      isAdmin: this.state.isAdmin,
                    });
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: wp(3),
                  }}>
                  <Image
                    source={{
                      uri: `${IMAGEURL}/${this.state?.groupDetail?.photo_url}`,
                    }}
                    style={{
                      marginLeft: wp(2),
                      borderRadius: 120,
                      height: 40,
                      width: 40,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('groupInfo', {
                        groupId: this.state.groupId,
                        privacy: this.props.route.params.privacy,
                        isAdmin: this.state.isAdmin
                      });
                    }}
                    style={{
                      width: wp(70),
                      marginLeft: wp(3),
                      marginTop: hp(1),
                    }}>
                    <Text style={styles.heading}>{name}</Text>
                    <Text style={styles.onlineText}>{description}</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
            )}
            title={null}
          />
          {console.log(this.state.chatList, "this.state.chatList")}
          <View style={{ flex: 1, paddingBottom: 0 }}>
            <AudioContextProvider>
              <FlatList
                ref={this.chatListRef}
                inverted={true}
                // onContentSizeChange={() => chatListRef.current.scrollToEnd({ animated: true })}
                data={this.state.chatList}
                // keyExtractor={item => String(item.id)}
                onEndReached={this.onScrollHandler}
                onEndThreshold={1}
                renderItem={({ item, index }) => (
                  <View>
                    {/* <Text>{item.sender.id}</Text> */}

                    <ChatItemgroup
                      onImagePress={files =>
                        this.props.navigation.navigate('ShowImg', {
                          file: files?.file,
                          fileType: files?.fileType,
                        })
                      }
                      user_id={this.props?.route?.params?.user_id}
                      // avatar={this.props?.route?.params?.avatar}
                      avatar={item?.sender?.avatar}
                      item={item}
                      index={index}
                      menu={this.state.menu}
                      replyOn={(replyMSG) => this.handleOnReplyOn(replyMSG)}
                    />
                  </View>
                )}
              />
              {this.state.is_exit === false ? (
                <>
                  {(this.state.groupType == 2 && this.state.isAdmin == true) ||
                    this.state.groupType == 1 ? (
                    <BottomView
                      // group_type={group_type}
                      pickCamera={
                        (this.state.mediaPrivacy == 2 &&
                          this.state.isAdmin == true) ||
                        this.state.mediaPrivacy == 1
                      }
                      // media_privacy={media_privacy}
                      message={this.state.message}
                      replyOn={this.state.replyOn !== undefined ? this.state.replyOn : null}
                      removeReplyBox={() => this.setState({ replyOn: null })}
                      file={this.state.file}
                      audioFile={file => this.setState({ audioFile: file })}
                      deleteFile={() => this.setState({ file: undefined })}
                      sendMessage={
                        this.state.file || this.state.audioFile != ''
                          ? this.sendFile
                          : this.sendMessage
                      }
                      textChange={v => this.setState({ message: v })}
                      inputFocus={() => this.bottomSheetRef?.current?.close()}
                      addPress={() => {
                        (this.state.groupType == 2 &&
                          this.state.isAdmin == true) ||
                          (this.state.groupType == 1 &&
                            this.state.mediaPrivacy == 2 &&
                            this.state.isAdmin == true) ||
                          (this.state.groupType == 1 &&
                            this.state.mediaPrivacy == 1)
                          ? (
                            this.setState({ isShowBottomSheet: true })
                           
                  )
                  : alert(
                  'You do not have access to send media in this group.',
                  );
                  Keyboard.dismiss();
                      }}
                  emojiSelect={v => {
                    this.setState({ message: `${this.state.message}${v}` });
                  }}
                  setFile={file => {
                    this.setState({ file: file });
                  }}
                    />
                  ) : (
                  <View style={{ height: 60 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        textAlign: 'center',
                        marginLeft: 1,
                        marginTop: 3,
                      }}>
                      You can't send messages to this group.
                    </Text>
                  </View>
                  )}
                </>
              ) : (
                <View style={{ height: 60 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      textAlign: 'center',
                      marginLeft: 1,
                      marginTop: 1,
                    }}>
                    You can't send messages to this group because you're no longer
                    a participant.
                  </Text>
                </View>
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
                console.log(file, "file")
                this.setState({ file: file });
                this.bottomSheetRef?.current?.close();
              }}
              sendFile={this.sendFile}
              snapPoints={this.snapPoints}
              bottomSheetRef={this.bottomSheetRef}
            /> */}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

export default GroupChat;

const styles = StyleSheet.create({
  heading: {
    marginTop: -10,
    lineHeight: 20,
    fontSize: 15,
    color: color.black,
    fontFamily: fontFamily.Bold,
  },

  onlineText: {
    fontSize: 10,
    color: color.textGray2,
    fontFamily: fontFamily.Regular,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
