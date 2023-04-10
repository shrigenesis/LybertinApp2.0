/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect, FC, Component, memo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    Image,
    Button,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    ActivityIndicator,
    Platform,
    ImageBackground,
    Share,
} from 'react-native';
import { IMAGE, color, fontFamily, fontSize } from '../../constant/';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import { BottomSheet } from 'react-native-elements';
import Loader from './../../component/loader';
import { APIRequest, ApiUrl, IMAGEURL, Toast, twitterFailUrl, twitterSuccessUrl } from './../../utils/api';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import { User } from '../../utils/user';
import SimpleToast from 'react-native-simple-toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SliderBox } from "react-native-image-slider-box";
import ReadMore from '@fawazahmed/react-native-read-more';
import HtmlToText from '../../utils/HtmlToText';
import SvgUri from 'react-native-svg-uri-updated';
import ConfirmationModal from './Modal/ConfirmationModal';
import BottomSheetCustom from '../../component/BottomSheetCustom';
import DetailsSkelton from '../../utils/skeltons/DetailsSkelton';
import TwitterAuthorization from './Modal/TwitterAuthorization';
import WebView from 'react-native-webview';
import { log } from 'react-native-reanimated';
import NoFormatter from '../../utils/NoFormatter';
let strippedHtml
const sponsorsImage = ['https://lybertine.com/images/danone-logo.png', 'https://lybertine.com/images/Tata-Company.png', 'https://lybertine.com/images/danone-logo.png']


export default class MarketplaceDetails extends Component {
    constructor(props) {
        super(props);
        this.bottomSheetRef = React.createRef();
        this.state = {
            selected: 0,
            eventId: this.props.route.params.event_id,
            event: {},
            engagement: {},
            showText: 0,
            isRepetative: '',
            repititiveSchedule: [],
            hosts: [],
            dance: [],
            images: [],
            tag_group: [],
            webviewUrl: '',
            twitterMassage: '',
            isLoading: true,
            isShowBottomSheet: false,
            isPostTwitter: false,
            openWebview: false,
        };
    }

    componentDidMount = () => {
        this.getEventDetails();
    };

    // Getg deeplink for socail share
    OtherShare = () => {
        this.setState({ ...this.state, isShowBottomSheet: false });
        let config = {
            url: `${ApiUrl.getDeeplink}`,
            method: 'post',
            body: {
                event_id: this.state.event.id,
            },
        };
        APIRequest(
            config,
            res => {
                if (res.status) {
                    console.log(res, 'getEventShareUrl');
                    this.onShare(res.deep_link)
                }
            },
            err => {
                console.log(err);
            },
        );
    }

    // Get message and check user autoraizd
    TwittwrShare = () => {
        this.setState({ ...this.state, isLoading: true })
        let config = {
            url: `${ApiUrl.getDeeplink}`,
            method: 'post',
            body: {
                event_id: this.state.event.id,
            },
        };
        APIRequest(
            config,
            res => {
                if (res.status) {
                    this.setState({ ...this.state, twitterMassage: `${res.promotional_text} Book your tickets at ${res.deep_link}`, isPostTwitter: true })
                }
                this.setState({ ...this.state, isLoading: false })
            },
            err => {
                console.log(err);
                this.setState({ ...this.state, isLoading: false })
            },
        );
    }

    // Post on twitter 
    PostTwitter = () => {

        let config = {
            url: `${ApiUrl.twitterPost}`,
            method: 'post',
            body: {
                event_id: this.state.event.id,
                text: this.state.twitterMassage
            },
        };
        APIRequest(
            config,
            res => {
                if (res.status) {
                    if (!res.alreadyHasAuthorized) {
                        this.setState({ ...this.state, webviewUrl: res.authorize_url, openWebview: true })
                    }
                }
                this.setState({ ...this.state, isLoading: false })
            },
            err => {
                console.log(err);
                this.setState({ ...this.state, isLoading: false })
            },
        );

    }

