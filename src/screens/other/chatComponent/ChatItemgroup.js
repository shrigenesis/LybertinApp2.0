/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useRef, useContext, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {IMAGE, color, fontFamily, fontSize} from '../../../constant/';
import moment from 'moment';
import SoundPlayer from './../../../component/soundPlayer';
import {IMAGEURL} from '../../../utils/api';
import Video from 'react-native-video';
import Slider from 'react-native-slider';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu'; //
import {AudioContext} from '../../../context/AudioContext';
import {ActivityIndicator} from 'react-native';

const getTime = time => {
  if (time) {
    return moment(time).format('DD, MMM HH:mm');
  }
};

const _getStyleSelector = (item, direction) => {
  switch (item.message_type) {
    case 0:
      return direction === 'left'
        ? styles.textWrapper
        : styles.textWrapperRight; //
    case 1:
      return direction === 'left'
        ? styles.imageWrapper
        : styles.imageWrapperRight; //
    case 2:
      return direction === 'left' ? styles.pdfWrapper : styles.pdfWrapperRight; //
    case 3:
      return direction === 'left' ? styles.pdfWrapper : styles.pdfWrapperRight; //
    case 4:
      return direction === 'left'
        ? styles.voiceWrapper
        : styles.voiceWrapperRight; //
    case 5:
      return direction === 'left'
        ? styles.videoWrapper
        : styles.videoWrapperRight; //
    case 6:
      return direction === 'left'
        ? styles.youtubeWrapper
        : styles.youtubeWrapperRight; //
    case 7:
      return direction === 'left'
        ? styles.mediaTextWrapper
        : styles.mediaTextWrapperRight; //
    case 8:
      return direction === 'left' ? styles.xlsWrapper : styles.xlsWrapperRight; //
    case 9:
      return direction === 'left' ? styles.badgeWrapper : styles.badgeWrapper; //
    case 10:
      return direction === 'left' ? styles.zipWrapper : styles.zipWrapperRight; //
    case 11:
      return direction === 'left' ? styles.rarWrapper : styles.rarWrapperRight; //
    case 20:
      return direction === 'left' ? '' : styles.activityLoaderWrapper; //uploading
  }
};

