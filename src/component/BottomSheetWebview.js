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

const BottomSheetWebview = (props) => {

    return (
        <>
            <SafeAreaView>
                <BottomSheet modalProps={{}} isVisible={props.isShowBottomSheet} >
                    <View
                        style={styles.outerContainer}
                    >
                        <View style={styles.container}>
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
                            <Button
                                onPress={() => props.setisShowBottomSheet(false)}
                                title={props.cancelBtn.title}
                                titleStyle={{ color: props?.cancelBtn?.textColor ? props?.cancelBtn?.textColor : color.white }}
                                buttonStyle={{
                                    backgroundColor: props.cancelBtn.color,
                                    borderWidth: 2,
                                    borderColor: 'white',
                                    borderRadius: 11,
                                    padding: 15,
                                }}
                            />
                        </View>
                    </View>
                </BottomSheet>
            </SafeAreaView >
        </>
    )
}

export default BottomSheetWebview

const styles = StyleSheet.create({
    outerContainer: {
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