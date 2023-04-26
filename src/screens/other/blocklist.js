import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Image, TouchableOpacity, ScrollView, StatusBar, SafeAreaView } from 'react-native';
import { IMAGE, color, fontFamily } from '../../constant/';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RippleTouchable, Header } from '../../component/';
import { APIRequest, ApiUrl, IMAGEURL } from './../../utils/api';
import { useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import NoRecord from './noRecord';





const BlockList = ({ navigation, route }) => {
    const data = [1, 1, 1, 1, 1, 1];
    const [isLoading, setisLoading] = useState(false);
    const [blockList, setBlockedList] = useState([]);
    const isFocus = useIsFocused();

    useEffect(() => {
        if (isFocus) {
            fetchBlockList()
        }
    }, [isFocus]);

    const fetchBlockList = () => {
        setisLoading(true)

        let config = {
            url: ApiUrl.blockedList,
            method: 'get',
        }

        APIRequest(config,
            (res) => {
                setBlockedList(res.blocked)
                if (res.status) {
                }
                setisLoading(false)
            },
            (err) => {
                setisLoading(false)
                console.log(err);
            })
    }

    const blockUser = (item) => {

        setisLoading(true)
        let config = {
            url: ApiUrl.blockedUser,
            method: 'post',
            body: {
                blocked_to: item.id
            }
        }
        APIRequest(config,
            (res) => {
                if (res?.alert?.message) {
                    // getuserInfo(userData?.user?.id)
                    Toast.show({
                        type: 'success',
                        text1: res?.alert?.message
                      })
                    fetchBlockList()
                }
                setisLoading(false)
            },
            (err) => {
                setisLoading(false)
                console.log(err);
            })
    }



    const _renderBlockList = (item, index) => {
        return (
            <View>
                <View style={{ alignItems: 'center', flexDirection: 'row', paddingLeft: wp(8) }}>
                    <View style={style.imgview}>
                        <Image source={{ uri: `${IMAGEURL}/${item.avatar}` }} style={style.imgBox} />
                    </View>
                    <View style={style.nameView}>
                        <Text style={style.name}>{item.name}</Text>
                        <Text onPress={() => {
                            blockUser(item)
                        }} style={style.block}>Unblock</Text>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={style.safeArea}>
            <View style={{ flex: 1, backgroundColor: color.white }}>
                <StatusBar barStyle={'dark-content'} backgroundColor={color.lightGray} />
                <Header title={'Blocklist'} headStyle={{backgroundColor: color.lightGray}} />


                {blockList.length > 0 ? (
                    <View style={style.bodySection}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(index) => index?.id}
                            data={blockList}
                            contentContainerStyle={{ marginBottom: hp(25) }}
                            renderItem={({ item, index }) => (
                                _renderBlockList(item, index)
                            )}
                        />
                    </View>
                ) : (
                    <>
                        {!isLoading && (
                            <NoRecord
                                image={IMAGE.blocked}
                                title="No blocked users"
                                description="Blocked users won't be able to see your profile."
                                showButton={false}
                            />
                        )}
                    </>

                )}
            </View>
        </SafeAreaView>
    );
}

const style = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: color.white
    },
    imgview: {
        overflow: 'hidden',
        borderColor: color.lightSlaty
    },
    imgBox: {
        borderRadius: 120,
        height: 50,
        width: 50,
        resizeMode: 'cover'
    },
    name: {
        fontSize: 14,
        fontFamily: fontFamily.Bold,
        color: color.black,
    },
    block: {
        fontSize: 12,
        fontFamily: fontFamily.Medium,
        color: color.red,
    },
    bodySection: {
    },
    nameView: {
        width: wp(70),
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: hp(2.2),
        marginLeft: wp(5),
        paddingRight: wp(4),
        borderBottomWidth: 0.4,
        borderColor: color.textGray2
    },
})
export default BlockList;