const _renderMessage = (item, style, videoRef, direction) => {
  const audio = useContext(AudioContext);

  const Audio = () => {
    if (`${IMAGEURL}/${item.file_name}` === audio?.audio) {
      return (
        <TouchableOpacity onPress={() => console.log('audio')}>
          <SoundPlayer
            forChat={true}
            recordingFile={`${IMAGEURL}/${item.file_name}`}
          />
        </TouchableOpacity>
      );
    } else {
      return (
        // <TouchableOpacity
        //   disabled={audio?.isdisabled}
        //   activeOpacity={1}
        //   onPress={() => audio?.setaudio(`${IMAGEURL}/${item.file_name}`)}>
        <View
          style={{
            // backgroundColor: color.borderGray,
            alignItems: 'center',
            marginTop: hp(2),
            height: hp(4),
            flexDirection: 'row',
            paddingRight: wp(5),
            marginHorizontal: wp(2),
            padding: 10,
          }}>
          <TouchableOpacity
            onPress={() => audio?.setaudio(`${IMAGEURL}/${item.file_name}`)}
            style={styles.playpause}>
            <Image source={IMAGE.playFill} style={{width: 40, height: 40}} />
          </TouchableOpacity>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Slider
              style={{width: wp(28), marginLeft: wp(3)}}
              trackStyle={styles.track}
              thumbStyle={styles.thumb}
              minimumTrackTintColor="#681F84"
              thumbTouchSize={{width: 50, height: 40}}
              minimumValue={0}
              value={0}
              maximumValue={10}
              disabled={true}
            />
          </View>
        </View>
        // </TouchableOpacity>
      );
    }
  };

  switch (item.message_type) {
    case 0:
      return (
        <>
          {direction === 'left' && (
            <Text style={styles.senderNameTextType}>{item.sender.name}</Text>
          )}
          <Text style={styles.getMessage}>{item.message}</Text>
          <Text style={styles.leftChatTime}>{getTime(item.created_at)}</Text>
        </>
      ); //text
    case 1:
      return (
        <>
          {direction === 'left' && (
            <View style={styles.senderNameLeft}>
              <Text style={styles.senderNameLeftText}>{item.sender.name}</Text>
            </View>
          )}
          <View style={styles.imageOverlayWrapper}>
            <View style={styles.imageOverlay}></View>

            <Image
              source={{uri: `${IMAGEURL}/${item?.file_name}`}}
              style={styles.image}
            />
            <Text style={[styles.rightChatTime, styles.imageTime]}>
              {getTime(item.created_at)}
            </Text>
          </View>
        </>
      ); //IMAGE
    case 2:
      return (
        <View>
          {direction === 'left' && (
            <Text style={styles.generalSenderText}>{item.sender.name}</Text>
          )}

          <View style={styles.flexboxImage}>
            <Image source={IMAGE.pdf} style={styles.Pdf} />
            <Text style={styles.PdfName}>{item.file_original_name}</Text>
          </View>
          {/* <Image source={IMAGE.pdf} style={styles.pdf} /> */}
          <Text style={styles.leftChatTime}>{getTime(item.created_at)}</Text>
        </View>
      ); //PDF
    case 3:
      return (
        <>
          {direction === 'left' && (
            <Text style={{color: color.btnBlue}}>{item.sender.name}</Text>
          )}
          <View>
            <Image source={IMAGE.file} style={styles.file} />
            <Text style={styles.leftChatTime}>{getTime(item.created_at)}</Text>
          </View>
        </>
      );

    case 4:
      return (
        <View>
          {direction === 'left' && (
            <Text style={[styles.generalSenderText, {paddingBottom: 0}]}>
              {item.sender.name}
            </Text>
          )}
          {Audio()}

          {/* <SoundPlayer
            forChat={true}
            recordingFile={`${IMAGEURL}/${item.file_name}`}
          /> */}
          <Text style={styles.leftChatTime}>{getTime(item.created_at)}</Text>
        </View>
      ); //VOICE
    case 5:
      return (
        <>
          {direction === 'left' && (
            <View style={styles.senderNameLeft}>
              <Text style={styles.senderNameLeftText}>{item.sender.name}</Text>
            </View>
          )}
          <View style={styles.imageOverlayWrapper}>
            <View style={styles.imageOverlay}></View>
            <Video
              ref={videoRef}
              onLoad={() => {
                videoRef?.current?.seek(3);
                videoRef?.current?.setNativeProps({
                  paused: true,
                });
              }}
              paused={true}
              source={{uri: `${IMAGEURL}/${item?.file_name}`}}
              resizeMode={'cover'}
              style={styles.video}
            />
            <Image source={IMAGE.PlayBtn} style={styles.playBtnIcon} />
            <Text style={[styles.leftChatTime, styles.imageTime]}>
              {getTime(item.created_at)}
            </Text>
          </View>
        </>
      ); //VIDEO
    case 6:
      return <Image source={IMAGE.pdf} style={styles.file} />; //YOUTUBE_URL
    case 7:
      return <Image source={IMAGE.file} style={styles.file} />; //MEDIA_TXT
    case 8:
      return <Image source={IMAGE.excel} style={styles.file} />; //XLS
    case 9:
      return (
        <>
          <Text style={styles.centerChatTime}>{getTime(item.created_at)}</Text>
          <View style={styles.badgeTextWrapper}>
            <Text style={styles.badges}>{item.message}</Text>
          </View>
        </>
      ); //MESSAGE_TYPE_BADGES
    case 10:
      return <Image source={IMAGE.zip_file} style={styles.file} />; //ZIP
    case 11:
      return <Image source={IMAGE.zip_file} style={styles.file} />; //RAR
    case 20:
      return (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            alignSelf: 'flex-end',
            backgroundColor: color.chatRight,
            padding: 10,
            borderRadius: 10,
            columnGap: 10,
          }}>
          <ActivityIndicator size="small" color={color.btnBlue} />
          <Text style={{fontStyle: 'italic', color: color.black}}>Uploading...</Text>
        </View>
      ); //uploading
  }
};

