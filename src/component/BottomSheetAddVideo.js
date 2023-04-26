import React from 'react'
import { SafeAreaView } from 'react-native'
import { View, StyleSheet } from 'react-native'
import { BottomSheet, Button } from 'react-native-elements'
import { color, fontFamily, fontSize } from '../constant'
import { Divider } from 'react-native-elements'
import LottieView from 'lottie-react-native';
import { Text } from 'react-native'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const BottomSheetAddVideo = (props) => {
    return (
        <>
            <SafeAreaView>
                <BottomSheet modalProps={{}} isVisible={props.isShowBottomSheet}>
                    <View style={styles.container}>
                        <Text style={styles.heading}>Add session videos</Text>

                        <Divider style={styles.divider} />
                        {props.children}
                        <Divider style={styles.divider} />
                        <View style={{
                            flexDirection: 'row',
                            justifyContent:'space-between'
                        }}>
                            <Button
                                onPress={() => props.setisShowBottomSheet(false)}
                                title='Cancel'
                                titleStyle={{ color: color.btnBlue }}
                                buttonStyle={{
                                    backgroundColor: color.lightGray,
                                    borderWidth: 2,
                                    borderColor: 'white',
                                    borderRadius: 11,
                                    padding: 15,
                                }}
                                containerStyle={styles.containerStyle}
                            />
                            <Button
                                onPress={() => props.setisShowBottomSheet(false)}
                                title='Add video - $25'
                                titleStyle={{ color: color.white }}
                                buttonStyle={{
                                    backgroundColor: color.btnBlue,
                                    borderWidth: 2,
                                    borderColor: 'white',
                                    borderRadius: 11,
                                    padding: 15,
                                }}
                                containerStyle={styles.containerStyle}
                            />
                        </View>

                    </View>
                </BottomSheet>
            </SafeAreaView>
        </>
    )
}

export default BottomSheetAddVideo

const styles = StyleSheet.create({
    container: {
        backgroundColor: color.white,
        padding: 15,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    heading: {
        fontSize: fontSize.size19,
        fontFamily: fontFamily.Semibold,
        textAlign: 'center',
        paddingBottom: 20,

    },
    divider: {
        height: 2,
        width: wp(100),
        backgroundColor: color.divider,
        alignSelf: 'center',
        marginBottom: 20,
    },
    containerStyle:{
        width: wp(44),
    },
})