    // Get event details
    getEventDetails = () => {
        this.setState({ ...this.state, isLoading: true })

        let config = {
            url: `${ApiUrl.getMarketingEventDetails}/${this.state.eventId}`,
            method: 'get',
        };
        APIRequest(
            config,
            res => {
                if (res.status) {
                    console.log(res, 'getEventDetails');
                    this.setState({
                        ...this.state,
                        event: res.marketing_event_info.event,
                        engagement: res.engagement.data,
                        last_sync: res.engagement.last_sync,
                        // isRepetative: res.marketing_event_info.is_repetative,
                        // repititiveSchedule: res.marketing_event_info.repititive_schedule,
                        tag_group: res.marketing_event_info.tag_group,
                        images: res.marketing_event_info.event.images,
                    });
                    let myHTML = res.marketing_event_info.event.description;
                    strippedHtml = HtmlToText(myHTML)
                }
                this.setState({ ...this.state, isLoading: false })
            },
            err => {
                this.setState({ ...this.state, isLoading: false })
                console.log(err);
            },
        );
    };

    // Extrect Image string to array
    sliderImageArray = (images) => {
        let res = [];
        for (let i = 0; i < images.length; i++) {
            res.push(images[i].img)
        }
        return res;
    }

    // Handle Bottom Sheet 
    setisShowBottomSheet(value) {
        if (!value) {
            this.setState({
                ...this.state,
                isShowBottomSheet: value,
                isPostTwitter: false,
                openWebview: false,
            });
        }
    }