export const ChatItemgroup = React.memo(
  ({item, user_id, avatar, index, onImagePress, menu, replyOn, reportOn}) => {
    const audio = useContext(AudioContext);
    const videoRef = useRef();
    const Action = item => {
      audio?.setaudio('');
      // let url = `${IMAGEURL}${item.message}`;
      if (item.message_type == 2) {
        onImagePress({file: item.file_name, fileType: 'pdf'});
      } else if (item.message_type == 1) {
        onImagePress({file: item.file_name, fileType: 'photo'});
      } else if (item.message_type == 5) {
        onImagePress({file: item.file_name, fileType: 'video'});
      }
    };
    const openMenu = () => {
      console.log(item.message_type);
      if (item.message_type !== 20) {
        menu.open();
      }
    };
    const getIconAndMessageOnReplyBox = replyMSG => {
      const item = JSON.parse(replyMSG?.reply_to);
      if (item?.message_type == '0') {
        return (
          <>
            <Text
              style={{
                fontFamily: fontFamily.Regular,
                fontSize: fontSize.size15,
              }}>
              {item?.message.length < 40
                ? `${item?.message}`
                : `${item?.message.substring(0, 40)}...`}
            </Text>
          </>
        );
      }
      if (item?.message_type == '1') {
        return (
          <>
            <Image source={IMAGE.camera} style={styles.replyBoxImgIcon} />
            <Text style={styles.replyBoxImgText}> Image </Text>
          </>
        );
      }
      if (item?.message_type == '4') {
        return (
          <>
            <Image
              source={IMAGE.micIconPurple}
              style={{resizeMode: 'contain', height: 14, width: 14}}
            />
            <Text style={styles.replyBoxImgText}> Voice Message </Text>
          </>
        );
      }
      if (item?.message_type == '5') {
        return (
          <>
            <Image
              source={IMAGE.videoIconPurple}
              style={{resizeMode: 'contain', height: 14, width: 14}}
            />
            <Text style={styles.replyBoxImgText}> Video </Text>
          </>
        );
      } else {
        return (
          <>
            <Image
              source={IMAGE.documentIconPurple}
              style={{resizeMode: 'contain', height: 14, width: 14}}
            />
            <Text style={styles.replyBoxImgText}> Document </Text>
          </>
        );
      }
    };
    
    if (item.from_id != user_id) {
      return (
        <View key={String(index)} style={styles.listInner}>
          {item?.message_type !== 9 && (
            <View>
              {avatar ? (
                <Image
                  source={{uri: `${IMAGEURL}/${avatar}`}}
                  style={styles.imgBox}
                />
              ) : (
                <Image
                  source={IMAGE.chatgirl}
                  style={{height: 40, width: 40}}
                />
              )}
            </View>
          )}
          <Menu ref={c => (menu = c)}>
            <MenuOptions>
              <MenuOption onSelect={() => replyOn(item)}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    minHeight: hp(4),
                    alignItems: 'center',
                  }}>
                  <Image source={IMAGE.reply} style={styles.replyBtn} />
                  <Text
                    style={{
                      color: color.black,
                      fontFamily: fontFamily.Semibold,
                      fontSize: fontSize.size16,
                    }}>
                    Reply
                  </Text>
                </View>
              </MenuOption>
              <MenuOption onSelect={() => reportOn(item)}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    minHeight: hp(4),
                    alignItems: 'center',
                  }}>
                  <Image source={IMAGE.report} style={styles.replyBtn} />
                  <Text
                    style={{
                      color: color.black,
                      fontFamily: fontFamily.Semibold,
                      fontSize: fontSize.size16,
                    }}>
                    Report
                  </Text>
                </View>
              </MenuOption>
            </MenuOptions>
            <MenuTrigger text="" />
          </Menu>
          <TouchableOpacity
            activeOpacity={1}
            onLongPress={openMenu}
            onPress={() => Action(item)}
            style={[_getStyleSelector(item, 'left')]}>
            <View style={{...styles.chatBoxWarrper}}>
              {item?.reply_to !== null && (
                <View style={[styles.replyBox, styles.replyBoxLeft]}>
                  <View>
                    <Text style={{color: color.btnBlue}}>
                      {JSON.parse(item?.reply_to).name}
                    </Text>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      {getIconAndMessageOnReplyBox(item)}
                    </View>
                  </View>
                  {JSON.parse(item?.reply_to).message_type == '1' && (
                    <Image
                      source={{
                        uri: `${IMAGEURL}/${
                          JSON.parse(item?.reply_to).file_name
                        }`,
                      }}
                      style={{resizeMode: 'contain', height: 30, width: 30}}
                    />
                  )}
                </View>
              )}
              <View>
                {_renderMessage(item, styles.leftChatText, videoRef, 'left')}
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View
          key={String(index)}
          style={{
            marginRight: item?.message_type == 9 ? '0%' : '4%',
          }}>
          <Menu ref={c => (menu = c)}>
            <MenuOptions>
              <MenuOption onSelect={() => replyOn(item)}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    minHeight: hp(4),
                    alignItems: 'center',
                  }}>
                  <Image source={IMAGE.reply} style={styles.replyBtn} />
                  <Text
                    style={{
                      color: color.black,
                      fontFamily: fontFamily.Semibold,
                      fontSize: fontSize.size16,
                    }}>
                    Reply
                  </Text>
                </View>
              </MenuOption>
            </MenuOptions>
            <MenuTrigger text="" />
          </Menu>
          <TouchableOpacity
            activeOpacity={1}
            onLongPress={openMenu}
            onPress={() => Action(item)}
            style={[_getStyleSelector(item, 'right')]}>
            <View style={{...styles.chatBoxWarrper}}>
              {item?.reply_to !== null && (
                <View style={styles.replyBox}>
                  <View>
                    <Text style={{color: color.btnBlue}}>
                      {JSON.parse(item?.reply_to).name}
                    </Text>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      {getIconAndMessageOnReplyBox(item)}
                    </View>
                  </View>
                  {JSON.parse(item?.reply_to).message_type == '1' && (
                    <Image
                      source={{
                        uri: `${IMAGEURL}/${
                          JSON.parse(item?.reply_to).file_name
                        }`,
                      }}
                      style={{resizeMode: 'contain', height: 30, width: 30}}
                    />
                  )}
                </View>
              )}
              <View>
                {_renderMessage(item, styles.rightChatText, videoRef, 'right')}
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  },
);
const styles = StyleSheet.create({
  listInner: {
    marginHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  image: {
    borderRadius: 15,
    overflow: 'hidden',
    width: 200,
    height: 150,
    resizeMode: 'cover',
  },
  video: {
    borderRadius: 15,
    overflow: 'hidden',
    width: 200,
    height: 150,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: color.borderGray,
  },
  file: {
    height: 80,
    width: 80,
    tintColor: color.btnBlue,
    resizeMode: 'contain',
    marginBottom: hp(1),
  },
  leftChat: {
    backgroundColor: color.chatLeft,
    paddingHorizontal: wp(2),
    paddingVertical: hp(1),
    borderRadius: 10,
    elevation: 2,
  },
  senderNameTextType: {
    color: color.btnBlue,
    fontFamily: fontFamily.Regular,
    paddingTop: wp(1),
    paddingBottom: wp(1),
  },
  getMessage: {
    fontSize: fontSize.size14,
    fontFamily: fontFamily.Regular,
    lineHeight: 20,
    color: color.black,
  },
  textWrapper: {
    marginTop: 10,
    backgroundColor: color.chatLeft,
    paddingTop: wp(0),
    paddingBottom: wp(4),
    paddingHorizontal: wp(4),
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    // width:"60%",
    minWidth: '25%',
    maxWidth: '85%',
  },
  textWrapperRight: {
    marginTop: 10,
    backgroundColor: color.chatRight,
    padding: wp(4),
    borderRadius: 10,
    borderBottomRightRadius: 0,
    // width:"60%",
    minWidth: '25%',
    maxWidth: '85%',
    alignSelf: 'flex-end',
  },

  activityLoaderWrapper: {
    marginTop: 10,
    minWidth: '25%',
    maxWidth: '85%',
    alignSelf: 'flex-end',
  },
  imageWrapper: {
    marginTop: 10,

    borderRadius: 15,
    minWidth: '35%',
    maxWidth: '85%',
    backgroundColor: color.chatLeft,
    padding: 3,
  },
  imageWrapperRight: {
    marginTop: 10,

    borderRadius: 15,
    minWidth: '35%',
    maxWidth: '85%',
    alignSelf: 'flex-end',
    backgroundColor: color.chatRight,
    padding: 3,
  },
  senderNameLeft: {
    marginHorizontal: 7,
    marginVertical: 5,
    position: 'absolute',
    top: 7,
    left: 7,
    zIndex: 1,
  },
  generalSenderText: {
    color: color.btnBlue,
    paddingLeft: 10,
    paddingVertical: 5,
    fontFamily: fontFamily.Regular,
  },
  senderNameLeftText: {
    color: color.white,
    fontFamily: fontFamily.Regular,
  },
  imageOverlayWrapper: {
    position: 'relative',
    overflow: 'hidden',
  },
  imgBox: {
    borderRadius: 60,
    height: Platform.OS == 'ios' ? 40 : 40,
    width: Platform.OS == 'ios' ? 40 : 40,
    resizeMode: 'cover',
    marginRight: 10,
    marginTop: 10,
  },
  imageOverlay: {
    borderRadius: 15,
    position: 'absolute',
    zIndex: 1,
    opacity: 0.4,
    backgroundColor: color.black,
    width: '100%',
    height: '100%',
  },
  leftChatText: {
    paddingRight: wp(10),
    fontFamily: fontFamily.Regular,
    fontSize: 11,
    color: color.black,
    paddingVertical: hp(0.7),
  },
  leftChatTime: {
    lineHeight: hp(1.5),
    alignSelf: 'flex-end',
    fontSize: 11,
    color: color.black,
    fontFamily: fontFamily.Semibold,
    marginTop: hp(1),
  },
  centerChatTime: {
    lineHeight: hp(1.5),
    alignSelf: 'center',
    fontSize: 11,
    color: color.black,
    fontFamily: fontFamily.Semibold,
    marginTop: hp(1),
  },
  imageTime: {
    position: 'absolute',
    bottom: 5,
    right: 10,
    color: color.white,
    zIndex: 2,
    lineHeight: 20,
  },
  rightChatTime: {
    alignSelf: 'flex-end',
    fontSize: 10,
    color: color.black,
    fontFamily: fontFamily.Regular,
    marginTop: '2%',
  },
  rightChatText: {
    paddingRight: wp(5),
    fontFamily: fontFamily.Regular,
    fontSize: 11,
    color: color.white,
  },
  rightChat: {
    backgroundColor: color.chatRight,
    borderRadius: 10,
    elevation: 2,
  },
  voiceWrapper: {
    backgroundColor: color.chatLeft,
    borderRadius: 10,
    marginTop: 10,
    paddingRight: wp(1.5),
    paddingBottom: hp(1),
  },
  voiceWrapperRight: {
    backgroundColor: color.chatRight,
    borderRadius: 10,
    marginTop: 10,
    paddingRight: wp(1.5),
    paddingBottom: hp(1),
    alignSelf: 'flex-end',
  },

  pdfWrapper: {
    backgroundColor: color.chatLeft,
    borderRadius: 10,
    marginTop: 10,
    paddingTop: wp(0),
    paddingBottom: wp(4),
    paddingHorizontal: wp(2),
  },
  pdfWrapperRight: {
    backgroundColor: color.chatRight,
    borderRadius: 10,
    marginTop: 10,
    paddingRight: wp(1.5),
    paddingBottom: hp(1),
    alignSelf: 'flex-end',
  },
  videoWrapper: {
    borderRadius: 15,
    backgroundColor: color.chatLeft,
    padding: 3,
    marginTop: 10,
    alignSelf: 'flex-end',
    position: 'relative',
  },
  videoWrapperRight: {
    borderRadius: 15,
    backgroundColor: color.chatRight,
    padding: 3,
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  playBtnIcon: {
    position: 'absolute',
    bottom: 55,
    left: 80,
    height: 40,
    zIndex: 9,
    width: 40,
    resizeMode: 'contain',
  },
  replyBtn: {
    height: 20,
    width: 20,
    marginHorizontal: wp(2),
    resizeMode: 'contain',
  },
  badgeWrapper: {
    marginTop: 10,
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
  },
  badgeTextWrapper: {
    // width: wp(60),
    backgroundColor: color.chatLable,
    paddingHorizontal: wp(4),
    paddingVertical: wp(2),
    borderRadius: 40,
    alignSelf: 'center',
  },
  badges: {
    fontSize: 14,
    textAlign: 'center',
    color: color.black,

    // lineHeight: hp(1.5),
    // alignSelf: 'center',
    // fontSize: 11,
    // color: color.black,
    // fontFamily: fontFamily.Semibold,
    // marginTop: hp(1),
  },
  chatBoxWarrper: {
    // flex: 1,
    flexDirection: 'column',
  },

  replyBox: {
    minWidth: '60%',
    marginBottom: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: color.chatReplyBg,
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: color.btnBlue,
    borderRadius: 8,
  },
  replyBoxLeft: {
    marginTop: 10,
    backgroundColor: color.chatReplyLeftBg,
  },

  replyBoxImgIcon: {
    resizeMode: 'contain',
    height: 12,
    width: 12,
    tintColor: color.btnBlue,
  },
  replyBoxImgText: {
    marginTop: 2,
    fontFamily: fontFamily.Regular,
    fontSize: fontSize.size12,
    color: color.btnBlue,
  },
  playpause: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(10),
    height: hp(4),
  },
  track: {
    height: 3,
    backgroundColor: '#Fff',
  },
  thumb: {
    width: 10,
    height: 10,
    backgroundColor: color.btnBlue,
    borderRadius: 10,
    shadowColor: color.btnBlue,
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 2,
    shadowOpacity: 1,
  },
  flexboxImage: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    columnGap: 5,
  },
  Pdf: {
    height: 35,
    width: 35,
    resizeMode: 'contain',
    tintColor: color.btnBlue
  },
  PdfName: {
    fontSize: fontSize.size14,
    fontFamily: fontFamily.Regular,
    color: color.blackRussian,
    maxWidth: wp(60),
  },
});
