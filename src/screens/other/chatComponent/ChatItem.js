import React, { memo, useEffect, useRef } from "react";
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
import { IMAGE, color, fontFamily } from '../../../constant/';
import moment from 'moment';
import SoundPlayer from './../../../component/soundPlayer';
import { IMAGEURL } from '../../../utils/api';
import { Download } from './../../../utils/download';
import Video from 'react-native-video';
const getTime = time => {
  if (time) {
    return moment(time).format('hh:mm');
  }
};
const _getStyleSelector = (item, direction) => {
  switch (item.message_type) {
    case 0: return direction === 'left' ? styles.textWrapper : styles.textWrapperRight; //
    case 1: return direction === 'left' ? styles.imageWrapper : styles.imageWrapperRight; //
    case 2: return direction === 'left' ? styles.pdfWrapper : styles.pdfWrapperRight; //
    case 3: return direction === 'left' ? styles.pdfWrapper : styles.pdfWrapperRight; //
    case 4: return direction === 'left' ? styles.voiceWrapper : styles.voiceWrapperRight; //
    case 5: return direction === 'left' ? styles.videoWrapper : styles.videoWrapperRight; //
    case 6: return direction === 'left' ? styles.youtubeWrapper : styles.youtubeWrapperRight; //
    case 7: return direction === 'left' ? styles.mediaTextWrapper : styles.mediaTextWrapperRight; //
    case 8: return direction === 'left' ? styles.xlsWrapper : styles.xlsWrapperRight; //
    case 9: return direction === 'left' ? styles.xlsWrapper : styles.xlsWrapperRight; //
    case 10: return direction === 'left' ? styles.zipWrapper : styles.zipWrapperRight; //
    case 11: return direction === 'left' ? styles.rarWrapper : styles.rarWrapperRight; //
  }
};
const _renderMessage = (item, style) => {
  const videoRef = useRef();

  useEffect(() => {
    videoRef?.current?.setNativeProps({
      paused: true,
    });
  }, [])
  switch (item.message_type) {
    case 0:
      return (
        <>
          <View>
            {/* <Image source={IMAGE.zip_file} style={styles.file} /> */}
            {/* <View style={styles.replyWrapper}>
              <Text style={styles.replyText}>you sleep well</Text>
              <Text style={styles.d}>{getTime(item.created_at)}</Text>
            </View> */}
          </View>
          <View>
            <Text style={styles.getMessage}>{item.message}</Text>
          </View>
          <Text style={styles.leftChatTime}>{getTime(item.created_at)}</Text>
        </>

      ); //text
    case 1:
      return (
        <>
          <View style={styles.imageOverlayWrapper}>
            <View style={styles.imageOverlay}></View>
            <Image
              source={{ uri: `${IMAGEURL}/${item?.file_name}` }}
              style={styles.image}
            />
            <Text style={[styles.leftChatTime, styles.imageTime]}>{getTime(item.created_at)}</Text>
          </View>
        </>
      ); //IMAGE
    case 2:
      return (
        <>
          <View>
            <Image source={IMAGE.pdf} style={styles.file} />
          </View>
          <Text style={styles.leftChatTime}>{getTime(item.created_at)}</Text>
        </>
      ); //PDF
    case 3:
      return (
        <>
          <View>
            <Image source={IMAGE.file} style={styles.file} />
          </View>
          <Text style={styles.leftChatTime}>{getTime(item.created_at)}</Text>
        </>
      );

    case 4:
      return (
        <>
          <View style={{ marginBottom: hp(2) }}>
            <SoundPlayer
              forChat={true}
              recordingFile={`${IMAGEURL}/${item.file_name}`}
            />
          </View>
          <Text style={styles.leftChatTime}>{getTime(item.created_at)}</Text>
        </>

      ); //VOICE
    case 5:
      return (
        <>
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
              source={{ uri: `${IMAGEURL}/${item?.file_name}` }}
              resizeMode={'cover'}
              style={styles.video}
            />
            <Image
              source={IMAGE.PlayBtn}
              style={styles.playBtnIcon}
            />
            <Text style={[styles.leftChatTime, styles.imageTime]}>{getTime(item.created_at)}</Text>
          </View>
        </>


      ); //VIDEO
    case 6:
      return (
        <>
          <Image source={IMAGE.pdf} style={styles.file} />

          <Text style={styles.leftChatTime}>{getTime(item.created_at)}</Text>
        </>

      ); //YOUTUBE_URL
    case 7:
      return (
        <View>
          <Image source={IMAGE.file} style={styles.file} />
          <Text style={styles.leftChatTime}>{getTime(item.created_at)}</Text>
        </View>
      ); //MEDIA_TXT
    case 8:
      return (
        <View>
          <Image source={IMAGE.excel} style={styles.file} />
          <Text style={styles.leftChatTime}>{getTime(item.created_at)}</Text>
        </View>
      ); //XLS
    case 9:
      return (
        <View>
          <Image source={IMAGE.pdf} style={styles.file} />
          <Text style={styles.leftChatTime}>{getTime(item.created_at)}</Text>
        </View>
      ); //YOUTUBE_URL
    case 10:
      return (
        <View>
          <Image source={IMAGE.zip_file} style={styles.file} />
          <Text style={styles.leftChatTime}>{getTime(item.created_at)}</Text>
        </View>
      ); //ZIP
    case 11:
      return (
        <View>
          <Image source={IMAGE.zip_file} style={styles.file} />
          <Text style={styles.leftChatTime}>{getTime(item.created_at)}</Text>
        </View>
      ); //RAR




  }
};

