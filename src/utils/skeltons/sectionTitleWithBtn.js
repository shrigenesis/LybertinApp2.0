import React, {
    useEffect,
    useRef
  } from 'react';
  import {
    View,
    StyleSheet,
    Animated,
  } from 'react-native';
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
  import { color } from '../../constant';
  
const SectionTitleWithBtn = () => {
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
            <View style={styles.sectionTitleWrapper}>
                <View style={styles.sectionTitle}></View>
                <View style={styles.btn}></View>
            </View>
        </Animated.View>
      );
  }
  
  const styles = StyleSheet.create({
    sectionTitleWrapper:{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    sectionTitle:{
        width: 150,
        height: 12,
        borderRadius: 7,
        backgroundColor: color.borderGray
    },
    btn:{
        width: 30,
        height: 12,
        borderRadius: 7,
        backgroundColor: color.borderGray
    },
  });
  export default SectionTitleWithBtn;
  