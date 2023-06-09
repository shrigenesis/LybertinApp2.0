import React, { useState, useMemo, useRef, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Sound from 'react-native-sound';
import Slider from 'react-native-slider';
import Animated, {
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { IMAGE, color, fontFamily } from '../constant';
import Toast from 'react-native-toast-message';
import { AudioContext } from '../context/AudioContext';
import moment from 'moment';

const SoundPlayer = ({
  recordingFile = '',
  playImmediate = true,
  close = () => { },
  forChat = false,
  Send = () => { },
}) => {
  const audio = useContext(AudioContext);
  const [isPlay, setIsPlay] = useState(false);
  const [totalDuration, settotalDuration] = useState(0);
  const [playTime, setplayTime] = useState(0);
  let sound;
  let timerRef = useRef();

  useEffect(() => {
    console.log(recordingFile, 'recordingFile');
    setplayTime(0);
    settotalDuration(0);
    // setIsPlay(false);
    if (playImmediate) {
      startSound();
    }
    Sound.setCategory('Playback');
    // startSound()
  }, [recordingFile]);

  useEffect(() => {
    if (audio?.isdisabled) {
      pauseSound();
    }
  }, [audio?.isdisabled]);

  useEffect(() => {
    return () => {
      stopSound();
    };
  }, []);

  const startSound = () => {
    if (audio?.isdisabled) {
      Toast.show({
        type: 'error',
        text1: "Can't play audio while recording is in progress.",
      });
      return
    }
    setIsPlay(true);
    try {
      if (global?.sound) {
        console.log('firzst');
        global?.sound.getCurrentTime(seconds => {
          global?.sound.setCurrentTime(seconds);
          soundPlaying();
          global?.sound.play();
        });
        return;
      } else {
        console.log('sec');
        setplayTime(0);
        sound = new Sound(recordingFile, null, error => {
          console.log(recordingFile, null, error, 'recordingFile:::::::');
          if (error) {
            console.log('error loading sound', error);
            Toast.show({
              type: 'info',
              text1: 'Damaged Audio',
            });
            setIsPlay(false);
            return;
          } else {
            if (sound) {
              global.sound = sound;
              soundPlaying();
              sound.play(success => {
                if (success) {
                  setIsPlay(false);
                  console.log('successfully finished playing');
                } else {
                  console.log('playback failed due to audio decoding errors');
                }
              });
              // sound.setVolume(100);
            }
          }
        });
      }
    } catch (err) {
      close();
      console.log(err);
      Toast.show({
        type: 'info',
        text1: 'Damaged Audio',
      });
    }
  };
  // NSAllowsArbitraryLoads
  const soundPlaying = () => {
    try {
      let duration = parseInt(global?.sound?.getDuration());
      settotalDuration(duration);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        global?.sound?.getCurrentTime(v => {
          setplayTime(v);
          if (parseInt(v) >= duration) {
            setplayTime(duration);
            audio?.setaudio('');
            stopSound();
          }
        });
      }, 1);
    } catch (err) {
      close();
      console.log(err);
    }
  };

  const pauseSound = () => {
    try {
      setIsPlay(false);
      clearInterval(timerRef.current);
      if (global?.sound) global?.sound.pause();
    } catch (err) {
      close();
      console.log(err);
    }
  };
  const stopSound = () => {
    try {
      setIsPlay(false);
      clearInterval(timerRef.current);
      if (global?.sound) {
        global?.sound.stop();
        global?.sound.release();
        global.sound = null;
      }
      // setplayTime(0);
    } catch (err) {
      close();
      console.log(err);
    }
  };

  if (recordingFile != '') {
    if (forChat) {
      return (
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
          {!isPlay ? (
            <TouchableOpacity
              // disabled={audio?.isdisabled}
              style={styles.playpause}
              onPress={startSound}
            // onPress={()=>alert('ghn')}
            >
              {/* <Icon name='play' style={{ fontSize: 16, color: '#681F84' }} /> */}
              <Image source={IMAGE.playFill} style={{ width: 40, height: 40 }} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              disabled={audio?.isdisabled}
              style={styles.playpause}
              onPress={pauseSound}>
              {/* <Icon name='pause' style={{ fontSize: 16, color: '#000' }} /> */}
              <Image source={IMAGE.pauseFill} style={{ width: 40, height: 40 }} />
            </TouchableOpacity>
          )}

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Slider
              style={{ width: wp(28), marginLeft: wp(3) }}
              trackStyle={styles.track}
              thumbStyle={styles.thumb}
              minimumTrackTintColor="#681F84"
              thumbTouchSize={{ width: 50, height: 40 }}
              minimumValue={0}
              value={playTime}
              maximumValue={totalDuration}
              disabled={true}
            />
          </View>
          {totalDuration > 0 ? (
            <Text style={{ position: 'absolute', top: 25, left: 60 }}>
              {totalDuration > 0 &&
                `${moment.utc(totalDuration * 1000).format('mm:ss')}`}
            </Text>
          ) : (
            !(audio?.isdisabled) && (
              <ActivityIndicator
                style={{ position: 'absolute', top: 25, left: 60 }}
                color={color.btnBlue}
                size="small"
              />
            )
          )}
        </View>
      );
    } else {
      return (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}>
          <View style={styles.row}>
            {!isPlay ? (
              <TouchableOpacity
                // style={styles.playpause}
                onPress={() => startSound()}>
                <Image
                  source={IMAGE.playFill}
                  style={{ width: 40, height: 40 }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                // style={styles.playpause}
                onPress={pauseSound}>
                <Image
                  source={IMAGE.pauseFill}
                  style={{ width: 40, height: 40 }}
                />
              </TouchableOpacity>
            )}
            <Slider
              style={styles.slider}
              trackStyle={styles.track}
              thumbStyle={styles.thumb}
              minimumTrackTintColor="#681F84"
              thumbTouchSize={{ width: 50, height: 40 }}
              minimumValue={0}
              value={playTime}
              maximumValue={totalDuration}
            />
            <TouchableOpacity
              style={[styles.col_small]}
              onPress={() => {
                stopSound();
                close();
              }}>
              <Image
                source={IMAGE.delete}
                style={{
                  resizeMode: 'contain',
                  height: 24,
                  width: 24,
                  tintColor: color.red,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                stopSound();
                Send();
              }}
              style={[styles.col_small, styles.sendIconBox]}>
              <Image
                source={IMAGE.send}
                style={{
                  resizeMode: 'contain',
                  height: 20,
                  width: 20,
                  tintColor: color.white,
                }}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      );
    }
  } else {
    return null;
  }
};