export const ChatItem = React.memo(
  ({ item, user_id, avatar, index, onImagePress }) => {

    const Action = item => {
      // let url = `${IMAGEURL}${item.message}`;
      if (item.message_type == 2) {
        onImagePress({ file: item.file_name, fileType: 'pdf' });
      } else if (item.message_type == 1) {
        onImagePress({ file: item.file_name, fileType: 'photo' });
      } else if (item.message_type == 5) {
        onImagePress({ file: item.file_name, fileType: 'video' });
      }
    };
    if (item.from_id == user_id) {
      return (
        <View
          key={String(index)}
          style={styles.listInner}>
          {/* <Text>{item.name}</Text> */}
          {/* {item?.message_type !== 9 && (
            <View>
              {avatar ? (
                <Image
                  source={{uri: `${IMAGEURL}/${avatar}`}}
                  style={{
                    height: 40,
                    borderRadius: 120,
                    overflow: 'hidden',
                    width: 40,
                  }}
                />
              ) : (
                <Image
                  source={IMAGE.chatgirl}
                  style={{height: 40, width: 40}}
                />
              )}
            </View>
          )} */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => Action(item)}
            style={[_getStyleSelector(item, 'left')]}>
            {_renderMessage(item, styles.leftChatText)}
          </TouchableOpacity>

        </View>
      );
    } else {
      return (
        <View
          key={String(index)}
          style={{
            marginRight: wp(4),
            marginRight: item?.message_type == 9 ? '25%' : '4%',
          }}>

          {/* <TouchableOpacity
            activeOpacity={1}
            onPress={() => Action(item)}
            style={[_getStyleSelector(item)]}>
            {_renderMessage(item, styles.leftChatText, videoRef)}
          </TouchableOpacity> */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => Action(item)}
            // style={styles.rightChatBox}>
            style={[_getStyleSelector(item, 'right')]}>
            {_renderMessage(item, styles.rightChatText)}
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
    alignItems: 'flex-end',

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
    borderColor: color.borderGray
  },
  file: {
    height: 80,
    width: 80,
    resizeMode: 'contain',
    marginBottom: hp(1)
  },
  leftChat: {
    backgroundColor: color.chatLeft,
    paddingHorizontal: wp(2),
    paddingVertical: hp(1),
    borderRadius: 10,
    elevation: 2,
  },
  getMessage: {
    fontSize: Platform.OS == 'ios' ? 16 : 15,
    lineHeight: 20,
    color: color.black
  },
  textWrapper: {
    marginTop: 10,
    backgroundColor: color.chatLeft,
    padding: wp(4),
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    // width:"60%",
    minWidth: "25%",
    maxWidth: "85%",
  },
  textWrapperRight: {
    marginTop: 10,
    backgroundColor: color.chatRight,
    padding: wp(4),
    borderRadius: 10,
    borderBottomRightRadius: 0,
    minWidth: "25%",
    maxWidth: "85%",
    alignSelf: 'flex-end'
  },
  imageWrapper: {
    marginTop: 10,
    padding: 0,
    borderRadius: 15,
    minWidth: "35%",
    maxWidth: "85%",
    backgroundColor: color.chatLeft,
    padding: 3
  },
  imageWrapperRight: {
    marginTop: 10,
    borderRadius: 15,
    minWidth: "35%",
    maxWidth: "85%",
    alignSelf: 'flex-end',
    backgroundColor: color.chatRight,
    padding: 3
  },
  imageOverlayWrapper: {
    position: "relative",
    overflow: "hidden",
  },
  imageOverlay: {
    borderRadius: 15,
    position: 'absolute',
    zIndex: 1,
    opacity: .4,
    backgroundColor: color.black,
    width: "100%",
    height: "100%"
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
  imageTime: {
    position: "absolute",
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
    paddingRight: wp(1.5),
    paddingBottom: hp(1),
  },
  videoWrapperRight: {
    backgroundColor: color.chatRight,
    marginTop: 10,
    borderRadius: 15,
    minWidth: "35%",
    maxWidth: "85%",
    alignSelf: 'flex-end',
    padding: 3
  },
  pdfWrapperRight: {
    backgroundColor: color.chatRight,
    marginTop: 10,
    borderRadius: 15,
    alignSelf: 'flex-end',
    padding: 3
  },
  playBtnIcon: {
    position: "absolute",
    bottom: 55,
    left: 80,
    height: 40,
    zIndex: 9,
    width: 40,
    resizeMode: 'contain'
  },
  
  // replyWrapper:{
  //   width:wp(70),
  //   flexDirection: "row",
  // },
  // replyText:{
  //   flex: 1,
  // },
  // dd:{
  //   flex: 1,
  // }
});
