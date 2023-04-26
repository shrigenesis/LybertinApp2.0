import React, { useState, useMemo, useRef, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import Sound from 'react-native-sound';
import Slider from 'react-native-slider'
import Animated, { BounceInLeft, FadeOutUp } from 'react-native-reanimated';
import { color, fontFamily } from '../constant';
import Toast from 'react-native-toast-message';

const SoundPlayer = ({ recordingFile = '', close = () => { }, forChat = false }) => {
    const [isPlay, setIsPlay] = useState(false);
    const [totalDuration, settotalDuration] = useState(0);
    const [playTime, setplayTime] = useState(0);

    useEffect(() => {
        setplayTime(0);
        settotalDuration(0);
        setIsPlay(false);
        Sound.setCategory('Playback');
    }, [recordingFile]);

    let sound;
    let timerRef = useRef();

    const startSound = () => {
        setIsPlay(true)
        try {
            sound = new Sound(recordingFile, null, error => {
                console.log(recordingFile, "recordingFile:::::::");
                if (error) {
                    console.log('error loading sound', error)
                    Toast.show({
                        type: 'info',
                        text1: 'Damaged Audio'
                    })
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
                    if (parseInt(v) == duration) {
                        stopSound();
                    }
                })
            }, 300);
        } catch (err) {
            close();
            console.log(err);
        }
    }

    const stopSound = () => {
        try {
            setIsPlay(false);
            clearInterval(timerRef.current);
            if (global?.sound) global?.sound.stop();
        } catch (err) {
            close();
            console.log(err);
        }

    }


    if (recordingFile != '') {
        if (forChat) {
            return (
                <View style={{ backgroundColor: color.borderGray, alignItems: 'center', marginTop: hp(1), height: hp(4), flexDirection: 'row', paddingRight: wp(5), marginHorizontal: wp(2) }}>
                    {(!isPlay) ?
                        <TouchableOpacity style={styles.playpause} onPress={startSound}>
                            <Icon name='play' style={{ fontSize: 16, color: '#000' }} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={styles.playpause} onPress={stopSound}>
                            <Icon name='pause' style={{ fontSize: 16, color: '#000' }} />
                        </TouchableOpacity>
                    }

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Slider
                            style={{ width: wp(28), marginLeft: wp(3) }}
                            trackStyle={styles.track}
                            thumbStyle={styles.thumb}
                            minimumTrackTintColor='#31a4db'
                            thumbTouchSize={{ width: 50, height: 40 }}
                            minimumValue={0}
                            value={playTime}
                            maximumValue={totalDuration}
                        />
                    </View>
                </View>
            )
        } else {
            return (
                <Animated.View entering={BounceInLeft} exiting={FadeOutUp} style={{ backgroundColor: color.borderGray, alignItems: 'center', marginTop: hp(1), height: hp(5), flexDirection: 'row', paddingRight: wp(5), paddingHorizontal: wp(2) }}>

                    {(!isPlay) ?
                        <TouchableOpacity style={styles.playpause} onPress={() => startSound()}>
                            <Icon name='play' style={{ fontSize: 20, color: '#000' }} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={styles.playpause} onPress={stopSound}>
                            <Icon name='pause' style={{ fontSize: 20, color: '#000' }} />
                        </TouchableOpacity>
                    }
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Slider
                            style={{ width: wp(70), marginLeft: wp(5) }}
                            trackStyle={styles.track}
                            thumbStyle={styles.thumb}
                            minimumTrackTintColor='#31a4db'
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
        backgroundColor: '#31a4db',
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