    // Social Share fundtion
    onShare = async (link) => {
        try {
            const result = await Share.share({
                message:
                    link,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            SimpleToast.show(error.message)
        }
    };

    // Extract min price to Tickets array
    minPrice = () => {
        let priceValue = [];
        for (let index = 0; index < this.state.event?.tickets?.length; index++) {
            priceValue.push(this.state.event.tickets[index].price)
        }
        return Math.min(...priceValue)
    }
    TimeDiff = () => {
        var a = moment(new Date());//now
        var b = moment(this.state.last_sync);
        console.log(a.diff(b, 'minutes'))
        return a.diff(b, 'minutes') > 10 ? true : false
    }


    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle={'light-content'} translucent backgroundColor="transparent" />
                {this.state.isLoading !== true ?
                    <ScrollView style={{ flex: 0.92 }}>
                        <SliderBox
                            images={this.state.event.images ? this.sliderImageArray(this.state.event.images) : [1]}
                            sliderBoxHeight={300}
                            onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
                            dotColor={color.btnBlue}
                            inactiveDotColor={color.black}
                            dotStyle={styles.dotStyle}
                        />
                        <View
                            style={styles.backImageBox}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Image
                                    source={IMAGE.ArrowLeft}
                                    style={styles.backImage}
                                />
                            </TouchableOpacity>
                        </View>

                        <View
                            style={styles.bodyContainer} />
                        <View
                            style={{
                                backgroundColor: color.background,
                            }}>
                            <Text style={styles.mainHeading}>${this.minPrice()}</Text>
                            <View>
                                <View style={styles.shareWrapp}>
                                    <Text style={styles.heading}>{this.state.event.title}</Text>

                                </View>
                                <View
                                    style={styles.shareBox}
                                >
                                    <TouchableOpacity
                                        onPress={() => this.setState({ ...this.state, isShowBottomSheet: true })}
                                        style={styles.shareBtnText}>
                                        <Image
                                            source={IMAGE.sendBlue}
                                            style={styles.shareImage}
                                        />
                                        <Text style={styles.buttonText}>Share Now</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => this.setState({ ...this.state, isShowBottomSheet: true })}
                                        style={styles.shareBtnImg}>
                                        <Image
                                            source={IMAGE.shareMarketplace}
                                            style={styles.shareImage}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.borderBox, { padding: 15, paddingBottom: 5, marginHorizontal: 14, marginVertical: 15 }]}>
                                    <View style={styles.engagementTitleBox}>
                                        <Text style={styles.engagementTitle}>POST ENGAGEMENT</Text>
                                        <TouchableOpacity onPress={this.getEventDetails}>
                                            <Image source={IMAGE.sync} style={styles.syncImage} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={[styles.engagementTitleBox, { marginTop: 15 }]}>
                                        <View>
                                            <Text style={styles.detailsTitle}>{NoFormatter(this.state.engagement.favorites)}</Text>
                                            <Text style={styles.detailsText}>Post likes</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.detailsTitle}>{NoFormatter(this.state.engagement.retweets)}</Text>
                                            <Text style={styles.detailsText}>Comments</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.detailsTitle}>{NoFormatter(this.state.event.total_shares)}</Text>
                                            <Text style={styles.detailsText}>Share</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.detailsTitle}>{this.state.event.total_coins_distributed ? NoFormatter(this.state.event.total_coins_distributed) : 0}</Text>
                                            <Text style={styles.detailsText}>Earning</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.detailsTitle}>{NoFormatter(this.state.event.total_bookings_from_links)}</Text>
                                            <Text style={styles.detailsText}>Booking</Text>
                                        </View>
                                    </View>
                                    <Text style={[styles.detailsText, { marginTop: 10 }]}>Last sync {this.state.last_sync}</Text>
                                </View>
                                <View style={styles.imageContainer}>
                                    <Image
                                        source={IMAGE.dateColor}
                                        style={styles.dateStyle}
                                    />
                                    <View>
                                        <Text style={styles.dateText}>Date & Time</Text>
                                        <Text style={styles.timeText}>
                                            {this.state.event.event_timing_formatted}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.imageContainer}>
                                    <Image
                                        source={IMAGE.locationColor}
                                        style={styles.dateStyle}
                                    />

                                    <View>
                                        <Text style={styles.dateText}>Location</Text>
                                        <Text style={styles.timeText} numberOfLines={2}>
                                            {this.state.event.venue && this.state.event.venue}
                                            {this.state.event.state && ", " + this.state.event.state}
                                            {this.state.event.city && ", " + this.state.event.city}
                                            {this.state.event.zipcode && ", " + this.state.event.zipcode}
                                        </Text>
                                    </View>
                                </View>

                                {this.state.event.repetitive === 1 ? (
                                    <View style={styles.imageContainer}>
                                        <Image
                                            source={IMAGE.eventColor}
                                            style={styles.dateStyle}
                                        />

                                        <View>
                                            <Text style={styles.dateText}>Event type</Text>
                                            <Text style={styles.timeText} numberOfLines={2}>
                                                {this.state.event.event_type_text}
                                            </Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View></View>
                                )}

                                {strippedHtml === '' ? (
                                    null
                                ) : (
                                    <View>
                                        <View style={styles.descriptionWrapper}>
                                            <Text style={styles.desHeading}>Video Description</Text>
                                            <ReadMore
                                                numberOfLines={4}
                                                style={styles.desText}
                                                seeMoreText='read more'
                                                seeMoreStyle={{ color: color.btnBlue }}>
                                                {strippedHtml}
                                            </ReadMore>
                                        </View>

                                    </View>
                                )}
                                {this.state.tag_group?.length > 0 &&
                                    this.state.tag_group?.map((itt, indx) => {
                                        return (
                                            <View style={styles.eventItems} key={indx}>
                                                <Text style={styles.ticketsText}>{itt?.name}</Text>
                                                <FlatList
                                                    horizontal
                                                    showsHorizontalScrollIndicator={false}
                                                    data={itt?.items}
                                                    renderItem={({ item, index }) => (
                                                        <View
                                                            key={`marketplace-details${index}`}
                                                            style={styles.eventTagInner}>
                                                            <View style={styles.tagIMageWrapper}>
                                                                <Image
                                                                    source={{ uri: `${IMAGEURL}/${item.image}` }}
                                                                    style={styles.profileImage}
                                                                />
                                                            </View>
                                                            <View style={{ margin: 8 }}>
                                                                <Text style={styles.nameText}>{item.title}</Text>
                                                                <Text style={styles.proText}>{item.type}</Text>
                                                            </View>
                                                        </View>
                                                    )}
                                                />
                                            </View>
                                        );
                                    })}
                                <View>
                                    <View style={styles.descriptionWrapper}>
                                        <Text style={styles.desHeading}>Sponsors</Text>
                                        <FlatList
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={true}
                                            data={sponsorsImage}
                                            renderItem={({ item, index }) => (
                                                <View
                                                    style={styles.sponsorTagInner}>
                                                    <View >
                                                        <Image
                                                            source={{ uri: item }}
                                                            style={styles.sponsorImage}
                                                        />
                                                    </View>
                                                </View>
                                            )}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                        {false ? <ConfirmationModal /> : null}
                        <BottomSheetCustom
                            cancelBtn={{ color: color.lightGray, title: "Cancel", textColor: color.btnBlue }}
                            isShowBottomSheet={this.state.isShowBottomSheet}
                            setisShowBottomSheet={this.setisShowBottomSheet.bind(this)}
                        >
                            {!this.state.isPostTwitter ? <>
                                <TouchableOpacity
                                    onPress={this.TwittwrShare}
                                    style={styles.twitterShareBtn}>
                                    <Text style={styles.buttonText}>Twitter</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={this.OtherShare}
                                    style={styles.twitterShareBtn}>
                                    <Text style={styles.buttonText}>Others</Text>
                                </TouchableOpacity></> : null}
                            {(this.state.isPostTwitter && !this.state.openWebview) ?
                                <>
                                    <TextInput
                                        value={this.state.twitterMassage}
                                        onChangeText={(e) => this.setState({ ...this.state, twitterMassage: e })}
                                        maxLength={280}
                                        style={styles.input}
                                        multiline={true}
                                        numberOfLines={4}
                                    />
                                    <TouchableOpacity
                                        onPress={this.PostTwitter}
                                        style={styles.postTwitterBtn}>
                                        <Text style={styles.buttonText}>Post</Text>
                                    </TouchableOpacity></> : null}
                            {(this.state.openWebview && this.state.isPostTwitter) ?
                                <View style={{ height: 500 }}>
                                    <WebView
                                        source={{ uri: this.state.webviewUrl }}

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
                                </View> : null}
                        </BottomSheetCustom>

                    </ScrollView> :
                    <DetailsSkelton />
                }
                <Loader isLoading={this.state.isLoading} type={'dots'} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: null,
        borderColor: color.white,
    },
    backButton: {
        backgroundColor: color.white,
        height: 24,
        width: 24,
        borderRadius: 40,
    },
    dotStyle: {
        width: 20,
        height: 5,
        borderRadius: 5,
        marginBottom: Platform.OS == "ios" ? 50 : 80,
        padding: 0,
        margin: -5,
    },
    backImageBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: '5%',
        marginTop: Platform.OS == "ios" ? '-60%' : '-70%',
    },
    backImage: {
        height: 32,
        width: 32,
        resizeMode: 'contain',
    },
    bodyContainer: {
        marginTop: Platform.OS == "ios" ? '40%' : '50%',
        height: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 40,
        backgroundColor: color.background,
    },
    shareBox: {
        display: 'flex',
        flexDirection: 'row',
        paddingHorizontal: 14,
    },
    shareBtnText: {
        backgroundColor: '#F6EAFA',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        display: 'flex',
        flexDirection: 'row',
        marginVertical: 10,
        width: '82%',
        marginRight: '2%'
    },
    shareImage: {
        height: 15,
        width: 15,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginRight: 4,
    },
    shareBtnImg: {
        backgroundColor: '#F6EAFA',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        display: 'flex',
        flexDirection: 'row',
        marginVertical: 10,
        width: '16%',
    },
    engagementTitle: {
        textAlign: 'center',
        fontFamily: fontFamily.Semibold,
        fontSize: fontSize.size12,
        color: color.blackRussian
    },
    dateStyle:{
        height: 22,
        width: 22,
        resizeMode: 'contain',
        marginRight: '4%',
        tintColor: color.btnBlue,
    },
    twitterShareBtn:{
        backgroundColor: '#F6EAFA',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        display: 'flex',
        flexDirection: 'row',
        marginVertical: 10,
        marginHorizontal: '5%',
        width: '90%',
    },
    postTwitterBtn:{
        backgroundColor: '#F6EAFA',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        display: 'flex',
        flexDirection: 'row',
        marginHorizontal: '5%',
        marginVertical: 10,
        width: '90%',
    },
    mainHeading: {
        fontSize: fontSize.size31,
        fontFamily: fontFamily.Bold,
        color: color.btnBlue,
        marginHorizontal: 15
    },
    heading: {
        fontSize: fontSize.size21,
        fontFamily: fontFamily.Bold,
        color: color.blueMagenta,
        marginHorizontal: 15
    },
    imageContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginVertical: 10,
        paddingHorizontal: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: color.borderGray
    },
    eventItems: {
        paddingHorizontal: 15,
        marginTop: 20
    },
    eventTagInner:
    {
        backgroundColor: color.extralightSlaty,
        borderColor: color.borderGray,
        borderWidth: 1,
        marginRight: 10,
        borderRadius: 10,
        marginTop: 10,
        height: 190,
        width: 128,
    },
    dateText: {
        fontSize: fontSize.size12,
        fontFamily: fontFamily.Regular,
        color: color.blueMagenta,
    },
    timeText: {
        fontSize: fontSize.size13,
        fontFamily: fontFamily.Bold,
        color: color.blueMagenta,
        width: 320,
    },
    descriptionWrapper: {
        paddingHorizontal: 15,
        paddingBottom: 15,
        borderColor: color.borderGray,
        borderBottomWidth: 1,
    },
    desHeading: {
        fontSize: fontSize.size19,
        fontFamily: fontFamily.Bold,
        color: color.blueMagenta,
        marginTop: 10,
    },
    desText: {
        fontSize: fontSize.size13,
        fontFamily: fontFamily.Medium,
        color: color.blueMagenta,
        marginTop: 5,
    },
    ticketsText: {
        fontSize: fontSize.size19,
        fontFamily: fontFamily.Bold,
        color: color.blueMagenta,
        marginTop: 10,
    },
    dayText: {
        fontSize: fontSize.size13,
        fontFamily: fontFamily.Bold,
    },
    tagIMageWrapper: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    profileImage: {
        width: '100%',
        height: 116,
        resizeMode: 'cover',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    nameText: {
        fontSize: fontSize.size15,
        fontFamily: fontFamily.Bold,
        color: color.blueMagenta,
    },
    proText: {
        fontSize: fontSize.size11,
        fontFamily: fontFamily.Light,
        color: color.blueMagenta
    },
    sponsorsImage: {
        width: 161,
        height: 56,
        resizeMode: 'cover',
    },
    shareWrapp: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    sponsorTagInner: {
        backgroundColor: color.extralightSlaty,
        borderColor: color.borderGray,
        borderWidth: 1,
        marginRight: 10,
        borderRadius: 5,
        marginTop: 10,
        height: 50,
        width: 128,
    },
    sponsorImage: {
        width: 'auto',
        height: '70%',
        resizeMode: 'contain',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        alignItems: 'center',
        marginVertical: 7,
        // alignSelf:'center'
    },
    buttonText: {
        fontSize: fontSize.size15,
        fontWeight: '700',
        fontFamily: fontFamily.Regular,
        color: color.violet,
        paddingVertical: 11,
    },
    borderBox: {
        borderColor: color.liteMagenta,
        borderWidth: 1,
        borderRadius: 5,
    },
    detailsTitle: {
        fontSize: fontSize.size25,
        color: color.blueMagenta,
        fontWeight: '700',
        fontFamily: fontFamily.Semibold,
        textAlign: 'center',
    },
    detailsText: {
        fontSize: fontSize.size11,
        color: color.blueMagenta,
        fontFamily: fontFamily.Regular,
        textAlign: 'center',
    },
    button: {
        fontSize: fontSize.size15,
        fontWeight: '700',
        fontFamily: fontFamily.Regular,
        color: color.violet,
        paddingVertical: 20,
    },
    input: {
        borderColor: color.borderGray,
        borderWidth: 1,
        height: 100,
        borderRadius: 10,
        textAlignVertical: 'top'
    },
    syncImage: {
        width: 20,
        height: 20
    },
    engagementTitleBox: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});
