/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {
  useState,
  useMemo,
  useRef,
  memo,
  useEffect,
  useContext,
} from 'react';
import ReactNative, {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Keyboard,
  Pressable,
  Platform,
  ActivityIndicator,
  Alert,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import { Header, Loader, pickDocument, pickImage } from './../../component/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { IMAGE, color, fontFamily, fontSize } from '../../constant/';
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
import {
  BottomSheetUploadFile,
  BottomSheetUploadFileStyle,
} from '../../component/BottomSheetUploadFile';
import AudioContextProvider, { AudioContext } from '../../context/AudioContext';
import FocusAwareStatusBar from '../../utils/FocusAwareStatusBar';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomViewNew } from './chatComponent/bottomViewNew';

// const Socket = io.connect(socketUrl);
var Socket;
const userdata = new User().getuserdata();
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
      bottomViewHeight: 0,
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
      console.log('componentDidMount');

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
    this.unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        this.setState({ isConnected: true });
      } else {
        this.setState({ isConnected: false });
      }
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
  handleOnReplyOn = item => {
    this.setState({ replyOn: item });
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

    Socket.on('disconnect', reason => {
      console.log(reason);
      if (reason) {
        this.fetchChatList();
      }
    });

    Socket.on('typing', () => {
      this.setState({ isTyping: true });
    });
    Socket.on('stop typing', () => {
      this.setState({ isTyping: false });
    });

    Socket.on('message recieved', newMessageRecieved => {
      const isExist = this.state.chatList?.findIndex(
        item => item.uuid === newMessageRecieved.uuid,
      );
      if (isExist === -1) {
        const data = [newMessageRecieved, ...this.state.chatList];
        this.setState({
          isLoading: false,
          chatList: data
        });
        this.GroupMessageReadMark(
          this.props?.route?.params?.group_id,
          newMessageRecieved.uuid,
        );
        return;
      }
    });
  };

  componentWillUnmount() {
    this.removeSocket();
    this.focusListener();
    this.unsubscribe();
  }
  GroupMessageReadMark = (group_id, message_id) => {
    let config = {
      url: ApiUrl.groupReadMark,
      method: 'post',
      body: {
        group_id: group_id,
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

  removeSocket() {
    Socket.disconnect();
    Socket.off('setup');
    Socket.off('connected');
    Socket.off('typing');
    Socket.off('stop typing');
    Socket.off('message recieved');
    Socket.off('disconnect');
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

  setMessages = (res, type) => {
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

  prepareSocketMessageObject = (uuid, message_type, reply_on = null) => {
    let date = new Date();
    // let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let message = {
      uuid: uuid,
      from_id: userdata.id,
      to_id: `${this.props?.route?.params?.group_id}`,
      created_at: date,
      roomId: this.state.roomId,
      message: this.state.message,
      is_archive_chat: 0,
      message_type: message_type,
      reply_to: null,
      is_group: 1,
      sender: {
        id: userdata.id,
        name: userdata.name,
        avatar: userdata.avatar,
      },
      reply_to: reply_on ? JSON.stringify(reply_on) : null,
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
      // this.setState({ isLoading: true });
      let reply_on = null;
      if (this.state?.replyOn !== undefined) {
        reply_on = {
          name: this.state?.replyOn?.sender?.name,
          message_type: this.state?.replyOn?.message_type,
          message: this.state?.replyOn?.message,
          file_name: this.state?.replyOn?.file_name,
        };
      }

      let uuid = uuidv4();

      let message = this.prepareSocketMessageObject(uuid, 0, reply_on);

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
          to_id: `${this.props?.route?.params?.group_id}`,
          message: this.state.message,
          reply_to:
            reply_on != null ? JSON.stringify(reply_on) : null,
          is_group: 1,
        },
      };

      this.setState({
        isLoading: false,
        file: undefined,
        replyOn: undefined,
        audioFile: '',
        message: '',
        chatList: data,
      });

      APIRequest(
        config,
        res => {
          // this.setMessages(res, 'message');
        },
        err => {
          console.log(err);
          this.setState({ isLoading: false });
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

    let uuid = uuidv4();
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
          },
        }),
      });
    } else if (this.state.file.fileType === 'pdf') {
      formData.append('file', this.state.file);
    } else {
      let type = this.state.file.type.split('/');
      if (this.state.file != '') {
        formData.append('file', {
          uri: this.state.file.uri,
          name: `images${uuid}.${type[1]}`,
          type: this.state.file.type,
        });
      } else {
        Toast.show({
          type: 'info',
          text1: 'Media Required',
        });
        return;
      }

      // formData.append('file', this.state.file);
    }

    // this.setState({isLoading: true});
    formData.append('to_id', `${this.props?.route?.params?.group_id}`);
    formData.append('is_group', 1);
    formData.append('uuid', String(uuid));

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

    APIRequestWithFile(
      config,
      res => {
        if (res.status) {
          this.setMessages(res);
        }
      },
      err => {
        if (err.response.status === 422) {
          let errorMsg = '';
          if (err?.response?.data?.error?.to_id) {
            errorMsg = err?.response?.data?.error?.to_id[0];
          }
          if (err?.response?.data?.error?.file) {
            errorMsg = err?.response?.data?.error?.file[0];
            // if (err?.response?.data?.uniqueId) {
            //   const data = this.state.progressFile?.filter((item, i) => item.uniqueId != err?.response?.data?.uniqueId)
            //   this.setState({ progressFile: data })
            // }
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

  updateBottomViewHeight(event) {
    let { height } = event.nativeEvent.layout;
    if (this.state.bottomViewHeight !== height) {
      this.setState({ bottomViewHeight: height });
    }
  }

  render() {
    const { group_type, privacy, media_privacy, name, description } =
      this.state?.groupDetail;

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
                      this.setState({ page: 1 });
                      this.props.navigation.navigate('groupInfo', {
                        groupId: this.state.groupId,
                        privacy: this.props.route.params.privacy,
                        isAdmin: this.state.isAdmin,
                      });
                    }}
                    style={{
                      width: wp(70),
                      marginLeft: wp(3),
                      marginTop: hp(1),
                    }}>
                    <Text numberOfLines={1} style={styles.heading}>
                      {name}
                    </Text>
                    <Text numberOfLines={1} style={styles.onlineText}>
                      {description}
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
            )}
            title={null}
          />
        </SafeAreaView>
        <View
          style={{
            // gap: 10,
            ...Platform.select({
              ios: {
                flex: 1,
                minHeight:
                  this.state.replyOn != undefined
                    ?? Dimensions.get('window').height - 80
              },
              android: {
                flex: 1,
              },
            }),
          }}>
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
              inverted={true}
              // onContentSizeChange={() => chatListRef.current.scrollToEnd({ animated: true })}
              data={this.state.chatList}
              keyExtractor={item => item.uuid}
              onEndReached={this.onScrollHandler}
              onEndThreshold={1}
              style={{
                flex: 1,
                marginBottom: Platform.OS === 'ios' ? 15 : 15,
              }}
              renderItem={({ item, index }) => (
                <ChatItemgroup
                  onImagePress={files => {
                    this.setState({ page: 1 });
                    this.props.navigation.navigate('ShowImg', {
                      file: files?.file,
                      fileType: files?.fileType,
                    })
                  }
                  }
                  user_id={this.props?.route?.params?.user_id}
                  // avatar={this.props?.route?.params?.avatar}
                  avatar={item?.sender?.avatar}
                  item={item}
                  index={index}
                  menu={this.state.menu}
                  replyOn={replyMSG => this.handleOnReplyOn(replyMSG)}
                  reportOn={replyMSG => this.handleOnReportOn(replyMSG)}
                />
              )}
            />

            {this.state.is_exit === false ? (
              <>
                {(this.state.groupType == 2 && this.state.isAdmin == true) ||
                  this.state.groupType == 1 ? (
                  <BottomViewNew
                    // group_type={group_type}
                    pickCamera={
                      (this.state.mediaPrivacy == 2 &&
                        this.state.isAdmin == true) ||
                      this.state.mediaPrivacy == 1
                    }
                    media_privacy={media_privacy}
                    message={this.state.message}
                    replyOn={
                      this.state.replyOn !== undefined
                        ? this.state.replyOn
                        : null
                    }
                    removeReplyBox={() => this.setState({ replyOn: undefined })}
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
                        ? this.setState({ isShowBottomSheet: true })
                        : Toast.show({
                          type: 'error',
                          text1: 'You do not have access to send media in this group.',
                        });;
                      Keyboard.dismiss();
                    }}
                    emojiSelect={v => {
                      this.setState({ message: `${this.state.message}${v}` });
                    }}
                    isConnected={this.state.isConnected}
                    setFile={file => {
                      this.setState({ file: file });
                    }}
                    updateBottomViewHeight={this.updateBottomViewHeight.bind(
                      this,
                    )}
                  />
                ) : (
                  <View style={styles.noLongerMemeberBox}>
                    <Image
                      source={IMAGE.exclamation}
                      style={styles.noLongerMemeberIcon}
                    />
                    <Text style={styles.noLongerMemeberText}>
                      You can't send messages to this group.
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <View style={styles.noLongerMemeberBox}>
                <Image
                  source={IMAGE.exclamation}
                  style={styles.noLongerMemeberIcon}
                />
                <Text style={styles.noLongerMemeberText}>
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
    fontSize: fontSize.size12,
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
  noLongerMemeberBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 30 : 0,
    paddingHorizontal: 30,
    paddingVertical: 20,
    gap: 20,
    backgroundColor: color.lightGray,
    // borderTopColor: color.lightGray,
    // borderTopWidth: 1
  },
  noLongerMemeberIcon: {
    resizeMode: 'contain',
    height: 24,
    width: 24,
  },
  noLongerMemeberText: {
    fontSize: fontSize.size13,
    fontFamily: fontFamily.Medium,
    color: color.color,
  },
});
