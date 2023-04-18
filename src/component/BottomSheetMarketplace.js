import React from 'react'
import { Pressable, SafeAreaView, TouchableHighlight } from 'react-native'
import { View, StyleSheet, Text } from 'react-native'
import { BottomSheet, Button } from 'react-native-elements'
import { color } from '../constant'
import { Divider } from 'react-native-elements'
import LottieView from 'lottie-react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const BottomSheetMarketplace = (props) => {

    return (
        <>
            <SafeAreaView>
                <BottomSheet modalProps={{}} isVisible={props.isShowBottomSheet} >
                    <Pressable
                        style={styles.outerContainer}
                        onPress={() => props.setisShowBottomSheet(false)}>
                        <Pressable style={styles.container}>
                            <View >
                                {props?.confetti ? <LottieView
                                    speed={1}
                                    style={{ height: 300, position: 'absolute', marginStart: 30 }}
                                    source={require('./../animation/Confetti.json')}
                                    autoPlay
                                    loop={false}
                                /> : null}
                                <Divider style={styles.divider} />
                                {props.children}
                                <Divider style={styles.dividerSpace} />
                                
                            </View>
                        </Pressable>
                    </Pressable>
                </BottomSheet>
            </SafeAreaView >
        </>
    )
}

export default BottomSheetMarketplace

const styles = StyleSheet.create({
    outerContainer:{
        height: hp(100),
        backgroundColor: color.extralightSlaty,
    },
    container: {
        backgroundColor: color.white,
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'absolute',
        bottom: 0,
        width: wp(100),
    },
    divider: {
        height: 2,
        width: 30,
        backgroundColor: color.divider,
        alignSelf: 'center',
        marginBottom: 20,
    },
    dividerSpace: {
        height: 40,
        backgroundColor: color.white,
        alignSelf: 'center',
    },
})