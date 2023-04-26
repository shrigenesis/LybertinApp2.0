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
  import { color } from '../../constant/';
  
const EventListSkelton = () => {
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
                <View style={styles.wrapper}>
                    <View style={styles.image}></View>
                    <View style={styles.bottomWrapper}>
                        <View style={styles.title}></View>
                        <View style={styles.subTitle}></View>
                        <View style={styles.badge}></View>
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
        width: Dimensions.get('window').width / 2.333,
        flex: 1,
        flexBasis: '50%',
        flexDirection: "column",
        borderRadius: 10,
        backgroundColor: color.white,
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        elevation: 3,
        shadowRadius: 3,
        padding: 8,
        marginTop: 20,
        marginHorizontal: 5,
    },
    image:{
        height: 120,
        borderRadius: 10,
        backgroundColor: color.borderGray
    },
    bottomWrapper:{
        flex: 1,
        flexDirection: 'column',
        paddingVertical: 10,
    },
    title:{
        width: 100,
        height: 12,
        borderRadius: 3,
        paddingHorizontal: 10,
        backgroundColor: color.borderGray
    },
    subTitle:{
        width: 80,
        height: 8,
        borderRadius: 3,
        marginTop: 10,
        paddingHorizontal: 10,
        backgroundColor: color.borderGray
    },
    badge:{
        width: 40,
        height: 8,
        borderRadius: 20,
        marginTop: 10,
        backgroundColor: color.borderGray
    },
  });
  export default EventListSkelton;
  