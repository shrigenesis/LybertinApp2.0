import React, { useEffect, useState } from 'react'
import { SafeAreaView, Text, View, TouchableOpacity, StatusBar, StyleSheet, Platform, Image, Alert } from 'react-native'
import { Loader, Radio } from '../../component'
import { IMAGE, color, fontSize, fontFamily } from '../../constant'
import { Button } from 'react-native-elements'
import { User } from '../../utils/user';
import { APIRequest, ApiUrl, Toast } from '../../utils/api'
import SimpleToast from 'react-native-simple-toast'
import { log } from 'react-native-reanimated'


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
    const [PaymentType, setPaymentType] = useState('');
    const [isLoading, setisLoading] = useState(false)
    const [PaymentData, setPaymentData] = useState({
        course_id: 1,
        booking_date: '2023-07-05',
        start_time: '04:03:00',
        end_time: '05:05:00',
        customer_id: 1,
        video_id: [1],
        payment_method: 7,
        method: 'Post',
        promocode: ['promocode']
    });
    const [WebviewUrl, setWebviewUrl] = useState({})
    let userdata = new User().getuserdata();

    useEffect(() => {
        setPaymentData({
            ...PaymentData,
            course_id: props.route.params.course_id,
            video_id: props.route.params.video_id,
            promocode: props.route.params.promocode,
            customer_id: userdata.id,
            payment_method: PaymentType,
        })
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
                if(res.status){
                    if(res.openInWebView){
                        setWebviewUrl({url:res.url, openInWebView: res.openInWebView})
                    }else{
                        SimpleToast.show(res.message)
                        props.navigation.goBack()
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
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={color.transparent} />
            <View style={styles.topbar}>
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
            </View>
            <View style={styles.bodyStyle}>
                <Text style={styles.headingStyle}>Payment method </Text>

                <View style={styles.btnContainer}>
                    <TouchableOpacity
                        style={[styles.PaymentTypeBox,
                        { borderColor: PaymentType === 'paypal' ? color.btnBlue : color.borderGray }
                        ]}
                        onPress={() => setPaymentType('paypal')}
                    >
                        <Image
                            source={IMAGE.Paypal_logo}
                            style={styles.paypalImage}
                        />
                        <Radio
                            active={PaymentType === 'paypal' ? true : false}
                            style={{ width: 0 }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.PaymentTypeBox,
                        { borderColor: PaymentType === 'pay360' ? color.btnBlue : color.borderGray }
                        ]}
                        onPress={() => setPaymentType('pay360')}
                    >
                        <Image
                            source={IMAGE.pay360}
                            style={styles.paypalImage}
                        />
                        <Radio
                            active={PaymentType === 'pay360' ? true : false}
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
            {WebviewUrl.openInWebView?<View style={{ height: 500 }}>
                <WebView
                    source={{ uri: WebviewUrl }}

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
            </View>:null}
            <Loader isLoading={isLoading} type='dots' />
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: null,
        marginTop: 25,
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
        padding: 20
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
        marginVertical: '6%'
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

})
export default Payment

