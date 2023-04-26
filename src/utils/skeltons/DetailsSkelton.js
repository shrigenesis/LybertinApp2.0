import React, {
    useEffect,
    useRef
  } from 'react';
  import {
    View,
    StyleSheet,
    Animated,
    Dimensions,
  } from 'react-native';
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
  
  import { color } from '../../constant';

const DetailsSkelton = () => {
    const opacity = useRef(new Animated.Value(0.3))
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity.current,{
                    toValue: 1,
                    useNativeDriver: true,
                    duration: 500,
                }),
                Animated.timing(opacity.current,{
                    toValue: 0.3,
                    useNativeDriver: true,
                    duration: 800,
                }),
            ]),
        ).start();
      }, [opacity]);
      
      return (
          <Animated.View style={[{opacity: opacity.current ,borderRadius: 10}]}>
            {/* <View style={styles.outerWrapper}> */}
                <View>
                    <View style={styles.image}></View>
                    <View style={styles.bottomWrapper}>
                        <View style={styles.money}></View>
                        <View style={styles.title}></View>
                        <View style={styles.btn}></View>
                        <View style={styles.height}></View>
                        <View style={styles.height}></View>
                        <View style={styles.subTitle}></View>
                        <View style={styles.subTitle}></View>
                        <View style={styles.subTitle}></View>
                        <View style={styles.subTitle}></View>
                        <View style={styles.height}></View>
                        <View style={styles.height}></View>
                        <View style={styles.height}></View>
                        <View style={styles.badge}></View>
                    </View>
                </View>
            {/* </View> */}
        </Animated.View>
      );
}

const styles = StyleSheet.create({
    outerWrapper:{
        flex: 1,
        flexDirection: "row",
        backgroundColor: color.white,
        shadowRadius: 3,
        marginBottom: 20,
        padding: 8,
    },
    wrapper:{
        width: wp(97),
        flexDirection: "column",
        borderRadius: 10,
        backgroundColor: color.white,
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        // elevation: 3,
        shadowRadius: 3,
        padding: 8,
        marginTop: 20,
        marginHorizontal: 5,
        height: hp(100),
    },
    image:{
        height: 230,
        borderRadius: 10,
        backgroundColor: color.borderGray
    },
    bottomWrapper:{
        flex: 1,
        flexDirection: 'column',
        paddingVertical: 10,
    },
    money:{
        width: 60,
        height: 20,
        borderRadius: 3,
        paddingHorizontal: 10,
        backgroundColor: color.borderGray,
        marginTop:20,
        marginLeft:20,
    },
    title:{
        width: 200,
        height: 16,
        borderRadius: 3,
        paddingHorizontal: 10,
        backgroundColor: color.borderGray,
        marginTop:15,
        marginLeft:20,
    },
    subTitle:{
        width: 220,
        height: 16,
        borderRadius: 3,
        paddingHorizontal: 10,
        backgroundColor: color.borderGray,
        marginTop:20,
        marginLeft:20,
    },
    badge:{
        alignSelf:'center',
        width: wp(90),
        height: 80,
        borderRadius: 20,
        marginTop: 20,
        backgroundColor: color.borderGray
    },
    btn:{
        alignSelf:'center',
        width: wp(85),
        height: 50,
        borderRadius: 7,
        backgroundColor: color.borderGray,
        marginTop:30,
    },
    height:{
        height:10
    }
  });

export default DetailsSkelton