import React, {
    useEffect,
    useRef
  } from 'react';
  import {
    View,
    StyleSheet,
    Animated,
  } from 'react-native';
  import { color } from '../../constant';
  
const TextLineSkelton = (props) => {
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
                <View style={styles.rightWrapper}>
                    <View style={styles.title}></View>
                    <View style={styles.title}></View>
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
        marginHorizontal: 20
    },
    rightWrapper:{
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: 10,
    },
    title:{
        width: 30,
        height: 10,
        marginBottom:5,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: color.borderGray,
        alignSelf:'center'
    },
  });
  export default TextLineSkelton;
  