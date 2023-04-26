import React, {
    useEffect,
    useRef
  } from 'react';
  import {
    View,
    StyleSheet,
    Animated,
  } from 'react-native';
  import { color } from '../../constant/';
  
const TicketListSkelton = () => {
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
        <Animated.View style={[{opacity: opacity.current}]}>
            <View style={styles.wrapper}>
                <View style={styles.image}></View>
                <View style={styles.rightWrapper}>
                    <View style={styles.title}></View>
                    <View style={styles.subTitleWrapper}>
                        <View style={styles.subTitle}></View>
                        <View style={styles.badge}></View>
                    </View>
                </View>
            </View>
        </Animated.View>
      );
  }
  
  const styles = StyleSheet.create({
    wrapper:{
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
        marginHorizontal: 20,
        backgroundColor: color.background
    },
    image:{
        width: 130,
        height: 120,
        backgroundColor: color.borderGray
    },
    rightWrapper:{
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: 10,
    },
    title:{
        width: 200,
        height: 12,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: color.borderGray
    },
    subTitleWrapper:{
        flexDirection: 'row',
        alignItems: "baseline",
        justifyContent: "space-between",
    },
    subTitle:{
        width: 80,
        height: 8,
        borderRadius: 5,
        marginTop: 10,
        paddingHorizontal: 10,
        backgroundColor: color.borderGray
    },
    badge:{
        width: 40,
        height: 8,
        borderRadius: 20,
        backgroundColor: color.borderGray
    },
  });
  export default TicketListSkelton;
  