import Reactm, {useState} from 'react'
import { SafeAreaView, StatusBar, StyleSheet, View, Image, TouchableOpacity } from 'react-native'
import WebView from 'react-native-webview'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { IMAGE, color } from '../../constant'
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { Loader } from '../../component';

const STATUSBAR_HEIGHT = StatusBar.currentHeight;

const LiveConference = (props) => {
    const [isLoading, setisLoading] = useState(true)

    const OnLoad= ()=>{
       setisLoading(false)
    }
    const runFirst = `
    window.document.querySelector('.css-11lsl83-supportedBrowserContent .css-1l3cxcu-linkLabel').click()
  `

    return (
        <SafeAreaView style={{paddingTop:STATUSBAR_HEIGHT, position:'relative'}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={color.white} />
            <View
                style={styles.backBtn}>
                <TouchableOpacity onPress={() => props.navigation.goBack()}>
                    <Image
                        source={IMAGE.ArrowLeft}
                        style={styles.backBtnImage}
                    />
                </TouchableOpacity>
            </View>

            <View style={{ height: hp(100), width: wp(100)}}>
                <WebView
                    source={{ uri: 'https://meet.jit.si/ReadySnowsRemainAdequately' }}
                    onLoad={() => OnLoad()}
                    injectedJavaScript={runFirst}
                    onNavigationStateChange={navState => {
                        console.log('navstate', navState);
                        if (navState?.url.includes('static')) {
                            Toast.show({
                                type:'info',
                                text1: 'Your call disconnected'
                            })
                            props.navigation.goBack()
                        }
                    }}
                />
            </View>
            {isLoading? <Loader isLoading={isLoading} type='dots' /> : null}
        </SafeAreaView>
    )
}

export default LiveConference

const styles = StyleSheet.create({
    backBtn: {
        position:'absolute',
        top: hp(6),
        left: wp(5),
        zIndex:1
    },
    backBtnImage: {
        height: 32,
        width: 32,
        resizeMode: 'contain',
    },
})