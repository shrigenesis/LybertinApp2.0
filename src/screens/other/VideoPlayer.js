import React, { useState } from 'react';
import Video from 'react-native-video';
import { View, StyleSheet, StatusBar, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import LottieView from 'lottie-react-native';
import { useOrientation } from '../../hooks/useOrientation';
import { color, IMAGE } from '../../constant';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Loader } from '../../component';


const VideoPlayer = ({ route, navigation }) => {
    const [isLoading, setisLoading] = useState(false)
    const Orientation = useOrientation();
    const { VideoURL } = route.params;
    const onLoadEnd = () => {
        console.log('onLoadEnd :', onLoadEnd);
        setisLoading(false)
    };

    const onLoadStart = () => {
        console.log('onLoadStart :', onLoadStart);
        setisLoading(true)
    };

    const onProgress = () => {
        //  console.log('onProgress :', onProgress);
    };

    const onBuffer = () => {
        console.log('onBuffer :', onBuffer);
    };

    const onError = () => {
        console.log('onError :', onError);
    };

    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: color.black }}>
                <StatusBar barStyle={'light-content'} translucent backgroundColor={color.transparent} />
                <View style={styles.container}>
                    <View
                        style={{
                            position: 'absolute',
                            left: 20,
                            top: 45,
                        }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image
                                source={IMAGE.ArrowLeft}
                                style={{
                                    height: 32,
                                    width: 32,
                                    resizeMode: 'contain',
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                    {isLoading ?
                        <LottieView speed={1.6} style={{ ...styles.Loader, top: Orientation === 'PORTRAIT' ? '38%' : '17%', }} source={require('../../animation/circle.json')} autoPlay loop />
                        : null}
                    <Video
                        source={
                            { uri: VideoURL }
                        }
                        style={styles.Videos}
                        resizeMode={'contain'}
                        controls={true}
                        volume={10}
                        muted={true}
                        onLoad={onLoadEnd}
                        onLoadStart={onLoadStart}
                        onProgress={onProgress}
                        onBuffer={onBuffer}
                        onError={onError}
                        hideShutterView={true}
                        fullscreenOrientation="all"
                        bufferConfig={{
                            minBufferMs: 15000,
                            maxBufferMs: 50000,
                            bufferForPlaybackMs: 2500,
                            bufferForPlaybackAfterRebufferMs: 5000
                        }}
                    // fullscreenOrientation={'landscape'}
                    />
                </View>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    Videos: {
        height: hp(100),
        width: wp(100),
        zIndex: -1,
    },
    Loader: {
        position: 'absolute',
        height: 100
    }
});

export default VideoPlayer;