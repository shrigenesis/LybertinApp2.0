import React, { memo, useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Platform,
  TouchableHighlight,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { IMAGE, color, fontFamily, fontSize } from '../../../constant/';
import moment from 'moment';
import SoundPlayer from './../../../component/soundPlayer';
import { IMAGEURL } from '../../../utils/api';
import { Download } from './../../../utils/download';
import Video from 'react-native-video';
import Slider from 'react-native-slider'
import AudioContextProvider, { AudioContext } from "../../../context/AudioContext";
const getTime = time => {
  if (time) {
    return moment(time).format('DD, MMM hh:mm A');
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
  const audio = useContext(AudioContext);
  // const [oldDate, setoldDate] = useState(new Date())


  useEffect(() => {
    videoRef?.current?.setNativeProps({
      paused: true,
    });
  }, [])


  const Audio = () => {
    if (`${IMAGEURL}/${item.file_name}` === audio?.audio) {
      return (
        <SoundPlayer
          forChat={true}
          recordingFile={`${IMAGEURL}/${item.file_name}`}
        />
      )
    } else {
      return (
        <TouchableOpacity
          disabled={audio?.isdisabled}
          activeOpacity={1}
          onPress={() => audio?.setaudio(`${IMAGEURL}/${item.file_name}`)}>
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
            <View style={styles.playpause} >
              <Image source={IMAGE.playFill} style={{ width: 40, height: 40 }} />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Slider
                style={{ width: wp(28), marginLeft: wp(3) }}
                trackStyle={styles.track}
                thumbStyle={styles.thumb}
                minimumTrackTintColor='#681F84'
                thumbTouchSize={{ width: 50, height: 40 }}
                minimumValue={0}
                value={0}
                maximumValue={10}
                disabled={true}
              />
            </View>
          </View>
        </TouchableOpacity>
      )
    }
  }

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
          <View style={styles.imageOverlayWrapperImage}>
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
          <View style={styles.flexboxImage}>
            <Image
              source={IMAGE.pdf}
              style={styles.Pdf}
            />
            <Text style={styles.PdfName}>{item.file_original_name}</Text>
          </View>
          <Text style={[styles.leftChatTime, { marginRight: 5, marginBottom: 5 }]}>{getTime(item.created_at)}</Text>
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
            {Audio()}
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
    const audio = useContext(AudioContext);
    const Action = item => {
      audio?.setaudio('');
      // let url = `${IMAGEURL}${item.message}`;
      if (item.message_type == 2) {
        onImagePress({ file: item.file_name, fileType: 'pdf' });
      } else if (item.message_type == 1) {
        onImagePress({ file: item.file_name, fileType: 'photo' });
      } else if (item.message_type == 5) {
        onImagePress({ file: item.file_name, fileType: 'video' });
      }
    };

    // if (item.type === 'agoDate') {
    //   return (
    //     <View style={{display:'flex', alignItems:'center'}}>
    //       <Text style={{
    //         textAlign: 'center',
    //         backgroundColor: color.lightSlaty,
    //         borderRadius: 20, width: wp(30),
    //         padding: 2,
    //         color: color.black,
    //         justifyContent: 'center',
    //         marginVertical:20
    //       }}>
    //         {item.created_time_ago}
    //       </Text>
    //     </View>
    //   )
    // } else {
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
    // marginTop: 10
  },
  imageOverlayWrapperImage: {
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
  videoWrapper: {
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
  playpause: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(10),
    height: hp(4)
  },
  track: {
    height: 3,
    backgroundColor: '#Fff',
  },
  thumb: {
    width: 10,
    height: 10,
    backgroundColor: '#681F84',
    borderRadius: 10,
    shadowColor: '#31a4db',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    shadowOpacity: 1,
  },
  flexboxImage: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    columnGap: 5
  },
  Pdf: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
    // tintColor: color.btnBlue
  },
  PdfName: {
    fontSize: fontSize.size12,
    color: color.blackRussian,
    fontFamily: fontFamily.Medium,
    maxWidth: wp(70)
  }

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
