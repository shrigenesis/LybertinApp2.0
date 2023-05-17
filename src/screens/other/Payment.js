import React, { useEffect, useState } from 'react'
import { SafeAreaView, Text, View, TouchableOpacity, StatusBar, StyleSheet, Platform, Image, Alert } from 'react-native'
import { Header, Loader, Radio } from '../../component'
import { IMAGE, color, fontSize, fontFamily } from '../../constant'
import { Button } from 'react-native-elements'
import { User } from '../../utils/user';
import { APIRequest, ApiUrl } from '../../utils/api'
import Toast from 'react-native-toast-message';
import { log } from 'react-native-reanimated'
import WebView from 'react-native-webview'
import BottomSheetCustom from '../../component/BottomSheetCustom'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';



const data = {
    course_id: 1,
    booking_date: '2023-07-05',
    start_time: '04:03:00',
    end_time: '05:05:00',
    customer_id: 1,
    video_id: [1],
    payment_method: 7,
    method: 'Post',
    promocode: ['promocode']
}

const Payment = (props) => {
    const [PaymentType, setPaymentType] = useState(0);
    const [isLoading, setisLoading] = useState(false)
    const [isNavigate, setisNavigate] = useState(false)
    const [PaymentData, setPaymentData] = useState({
        course_id: 1,
        booking_date: '2023-07-05',
        start_time: '04:03:00',
        end_time: '05:05:00',
        customer_id: 1,
        video_id: props.video_id,
        payment_method: 7,
        method: 'Post',
        promocode: ['promocode']
    });
    const [WebviewUrl, setWebviewUrl] = useState({})
    const [isShowBottomSheet, setisShowBottomSheet] = useState(false)
    let userdata = new User().getuserdata();

    useEffect(() => {
        if (PaymentType === 0) {
            setPaymentData({
                ...PaymentData,
                course_id: props.route.params.course_id,
                video_id: props.route.params.video_id,
                promocode: props.route.params.promocode,
                customer_id: userdata.id,
                payment_method: 'offline'
            })
        } else {
            setPaymentData({
                ...PaymentData,
                course_id: props.route.params.course_id,
                video_id: props.route.params.video_id,
                promocode: props.route.params.promocode,
                customer_id: userdata.id,
                payment_method: PaymentType,
            })
        }
        console.log(PaymentData);
    }, [PaymentType])

    const getEvents = (text) => {
        setisLoading(true)
        let config = {
            url: ApiUrl.educationBuy,
            method: 'post',
            body: {
                ...PaymentData
            },
        };
        APIRequest(
            config,
            res => {
                console.log(res);
                setisLoading(false)
                if (res.status) {
                    if (res.openInWebView) {
                        setWebviewUrl({ url: res.url, openInWebView: res.openInWebView })
                        setisShowBottomSheet(true)
                    } else {
                        // Toast.show({
                        //     type: 'success',
                        //     text1: res.message
                        // })
                        setisShowBottomSheet(true)
                        setisNavigate(true)
                        // props.navigation.goBack()
                    }
                }
            },
            err => {
                console.log(err);
                setisLoading(false)
            },
        );
    };

    const handleSubmit = () => {
        console.log('submit', PaymentData);
        getEvents()

    }
    const handleCancle = () => {
        console.log('cancle');
        props.navigation.goBack()

    }

    useEffect(() => {
        if (!isShowBottomSheet && isNavigate) {
            props.navigation.goBack()
        }
    }, [isShowBottomSheet])
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={color.transparent} />
            {/* <View style={styles.topbar}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity
                        style={styles.imageBox}
                        onPress={() => props.navigation.goBack()}>
                        <Image
                            source={IMAGE.back}
                            style={styles.backImage}
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>
                        Payment
                    </Text>
                </View>
            </View> */}

            <Header title='Payment' />

            <View style={styles.bodyStyle}>
                <Text style={styles.headingStyle}>Payment method </Text>

                <View style={styles.btnContainer}>
                    <TouchableOpacity
                        style={[styles.PaymentTypeBox,
                        { borderColor: PaymentType === 1 ? color.btnBlue : color.borderGray }
                        ]}
                    // onPress={() => setPaymentType(1)}
                    >
                        <Image
                            source={IMAGE.Paypal_logo}
                            style={styles.paypalImage}
                        />
                        <Radio
                            active={PaymentType === 1 ? true : false}
                            style={{ width: 0 }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.PaymentTypeBox,
                        { borderColor: PaymentType === 7 ? color.btnBlue : color.borderGray }
                        ]}
                    // onPress={() => setPaymentType(7)}
                    >
                        <Image
                            source={IMAGE.pay360}
                            style={styles.paypalImage}
                        />
                        <Radio
                            active={PaymentType === 7 ? true : false}
                            style={{ width: 0 }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.PaymentTypeBox,
                        { borderColor: PaymentType === 0 ? color.btnBlue : color.borderGray }
                        ]}
                        onPress={() => setPaymentType(0)}
                    >
                        <Text style={styles.headingStyle}>Offline</Text>
                        <Radio
                            active={PaymentType === 0 ? true : false}
                            style={{ width: 0 }}
                        />
                    </TouchableOpacity>
                </View>

                <Text style={styles.disc}>
                    This booking is subject to Lybertine Terms of Service & Privacy Policy.
                </Text>
                <View style={styles.btnContainer}>
                    <Button
                        onPress={() => {
                            handleSubmit()
                        }}
                        title="Submit Request"
                        buttonStyle={styles.submitBtn}
                    />
                    <Button
                        onPress={() => {
                            handleCancle()
                        }}
                        title="Cancel"
                        buttonStyle={styles.cancelBtn}
                        titleStyle={{ color: color.violet }}
                    />
                </View>
            </View>
            {/* {WebviewUrl.openInWebView?
            <View style={{ height: 500 }}>
                <WebView
                    source={{ uri: WebviewUrl.url }}

                    // onNavigationStateChange={navState => {
                    //     // Keep track of going back navigation within component
                    //     console.log('navstate', navState);
                    //     if (navState?.url == twitterSuccessUrl) {
                    //         SimpleToast.show('Twitter successful')
                    //         this.setState({ ...this.state, isPostTwitter: false, openWebview: false, isShowBottomSheet: false });
                    //     }
                    //     if (navState?.url.includes(twitterFailUrl)) {
                    //         SimpleToast.show('Sorry, Something went wrong, please try again.')
                    //         this.setState({ ...this.state, isPostTwitter: false, openWebview: false, isShowBottomSheet: false });
                    //     }
                    // }}

                />
            </View>:null} */}

            {/* <BottomSheetCustom
                cancelBtn={{ color: color.lightGray, title: "Cancel", textColor: color.btnBlue }}
                isShowBottomSheet={isShowBottomSheet}
                setisShowBottomSheet={setisShowBottomSheet}
            >
                <View style={{ height: 500, width: wp(89) }}>
                    <WebView
                        source={{ uri: WebviewUrl.url }}
                    />
                </View>
            </BottomSheetCustom> */}
            <BottomSheetCustom
                isShowBottomSheet={isShowBottomSheet}
                setisShowBottomSheet={setisShowBottomSheet}
                cancelBtn={{ color: color.lightGray, title: "Okay", textColor: color.btnBlue }}
                confetti={true}
            >
                <Image style={styles.alertImage} source={IMAGE.checkTick} />
                <Text style={styles.alertTitle}>Thank You!</Text>
                <Text style={styles.alertText}>Your payment request has been successfully submitted to Admin</Text>
            </BottomSheetCustom>
            <Loader isLoading={isLoading} type='dots' />
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: null,
        backgroundColor: color.white
        // marginTop: 25,
    },
    headerContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        marginTop: Platform.OS == 'ios' ? hp(4) : 2,
    },
    headerText: {
        fontSize: fontSize.size15,
        fontFamily: fontFamily.Bold,
        color: color.atomicBlack,
        textAlign: "center",
        flex: 1,
    },
    bodyStyle: {
        padding: 20,
        paddingTop: 50
    },
    headingStyle: {
        fontSize: fontSize.size15,
        fontFamily: fontFamily.Bold,
        color: color.atomicBlack,
        marginBottom: 15
    },
    backImage: {
        height: 20,
        width: 20,
        resizeMode: 'contain',
    },
    paypalImage: {
        height: 40,
        width: 100,
        resizeMode: 'contain',
    },
    topbar: {
        marginHorizontal: '4%',
        // marginVertical: '6%'
    },
    PaymentTypeBox: {
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 10,
        padding: 15,
    },
    disc: {
        fontSize: fontSize.size12,
        fontFamily: fontFamily.Light,
        color: color.blueMagenta,
        marginTop: 40,
        marginBottom: 80
    },
    submitBtn: {
        backgroundColor: color.btnBlue,
        borderWidth: 2,
        borderColor: color.white,
        borderRadius: 11,
        padding: 15
    },
    cancelBtn: {
        backgroundColor: color.lightGray,
        borderWidth: 2,
        borderColor: color.lightGray,
        borderRadius: 11,
        padding: 15,
    },
    btnContainer: { flexDirection: 'column', gap: 25 },
    alertImage: {
        width: 50,
        height: 50,
        alignSelf: 'center',
        marginVertical: 20,
    },
    alertTitle: {
        fontSize: fontSize.size20,
        color: color.black,
        textAlign: 'center',
        marginVertical: 10,
    },
    alertText: {
        fontSize: fontSize.size15,
        color: color.liteBlueMagenta,
        textAlign: 'center',
        marginBottom: 25,
    },

})
export default Payment