export default SoundPlayer;

const styles = StyleSheet.create({
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
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    shadowOpacity: 1,
  },
  duration: {
    paddingLeft: wp(2),
    fontSize: 13,
    color: color.black,
    fontFamily: fontFamily.Bold,
  },
  icon: {
    resizeMode: 'contain',
    height: 22,
    width: 22,
  },
  col_small: {
    height: 50,
    width: 40,
    minWidth: 40,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  sendIconBox: {
    height: 40,
    minHeight: 40,
    minWidth: 40,
    width: 40,
    backgroundColor: color.btnBlue,
    borderRadius: 60,
    padding: 10,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    transition: 'opacity 0.5s ease-in',
  },
  sendIconBox: {
    height: 40,
    minHeight: 40,
    minWidth: 40,
    width: 40,
    backgroundColor: color.btnBlue,
    borderRadius: 60,
    padding: 10,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  // container: {
  //   position: 'relative',
  //   bottom: 0,
  //   flex: 1,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: color.lightGray,
  //   height: 80,
  //   paddingVertical: 15,
  //   width: wp(100),
  //   paddingBottom: 25,
  //   zIndex: 1,
  // },
  row: {
    width: wp(100),
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between',
    gap: 5,
    paddingHorizontal: 10,
  },
  slider: {
    flex: 1,
    marginLeft: 10,
  },
});
