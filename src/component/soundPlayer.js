import React, { useState, useMemo, useRef, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import Sound from 'react-native-sound';
import Slider from 'react-native-slider'
import Animated, { BounceInLeft, FadeOutUp } from 'react-native-reanimated';
import { IMAGE, color, fontFamily } from '../constant';
import Toast from 'react-native-toast-message';
import { AudioContext } from '../context/AudioContext';
import moment from 'moment';


const SoundPlayer = ({ recordingFile = '', close = () => { }, forChat = false, Send = () => { } }) => {
    const audio = useContext(AudioContext);
    const [isPlay, setIsPlay] = useState(false);
    const [totalDuration, settotalDuration] = useState(0);
    const [playTime, setplayTime] = useState(0);
    let sound;
    let timerRef = useRef();

    useEffect(() => {
        console.log(recordingFile, "recordingFile")
        setplayTime(0);
        settotalDuration(0);
        setIsPlay(false);
        Sound.setCategory('Playback');
        // startSound()
    }, [recordingFile]);

    useEffect(() => {
        if (audio?.isdisabled) {
            pauseSound()
        }
    }, [audio?.isdisabled])

    useEffect(() => {
        return () => {
            stopSound()
        }
    }, [])

    const startSound = () => {
        setIsPlay(true)
        try {
            if (global?.sound) {
                global?.sound.getCurrentTime((seconds) => {
                    global?.sound.setCurrentTime(seconds);
                    soundPlaying();
                    global?.sound.play()
                });
                return;
            } else {
                setplayTime(0)
                sound = new Sound(recordingFile, null, error => {
                    console.log(recordingFile, "recordingFile:::::::");
                    if (error) {
                        console.log('error loading sound', error)
                        // Toast.show({
                        //     type: 'info',
                        //     text1: 'Damaged Audio'
                        // })
                        setIsPlay(false)
                        return
                    } else {
                        if (sound) {
                            global.sound = sound;
                            soundPlaying();
                            sound.play();
                            sound.setVolume(100);
                        }
                    }

                })
            }
        } catch (err) {
            close();
            console.log(err);
            Toast.show({
                type: 'info',
                text1: 'Damaged Audio'
            })
        }

    }
    // NSAllowsArbitraryLoads
    const soundPlaying = () => {
        try {
            let duration = parseInt(global?.sound?.getDuration());
            settotalDuration(duration);
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = setInterval(() => {
                global?.sound?.getCurrentTime((v) => {
                    setplayTime(v);
                    if (parseInt(v) >= duration) {
                        setplayTime(duration);
                        // setTimeout(()=>{
                        stopSound();
                        // })
                    }
                })
            }, 1);
        } catch (err) {
            close();
            console.log(err);
        }
    }

    const pauseSound = () => {
        try {
            setIsPlay(false);
            clearInterval(timerRef.current);
            if (global?.sound) global?.sound.pause();
        } catch (err) {
            close();
            console.log(err);
        }

    }
    const stopSound = () => {
        try {
            setIsPlay(false);
            clearInterval(timerRef.current);
            if (global?.sound) {
                global?.sound.stop();
                global?.sound.release();
                global.sound = null
            }
            // setplayTime(0);
        } catch (err) {
            close();
            console.log(err);
        }

    }

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
                    {(!isPlay) ?
                        <TouchableOpacity disabled={audio?.isdisabled} style={styles.playpause} onPress={startSound}>
                            {/* <Icon name='play' style={{ fontSize: 16, color: '#681F84' }} /> */}
                            <Image source={IMAGE.playFill} style={{ width: 40, height: 40 }} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity disabled={audio?.isdisabled} style={styles.playpause} onPress={pauseSound}>
                            {/* <Icon name='pause' style={{ fontSize: 16, color: '#000' }} /> */}
                            <Image source={IMAGE.pauseFill} style={{ width: 40, height: 40 }} />
                        </TouchableOpacity>
                    }

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Slider
                            style={{ width: wp(28), marginLeft: wp(3) }}
                            trackStyle={styles.track}
                            thumbStyle={styles.thumb}
                            minimumTrackTintColor='#681F84'
                            thumbTouchSize={{ width: 50, height: 40 }}
                            minimumValue={0}
                            value={playTime}
                            maximumValue={totalDuration}
                            disabled={true}
                        />
                    </View>
                    <Text style={{ position: 'absolute', top: 25, left: 60 }}>{totalDuration > 0 && `${moment.utc(totalDuration * 1000).format('mm:ss')}`}</Text>
                </View>
            )
        } else {
            return (
                <Animated.View entering={BounceInLeft} exiting={FadeOutUp}
                    style={{
                        alignItems: 'center',
                        height: hp(10),
                        flexDirection: 'row',
                        paddingHorizontal: wp(2),
                    }}>
                    {(!isPlay) ?
                        <TouchableOpacity style={styles.playpause} onPress={() => startSound()}>
                            <Image source={IMAGE.playFill} style={{ width: 40, height: 40 }} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={styles.playpause} onPress={pauseSound}>
                            <Image source={IMAGE.pauseFill} style={{ width: 40, height: 40 }} />
                        </TouchableOpacity>
                    }
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Slider
                            style={{ width: wp(55), marginLeft: wp(5) }}
                            trackStyle={styles.track}
                            thumbStyle={styles.thumb}
                            minimumTrackTintColor='#681F84'
                            thumbTouchSize={{ width: 50, height: 40 }}
                            minimumValue={0}
                            value={playTime}
                            maximumValue={totalDuration}
                        />
                        <TouchableOpacity onPress={() => {
                            stopSound();
                            close();
                        }} style={{ paddingLeft: wp(5) }}>
                            <Icon name='times' style={{ fontSize: 20, color: '#000' }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            stopSound();
                            Send();
                        }} style={{ paddingLeft: wp(5) }}>
                            <Icon name='send' style={{ fontSize: 20, color: '#681F84' }} />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )
        }

    } else {
        return null;
    }

}

export default SoundPlayer

const styles = StyleSheet.create({
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
    duration: {
        paddingLeft: wp(2),
        fontSize: 13,
        color: color.black,
        fontFamily: fontFamily.Bold
    },
    icon: {
        resizeMode: 'contain',
        height: 22,
        width: 22
    },
})
